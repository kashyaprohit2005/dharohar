"use client";

import React, { useEffect, useState } from "react";
import { StateCulturalProfile, ODOPDistrictItem } from "../data/odopCulturalData";
import { 
  X, 
  Sparkles, 
  MapPin, 
  Compass, 
  CheckCircle2, 
  ExternalLink, 
  Utensils, 
  BookOpen, 
  Music, 
  Scissors, 
  Shirt, 
  Landmark, 
  Building2,
  Share2
} from "lucide-react";

export type CulturalTab = 
  | "odop" 
  | "food" 
  | "culture" 
  | "songs" 
  | "crafts" 
  | "attire" 
  | "monuments";

interface StateCulturalModalProps {
  profile: StateCulturalProfile | null;
  isOpen: boolean;
  onClose: () => void;
  activeTab?: CulturalTab;
  onTabChange?: (tab: CulturalTab) => void;
}

const TABS: { id: CulturalTab; label: string; icon: React.ReactNode }[] = [
  { id: "odop", label: "ODOP Catalog", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "food", label: "Food", icon: <Utensils className="w-3.5 h-3.5" /> },
  { id: "culture", label: "Culture & Folklore", icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: "songs", label: "Songs & Dances", icon: <Music className="w-3.5 h-3.5" /> },
  { id: "crafts", label: "Crafts", icon: <Scissors className="w-3.5 h-3.5" /> },
  { id: "attire", label: "Attire", icon: <Shirt className="w-3.5 h-3.5" /> },
  { id: "monuments", label: "Monuments & Shrines", icon: <Landmark className="w-3.5 h-3.5" /> },
];

