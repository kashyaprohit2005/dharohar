"use client";

import { X, MapPin, Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { GeoState, GeoDistrict } from "../map/mapTypes";

interface StateDetailPanelProps {
  state: GeoState | null;
  districts: GeoDistrict[];
  onSelectDistrict: (district: GeoDistrict) => void;
  onClose: () => void;
  onJumpToHaryana: () => void;
}

// Cultural Themes mapped by Zone / State
const STATE_CULTURAL_THEMES: Record<string, string[]> = {
  "IN-RJ": ["Jaipur Blue Pottery", "Bagru & Sanganeri Block Prints", "Mehrangarh Fort Architecture", "Langa-Manganiyar Folk Ballads", "Dal Baati Churma Cuisine", "Teej & Gangaur Festivals"],
  "IN-GJ": ["Patan Patola Double Ikat", "Kutch Rogan Art", "Lothal Harappan Archaeology", "Living Garba & Dandiya", "Dhokla & Kathiyawadi Cuisine"],
  "IN-PB": ["Phulkari Geometric Embroidery", "Golden Temple Sanctum", "Bhangra & Giddha Folk Rhythms", "Makki Di Roti & Sarson Saag", "Virasat Mela"],
  "IN-KL": ["Kathakali Classical Dance-Drama", "Aranmula Metal Mirrors", "Kalaripayattu Martial Art", "Sadya & Malabar Culinary Heritage", "Theyyam Sacred Rituals"],
  "IN-TN": ["Brihadisvara Dravidian Architecture", "Kanchipuram Pure Mulberry Silk", "Bharatanatyam Classical Dance", "Tanjore Gold Leaf Painting", "Chettinad Cuisine"],
  "IN-WB": ["Bishnupur Terracotta Temples", "Baluchari & Jamdani Weaving", "Baul Mystic Folk Tradition", "Durga Puja Intangible Heritage", "Sandesh & Bengali Sweets"],
  "IN-AS": ["Muga Golden Silk Guilds", "Majuli Mask-Making & Neo-Vaishnavism", "Bihu Traditional Dance", "Assam Tea Lineage & Cuisine"],
  "IN-UP": ["Banarasi Zari Brocade", "Lucknow Chikankari Needlecraft", "Kashi Ghats & Awadhi Architecture", "Kathak Classical Dance", "Mughlai & Awadhi Culinary Heritage"],
  "IN-KA": ["Hampi UNESCO Citadels", "Mysore Silk & Sandalwood Craft", "Bidri Silver Inlay", "Yakshagana Folk Theatre", "Udupi Culinary Heritage"],
  "IN-MH": ["Ajanta-Ellora Rock Cut Architecture", "Paithani Silk Sarees", "Warli Indigenous Painting", "Lavani Folk Dance", "Modak & Maharashtrian Culinary Art"],
  "IN-MP": ["Khajuraho Nagara Temple Sculptures", "Chanderi & Maheshwari Weaving", "Bhimbetka Cave Murals", "Gond Indigenous Art", "Malwa Cuisine"],
};

export default function StateDetailPanel({
  state,
  districts,
  onSelectDistrict,
  onClose,
  onJumpToHaryana,
}: StateDetailPanelProps) {
  if (!state) return null;

  const isHaryana = state.code === "IN-HR";
  const themes = STATE_CULTURAL_THEMES[state.code] || [
    "Traditional Handicrafts & Textiles",
    "Historic Citadels & Architecture",
    "Regional Performing Arts & Music",
    "Indigenous Culinary Traditions",
    "Living Folklore & Festivals",
  ];

  return (
    <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[440px] md:w-[480px] bg-[#faf7f2]/98 backdrop-blur-2xl border-l border-[#e7dfd5] z-[500] shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right font-sans text-[#1c1917]">
      {/* Header */}
      <div className="p-5 border-b border-[#e7dfd5] flex items-start justify-between gap-4 shrink-0 bg-white/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              State Dossier
            </span>
            <span className="text-xs text-stone-500 font-medium">Zone: {state.zone}</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">{state.name}</h2>
          {state.tagline && (
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed italic font-serif">
              &ldquo;{state.tagline}&rdquo;
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors border border-[#e7dfd5] shrink-0 cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
        {isHaryana ? (
          <div>
            {/* Haryana Pilot Banner */}
            <div className="p-4 rounded-2xl bg-white border border-amber-300 mb-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Active Living Prototype (23 Recognized Districts)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Haryana features <strong className="text-stone-900">23 recognized districts</strong>, including <strong className="text-sky-700">Hansi</strong> (constituted 22 Dec 2025). Select any district below to explore verified living crafts, food traditions, and monuments down to rural tehsils.
              </p>
            </div>

            {/* Districts Grid */}
            <div>
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Recognized Districts ({districts.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {districts.map((d) => {
                  const isHansi = d.slug === "hr-hansi";
                  const isPanipat = d.slug === "hr-panipat";
                  return (
                    <button
                      key={d.slug}
                      onClick={() => onSelectDistrict(d)}
                      className={`p-3 rounded-xl text-left transition-all border group cursor-pointer shadow-sm ${
                        isHansi || isPanipat
                          ? "bg-white border-sky-400 hover:border-sky-600 hover:bg-sky-50/50"
                          : "bg-white border-[#e7dfd5] hover:border-sky-400 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 group-hover:text-sky-700 transition-colors">
                          {d.name}
                        </span>
                        {isHansi && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                            23rd Dist.
                          </span>
                        )}
                        {isPanipat && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            Textiles
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                        HQ: {d.headquarters}
                      </div>
                      {d.odop_product && (
                        <div className="text-[10px] text-amber-800 mt-1 truncate font-medium">
                          ODOP: {d.odop_product}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* NON-HARYANA STATE DOSSIER */
          <div className="space-y-5 animate-in fade-in">
            {/* Cultural Themes Showcase */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Primary Cultural Themes & Living Heritage</span>
              </h3>

              <div className="space-y-1.5">
                {themes.map((theme, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-[#e7dfd5] flex items-center gap-2.5 text-xs text-stone-800 font-medium shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                    <span>{theme}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prototype Scope Fact Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#e7dfd5] space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Demonstration Scope</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Dharohar models complete geographic boundaries and high-level cultural themes for all <strong className="text-stone-900">36 States & Union Territories</strong> of India. Deep administrative subdivision, rural tehsils, and craft settlements are currently demonstrated in <strong className="text-sky-700">Haryana (23 districts)</strong>.
              </p>
            </div>

            {/* CTA to jump to Haryana */}
            <button
              onClick={onJumpToHaryana}
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Explore Active Haryana Demonstration (23 Districts)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
