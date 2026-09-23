"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getCategoryConfig } from "./VisualCultureCard";
import { INDIA_STATES_DATA } from "../data/indiaGeoData";
import { CulturalEventData } from "./EventCard";
import India2DVectorMap from "./India2DVectorMap";
import IndiaMapToolbar, { LayerState } from "./IndiaMapToolbar";
import LocationDossier, { LocationDossierItem } from "./LocationDossier";
import { 
  Layers, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Navigation, 
  Search, 
  Compass, 
  Box, 
  Map as MapIcon,
  X,
  ArrowRight
} from "lucide-react";
import { geoAPI } from "@/lib/api";

const India3DMap = dynamic(() => import("./India3DMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-3xl bg-[#FAF6EE] flex flex-col items-center justify-center text-sm text-[#78350F] border border-[#E2D8C3]">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#B45309] border-t-transparent animate-spin"></div>
        <span className="font-serif font-semibold">Opening India's 3D living cultural atlas…</span>
      </div>
    </div>
  ),
});

export interface HeritageMarker {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  region: string;
  state: string;
  district?: string;
  village?: string;
  subdistrict?: string;
  locality?: string;
  lat: number;
  lon: number;
  gi_tag: string | null;
  preservation_status?: string;
  at_risk_level?: string;
  short_description?: string;
  description?: string;
  history?: string;
  techniques?: string;
  materials?: string;
  image_url?: string | null;
  image_source_name?: string;
  image_alt?: string;
  why_here?: string;
  what_makes_it_special?: string;
  distinctiveness_type?: string;
  has_3d?: boolean;
}

export const getCategoryColor = (cat: string = "") => {
  return getCategoryConfig(cat).accentColor;
};

export const getCategoryIcon = (cat: string = "") => {
  return getCategoryConfig(cat).icon;
};

interface IndiaMapProps {
  heritage?: HeritageMarker[];
  events?: CulturalEventData[];
  height?: string;
  selectedState?: string;
  activeId?: number | null;
  onSelectHeritage?: (id: number) => void;
  onSelectState?: (stateName: string) => void;
  onSelectEvent?: (event: CulturalEventData) => void;
  onOpenDossier?: (item: any) => void;
}

