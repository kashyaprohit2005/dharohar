"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCategoryConfig } from "./VisualCultureCard";
import { INDIA_STATES_DATA } from "../data/indiaGeoData";
import { CulturalEventData } from "./EventCard";
import { API_BASE_URL } from "@/lib/api";
import { 
  Layers, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Navigation, 
  Search, 
  Eye, 
  BookOpen, 
  Users 
} from "lucide-react";

export interface HeritageMarker {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  region: string;
  state: string;
  district?: string;
  village?: string;
  lat: number;
  lon: number;
  gi_tag: string | null;
  preservation_status?: string;
  at_risk_level?: string;
  short_description?: string;
  description?: string;
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
}

function MapController({
  selectedState,
  heritage,
  events,
  activeId,
}: {
  selectedState?: string;
  heritage?: HeritageMarker[];
  events?: CulturalEventData[];
  activeId?: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (activeId && heritage) {
      const target = heritage.find((h) => h.id === activeId);
      if (target && target.lat && target.lon) {
        map.flyTo([target.lat, target.lon], 9, { duration: 1.2 });
        return;
      }
    }

    if (selectedState && selectedState !== "ALL") {
      const key = selectedState.toLowerCase();
      if (INDIA_STATES_DATA[key]) {
        map.flyTo(INDIA_STATES_DATA[key].center, INDIA_STATES_DATA[key].zoom, { duration: 1.2 });
        return;
      }
      const stateItems = heritage ? heritage.filter((h) => h.state.toLowerCase() === key) : [];
      if (stateItems.length > 0 && stateItems[0].lat && stateItems[0].lon) {
        map.flyTo([stateItems[0].lat, stateItems[0].lon], 7.5, { duration: 1.2 });
        return;
      }
    }

    // Default India panorama overview
    map.flyTo([22.5, 78.9], 5, { duration: 1 });
  }, [selectedState, activeId, heritage, events, map]);

  return null;
}

