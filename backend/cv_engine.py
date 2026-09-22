"""
CraftProof — Computer Vision Microservice
==========================================

Purpose
-------
This Flask microservice implements the "Authenticity Engine" for CraftProof.
It receives a fabric close-up photo (buyer's smartphone camera), runs image
quality checks, performs a 2D FFT weave-pattern analysis, and classifies the
sample as HANDLOOM_AUTHENTIC or POWERLOOM_SUSPECT with a confidence score.

Pipeline
--------
1. Decode + validate the uploaded image.
2. Quality gate: reject images that are too blurry (Laplacian variance) or
   too small to trust a frequency-domain analysis.
3. Preprocess: grayscale conversion, CLAHE contrast normalization, center
   crop/resize to a fixed 512x512 working matrix (FFT is sensitive to
   input size, so we normalize it).
4. 2D FFT: compute the magnitude spectrum, derive two features:
     - PAER (Peak-to-Average Energy Ratio): how "spiky" the frequency
       spectrum is. Powerloom weaves produce sharp, discrete harmonic
       peaks (very periodic thread spacing) -> high PAER.
     - Spectral entropy: how spread out / disordered the energy
       distribution is. Handloom weaves have natural human
       micro-variation in tension and spacing -> diffuse spectrum -> high
       entropy. Powerloom -> concentrated spectrum -> low entropy.
5. Combine PAER + entropy into a single "periodicity_score" in [0, 1] and
   apply the calibrated threshold to classify, returning a confidence.

This file is intentionally self-contained (no DB writes) — the calling
backend (app.py) is responsible for persisting a WeaveInspectionLog row
using the JSON this service returns.
"""

from __future__ import annotations

import io
import logging
from dataclasses import dataclass, asdict
from typing import Tuple

import numpy as np
import cv2
from flask import Flask, request, jsonify

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("craftproof.cv_engine")

app = Flask(__name__)

# --------------------------------------------------------------------------
# Calibration constants
# --------------------------------------------------------------------------
# These thresholds are starting points for the SIH demo/MVP. In production
# they should be re-calibrated against a labeled dataset of real handloom
# vs powerloom close-up photos (see calibrate.py, not included here) using
# an ROC curve to pick the operating point that best trades off false
# "authentic" vs false "counterfeit" classifications.

WORKING_SIZE = 512  # square working resolution for the FFT matrix

# Quality gate
MIN_LAPLACIAN_VARIANCE = 80.0   # below this, image is considered too blurry
MIN_INPUT_DIMENSION = 300       # px, minimum width/height accepted

# FFT feature -> periodicity_score threshold
# periodicity_score is a weighted blend of normalized PAER and
# (1 - normalized entropy), so it rises with "machine-like" regularity.
POWERLOOM_THRESHOLD = 0.85

# Normalization bounds used to map raw PAER / entropy into [0, 1].
# Derived empirically from sample fabric macro shots; tune with real data.
PAER_MIN, PAER_MAX = 3.0, 40.0
ENTROPY_MIN, ENTROPY_MAX = 4.0, 12.0

# Weighting between the two features in the final periodicity_score.
PAER_WEIGHT = 0.6
ENTROPY_WEIGHT = 0.4


@dataclass
class ClassificationResult:
    classification_result: str          # "HANDLOOM_AUTHENTIC" | "POWERLOOM_SUSPECT"
    confidence: float                   # 0-1
    periodicity_score: float            # 0-1, raw combined score vs threshold
    calculated_periodicity_score: float # alias kept for DB field naming
    entropy_score: float                # raw spectral entropy (not normalized)
    paer: float                         # raw peak-to-average energy ratio
    quality_ok: bool
    quality_message: str

    def to_dict(self) -> dict:
        return asdict(self)


class ImageQualityError(Exception):
    """Raised when the input image fails the pre-analysis quality gate."""


# --------------------------------------------------------------------------
# Step 1-2: Decode + quality gate
# --------------------------------------------------------------------------

def decode_image(file_bytes: bytes) -> np.ndarray:
    """Decode raw bytes into a BGR OpenCV image, raising on invalid input."""
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ImageQualityError("Could not decode image — unsupported or corrupt file.")
    return img


def check_blur(gray: np.ndarray) -> float:
    """
    Variance of the Laplacian is a standard focus-measure: a sharp image has
    high-frequency edge content (high variance); a blurry image is smoothed
    out (low variance). Returns the raw variance for logging/thresholding.
    """
    return cv2.Laplacian(gray, cv2.CV_64F).var()


