"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  X, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  Layers, 
  Building2, 
  ArrowRight,
  QrCode,
  CheckCircle2,
  Share2,
  Check,
  Compass,
  FileText
} from "lucide-react";
import Link from "next/link";
import { GeoDistrict, DistrictDossier, CulturalItem } from "../map/mapTypes";
import { geoAPI } from "@/lib/api";

interface DistrictDetailPanelProps {
  district: GeoDistrict | null;
  onSelectItem: (item: CulturalItem) => void;
  onSelectLocality?: (localitySlug: string, center: [number, number]) => void;
  onSelectGeoLocation?: (locationSlug: string, lat: number, lon: number) => void;
  onBackToState: () => void;
  onClose: () => void;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  CRAFTS: { label: "Crafts", icon: "🏺" },
  TEXTILES: { label: "Textiles", icon: "🧵" },
  FOOD: { label: "Culinary", icon: "🍲" },
  MONUMENTS: { label: "Monuments", icon: "🏰" },
  ARCHAEOLOGY: { label: "Archaeology", icon: "⛏️" },
  ARCHITECTURE: { label: "Architecture", icon: "🏛️" },
  TEMPLES: { label: "Temples", icon: "🛕" },
  RELIGIOUS_HERITAGE: { label: "Sacred Heritage", icon: "✨" },
  HISTORICAL_PLACES: { label: "Historic Sites", icon: "🚩" },
  LOCAL_PRODUCTS: { label: "Local Products", icon: "📦" },
  FESTIVALS: { label: "Festivals", icon: "🎪" },
  DANCE: { label: "Folk Dance", icon: "💃" },
  MUSIC: { label: "Folk Music", icon: "🎵" },
  TRADITIONS: { label: "Folklore", icon: "📜" },
  NATURE_RELATED_HERITAGE: { label: "Nature & Ecology", icon: "🌿" },
  TRADITIONAL_KNOWLEDGE: { label: "Traditional Knowledge", icon: "💧" },
  RURAL_PRACTICES: { label: "Rural Life", icon: "🌾" },
};

