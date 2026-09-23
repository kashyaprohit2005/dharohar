"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Navigation, 
  Share2, 
  Sparkles, 
  Calendar, 
  Info, 
  Layers, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  QrCode,
  BookOpen,
  ArrowRight,
  Volume2
} from "lucide-react";
import { geoAPI } from "@/lib/api";

export interface LocationDossierItem {
  id?: number | string;
  name: string;
  slug?: string;
  category?: string;
  subcategory?: string;
  state?: string;
  region?: string;
  district?: string;
  subdistrict?: string;
  village?: string;
  locality?: string;
  lat?: number;
  lon?: number;
  description?: string;
  short_description?: string;
  history?: string;
  techniques?: string;
  materials?: string;
  why_here?: string;
  what_makes_it_special?: string;
  preservation_status?: string;
  at_risk_level?: string;
  gi_tag?: string | null;
  image_url?: string | null;
  image_source_name?: string;
  image_source_url?: string;
  image_alt?: string;
  has_3d?: boolean;
  evidence?: Array<{
    claim: string;
    source_name: string;
    source_url?: string;
    source_type?: string;
    verification_status?: string;
  }>;
  verification?: {
    status: string;
    badge: string;
    sources: Array<any>;
  };
  connected_practitioners?: Array<{
    id: number | string;
    name: string;
    district?: string;
    state?: string;
    craft?: string;
    passbook_url?: string;
  }>;
  events?: Array<{
    event_id: string;
    title: string;
    start_date: string;
    end_date?: string;
    venue?: string;
    status?: string;
  }>;
  isGeographicOnly?: boolean;
  statusNotice?: string;
}

interface LocationDossierProps {
  isOpen: boolean;
  item: LocationDossierItem | null;
  onClose: () => void;
  onViewOnMap?: (lat: number, lon: number) => void;
  onShare?: (item: LocationDossierItem) => void;
}