def run_quality_gate(img: np.ndarray) -> Tuple[bool, str, np.ndarray]:
    """
    Validates minimum resolution and sharpness. Returns (ok, message, gray).
    We still return the grayscale image even on failure so the caller can
    decide whether to hard-reject or proceed with a lowered-confidence flag.
    """
    h, w = img.shape[:2]
    if min(h, w) < MIN_INPUT_DIMENSION:
        return False, (
            f"Image resolution too low ({w}x{h}); please move closer to the "
            f"fabric weave and retake the photo."
        ), cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_score = check_blur(gray)
    if blur_score < MIN_LAPLACIAN_VARIANCE:
        return False, (
            f"Image too blurry (sharpness={blur_score:.1f}, "
            f"min required={MIN_LAPLACIAN_VARIANCE}). Hold the camera steady "
            f"and ensure the weave threads are in focus."
        ), gray

    return True, "OK", gray


# --------------------------------------------------------------------------
# Step 3: Preprocessing
# --------------------------------------------------------------------------

def preprocess(gray: np.ndarray) -> np.ndarray:
    """
    - CLAHE (Contrast Limited Adaptive Histogram Equalization) corrects
      uneven lighting / low-light shots without blowing out highlights,
      which is important because raw contrast differences would otherwise
      leak into the FFT as spurious low-frequency energy.
    - Center-crop to a square, then resize to a fixed WORKING_SIZE so that
      FFT bin spacing is consistent across photos taken at different
      distances/resolutions (frequency bins are a function of pixel grid
      size, not physical distance, so fixing image size is essential for
      threshold comparability).
    """
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    h, w = enhanced.shape
    side = min(h, w)
    top = (h - side) // 2
    left = (w - side) // 2
    cropped = enhanced[top:top + side, left:left + side]

    resized = cv2.resize(cropped, (WORKING_SIZE, WORKING_SIZE), interpolation=cv2.INTER_AREA)

    # Apply a Hann window to reduce spectral leakage from the hard edges
    # of the crop (standard practice before taking an FFT of a finite
    # patch — otherwise edge discontinuities inject false high-frequency
    # energy that muddies both PAER and entropy).
    window = np.outer(np.hanning(WORKING_SIZE), np.hanning(WORKING_SIZE))
    windowed = resized.astype(np.float64) * window

    return windowed


# --------------------------------------------------------------------------
# Step 4: 2D FFT feature extraction
# --------------------------------------------------------------------------

def compute_fft_features(windowed: np.ndarray) -> Tuple[float, float, np.ndarray]:
    """
    Returns (paer, spectral_entropy, magnitude_spectrum).

    - Magnitude spectrum: |FFT| after fftshift, so the DC (zero-frequency)
      component sits at the center and radial distance from center encodes
      spatial frequency.
    - PAER (Peak-to-Average Energy Ratio): we exclude the DC region (a
      small central disk) since overall brightness dominates it and is
      not informative about weave regularity. PAER = max(energy) /
      mean(energy) over the remaining AC spectrum. A regular grid pattern
      (powerloom) concentrates energy into a handful of sharp harmonic
      peaks -> a small number of very high bins against a low mean ->
      high PAER. Hand-woven irregularity spreads energy across many bins
      -> lower PAER.
    - Spectral entropy: treat the (masked, normalized) power spectrum as a
      probability distribution and compute Shannon entropy. A few sharp
      peaks -> low entropy (low disorder). A diffuse spectrum -> high
      entropy (high disorder), consistent with organic hand-woven
      variation.
    """
    f_transform = np.fft.fft2(windowed)
    f_shifted = np.fft.fftshift(f_transform)
    magnitude = np.abs(f_shifted)

    # Power spectrum (energy), add epsilon to avoid log(0)/div-by-zero.
    power = magnitude ** 2
    eps = 1e-10

    # Mask out the DC / very-low-frequency disk at the center — this
    # carries overall brightness/illumination info, not weave texture.
    cy, cx = WORKING_SIZE // 2, WORKING_SIZE // 2
    yy, xx = np.ogrid[:WORKING_SIZE, :WORKING_SIZE]
    dist_from_center = np.sqrt((yy - cy) ** 2 + (xx - cx) ** 2)
    dc_radius = WORKING_SIZE * 0.02  # mask innermost ~2% of the spectrum radius
    ac_mask = dist_from_center > dc_radius

    ac_power = power[ac_mask]

    # --- PAER ---
    peak_energy = np.max(ac_power)
    mean_energy = np.mean(ac_power) + eps
    paer = float(peak_energy / mean_energy)

    # --- Spectral entropy (Shannon, base-2) ---
    total_energy = np.sum(ac_power) + eps
    prob_dist = ac_power / total_energy
    entropy = float(-np.sum(prob_dist * np.log2(prob_dist + eps)))

    return paer, entropy, magnitude


def normalize(value: float, lo: float, hi: float) -> float:
    """Clamp-and-scale a raw feature value into [0, 1]."""
    if hi == lo:
        return 0.0
    return float(np.clip((value - lo) / (hi - lo), 0.0, 1.0))


# --------------------------------------------------------------------------
# Step 5: Classification
# --------------------------------------------------------------------------