// Custom DivIcon marker generator for heritage traditions
const createCustomMarkerIcon = (category: string, isSelected: boolean, isAtRisk: boolean, has3D: boolean) => {
  if (typeof window === "undefined") return undefined;

  const cfg = getCategoryConfig(category);
  const size = isSelected ? 44 : 36;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none;">
      ${
        isSelected
          ? `<div style="position: absolute; inset: -5px; border-radius: 9999px; background-color: ${cfg.accentColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ""
      }
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background-color: ${cfg.accentColor};
        border: 2px solid ${isSelected ? "#ffffff" : "#ffffff"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? "20px" : "16px"};
        transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: transform 0.2s ease;
      ">
        <span style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4)); line-height: 1;">${cfg.icon}</span>
      </div>
      ${
        has3D
          ? `<span style="position: absolute; bottom: -2px; right: -2px; background: #000; color: #f59e0b; font-size: 8px; font-weight: 800; padding: 1px 3px; border-radius: 4px; border: 1px solid #f59e0b;">3D</span>`
          : ""
      }
      ${
        isAtRisk
          ? `<span style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; border-radius: 9999px; background: #f59e0b; border: 2px solid #fff;"></span>`
          : ""
      }
    </div>
  `;

  return L.divIcon({
    className: "custom-heritage-div-icon",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Custom DivIcon marker generator for live cultural events
const createEventMarkerIcon = (isLive: boolean) => {
  if (typeof window === "undefined") return undefined;

  const size = isLive ? 42 : 36;
  const color = isLive ? "#dc2626" : "#ea580c";

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none;">
      ${
        isLive
          ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: #ef4444; opacity: 0.5; animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ""
      }
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background: linear-gradient(135deg, ${color}, #7f1d1d);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 14px rgba(220, 38, 38, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        <span>${isLive ? "🔴" : "📅"}</span>
      </div>
      <span style="position: absolute; bottom: -3px; right: -3px; background: #111; color: #fff; font-size: 7px; font-weight: 800; padding: 1px 3px; border-radius: 3px; border: 1px solid #ef4444;">LIVE</span>
    </div>
  `;

  return L.divIcon({
    className: "custom-event-div-icon",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function IndiaMap({
  heritage = [],
  events = [],
  height = "600px",
  selectedState,
  activeId,
  onSelectHeritage,
  onSelectState,
  onSelectEvent,
}: IndiaMapProps) {
  const [mounted, setMounted] = useState(false);
  
  // 5 Multi-Layer Toggles
  const [layers, setLayers] = useState({
    culture: true,   // Crafts, textiles, clothing, food, art, folklore, music, dance
    places: true,    // Forts, stepwells, sacred places, architecture
    people: true,    // Living practitioners
    events: true,    // Live cultural events & festivals
    learn: true,     // Traditional knowledge & practices
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-3xl bg-stone-900 flex items-center justify-center text-sm text-stone-400 border border-stone-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          <span className="font-serif">Loading Dharohar Living Cultural Atlas...</span>
        </div>
      </div>
    );
  }

  // Filter heritage by selected state and search query
  const filteredHeritage = heritage.filter((h) => {
    if (selectedState && selectedState !== "ALL" && h.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        h.name.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        (h.district && h.district.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Filter by Layer Toggles
    const cat = h.category.toLowerCase();
    if (["architecture", "spiritual"].includes(cat) && !layers.places) return false;
    if (["traditional_knowledge", "cultural_practices"].includes(cat) && !layers.learn) return false;
    if (["craft", "textile", "clothing", "food", "art", "folklore", "music", "dance", "performing_arts"].includes(cat) && !layers.culture) return false;

    return true;
  });

  // Filter events by selected state and search query
  const filteredEvents = events.filter((e) => {
    if (!layers.events) return false;
    if (selectedState && selectedState !== "ALL" && e.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div
      style={{ height }}
      className="w-full relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-950 font-sans"
    >
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        scrollWheelZoom={true}
        touchZoom={true}
        dragging={true}
        doubleClickZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController
          selectedState={selectedState}
          heritage={heritage}
          events={events}
          activeId={activeId}
        />

        {/* Heritage Tradition Markers */}
        {filteredHeritage.map((h) => {
          if (!h.lat || !h.lon) return null;
          const isSelected = activeId === h.id;
          const cfg = getCategoryConfig(h.category);
          const isAtRisk = Boolean(
            h.preservation_status === "PRESERVATION_WATCH" ||
            h.preservation_status === "ENDANGERED" ||
            (h.at_risk_level && h.at_risk_level !== "STABLE")
          );

          const icon = createCustomMarkerIcon(h.category, isSelected, isAtRisk, Boolean(h.has_3d));

          return (
            <Marker
              key={`h-${h.id}`}
              position={[h.lat, h.lon]}
              icon={icon}
              zIndexOffset={isSelected ? 1000 : 100}
              eventHandlers={{
                click: () => {
                  if (onSelectHeritage) onSelectHeritage(h.id);
                },
              }}
            >
              <Popup className="dharohar-custom-popup">
                <div className="p-1 min-w-[220px] max-w-[260px] text-stone-900">
                  {h.image_url && (
                    <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-stone-200">
                      <img
                        src={h.image_url}
                        alt={h.image_alt || h.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <span>{cfg.icon}</span>
                      <span>{h.category.replace("_", " ")}</span>
                    </span>
                    {isAtRisk ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Watch
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Verified
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-sm font-bold text-stone-950 mb-0.5 leading-snug">
                    {h.name}
                  </h4>

                  <p className="text-[11px] text-stone-600 mb-1.5 font-medium">
                    📍 {h.district ? `${h.district}, ` : ""}{h.region} · {h.state}
                  </p>

                  <p className="text-xs text-stone-700 mb-2.5 line-clamp-2 leading-relaxed">
                    {h.short_description || h.description}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-stone-200">
                    {h.has_3d && (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                        <span>🔍 3D View</span>
                      </span>
                    )}
                    <Link
                      href={`/heritage/${h.id}`}
                      className="ml-auto text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                    >
                      <span>Explore Tradition</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Live Cultural Event Markers */}
        {filteredEvents.map((ev) => {
          if (!ev.lat || !ev.lon) return null;
          const isLive = ev.status === "LIVE NOW" || ev.is_happening_today;
          const eventIcon = createEventMarkerIcon(Boolean(isLive));

          return (
            <Marker
              key={`ev-${ev.id}`}
              position={[ev.lat, ev.lon]}
              icon={eventIcon}
              zIndexOffset={900}
              eventHandlers={{
                click: () => {
                  if (onSelectEvent) onSelectEvent(ev);
                },
              }}
            >
              <Popup className="dharohar-custom-popup">
                <div className="p-1 min-w-[240px] max-w-[280px] text-stone-900">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-rose-600 text-white">
                      {isLive ? "🔴 Live Now" : "📅 Upcoming Event"}
                    </span>
                    <span className="text-[10px] text-stone-500 font-semibold uppercase">{ev.category}</span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-stone-950 mb-1 leading-snug">
                    {ev.title}
                  </h4>

                  <p className="text-[11px] text-stone-600 mb-1">
                    📍 {ev.venue}, {ev.city}, {ev.state}
                  </p>

                  <p className="text-[11px] text-amber-800 font-semibold mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700" />
                    <span>{ev.start_date === ev.end_date ? ev.start_date : `${ev.start_date} → ${ev.end_date}`}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                    <a
                      href={ev.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${ev.lat},${ev.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 fill-current" />
                      <span>Directions</span>
                    </a>

                    <a
                      href={`${API_BASE_URL}/api/events/${ev.event_id}/calendar.ics`}
                      download={`${ev.event_id}.ics`}
                      className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      + Calendar
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Header: Search & State Switcher */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Search Input on Map */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-lg text-stone-100 max-w-xs w-full">
          <Search className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Search tradition, fort, craft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        {/* 5 Layer Controls Toggle Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/80 shadow-lg text-xs font-semibold text-amber-300 hover:bg-stone-800 transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Map Layers</span>
          </button>
        </div>
      </div>

      {/* Floating Layer Selection Panel */}
      {showLayerPanel && (
        <div className="absolute top-16 right-4 z-[400] w-64 bg-stone-900/95 backdrop-blur-md border border-stone-700 rounded-2xl p-4 shadow-2xl space-y-2.5 text-xs text-stone-200 animate-fade-in">
          <div className="font-serif font-bold text-amber-400 text-sm pb-1 border-b border-stone-800 flex items-center justify-between">
            <span>Dharohar Map Layers</span>
            <span className="text-[10px] font-sans text-stone-400">Toggle filters</span>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-amber-300">
            <input
              type="checkbox"
              checked={layers.culture}
              onChange={() => toggleLayer("culture")}
              className="accent-amber-500 rounded"
            />
            <span className="font-semibold">Culture</span>
            <span className="text-[10px] text-stone-400">(Crafts, Food, Art)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-amber-300">
            <input
              type="checkbox"
              checked={layers.places}
              onChange={() => toggleLayer("places")}
              className="accent-amber-500 rounded"
            />
            <span className="font-semibold">Places</span>
            <span className="text-[10px] text-stone-400">(Forts & Sacred Sites)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-amber-300">
            <input
              type="checkbox"
              checked={layers.events}
              onChange={() => toggleLayer("events")}
              className="accent-rose-500 rounded"
            />
            <span className="font-semibold text-rose-300">🔴 Live Events</span>
            <span className="text-[10px] text-stone-400">({filteredEvents.length})</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer hover:text-amber-300">
            <input
              type="checkbox"
              checked={layers.learn}
              onChange={() => toggleLayer("learn")}
              className="accent-amber-500 rounded"
            />
            <span className="font-semibold">Traditional Knowledge</span>
          </label>
        </div>
      )}

      {/* Floating State Selector Pill Strip at Bottom Left */}
      <div className="absolute bottom-4 left-4 z-[400] max-w-[85vw] sm:max-w-xl overflow-x-auto no-scrollbar flex items-center gap-1.5 p-1.5 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-800 shadow-xl">
        <button
          type="button"
          onClick={() => onSelectState && onSelectState("ALL")}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            !selectedState || selectedState === "ALL"
              ? "bg-amber-600 text-stone-950 font-bold shadow-sm"
              : "text-stone-300 hover:bg-stone-800"
          }`}
        >
          All India
        </button>

        {Object.entries(INDIA_STATES_DATA)
          .slice(0, 10)
          .map(([sKey, sInfo]) => {
            const isActive = selectedState?.toLowerCase() === sKey;
            return (
              <button
                key={sKey}
                type="button"
                onClick={() => onSelectState && onSelectState(sInfo.name)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-amber-500 text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:bg-stone-800"
                }`}
              >
                {sInfo.name}
              </button>
            );
          })}
      </div>

      {/* Touch-Friendly Gesture Hint Badge */}
      <div className="absolute bottom-4 right-4 z-[400] pointer-events-none hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-800 shadow-sm text-[11px] font-medium text-stone-300">
        <span>🖐️ Pinch to zoom · Tap markers for living stories</span>
      </div>
    </div>
  );
}
