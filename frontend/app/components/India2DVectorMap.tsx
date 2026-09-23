"use client";

import React, { useState, useEffect } from "react";
import { INDIA_SVG_PATHS, StateSvgPath } from "../data/indiaSvgData";
import { INDIA_STATES_DATA } from "../data/indiaGeoData";
import { geoAPI } from "@/lib/api";
import { 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  RotateCcw, 
  Compass, 
  ShieldCheck, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";

export interface India2DVectorMapProps {
  height?: string;
  selectedState?: string;
  onSelectState?: (stateName: string) => void;
  onSelectHeritage?: (id: number) => void;
  onOpenDossier?: (item: any) => void;
}

export default function India2DVectorMap({
  height = "620px",
  selectedState = "ALL",
  onSelectState,
  onSelectHeritage,
  onOpenDossier,
}: India2DVectorMapProps) {
  const [hoveredState, setHoveredState] = useState<StateSvgPath | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [haryanaView, setHaryanaView] = useState(false);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [districtDetails, setDistrictDetails] = useState<any | null>(null);
  const [loadingDistrict, setLoadingDistrict] = useState(false);

  // Sync with selectedState prop
  useEffect(() => {
    if (selectedState && selectedState.toLowerCase() === "haryana") {
      setHaryanaView(true);
      loadHaryanaDistricts();
    } else if (selectedState === "ALL") {
      setHaryanaView(false);
      setSelectedDistrict(null);
      setDistrictDetails(null);
    }
  }, [selectedState]);

  const loadHaryanaDistricts = () => {
    geoAPI
      .districts("HR")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDistricts(res.data);
        }
      })
      .catch(() => {
        // Fallback handled gracefully
      });
  };

  const handleStateClick = (stateName: string) => {
    if (stateName.toLowerCase() === "haryana") {
      setHaryanaView(true);
      loadHaryanaDistricts();
      if (onSelectState) onSelectState("Haryana");
    } else {
      if (onSelectState) onSelectState(stateName);
    }
  };

  const handleDistrictClick = (d: any) => {
    setSelectedDistrict(d);
    setLoadingDistrict(true);
    geoAPI
      .district(d.slug)
      .then((res) => {
        setDistrictDetails(res.data);
      })
      .catch(() => {
        setDistrictDetails(d);
      })
      .finally(() => setLoadingDistrict(false));
  };

  const handleResetToIndia = () => {
    setHaryanaView(false);
    setSelectedDistrict(null);
    setDistrictDetails(null);
    if (onSelectState) onSelectState("ALL");
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      style={{ height }}
      className="relative w-full rounded-3xl overflow-hidden bg-[#FAF6EE] border border-[#E2D8C3] shadow-xl flex flex-col font-sans select-none"
    >
      {/* Subtle Sandstone & Parchment Radial Warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(247,241,231,0.9),rgba(243,235,221,0.6))] pointer-events-none" />

      {/* Top Breadcrumb & Status Navigation */}
      <div className="relative z-10 px-5 py-3 border-b border-[#E8DFC8] bg-[#F7F1E7]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#574E45]">
          <button
            onClick={handleResetToIndia}
            className={`hover:text-[#B45309] transition flex items-center gap-1 ${
              !haryanaView ? "text-[#1C1917] font-bold" : "text-[#78350F]"
            }`}
          >
            <span>India</span>
          </button>

          {haryanaView && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <button
                onClick={() => {
                  setSelectedDistrict(null);
                  setDistrictDetails(null);
                }}
                className={`hover:text-[#B45309] transition ${
                  !selectedDistrict ? "text-[#1C1917] font-bold" : "text-[#78350F]"
                }`}
              >
                <span>Haryana (23 Districts)</span>
              </button>
            </>
          )}

          {selectedDistrict && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[#B45309] font-bold">
                {selectedDistrict.name} District
              </span>
            </>
          )}
        </div>

        {haryanaView && (
          <button
            onClick={handleResetToIndia}
            className="text-[11px] font-bold text-[#78350F] hover:text-[#B45309] flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E2D8C3] hover:bg-[#EFE7D5] transition shadow-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to India Overview</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex">
        
        {/* VIEW A: ALL-INDIA APPROVED VECTOR SILHOUETTE (Strictly Bounded) */}
        {!haryanaView ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <svg
              viewBox="0 0 700 780"
              className="w-full h-full max-h-[580px] drop-shadow-md cursor-grab active:cursor-grabbing"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredState(null)}
            >
              {/* Outer Decorative Compass Compass Ring */}
              <circle
                cx="350"
                cy="390"
                r="360"
                fill="none"
                stroke="#D97706"
                strokeWidth="1"
                strokeDasharray="4 8"
                opacity="0.25"
              />
              <circle
                cx="350"
                cy="390"
                r="380"
                fill="none"
                stroke="#B45309"
                strokeWidth="0.75"
                opacity="0.15"
              />

              {/* State Polygons (Survey of India Boundaries) */}
              {INDIA_SVG_PATHS.map((state) => {
                const isHovered = hoveredState?.name === state.name;
                const isHaryana = state.name.toLowerCase() === "haryana";

                return (
                  <g key={state.name} className="transition-all duration-200">
                    <path
                      d={state.d}
                      fill={isHovered ? "#F59E0B" : state.color}
                      stroke={isHovered ? "#FFFFFF" : "#FAF6EE"}
                      strokeWidth={isHovered ? "2.5" : "1.2"}
                      opacity={isHovered ? 1 : isHaryana ? 0.95 : 0.82}
                      className="cursor-pointer transition-all duration-200 hover:opacity-100"
                      onMouseEnter={() => setHoveredState(state)}
                      onClick={() => handleStateClick(state.name)}
                    />

                    {/* Haryana Special Pulse Indicator */}
                    {isHaryana && (
                      <circle
                        cx={state.centroid[0]}
                        cy={state.centroid[1]}
                        r="6"
                        fill="#F59E0B"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="animate-pulse pointer-events-none"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip (Parchment Card) */}
            {hoveredState && (
              <div
                style={{
                  left: Math.min(mousePos.x + 15, 480),
                  top: Math.max(mousePos.y - 45, 10),
                }}
                className="absolute z-30 pointer-events-none p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5C7AA] shadow-xl text-[#2A2421] max-w-xs animate-fadeIn"
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="font-serif font-bold text-sm text-[#1C1917]">
                    {hoveredState.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    {hoveredState.name.toLowerCase() === "haryana" ? "Deep Atlas" : "Explore"}
                  </span>
                </div>
                <p className="text-[11px] text-[#78350F] leading-snug">
                  {hoveredState.name.toLowerCase() === "haryana"
                    ? "Tap to explore 23 Districts, Samalkha, Hathwala & Living Traditions."
                    : "Tap to view ODOP catalog, crafts, folklore & living traditions."}
                </p>
              </div>
            )}

            {/* Bottom-Left Context Indicator */}
            <div className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E2D8C3] shadow-sm text-xs text-[#574E45] space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Survey of India Bounded Vector Map</span>
              </div>
              <div className="text-[11px] text-[#78350F]">
                Tap Haryana for Village & District Explorer • Tap any State for Cultural Drawer
              </div>
            </div>
          </div>
        ) : (
          /* VIEW B: HARYANA DEEP DEMONSTRATION & DISTRICT DISCOVERY */
          <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left: District Grid & Selector */}
            <div className="w-full lg:w-7/12 h-full overflow-y-auto p-4 sm:p-5 border-r border-[#E8DFC8] space-y-4 scrollbar-thin scrollbar-thumb-[#DFD5C0]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B45309] font-bold">
                  Living Cultural Atlas of Haryana
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                  Select a District to Explore
                </h3>
                <p className="text-xs text-[#574E45] leading-relaxed">
                  23 administrative districts, historic divisions (including Hansi), verified rural weaving clusters & authentic village registries.
                </p>
              </div>

              {/* District Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {districts.map((d) => {
                  const isSelected = selectedDistrict?.slug === d.slug;
                  return (
                    <button
                      key={d.slug}
                      onClick={() => handleDistrictClick(d)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-amber-600 text-white border-amber-600 shadow-md font-bold scale-[1.02]"
                          : "bg-white border-[#E2D8C3] text-[#2A2421] hover:border-[#B45309] hover:bg-[#FDFBF7]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={isSelected ? "text-amber-100 uppercase font-mono" : "text-[#B45309] uppercase font-mono font-bold"}>
                          {d.slug}
                        </span>
                        {d.cultural_records_count > 0 && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isSelected ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
                          }`}>
                            {d.cultural_records_count} Traditions
                          </span>
                        )}
                      </div>

                      <div className="font-serif font-bold text-sm truncate">
                        {d.name}
                      </div>

                      <div className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-amber-100" : "text-[#78350F]"}`}>
                        {d.tagline || `${d.villages_count || 2} Verified Settlements`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected District / Locality Detail Pane */}
            <div className="w-full lg:w-5/12 h-full overflow-y-auto p-4 sm:p-5 bg-[#F9F5EC] space-y-5 scrollbar-thin scrollbar-thumb-[#DFD5C0]">
              {selectedDistrict ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* District Header */}
                  <div className="space-y-1 pb-3 border-b border-[#E8DFC8]">
                    <span className="text-[10px] font-mono uppercase text-[#B45309] font-bold">
                      District Profile • Haryana
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                      {selectedDistrict.name}
                    </h3>
                    <p className="text-xs text-[#574E45] italic leading-relaxed">
                      "{selectedDistrict.tagline || selectedDistrict.description}"
                    </p>
                  </div>

                  {/* Cultural Records in District */}
                  {districtDetails?.cultural_records?.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                        <span>Verified Cultural Traditions</span>
                        <span className="text-[11px] text-[#B45309]">
                          {districtDetails.cultural_records.length} Records
                        </span>
                      </div>

                      <div className="space-y-2">
                        {districtDetails.cultural_records.map((h: any) => (
                          <div
                            key={h.id}
                            onClick={() => onOpenDossier && onOpenDossier(h)}
                            className="p-3 rounded-2xl bg-white border border-[#E2D8C3] hover:border-[#B45309] transition cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between group"
                          >
                            <div className="space-y-0.5 pr-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#B45309] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                {h.category}
                              </span>
                              <h5 className="font-serif font-bold text-sm text-[#1C1917] group-hover:text-[#B45309]">
                                {h.name}
                              </h5>
                              <p className="text-[11px] text-[#574E45] line-clamp-1">
                                {h.short_description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#B45309] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subdivisions & Tehsils */}
                  {districtDetails?.subdivisions?.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-[#1C1917] block text-[11px]">
                        Administrative Subdivisions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {districtDetails.subdivisions.map((sub: any) => (
                          <span
                            key={sub.slug}
                            className="px-2.5 py-1 rounded-xl bg-white border border-[#E2D8C3] text-[11px] text-[#78350F] font-semibold"
                          >
                            🏛️ {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Villages Registry (Honest Cultural vs Geographic Separation) */}
                  {districtDetails?.villages?.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1C1917] text-[11px]">
                          Villages & Settlements Registry:
                        </span>
                        <span className="text-[10px] text-[#78350F]">
                          {districtDetails.villages.length} Authenticated
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {districtDetails.villages.map((v: any) => (
                          <div
                            key={v.slug}
                            onClick={() => onOpenDossier && onOpenDossier({
                              name: v.name,
                              slug: v.slug,
                              district: selectedDistrict.name,
                              state: "Haryana",
                              isGeographicOnly: !v.has_cultural_record,
                              statusNotice: v.status_notice,
                              lat: v.lat,
                              lon: v.lon
                            })}
                            className="p-2.5 rounded-xl bg-white border border-[#E2D8C3] hover:border-[#B45309] transition flex items-center justify-between cursor-pointer"
                          >
                            <div>
                              <div className="font-semibold text-xs text-[#1C1917]">{v.name}</div>
                              <div className="text-[10px] text-[#78350F] line-clamp-1 italic">
                                {v.status_notice}
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              v.has_cultural_record
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : "bg-amber-100 text-amber-900 border border-amber-300"
                            }`}>
                              {v.has_cultural_record ? "Verified" : "Geographic Only"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-[#78350F]">
                  <Compass className="w-10 h-10 text-amber-600 animate-spin-slow" />
                  <h4 className="font-serif font-bold text-base text-[#1C1917]">
                    Select any Haryana District
                  </h4>
                  <p className="text-xs text-[#574E45] max-w-xs leading-relaxed">
                    Tap Panipat to inspect the historic Handloom weaving clusters and Samalkha villages, or Hansi for Asigarh citadel and Sufi shrines.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