def classify(paer: float, entropy: float) -> ClassificationResult:
    """
    Combine normalized PAER (higher = more machine-like) and normalized
    inverse-entropy (lower entropy = more machine-like) into a single
    periodicity_score in [0, 1], then apply POWERLOOM_THRESHOLD.

    Confidence is reported as the distance of periodicity_score from the
    threshold, rescaled to [0.5, 1.0] — a score right at the threshold is
    a coin-flip (0.5 confidence); a score at the extreme is near-certain
    (1.0 confidence).
    """
    norm_paer = normalize(paer, PAER_MIN, PAER_MAX)
    norm_entropy = normalize(entropy, ENTROPY_MIN, ENTROPY_MAX)
    norm_inv_entropy = 1.0 - norm_entropy  # low entropy -> high "machine-ness"

    periodicity_score = (PAER_WEIGHT * norm_paer) + (ENTROPY_WEIGHT * norm_inv_entropy)
    periodicity_score = float(np.clip(periodicity_score, 0.0, 1.0))

    is_powerloom = periodicity_score > POWERLOOM_THRESHOLD
    label = "POWERLOOM_SUSPECT" if is_powerloom else "HANDLOOM_AUTHENTIC"

    # Distance from threshold, normalized against the wider side of the
    # [0,1] range it sits in, then mapped to [0.5, 1.0].
    if is_powerloom:
        span = max(1.0 - POWERLOOM_THRESHOLD, 1e-6)
        distance = (periodicity_score - POWERLOOM_THRESHOLD) / span
    else:
        span = max(POWERLOOM_THRESHOLD, 1e-6)
        distance = (POWERLOOM_THRESHOLD - periodicity_score) / span
    confidence = float(0.5 + 0.5 * np.clip(distance, 0.0, 1.0))

    return ClassificationResult(
        classification_result=label,
        confidence=round(confidence, 4),
        periodicity_score=round(periodicity_score, 4),
        calculated_periodicity_score=round(periodicity_score, 4),
        entropy_score=round(entropy, 4),
        paer=round(paer, 4),
        quality_ok=True,
        quality_message="OK",
    )


# --------------------------------------------------------------------------
# End-to-end pipeline
# --------------------------------------------------------------------------

def analyze_weave(file_bytes: bytes, allow_low_quality: bool = False) -> ClassificationResult:
    img = decode_image(file_bytes)
    quality_ok, quality_message, gray = run_quality_gate(img)

    if not quality_ok and not allow_low_quality:
        raise ImageQualityError(quality_message)

    windowed = preprocess(gray)
    paer, entropy, _magnitude = compute_fft_features(windowed)
    result = classify(paer, entropy)

    if not quality_ok:
        # Proceeded anyway (allow_low_quality=True): flag the low
        # confidence rather than silently returning a normal-looking result.
        result.quality_ok = False
        result.quality_message = quality_message
        result.confidence = round(result.confidence * 0.6, 4)  # discount confidence

    return result


# --------------------------------------------------------------------------
# Flask routes
# --------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health() -> Tuple[dict, int]:
    return jsonify({"status": "ok", "service": "craftproof-cv-engine"}), 200


@app.route("/analyze", methods=["POST"])
def analyze_endpoint():
    """
    Expects multipart/form-data with a single file field named "image".
    Optional form field "allow_low_quality" ("true"/"false") to force
    analysis through even if the quality gate fails (result will be
    flagged with a discounted confidence).

    Response JSON matches the WeaveInspectionLog fields the backend needs
    to persist:
        {
          "classification_result": "HANDLOOM_AUTHENTIC" | "POWERLOOM_SUSPECT",
          "confidence": 0.0-1.0,
          "calculated_periodicity_score": 0.0-1.0,
          "entropy_score": float,
          "paer": float,
          "quality_ok": bool,
          "quality_message": str
        }
    """
    if "image" not in request.files:
        return jsonify({"error": "Missing 'image' file field."}), 400

    file = request.files["image"]
    file_bytes = file.read()
    if not file_bytes:
        return jsonify({"error": "Empty file upload."}), 400

    allow_low_quality = request.form.get("allow_low_quality", "false").lower() == "true"

    try:
        result = analyze_weave(file_bytes, allow_low_quality=allow_low_quality)
    except ImageQualityError as exc:
        logger.info("Quality gate rejected upload: %s", exc)
        return jsonify({
            "error": "quality_gate_failed",
            "message": str(exc),
        }), 422
    except Exception as exc:  # noqa: BLE001 — surface unexpected errors safely
        logger.exception("Unexpected error during weave analysis")
        return jsonify({"error": "internal_error", "message": str(exc)}), 500

    return jsonify(result.to_dict()), 200


if __name__ == "__main__":
    # Dev server only — run behind gunicorn/uwsgi in production.
    app.run(host="0.0.0.0", port=5001, debug=True)