export default function IndiaMap({
  heritage = [],
  events = [],
  height = "620px",
  selectedState = "ALL",
  activeId,
  onSelectHeritage,
  onSelectState,
  onSelectEvent,
  onOpenDossier,
}: IndiaMapProps) {
  const [mapMode, setMapMode] = useState<"2D" | "3D">("2D");
  const [isClient, setIsClient] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    crafts: true,
    places: true,
    food: true,
    events: true,
    knowledge: true,
  });

  // Search Modal overlay state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ heritage: [], places: [], events: [] });
  const [searching, setSearching] = useState(false);

  // Internal Location Dossier Modal
  const [dossierItem, setDossierItem] = useState<LocationDossierItem | null>(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggleLayer = (key: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRecenter = () => {
    if (onSelectState) onSelectState("ALL");
  };

  const handleSearchExecute = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults({ heritage: [], places: [], events: [] });
      return;
    }

    setSearching(true);
    geoAPI
      .search(q)
      .then((res) => {
        setSearchResults(res.data || { heritage: [], places: [], events: [] });
      })
      .catch(() => {
        setSearchResults({ heritage: [], places: [], events: [] });
      })
      .finally(() => setSearching(false));
  };

  const handleOpenItemDossier = (item: any) => {
    setDossierItem(item);
    setDossierOpen(true);
    if (onOpenDossier) onOpenDossier(item);
    if (item.id && onSelectHeritage) onSelectHeritage(item.id);
  };

  if (!isClient) {
    return (
      <div 
        className="w-full rounded-3xl bg-[#FAF6EE] flex flex-col items-center justify-center border border-[#E2D8C3] text-[#78350F] shadow-sm space-y-2.5"
        style={{ height }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-[#B45309] border-t-transparent animate-spin"></div>
          <span className="font-serif font-semibold text-sm">Opening India's living cultural atlas…</span>
        </div>
        <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase">Dharohar • Preserving Heritage</span>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-2.5">
      {/* Top Controls: Atlas Projection Switcher Pill */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-bold text-[#78350F]">Atlas View:</span>
          <div className="flex items-center p-1 bg-[#FAF6EE] rounded-2xl border border-[#E2D8C3] text-xs shadow-xs">
            <button
              onClick={() => setMapMode("2D")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                mapMode === "2D"
                  ? "bg-[#2A2421] text-white shadow-xs"
                  : "text-[#78350F] hover:text-[#1C1917]"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Vector Atlas (Approved)</span>
            </button>
            <button
              onClick={() => setMapMode("3D")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                mapMode === "3D"
                  ? "bg-[#2A2421] text-white shadow-xs"
                  : "text-[#78350F] hover:text-[#1C1917]"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-500" />
              <span>3D Extruded Relief</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#574E45]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span>Survey of India Boundaries Strictly Bounded</span>
        </div>
      </div>

      {/* Map Container Area */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-[#E2D8C3]">
        {/* Floating Right-Side Control Toolbar (Section 7) */}
        <IndiaMapToolbar
          onSearchOpen={() => setSearchModalOpen(true)}
          onRecenter={handleRecenter}
          layers={layers}
          onToggleLayer={handleToggleLayer}
          selectedState={selectedState}
          onSelectState={onSelectState}
        />

        {/* View Mode: 2D Vector Map vs 3D Extruded Map */}
        {mapMode === "2D" ? (
          <India2DVectorMap
            height={height}
            selectedState={selectedState}
            onSelectState={onSelectState}
            onSelectHeritage={onSelectHeritage}
            onOpenDossier={handleOpenItemDossier}
          />
        ) : (
          <India3DMap
            heritage={heritage}
            events={events}
            height={height}
            selectedState={selectedState}
            activeHeritageId={activeId}
            onSelectState={onSelectState}
            onSelectHeritage={(id) => {
              const matched = heritage.find((h) => h.id === id);
              if (matched) handleOpenItemDossier(matched);
              else if (onSelectHeritage) onSelectHeritage(id);
            }}
            onSelectEvent={onSelectEvent}
          />
        )}
      </div>

      {/* SEARCH MODAL OVERLAY (Section 29) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-[700] flex items-start justify-center pt-20 p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#FAF6EE] border border-[#E0D5BE] shadow-2xl p-5 space-y-4 text-[#2A2421]">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#B45309]">
                <Search className="w-4 h-4" />
                <span>Search Dharohar Living Atlas</span>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#EFE7D5] text-stone-500 hover:text-stone-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearchExecute(e.target.value)}
                placeholder="Search a place, craft, food, fort, tradition or village..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E0D5BE] text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:border-[#B45309] shadow-inner"
              />
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1 text-xs scrollbar-thin scrollbar-thumb-[#DFD5C0]">
              {searching ? (
                <div className="py-6 text-center text-stone-500 font-serif">
                  Searching verified cultural database...
                </div>
              ) : searchQuery && searchResults.results_count === 0 ? (
                <div className="py-6 text-center text-stone-500 font-serif">
                  No matching verified traditions or places found for "{searchQuery}".
                </div>
              ) : (
                <>
                  {searchResults.heritage?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-[10px] uppercase text-[#78350F] block">
                        Verified Living Traditions:
                      </span>
                      {searchResults.heritage.map((h: any) => (
                        <div
                          key={h.id}
                          onClick={() => {
                            setSearchModalOpen(false);
                            handleOpenItemDossier(h);
                          }}
                          className="p-2.5 rounded-xl bg-white border border-[#E2D8C3] hover:border-[#B45309] transition cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-semibold text-[#1C1917] group-hover:text-[#B45309]">
                              {h.name}
                            </span>
                            <span className="text-stone-500 block text-[11px]">
                              {h.category} • {h.district ? `${h.district}, ` : ""}{h.state}
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B45309]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.places?.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="font-bold text-[10px] uppercase text-[#78350F] block">
                        Geographic Settlements & Districts:
                      </span>
                      {searchResults.places.map((p: any) => (
                        <div
                          key={p.slug}
                          onClick={() => {
                            setSearchModalOpen(false);
                            handleOpenItemDossier({
                              name: p.name,
                              slug: p.slug,
                              district: p.district_slug,
                              state: "Haryana",
                              isGeographicOnly: !p.has_cultural_record,
                              statusNotice: p.status_notice,
                              lat: p.lat,
                              lon: p.lon
                            });
                          }}
                          className="p-2.5 rounded-xl bg-white border border-[#E2D8C3] hover:border-[#B45309] transition cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-semibold text-[#1C1917] group-hover:text-[#B45309]">
                              {p.name}
                            </span>
                            <span className="text-stone-500 block text-[11px]">
                              {p.entity_type} • {p.district_slug || "Haryana"}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            p.has_cultural_record
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}>
                            {p.has_cultural_record ? "Verified" : "Geographic Only"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOCATION DOSSIER MODAL (Section 20, 21, 31) */}
      <LocationDossier
        isOpen={dossierOpen}
        item={dossierItem}
        onClose={() => setDossierOpen(false)}
        onViewOnMap={(lat, lon) => {
          setDossierOpen(false);
          // Could center map on these coordinates
        }}
      />
    </div>
  );
}
