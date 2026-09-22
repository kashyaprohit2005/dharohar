import os
import zipfile
import sys

BACKEND_DIR = r"C:\Users\Rohit\craftproof"
FRONTEND_DIR = r"C:\Users\Rohit\craftproof-web"

OUTPUT_FULL_ZIP = r"C:\Users\Rohit\DHAROHAR_FULL_PROJECT.zip"
OUTPUT_BACKEND_ZIP = r"C:\Users\Rohit\dharohar-backend.zip"
OUTPUT_FRONTEND_ZIP = r"C:\Users\Rohit\dharohar-frontend.zip"

BACKEND_EXCLUDE_DIRS = {"venv", "__pycache__", ".git", ".pytest_cache", "node_modules"}
BACKEND_EXCLUDE_FILES = {"backend.log", "package.json", "package-lock.json", "package_dharohar.py"}

FRONTEND_EXCLUDE_DIRS = {"node_modules", ".next", ".git", "__pycache__", ".turbo"}
FRONTEND_EXCLUDE_FILES = {"frontend.log", "tsconfig.tsbuildinfo"}

ROOT_README = """# DHAROHAR (धरोहर)
### India's Living Heritage — Places, People, Stories & Proof

## Overview
Dharohar connects Place, Culture, Living Heritage, Stories, Practitioners, Traditional Knowledge, Evidence, and Cryptographic Provenance across India.

- **15 First-Class Cultural Domains**: Food & Culinary, Crafts, Textiles, Traditional Clothing, Art Styles, Folklore, Music, Living Dance, Performing Arts, Festivals & Fairs, Forts & Architecture, Spiritual & Sacred, Cultural Practices, Traditional Knowledge, Live Cultural Events.
- **40 Real Reference Traditions**: Verified, authentic records spanning all 28 Indian States and 8 UTs.
- **Live Cultural Events Engine**: Dynamic calculation (`LIVE NOW`, `THIS WEEK`, `UPCOMING`), Geodesic Haversine distance, and RFC 5545 `.ics` iCalendar calendar downloads.
- **"Listen to India"**: Oral storytelling narration with Web Speech API audio synthesis and visualizer wave bars.
- **"Share India"**: HTML5 Canvas (1200x630) social card generator (PNG download + WhatsApp/X/LinkedIn sharing).
- **3D WebGL Artifacts Lab**: Three.js 360-degree interactive viewer with clickable structural hotspots.
- **"My Heritage Passport"**: Persistent slide-out favorites drawer & session trail breadcrumbs.
- **Zero Fake Demo Data Baseline**: Starts cleanly with 0 dummy artisans/products/batches. All records created live through the UI.

---

## Quick Start Guide

### 1. Backend Setup & Run (FastAPI + SQLite)
```bash
cd backend
python -m venv venv

# On Windows:
venv\\Scripts\\activate
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
- API Server: http://localhost:8000
- API Health Check: http://localhost:8000/health
- Swagger Interactive Docs: http://localhost:8000/docs

### 2. Frontend Setup & Run (Next.js 16 + React 19 + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: http://localhost:3000
- Interactive Atlas Map: http://localhost:3000/map
- Heritage Around Me: http://localhost:3000/around-me
- Artisan Portal: http://localhost:3000/artisan/register
- Verifier Portal: http://localhost:3000/verifier

---

## Automated Verification Suite
To run the full end-to-end judge verification journey:
```bash
cd backend
python test_e2e_judge_walkthrough.py
```
Tests all 8 stages:
1. Passport Favorites toggle
2. Live Artisan Self-Registration
3. Verifier Portal Approval
4. Product Creation
5. Batch & SHA-256 Provenance Hash Minting
6. Public Cryptographic QR Verification
7. Cultural Calendar `.ics` Download
8. Clean State Reset
"""

def add_folder_to_zip(zip_file, folder_path, arc_prefix, exclude_dirs, exclude_files):
    count = 0
    for root, dirs, files in os.walk(folder_path):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if f.endswith(('.pyc', '.pyo')) or f == '.DS_Store' or f in exclude_files:
                continue
            abs_path = os.path.join(root, f)
            rel_path = os.path.relpath(abs_path, folder_path).replace("\\", "/")
            arc_name = f"{arc_prefix}/{rel_path}" if arc_prefix else rel_path
            zip_file.write(abs_path, arc_name)
            count += 1
    return count

def build_zips():
    print("Building DHAROHAR Zip Archives...")

    # 1. Full Unified Zip
    print(f"Creating Unified Archive: {OUTPUT_FULL_ZIP}")
    with zipfile.ZipFile(OUTPUT_FULL_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("README.md", ROOT_README.strip() + "\n")
        b_count = add_folder_to_zip(zf, BACKEND_DIR, "backend", BACKEND_EXCLUDE_DIRS, BACKEND_EXCLUDE_FILES)
        f_count = add_folder_to_zip(zf, FRONTEND_DIR, "frontend", FRONTEND_EXCLUDE_DIRS, FRONTEND_EXCLUDE_FILES)
        print(f"  Added {b_count} backend files and {f_count} frontend files + README.md")

    # 2. Standalone Backend Zip
    print(f"Creating Backend Archive: {OUTPUT_BACKEND_ZIP}")
    with zipfile.ZipFile(OUTPUT_BACKEND_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        b_count = add_folder_to_zip(zf, BACKEND_DIR, "", BACKEND_EXCLUDE_DIRS, BACKEND_EXCLUDE_FILES)
        print(f"  Added {b_count} backend files")

    # 3. Standalone Frontend Zip
    print(f"Creating Frontend Archive: {OUTPUT_FRONTEND_ZIP}")
    with zipfile.ZipFile(OUTPUT_FRONTEND_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        f_count = add_folder_to_zip(zf, FRONTEND_DIR, "", FRONTEND_EXCLUDE_DIRS, FRONTEND_EXCLUDE_FILES)
        print(f"  Added {f_count} frontend files")

    print("\nAll archives created successfully:")
    for path in [OUTPUT_FULL_ZIP, OUTPUT_BACKEND_ZIP, OUTPUT_FRONTEND_ZIP]:
        size_mb = os.path.getsize(path) / (1024 * 1024)
        print(f" - {path} ({size_mb:.2f} MB / {os.path.getsize(path):,} bytes)")

if __name__ == "__main__":
    build_zips()