export default function StateCulturalModal({
  profile,
  isOpen,
  onClose,
  activeTab: controlledTab,
  onTabChange,
}: StateCulturalModalProps) {
  const [internalTab, setInternalTab] = useState<CulturalTab>("odop");
  const [odopFilter, setOdopFilter] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  const currentTab = controlledTab || internalTab;

  const handleTabSelect = (tab: CulturalTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !profile) return null;

  const filteredOdop = profile.odopProducts.filter((item) => {
    if (odopFilter === "all") return true;
    if (odopFilter === "gi") return item.giTagged;
    return item.category.toLowerCase() === odopFilter.toLowerCase();
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside 
        className="relative w-full md:w-[540px] lg:w-[620px] max-w-full h-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-label={`${profile.stateName} Cultural Heritage Profile`}
      >
        {/* Header with State Hero Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-950 shrink-0">
          <img 
            src={profile.heroImage} 
            alt={profile.stateName}
            className="w-full h-full object-cover brightness-75 contrast-110 transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />

          {/* Top action controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                India State Profile
              </span>
              <span className="text-xs text-stone-300 drop-shadow-md flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-amber-400" />
                {profile.coordinates[0].toFixed(2)}° N, {profile.coordinates[1].toFixed(2)}° E
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                title="Share link"
                className="w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 flex items-center justify-center border border-stone-700 backdrop-blur-md transition"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                title="Close drawer and return to full India view (Esc)"
                className="w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 flex items-center justify-center border border-stone-700 backdrop-blur-md transition group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* State Title Block */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-serif uppercase tracking-widest text-amber-400/90 font-semibold mb-0.5">
                Living Cultural Atlas
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100 drop-shadow-md">
                {profile.stateName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 bg-stone-900/70 px-2.5 py-1 rounded-lg border border-stone-800 backdrop-blur-sm transition"
            >
              <Compass className="w-3 h-3" />
              <span>Full Atlas</span>
            </button>
          </div>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="border-b border-stone-800 bg-stone-950/80 shrink-0 px-3 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {TABS.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-stone-950 shadow-sm font-bold scale-[1.02]"
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-200 scrollbar-thin scrollbar-thumb-stone-800">
          {/* TAB 1: ODOP Catalog */}
          {currentTab === "odop" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    One District One Product Catalog
                  </h3>
                  <p className="text-xs text-stone-400">
                    Official Invest India / DPIIT flagship district specialties
                  </p>
                </div>

                {/* Filter pills */}
                <div className="flex items-center gap-1 text-[11px] overflow-x-auto">
                  {["all", "gi", "Handicrafts", "Handlooms", "Agriculture", "Food Processing"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setOdopFilter(f)}
                      className={`px-2 py-0.5 rounded-lg border transition ${
                        odopFilter === f
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                          : "bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-stone-200"
                      }`}
                    >
                      {f === "all" ? "All" : f === "gi" ? "GI Only" : f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOdop.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-sm">
                  No ODOP products match the selected filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3.5">
                  {filteredOdop.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 hover:border-amber-500/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                            <MapPin className="w-3 h-3" />
                            {item.district} District
                          </span>
                          <h4 className="font-serif text-base font-bold text-stone-100 group-hover:text-amber-200 transition">
                            {item.productName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.giTagged && (
                            <span 
                              title="Geographical Indication (GI) Certified Product"
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                            >
                              <span>★</span> GI Tag
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.category === "Handlooms"
                              ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                              : item.category === "Handicrafts"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                              : item.category === "Agriculture"
                              ? "bg-lime-500/10 text-lime-300 border border-lime-500/30"
                              : "bg-rose-500/10 text-rose-300 border border-rose-500/30"
                          }`}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Food */}
          {currentTab === "food" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  Gastronomy & Culinary Heritage
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Indigenous ingredients, GI culinary dishes, and heritage preparation
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-amber-200/90 text-xs sm:text-sm leading-relaxed">
                {profile.food.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Signature Culinary Dishes & Spices
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.food.signatureDishes.map((dish, i) => (
                    <div 
                      key={i}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200 font-medium hover:border-amber-500/30 transition"
                    >
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-sm">
                        🍲
                      </span>
                      <span>{dish}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Culture & Folklore */}
          {currentTab === "culture" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Oral Traditions, Customs & Legends
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Living mythologies, festive legends, and regional customs
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 text-stone-300 text-xs sm:text-sm leading-relaxed">
                {profile.cultureAndFolklore.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Documented Oral Traditions & Festivities
                </h4>
                <div className="space-y-2.5">
                  {profile.cultureAndFolklore.traditions.map((t, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 flex items-start gap-3 text-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✦
                      </span>
                      <span className="text-stone-200 font-medium leading-relaxed">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Songs & Dances */}
          {currentTab === "songs" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" />
                  Performing Arts & Musical Traditions
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Classical repertoires, tribal percussion, and folk bardic balladeers
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-indigo-200/90 text-xs sm:text-sm leading-relaxed">
                {profile.songsAndDances.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Key Classical & Folk Performing Arts
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.songsAndDances.performingArts.map((art, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200 font-medium"
                    >
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 text-sm">
                        🎭
                      </span>
                      <span>{art}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Crafts */}
          {currentTab === "crafts" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Crafts, Handlooms & Metallurgy
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Heritage handloom weaves, metal casting, and generational master guilds
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 text-stone-300 text-xs sm:text-sm leading-relaxed">
                {profile.craftsAndHandlooms.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Signature Handicrafts & Weaving Traditions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.craftsAndHandlooms.signatureCrafts.map((craft, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200 font-medium hover:border-amber-500/30 transition"
                    >
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-sm">
                        🏺
                      </span>
                      <span>{craft}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Attire */}
          {currentTab === "attire" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  Traditional Attire & Drapes
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Regional garments, weaving techniques, draping styles, and embroidery
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/30 text-rose-200/90 text-xs sm:text-sm leading-relaxed">
                {profile.traditionalClothes.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Iconic Garments & Textiles
                </h4>
                <div className="space-y-2.5">
                  {profile.traditionalClothes.attire.map((a, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center gap-2.5 text-xs text-stone-200 font-medium"
                    >
                      <span className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 text-sm">
                        👘
                      </span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Monuments & Shrines */}
          {currentTab === "monuments" && (
            <div className="space-y-6">
              {/* Historic Monuments Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Historic Monuments & UNESCO Sites
                  </h4>
                </div>
                <p className="text-xs text-stone-400">
                  {profile.historicMonuments.description}
                </p>

                <div className="space-y-2">
                  {profile.historicMonuments.monuments.map((m, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs text-stone-200 hover:border-amber-500/30 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400">🏛️</span>
                        <span className="font-semibold">{m}</span>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m + ', ' + profile.stateName)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-400 hover:text-amber-300 text-[11px] flex items-center gap-1"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spiritual Places Section */}
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-base font-bold text-stone-100">
                    Spiritual Places & Sacred Shrines
                  </h4>
                </div>
                <p className="text-xs text-stone-400">
                  {profile.spiritualPlaces.description}
                </p>

                <div className="space-y-2">
                  {profile.spiritualPlaces.sites.map((s, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs text-stone-200 hover:border-amber-500/30 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400">🛕</span>
                        <span className="font-semibold">{s}</span>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s + ', ' + profile.stateName)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-400 hover:text-amber-300 text-[11px] flex items-center gap-1"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between shrink-0 text-xs">
          <div className="text-stone-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px]">Esc</kbd> or tap outside to close
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Back to India Atlas</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