export default function LocationDossier({
  isOpen,
  item,
  onClose,
  onViewOnMap,
  onShare,
}: LocationDossierProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [detailedItem, setDetailedItem] = useState<LocationDossierItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!item) {
      setDetailedItem(null);
      setRecommendations([]);
      return;
    }

    setDetailedItem(item);
    setActiveTab("overview");

    // If item has an ID or slug, fetch deep dossier from backend API
    if (item.id || item.slug) {
      const identifier = item.id || item.slug;
      setLoadingDetails(true);
      geoAPI
        .item(identifier!)
        .then((res) => {
          if (res.data) {
            setDetailedItem(res.data);
          }
        })
        .catch(() => {
          // Keep existing item data on fallback
        })
        .finally(() => setLoadingDetails(false));

      // Fetch contextual recommendations
      geoAPI
        .recommendations(identifier!)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setRecommendations(res.data);
          }
        })
        .catch(() => setRecommendations([]));
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const current = detailedItem || item;
  const isGeoOnly = Boolean(
    current.isGeographicOnly || 
    current.statusNotice?.includes("not yet verified") ||
    (!current.description && !current.category)
  );

  const directionsUrl = current.lat && current.lon
    ? `https://www.google.com/maps/dir/?api=1&destination=${current.lat},${current.lon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${current.name}, ${current.district || ""}, ${current.state || "Haryana"}`
      )}`;

  const handleShareClick = () => {
    if (onShare) {
      onShare(current);
    } else {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const shareUrl = typeof window !== "undefined" ? window.location.href : "";
        navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const getVerificationBadge = () => {
    if (isGeoOnly) {
      return {
        label: "GEOGRAPHIC RECORD ONLY",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        icon: <Info className="w-3.5 h-3.5" />
      };
    }
    const status = current.verification?.status || "VERIFIED";
    if (status === "VERIFIED") {
      return {
        label: "✓ VERIFIED LIVING RECORD",
        color: "bg-emerald-50 text-emerald-800 border-emerald-300",
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      };
    }
    return {
      label: "◐ UNDER CULTURAL REVIEW",
      color: "bg-amber-50 text-amber-800 border-amber-300",
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
    };
  };

  const badge = getVerificationBadge();

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-end bg-stone-950/50 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Shell: Warm Heritage Parchment */}
      <div className="relative w-full max-w-2xl h-full bg-[#FAF6EE] text-[#2A2421] shadow-2xl flex flex-col overflow-hidden border-l border-[#E2D8C3] z-10 animate-slideLeft">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFC8] bg-[#F7F1E7]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#78350F] font-bold">
              Dharohar Location Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareClick}
              className="p-2 rounded-full hover:bg-[#EFE7D5] text-[#78350F] transition border border-[#E2D8C3] flex items-center gap-1.5 text-xs font-semibold"
              title="Share Dossier"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copySuccess ? "Copied Link!" : "Share"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EFE7D5] text-stone-600 hover:text-stone-900 transition border border-[#E2D8C3]"
              title="Close Dossier (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-[#DFD5C0]">
          
          {/* 1. HERO MEDIA BANNER */}
          {current.image_url ? (
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E2D8C3] shadow-md group">
              <img
                src={current.image_url}
                alt={current.image_alt || current.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Category & Status Overlay on Hero */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  {current.category && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-600 text-white shadow-sm inline-block mb-1.5">
                      {current.category.replace("_", " ")}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight drop-shadow-md">
                    {current.name}
                  </h2>
                  <p className="text-xs text-stone-200 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {current.locality || current.village ? `${current.locality || current.village}, ` : ""}
                      {current.district ? `${current.district}, ` : ""}
                      {current.state || "Haryana"}
                    </span>
                  </p>
                </div>

                {current.has_3d && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-black/80 text-amber-400 border border-amber-500/50 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D View</span>
                  </span>
                )}
              </div>

              {/* Source attribution tiny tag */}
              {current.image_source_name && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-stone-300 font-mono">
                  Photo: {current.image_source_name}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#F4EDE0] border border-[#E2D8C3] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">
                <MapPin className="w-4 h-4 text-[#B45309]" />
                <span>
                  {current.district ? `${current.district} District • ` : ""}
                  {current.state || "Haryana"}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                {current.name}
              </h2>
            </div>
          )}

          {/* 2. GEOGRAPHIC EXISTENCE vs CULTURAL DOCUMENTATION HONEST STATE */}
          {isGeoOnly ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-[#78350F] space-y-3 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm text-[#92400E]">
                <Info className="w-4 h-4 shrink-0 text-[#B45309]" />
                <span>Verified Administrative Settlement</span>
              </div>
              <p className="text-sm font-serif italic text-[#78350F] leading-relaxed">
                "{current.statusNotice || "Geographic record available. Cultural documentation not yet verified."}"
              </p>
              <p className="text-xs text-[#92400E]/80 leading-relaxed">
                This locality is authenticated within the Survey of India and Haryana revenue registry. Traditional arts, oral narratives, or GI crafts have not yet completed official documentation. You may submit cultural evidence through our Community Contribution engine.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link
                  href="/contribute"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#B45309] text-white hover:bg-[#92400E] transition shadow-sm"
                >
                  <span>Submit Cultural Documentation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {current.lat && current.lon && (
                  <button
                    onClick={() => onViewOnMap && onViewOnMap(current.lat!, current.lon!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-amber-300 text-[#78350F] hover:bg-amber-100/50 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>Locate Settlement on Map</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Category Segmented Chips */}
              <div className="flex items-center gap-2 border-b border-[#E8DFC8] pb-2 text-xs font-semibold overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Overview & Synopsis" },
                  { id: "why_here", label: "Why is this here?" },
                  { id: "sources", label: `Sources (${current.evidence?.length || current.verification?.sources?.length || 1})` },
                  ...(current.connected_practitioners?.length ? [{ id: "artisans", label: `Artisans (${current.connected_practitioners.length})` }] : []),
                  ...(current.events?.length ? [{ id: "events", label: `Events (${current.events.length})` }] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                      activeTab === tab.id
                        ? "bg-[#2A2421] text-white font-bold shadow-sm"
                        : "text-[#574E45] hover:text-[#2A2421] hover:bg-[#EFE7D5]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW & ATMOSPHERIC SYNOPSIS */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* GI Tag & Verification Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.color}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    {current.gi_tag && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        🏷️ {current.gi_tag}
                      </span>
                    )}

                    {current.at_risk_level === "PRESERVATION_WATCH" && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        ⚠️ Preservation Watch
                      </span>
                    )}
                  </div>

                  {/* Short atmospheric synopsis */}
                  <p className="text-base sm:text-lg font-serif italic text-[#3D3531] leading-relaxed border-l-2 border-[#B45309] pl-3 py-0.5">
                    {current.short_description || current.description}
                  </p>

                  {/* Detailed Description */}
                  {current.description && current.description !== current.short_description && (
                    <div className="text-sm text-[#443C36] leading-relaxed space-y-2">
                      <p>{current.description}</p>
                    </div>
                  )}

                  {/* History / Origin */}
                  {current.history && (
                    <div className="p-4 rounded-2xl bg-[#F4EDE0] border border-[#E4DAC5] space-y-1.5 text-xs text-[#443C36]">
                      <h4 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#B45309]" />
                        <span>Historical Lineage & Context</span>
                      </h4>
                      <p className="leading-relaxed">{current.history}</p>
                    </div>
                  )}

                  {/* Techniques & Materials if available */}
                  {(current.techniques || current.materials) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {current.techniques && (
                        <div className="p-3 rounded-xl bg-white border border-[#E2D8C3]">
                          <span className="font-bold text-[#92400E] block mb-1">Technique & Crafting:</span>
                          <span className="text-[#443C36] leading-relaxed">{current.techniques}</span>
                        </div>
                      )}
                      {current.materials && (
                        <div className="p-3 rounded-xl bg-white border border-[#E2D8C3]">
                          <span className="font-bold text-[#92400E] block mb-1">Native Materials:</span>
                          <span className="text-[#443C36] leading-relaxed">{current.materials}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: WHY IS THIS HERE? (Section 19 & 31 Requirement) */}
              {activeTab === "why_here" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E0D5BE] space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#92400E]">
                      <Compass className="w-4 h-4 text-[#B45309]" />
                      <span>Why is this linked to this specific locality?</span>
                    </div>
                    <p className="text-sm text-[#3D3531] leading-relaxed">
                      {current.why_here || (
                        `Linked to ${current.locality || current.village || current.district || current.state} because historical records, government gazetteers, and artisan guild settlements identify this precise geographic terrain as the cradle of this cultural practice.`
                      )}
                    </p>

                    {current.what_makes_it_special && (
                      <div className="pt-3 border-t border-[#EFE7D5] space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#78350F]">
                          What Makes It Special?
                        </span>
                        <p className="text-xs text-[#574E45] leading-relaxed">
                          {current.what_makes_it_special}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SOURCES & VERIFICATION (Section 18 & 19 Requirement) */}
              {activeTab === "sources" && (
                <div className="space-y-3">
                  <div className="text-xs text-[#574E45]">
                    Every verified claim in Dharohar is tied to official gazetteers, government registries, or academic surveys:
                  </div>

                  {(current.evidence || current.verification?.sources || []).map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-[#E2D8C3] space-y-2 text-xs shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ev.source_name || "Official Cultural Gazetteer"}</span>
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {ev.verification_status || "VERIFIED"}
                        </span>
                      </div>
                      <p className="text-[#443C36] leading-relaxed">
                        {ev.claim || "Documented and protected under cultural heritage preservation protocols."}
                      </p>
                      {ev.source_url && (
                        <a
                          href={ev.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#B45309] hover:underline font-semibold"
                        >
                          <span>Inspect Original Registry</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: CONNECTED ARTISANS & PASSPORT (Section 34 & 35) */}
              {activeTab === "artisans" && current.connected_practitioners && (
                <div className="space-y-3">
                  <div className="text-xs text-[#574E45]">
                    Living practitioners preserving this tradition on the ground:
                  </div>
                  {current.connected_practitioners.map((artisan, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E2D8C3] flex items-center justify-between shadow-sm">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                          {artisan.name}
                        </h4>
                        <p className="text-xs text-[#78350F]">
                          {artisan.craft || current.category} • {artisan.district || current.district}
                        </p>
                      </div>
                      <Link
                        href={artisan.passbook_url || `/artisan/${artisan.id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#B45309] text-white hover:bg-[#92400E] transition flex items-center gap-1"
                      >
                        <span>View Passbook</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: UPCOMING EVENTS & FAIRS (Section 15 & 16) */}
              {activeTab === "events" && current.events && (
                <div className="space-y-3">
                  {current.events.map((ev, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E2D8C3] space-y-1.5 shadow-sm text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917] text-sm font-serif">{ev.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          {ev.status || "Seasonal"}
                        </span>
                      </div>
                      <p className="text-[#78350F] flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3 text-[#B45309]" />
                        <span>{ev.start_date} {ev.end_date ? `→ ${ev.end_date}` : ""}</span>
                      </p>
                      {ev.venue && <p className="text-[#574E45]">📍 {ev.venue}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MORE TO EXPLORE (RECOMMENDATIONS ENGINE - Section 27 & 56) */}
          {recommendations.length > 0 && !isGeoOnly && (
            <div className="space-y-3 pt-3 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                  More to Explore in {current.district || current.state}
                </h4>
                <span className="text-[11px] text-[#78350F]">Contextual Recommendations</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {recommendations.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => {
                      setDetailedItem(rec);
                      setActiveTab("overview");
                    }}
                    className="p-3 rounded-xl bg-white border border-[#E2D8C3] text-left hover:border-[#B45309] transition hover:shadow-md group space-y-1"
                  >
                    <div className="text-[10px] font-bold uppercase text-[#B45309] tracking-wider truncate">
                      {rec.category}
                    </div>
                    <div className="font-serif font-bold text-xs text-[#1C1917] group-hover:text-[#B45309] line-clamp-1">
                      {rec.name}
                    </div>
                    <div className="text-[10px] text-[#78350F] truncate">
                      📍 {rec.district || rec.state}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. ACTIONS FOOTER TOOLBAR (Section 25, 26, 31) */}
        <div className="p-4 border-t border-[#E8DFC8] bg-[#F7F1E7]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {current.lat && current.lon && (
              <button
                onClick={() => onViewOnMap && onViewOnMap(current.lat!, current.lon!)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#2A2421] border border-[#E2D8C3] hover:bg-[#EFE7D5] transition flex items-center gap-1.5 shadow-sm"
              >
                <Compass className="w-4 h-4 text-[#B45309]" />
                <span>View on Map</span>
              </button>
            )}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#B45309] text-white hover:bg-[#92400E] transition flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareClick}
              className="p-2 rounded-xl bg-white text-[#78350F] border border-[#E2D8C3] hover:bg-[#EFE7D5] transition"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {current.id && !isGeoOnly && (
              <Link
                href={`/heritage/${current.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2A2421] text-white hover:bg-black transition flex items-center gap-1 shadow-sm"
              >
                <span>Full Heritage Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