export default function DistrictDetailPanel({
  district,
  onSelectItem,
  onSelectLocality,
  onSelectGeoLocation,
  onBackToState,
  onClose,
}: DistrictDetailPanelProps) {
  const [dossier, setDossier] = useState<DistrictDossier | null>(null);
  const [items, setItems] = useState<CulturalItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeSubTab, setActiveSubTab] = useState<"CULTURE" | "HIERARCHY">("CULTURE");
  const [selectedLocalitySlug, setSelectedLocalitySlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!district) return;

    setIsLoading(true);
    setSelectedLocalitySlug(null);
    setActiveCategory("ALL");

    // Fetch deep district dossier and cultural items concurrently
    Promise.all([
      geoAPI.districtDetail(district.slug),
      geoAPI.districtItems(district.slug),
    ])
      .then(([dossierRes, itemsRes]) => {
        setDossier(dossierRes.data);
        setItems(itemsRes.data);
      })
      .catch((err) => {
        console.error("Error loading district details:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [district]);

  const handleShare = async () => {
    if (!district) return;
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/?district=${district.slug}`
      : `/district/${district.slug}`;
    const shareData = {
      title: `${district.name} Cultural Dossier — Dharohar Atlas`,
      text: `Explore verified cultural records, ODOP heritage, and living traditions in ${district.name}, Haryana on Dharohar.`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fall back to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Dynamically derive category chips ONLY from categories that actually have items in this district
  const presentCategories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category.toUpperCase()));
    const chips = [{ id: "ALL", label: `All Records (${items.length})`, icon: "🌐" }];
    cats.forEach((cat) => {
      const meta = CATEGORY_META[cat] || { label: cat.replace(/_/g, " "), icon: "🏷️" };
      const count = items.filter((i) => i.category.toUpperCase() === cat).length;
      chips.push({ id: cat, label: `${meta.label} (${count})`, icon: meta.icon });
    });
    return chips;
  }, [items]);

  if (!district) return null;

  const isHansi = district.slug === "hr-hansi";
  const isPanipat = district.slug === "hr-panipat";

  // Filter items by category and locality
  const filteredItems = items.filter((it) => {
    if (activeCategory !== "ALL" && it.category.toUpperCase() !== activeCategory) {
      return false;
    }
    if (selectedLocalitySlug) {
      const matchingLocations = dossier?.locations.filter(
        (loc) => (loc as any).locality_slug === selectedLocalitySlug || loc.slug.includes(selectedLocalitySlug.split("-")[0])
      );
      const matchingLocationSlugs = matchingLocations?.map((l) => l.slug) || [];
      if (it.location_slug && !matchingLocationSlugs.includes(it.location_slug)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[460px] md:w-[520px] bg-[#FAF6EE]/98 backdrop-blur-2xl border-l border-[#e7dfd5] z-[500] shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right font-sans text-[#1c1917]">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#e7dfd5] flex items-start justify-between gap-3 shrink-0 bg-white/70">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToState}
            className="p-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 hover:text-sky-700 transition-colors border border-[#e7dfd5] cursor-pointer shadow-sm"
            title="Back to Haryana State Overview"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                District Dossier
              </span>
              <span className="text-xs text-stone-500 font-medium">HQ: {district.headquarters}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>{district.name}</span>
              {isHansi && (
                <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  23rd District (2025)
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share District Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-[#e7dfd5] transition-colors cursor-pointer shadow-sm"
            title="Share this district dossier"
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

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-[#e7dfd5] shrink-0 cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cultural Coverage Indicator */}
      <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/70 flex items-center justify-between text-[11px] text-amber-950 font-medium">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{items.length} verified cultural records</span>
        </span>
        <span className="text-stone-400">•</span>
        <span>{dossier?.localities.length || 0} administrative subdivisions</span>
        <span className="text-stone-400">•</span>
        <span>{dossier?.locations.length || 0} mapped sites</span>
      </div>

      {/* Sub-Tabs: Cultural Universe vs Administrative Hierarchy */}
      <div className="px-5 pt-3 pb-1 border-b border-[#e7dfd5] flex items-center gap-4 text-xs font-semibold shrink-0 bg-white/50">
        <button
          onClick={() => {
            setActiveSubTab("CULTURE");
            setSelectedLocalitySlug(null);
          }}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "CULTURE"
              ? "border-sky-600 text-sky-700 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cultural Universe ({items.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab("HIERARCHY")}
          className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === "HIERARCHY"
              ? "border-sky-600 text-sky-700 font-bold"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Administrative Hierarchy ({dossier?.localities.length || 0})</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-stone-500 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
            <span className="font-serif">Loading authoritative dossier for {district.name}...</span>
          </div>
        ) : activeSubTab === "HIERARCHY" ? (
          /* ADMINISTRATIVE HIERARCHY DRILL-DOWN */
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-white border border-[#e7dfd5] text-xs text-stone-700 space-y-1.5 shadow-sm">
              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                <span>Subdivisions, Tehsils & Rural Villages</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Dharohar models the complete geographical hierarchy down to the smallest village or craft settlement. Select any subdivision to review its localized cultural documentation.
              </p>
            </div>

            {/* Localities Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Recognized Localities ({dossier?.localities.length || 0})
                </h4>
                {selectedLocalitySlug && (
                  <button
                    onClick={() => setSelectedLocalitySlug(null)}
                    className="text-[11px] text-sky-700 hover:underline cursor-pointer font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dossier?.localities.map((loc) => {
                  const isSelected = selectedLocalitySlug === loc.slug;
                  const matchingLocItems = items.filter(
                    (it) => it.location_slug && it.location_slug.includes(loc.slug.split("-")[0])
                  );

                  return (
                    <button
                      key={loc.slug}
                      onClick={() => {
                        setSelectedLocalitySlug(isSelected ? null : loc.slug);
                        if (onSelectLocality) {
                          onSelectLocality(loc.slug, loc.center);
                        }
                      }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer shadow-sm ${
                        isSelected
                          ? "bg-sky-50 border-sky-600 text-sky-900 ring-1 ring-sky-600"
                          : "bg-white border-[#e7dfd5] hover:border-sky-400 hover:bg-stone-50 text-stone-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{loc.name}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                          {loc.type}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                        {matchingLocItems.length > 0 ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{matchingLocItems.length} cultural record(s)</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 italic">
                            Documentation in progress
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Physical Heritage Sites (GeoPoints) */}
            {dossier?.locations && dossier.locations.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  Mapped Cultural Sites & Clusters ({dossier.locations.length})
                </h4>

                <div className="space-y-2">
                  {dossier.locations.map((loc) => (
                    <div
                      key={loc.slug}
                      className="p-3 rounded-xl bg-white border border-[#e7dfd5] flex items-start justify-between gap-3 shadow-sm hover:border-sky-300 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900">{loc.name}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                          <span>{loc.address || `${loc.lat.toFixed(4)}°N, ${loc.lon.toFixed(4)}°E`}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0 uppercase">
                        {loc.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* CULTURAL UNIVERSE VIEW */
          <>
            {/* Cultural Intro */}
            <div className="p-4 rounded-2xl bg-white border border-[#e7dfd5] leading-relaxed font-serif text-xs text-stone-700 shadow-sm">
              {district.cultural_intro || dossier?.cultural_intro}
            </div>

            {/* Honest ODOP Badge & Fact Box */}
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>One District One Product (ODOP)</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    district.odop_status === "VERIFIED" || dossier?.odop?.status === "VERIFIED"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {district.odop_status === "VERIFIED" || dossier?.odop?.status === "VERIFIED"
                    ? "✓ MoFPI Verified"
                    : "⏳ Pending Formal Gazette"}
                </span>
              </div>

              {(district.odop_product || dossier?.odop?.product) ? (
                <div>
                  <div className="text-sm font-semibold text-stone-900">
                    {district.odop_product || dossier?.odop?.product}
                  </div>
                  {dossier?.odop?.category && (
                    <div className="text-xs text-stone-600 mt-0.5">
                      Category: {dossier.odop.category}
                    </div>
                  )}
                  {dossier?.odop?.source && (
                    <div className="text-[10px] text-stone-500 mt-1 italic">
                      Source: {dossier.odop.source}
                    </div>
                  )}
                  {isPanipat && (
                    <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-700 leading-relaxed bg-amber-50/60 p-2.5 rounded-xl border border-amber-200">
                      <strong className="text-amber-900">Note on Living Strengths:</strong> Panipat is internationally acclaimed as the &ldquo;City of Weavers&rdquo; for Handloom Punja Durries. Its formal MoFPI food processing ODOP designation is carrot-based agro-products.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-stone-600 leading-relaxed font-sans">
                  Official ODOP notification for Hansi is pending following district constitution on 22 December 2025. Historical cultural anchors include Asigarh Fort, 1304 AD Barsi Gate (ASI protected), and Khoya sweet traditions.
                </div>
              )}
            </div>

            {/* Official Tourism / Portal Link */}
            {(district.tourism_url || dossier?.tourism_url) && (
              <a
                href={district.tourism_url || dossier?.tourism_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] text-xs text-stone-700 hover:text-sky-700 transition-all shadow-sm group"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                  <span>Official Portal ({district.name} Administration)</span>
                </span>
                <span className="text-[11px] text-stone-400 group-hover:text-sky-600 font-medium">Visit ↗</span>
              </a>
            )}

            {/* Dynamic, Data-Driven Category Chips Bar (ONLY categories with records) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Active Cultural Categories
                </h3>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {presentCategories.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setActiveCategory(chip.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer ${
                      activeCategory === chip.id
                        ? "bg-sky-600 text-white font-bold shadow-sm"
                        : "bg-white text-stone-700 border border-[#e7dfd5] hover:bg-stone-100"
                    }`}
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cultural Items Grid / Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Verified & Sourced Traditions ({filteredItems.length})</span>
                </h3>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-white rounded-2xl border border-[#e7dfd5] shadow-sm">
                  Documentation in progress for selected filter. More candidate traditions are being audited from district gazetteers.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredItems.map((item) => {
                    const isOfficial = item.verification_tier === "OFFICIAL_VERIFIED";
                    const isSourceAvailable = item.verification_tier === "SOURCE_AVAILABLE";

                    return (
                      <button
                        key={item.slug}
                        onClick={() => onSelectItem(item)}
                        className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-stone-50/80 border border-[#e7dfd5] hover:border-sky-500 transition-all shadow-sm group flex gap-3.5 items-start cursor-pointer"
                      >
                        {item.image_url ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-xl">
                            🏛️
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700 uppercase">
                              {item.category.replace(/_/g, " ")}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.2 rounded-full ${
                                isOfficial
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isSourceAvailable
                                  ? "bg-sky-100 text-sky-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isOfficial ? "✓ Official Verified" : isSourceAvailable ? "★ Source Available" : "⏳ Candidate"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 group-hover:text-sky-700 transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">
                            {item.short_description}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-stone-400 font-medium">
                              {item.location_name || district.name}
                            </span>
                            <span className="text-[10px] font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                              Read More... →
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Provenance & Verification Shortcut */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#e7dfd5] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-sky-600" />
                <div className="text-xs">
                  <div className="font-semibold text-stone-900">Public Provenance Ledger</div>
                  <div className="text-[11px] text-stone-500">Verify artisan batches & SHA-256 tokens</div>
                </div>
              </div>
              <Link
                href="/verify"
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Open Verifier →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
