"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  ChevronLeft, 
  MapPin, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  ShieldCheck, 
  BookOpen, 
  FileText,
  QrCode,
  Navigation2,
  Navigation,
  Share2,
  Check,
  Compass,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Info
} from "lucide-react";
import Link from "next/link";
import { CulturalItem, ItemRecommendations, RecommendationItem } from "../map/mapTypes";
import { geoAPI } from "@/lib/api";

interface CulturalItemPanelProps {
  item: CulturalItem | null;
  onBackToDistrict: () => void;
  onClose: () => void;
  onOpenStory: (storySlug: string) => void;
  onSelectItemSlug?: (slug: string) => void;
  onLocateOnMap?: (lat: number, lon: number) => void;
}

export default function CulturalItemPanel({
  item,
  onBackToDistrict,
  onClose,
  onOpenStory,
  onSelectItemSlug,
  onLocateOnMap,
}: CulturalItemPanelProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [recommendations, setRecommendations] = useState<ItemRecommendations | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Stop any speech when item changes or closes, and fetch recommendations
  useEffect(() => {
    setIsPlayingAudio(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (item?.slug) {
      setLoadingRecs(true);
      geoAPI
        .recommendations(item.slug)
        .then((res) => {
          setRecommendations(res.data);
        })
        .catch((err) => {
          console.warn("Could not load recommendations:", err);
          setRecommendations(null);
        })
        .finally(() => setLoadingRecs(false));
    }
  }, [item?.slug]);

  if (!item) return null;

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const text = item.audio_script || item.short_description;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" 
      ? `${window.location.origin}/?item=${item.slug}` 
      : `/culture/${item.slug}`;
    const shareData = {
      title: `${item.title} — Dharohar Cultural Atlas`,
      text: `${item.short_description} Discover India's living heritage on Dharohar.`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fall back to clipboard if user cancelled or error
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const isOfficial = item.verification_tier === "OFFICIAL_VERIFIED";
  const isSourceAvailable = item.verification_tier === "SOURCE_AVAILABLE";

  const hasCoords = item.lat != null && item.lon != null;
  const directionsUrl = hasCoords 
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`
    : null;

  // Flatten recommendations for display
  const allNearby = recommendations
    ? [
        ...(recommendations.nearby_crafts || []),
        ...(recommendations.nearby_food || []),
        ...(recommendations.nearby_heritage || []),
        ...(recommendations.nearby_traditions || []),
      ].slice(0, 4)
    : [];

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[460px] md:w-[520px] bg-[#FAF6EE]/98 backdrop-blur-2xl border-l border-[#e7dfd5] z-[510] shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right font-sans text-[#1c1917]">
      {/* Top Navigation Bar */}
      <div className="p-4 border-b border-[#e7dfd5] flex items-center justify-between gap-3 shrink-0 bg-white/70">
        <button
          onClick={onBackToDistrict}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 hover:text-sky-700 text-xs font-semibold transition-colors border border-[#e7dfd5] cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>District Dossier</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-[#e7dfd5] transition-colors cursor-pointer shadow-sm"
            title="Share this cultural record"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-600" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Close Panel Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-[#e7dfd5] cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
        {/* Category & Living Status Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 uppercase tracking-wider">
              {item.category.replace(/_/g, " ")}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
              <span>Living Heritage</span>
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isOfficial
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : isSourceAvailable
                ? "bg-sky-100 text-sky-800 border border-sky-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isOfficial ? "Official Government Verified" : isSourceAvailable ? "Source-Audited Record" : "Community Candidate"}
            </span>
          </div>
        </div>

        {/* Hero Image & Credit */}
        {item.image_url ? (
          <div className="space-y-1.5">
            <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-stone-100 border border-[#e7dfd5] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.image_caption && (
              <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
                <span>{item.image_caption}</span>
                {item.image_source && (
                  <span className="text-stone-400 italic">Source: {item.image_source}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-8 bg-amber-50/50 rounded-2xl border border-amber-200/70 flex flex-col items-center justify-center text-center p-4">
            <span className="text-3xl mb-1">🏛️</span>
            <span className="text-xs font-serif font-bold text-stone-800">{item.title}</span>
            <span className="text-[10px] text-stone-500 mt-0.5">Authoritative cultural archive entry</span>
          </div>
        )}

        {/* Title & Short Description */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight">
            {item.title}
          </h2>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed font-sans">
            {item.short_description}
          </p>
        </div>

        {/* Physical GeoPoint Site & Navigation Controls */}
        {(item.location_name || item.address || hasCoords) && (
          <div className="p-3.5 rounded-2xl bg-white border border-[#e7dfd5] space-y-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <div className="font-semibold text-stone-900">
                  {item.location_name || "Physical Heritage Site"}
                </div>
                {item.address && (
                  <div className="text-stone-500 text-[11px] mt-0.5">{item.address}</div>
                )}
                {hasCoords && (
                  <div className="text-stone-400 text-[10px] mt-0.5 font-mono">
                    {item.lat?.toFixed(4)}°N, {item.lon?.toFixed(4)}°E
                  </div>
                )}
              </div>
            </div>

            {/* Geo Action Buttons: Get Directions & Locate on Map */}
            <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  title="Open driving / transit directions in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions ↗</span>
                </a>
              )}

              {hasCoords && onLocateOnMap && (
                <button
                  onClick={() => onLocateOnMap(item.lat!, item.lon!)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-[#e7dfd5] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  title="Center map on this heritage site"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  <span>Locate</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Why This Is Here — Geospatial Provenance Explanation */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Why This Record Is Here</span>
          </div>
          <p className="text-[11px] text-amber-950/80 leading-relaxed">
            Dharohar pins this heritage to its authentic geographical origin. Sourced from official district gazetteers, archaeological audits, and the Ministry of Culture registry.
          </p>
        </div>

        {/* Audio Experience */}
        {item.audio_script && (
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Audio Narration</span>
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {item.audio_type === "RECORDED_STORY" ? "🎙️ Authentic Field Audio" : "🤖 Synthesized Narration"}
                </span>
              </div>

              <button
                onClick={toggleSpeech}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-stone-700 italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 leading-relaxed font-serif">
              &ldquo;{item.audio_script}&rdquo;
            </p>
          </div>
        )}

        {/* Multi-Chapter Story CTA */}
        {item.story_slug && (
          <button
            onClick={() => onOpenStory(item.story_slug!)}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-sky-300 text-sky-800 hover:text-sky-900 font-bold text-xs flex items-center justify-between shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Read Full Multi-Chapter Living Story</span>
            </div>
            <span className="text-sky-600 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {/* Detailed Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Detailed Documentation
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed font-sans whitespace-pre-line bg-white p-4 rounded-2xl border border-[#e7dfd5] shadow-sm">
            {item.detailed_overview}
          </p>
        </div>

        {/* More to Explore — Recommendations Engine */}
        {allNearby.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                <span>More to Explore Nearby</span>
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Proximity-aware</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allNearby.map((rec) => (
                <button
                  key={rec.slug}
                  onClick={() => onSelectItemSlug && onSelectItemSlug(rec.slug)}
                  className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] hover:border-sky-400 text-left transition-all shadow-sm group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                        {rec.category}
                      </span>
                      <span className="text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                        {rec.distance_km} km
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                      {rec.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-between">
                    <span>{rec.district_name}</span>
                    <span className="text-sky-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Normalized Multi-Source Citations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Authoritative Source Citations ({item.sources.length})</span>
          </h3>

          <div className="space-y-2.5">
            {item.sources.map((src, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-[#e7dfd5] space-y-1.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-stone-900">
                    {src.name}
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                    {src.tier.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-[11px] text-stone-500">
                  {src.publisher} {src.date ? `(${src.date})` : ""}
                </div>

                {src.citation && (
                  <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                    &ldquo;{src.citation}&rdquo;
                  </p>
                )}

                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:underline pt-1 font-medium"
                  >
                    <span>Verify at primary portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Existing Feature Bridge Links */}
        <div className="pt-2 border-t border-[#e7dfd5] space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-1">
            Connect With This Heritage
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/workshops"
              className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] flex items-center gap-2 text-xs text-stone-700 hover:text-amber-700 transition-colors shadow-sm group"
            >
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold truncate">Living Workshops</div>
                <div className="text-[10px] text-stone-400">Meet craft masters</div>
              </div>
            </Link>
            <Link
              href="/verify"
              className="p-3 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] flex items-center gap-2 text-xs text-stone-700 hover:text-sky-700 transition-colors shadow-sm group"
            >
              <QrCode className="w-4 h-4 text-sky-600 shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold truncate">QR Provenance</div>
                <div className="text-[10px] text-stone-400">Cryptographic audit</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
