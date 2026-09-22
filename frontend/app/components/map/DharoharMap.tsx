"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import MapController from "./MapController";
import IndiaStateLayer from "./IndiaStateLayer";
import HaryanaDistrictLayer from "./HaryanaDistrictLayer";
import CulturalMarkersLayer from "./CulturalMarkersLayer";
import MapControls from "./MapControls";
import MapBreadcrumbs from "./MapBreadcrumbs";
import MapSearch from "./MapSearch";
import {
  GeoState,
  GeoDistrict,
  CulturalItem,
  CategoryFilterConfig,
  MapLevel,
  MapBreadcrumbItem,
} from "./mapTypes";
import { geoAPI } from "@/lib/api";

interface DharoharMapProps {
  onSelectState: (state: GeoState) => void;
  onSelectDistrict: (district: GeoDistrict) => void;
  onSelectItem: (item: CulturalItem) => void;
  selectedState: GeoState | null;
  selectedDistrict: GeoDistrict | null;
  selectedItem: CulturalItem | null;
  onResetToIndia: () => void;
  onClosePanels: () => void;
}

// Strict geographical bounding box for India (Mainland + Islands)
// User cannot pan away to Europe, Africa, or world ocean
const INDIA_BOUNDS: LatLngBoundsExpression = [
  [6.5, 68.0],  // South-West corner (Kanyakumari / Lakshadweep)
  [37.5, 97.5], // North-East corner (Kashmir / Arunachal)
];

const DEFAULT_CATEGORIES: CategoryFilterConfig[] = [
  { id: "all", label: "All Heritage", icon: "🌐", color: "#f59e0b" },
  { id: "crafts", label: "Crafts & Textiles", icon: "🏺", color: "#d97706" },
  { id: "food", label: "Culinary Heritage", icon: "🍲", color: "#ea580c" },
  { id: "monuments", label: "Monuments & Forts", icon: "🏰", color: "#2563eb" },
  { id: "traditions", label: "Folklore & Lore", icon: "📜", color: "#7c3aed" },
  { id: "events", label: "Live Events", icon: "🎪", color: "#db2777" },
  { id: "art", label: "Art & Murals", icon: "🎨", color: "#059669" },
  { id: "people", label: "Living Masters", icon: "👥", color: "#4f46e5" },
];

// Helper to grab the Leaflet Map instance
function MapInstanceHook({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    if (map) onReady(map);
  }, [map, onReady]);
  return null;
}

export default function DharoharMap({
  onSelectState,
  onSelectDistrict,
  onSelectItem,
  selectedState,
  selectedDistrict,
  selectedItem,
  onResetToIndia,
  onClosePanels,
}: DharoharMapProps) {
  // Leaflet map instance handle
  const mapRef = useRef<L.Map | null>(null);

  // Geo Data
  const [statesRegistry, setStatesRegistry] = useState<GeoState[]>([]);
  const [districtsList, setDistrictsList] = useState<GeoDistrict[]>([]);
  const [districtItems, setDistrictItems] = useState<CulturalItem[]>([]);
  const [indiaGeoJson, setIndiaGeoJson] = useState<any>(null);
  const [haryanaGeoJson, setHaryanaGeoJson] = useState<any>(null);

  // Map state
  const [level, setLevel] = useState<MapLevel>("INDIA");
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5, 79.5]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Layer Toggles
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    districts: true,
    labels: true,
    crafts: true,
    food: true,
    monuments: true,
    traditions: true,
    events: true,
    knowledge: true,
  });

  const toggleLayer = (layerKey: string) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  // Load Initial States & GeoJSON
  useEffect(() => {
    async function loadData() {
      try {
        const [statesRes, distRes] = await Promise.all([
          geoAPI.states(),
          geoAPI.districts("IN-HR"),
        ]);
        setStatesRegistry(statesRes.data);
        setDistrictsList(distRes.data);

        // Fetch India States GeoJSON
        const statesJsonRes = await fetch("/data/india/states.geojson");
        if (statesJsonRes.ok) {
          const sJson = await statesJsonRes.json();
          setIndiaGeoJson(sJson);
        }

        // Fetch Haryana Districts GeoJSON
        const distJsonRes = await fetch("/data/haryana/districts.geojson");
        if (distJsonRes.ok) {
          const dJson = await distJsonRes.json();
          setHaryanaGeoJson(dJson);
        }
      } catch (err) {
        console.error("Failed to load geographic atlas data:", err);
      }
    }
    loadData();
  }, []);

  // Sync state selection from props
  useEffect(() => {
    if (selectedItem) {
      setLevel("ITEM");
      if (selectedItem.lat && selectedItem.lon) {
        setMapCenter([selectedItem.lat, selectedItem.lon]);
        setMapZoom(13.5);
      }
    } else if (selectedDistrict) {
      setLevel("DISTRICT");
      setMapCenter(selectedDistrict.center);
      setMapZoom(selectedDistrict.zoom || 10.5);

      // Fetch district cultural items
      geoAPI
        .districtItems(selectedDistrict.slug)
        .then((res) => {
          setDistrictItems(res.data);
        })
        .catch((err) => console.error("Error loading district items:", err));
    } else if (selectedState) {
      setLevel("STATE");
      setMapCenter(selectedState.center);
      setMapZoom(selectedState.zoom || 7.5);
      setDistrictItems([]);
    } else {
      setLevel("INDIA");
      setMapCenter([22.5, 79.5]);
      setMapZoom(5);
      setDistrictItems([]);
    }
  }, [selectedState, selectedDistrict, selectedItem]);

  // Breadcrumbs computation
  const breadcrumbs = useMemo((): MapBreadcrumbItem[] => {
    const list: MapBreadcrumbItem[] = [{ label: "India", level: "INDIA" }];
    if (selectedState) {
      list.push({ label: selectedState.name, level: "STATE", data: selectedState });
    }
    if (selectedDistrict) {
      list.push({ label: selectedDistrict.name, level: "DISTRICT", data: selectedDistrict });
    }
    if (selectedItem) {
      list.push({ label: selectedItem.title, level: "ITEM", data: selectedItem });
    }
    return list;
  }, [selectedState, selectedDistrict, selectedItem]);

  const handleBreadcrumbNavigate = (navLevel: MapLevel, data?: any) => {
    if (navLevel === "INDIA") {
      onResetToIndia();
    } else if (navLevel === "STATE" && data) {
      onSelectState(data);
    } else if (navLevel === "DISTRICT" && data) {
      onSelectDistrict(data);
    }
  };

  const handleSelectPlaceFromSearch = (place: {
    slug: string;
    name: string;
    type: string;
    lat: number;
    lon: number;
    zoom: number;
  }) => {
    if (place.type === "State") {
      const targetState = statesRegistry.find(
        (s) => s.code.toLowerCase() === place.slug.toLowerCase() || s.name.toLowerCase() === place.name.toLowerCase()
      );
      if (targetState) {
        onSelectState(targetState);
      } else {
        setMapCenter([place.lat, place.lon]);
        setMapZoom(place.zoom);
      }
    } else if (place.type === "District") {
      const targetDist = districtsList.find(
        (d) => d.slug.toLowerCase() === place.slug.toLowerCase() || d.name.toLowerCase() === place.name.toLowerCase()
      );
      if (targetDist) {
        onSelectDistrict(targetDist);
      } else {
        setMapCenter([place.lat, place.lon]);
        setMapZoom(place.zoom);
      }
    }
  };

  const handleSelectItemSlugFromSearch = async (slug: string) => {
    try {
      const res = await geoAPI.itemDetail(slug);
      onSelectItem(res.data);
    } catch (err) {
      console.error("Error loading item from search:", err);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  return (
    <div
      className="relative w-full h-full bg-[#F4EFE6] overflow-hidden select-none"
    >
      {/* Search Bar - Top Center */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-[420] w-[92%] max-w-md pointer-events-auto">
        <MapSearch
          onSelectPlace={handleSelectPlaceFromSearch}
          onSelectItemSlug={handleSelectItemSlugFromSearch}
        />
      </div>

      {/* Layer Controls & Floating Side Toolbar */}
      <MapControls
        categories={DEFAULT_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onResetView={onResetToIndia}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isIndiaView={level === "INDIA"}
        activeLayers={activeLayers}
        onToggleLayer={toggleLayer}
      />

      {/* Breadcrumbs Navigation */}
      <MapBreadcrumbs
        items={breadcrumbs}
        onNavigate={handleBreadcrumbNavigate}
      />

      {/* Interactive Leaflet Map Canvas - Pure Vector Rendering Strictly bounded to India */}
      <MapContainer
        center={[22.5, 79.5]}
        zoom={5}
        minZoom={4.5}
        maxZoom={18}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        className="w-full h-full z-0"
        attributionControl={false}
      >
        <MapInstanceHook onReady={(m) => { mapRef.current = m; }} />

        {/* Dynamic Camera Fly Controller */}
        <MapController level={level} center={mapCenter} zoom={mapZoom} />

        {/* MODE A: India States GeoJSON Layer (Curated Manuscript Palette + Visible Ivory Labels) */}
        <IndiaStateLayer
          geoJsonData={indiaGeoJson}
          statesRegistry={statesRegistry}
          selectedStateCode={selectedState?.code || null}
          onSelectState={onSelectState}
          visible={level === "INDIA" || (level === "STATE" && selectedState?.code !== "IN-HR")}
          showLabels={activeLayers.labels && level === "INDIA"}
        />

        {/* MODE B: Haryana Districts GeoJSON Layer (All 23 Districts including Hansi) */}
        <HaryanaDistrictLayer
          geoJsonData={haryanaGeoJson}
          districtsList={districtsList}
          selectedDistrictSlug={selectedDistrict?.slug || null}
          onSelectDistrict={onSelectDistrict}
          visible={
            activeLayers.districts &&
            (selectedState?.code === "IN-HR" || level === "DISTRICT" || level === "ITEM")
          }
          showLabels={activeLayers.labels}
        />

        {/* Cultural Markers Layer (Progressive disclosure for active district) */}
        <CulturalMarkersLayer
          items={districtItems}
          selectedItemSlug={selectedItem?.slug || null}
          onSelectItem={onSelectItem}
          visible={Boolean(selectedDistrict) || level === "DISTRICT" || level === "ITEM"}
          selectedCategory={selectedCategory}
        />
      </MapContainer>

      {/* Cartographic Ocean Watermark Overlays (Shown in Whole India view) */}
      {level === "INDIA" && (
        <>
          {/* Arabian Sea */}
          <div className="absolute bottom-[28%] left-[6%] sm:left-[12%] z-[20] pointer-events-none select-none text-center -rotate-6 hidden sm:block animate-in fade-in duration-700">
            <div className="text-xs sm:text-sm font-serif font-bold tracking-[0.45em] text-sky-950/25 uppercase">
              ARABIAN SEA
            </div>
            <div className="text-[9px] tracking-[0.3em] text-stone-500/30 font-serif italic mt-0.5">
              Sindhu Sagar
            </div>
          </div>

          {/* Bay of Bengal */}
          <div className="absolute bottom-[32%] right-[8%] sm:right-[14%] z-[20] pointer-events-none select-none text-center rotate-6 hidden sm:block animate-in fade-in duration-700">
            <div className="text-xs sm:text-sm font-serif font-bold tracking-[0.45em] text-sky-950/25 uppercase">
              BAY OF BENGAL
            </div>
            <div className="text-[9px] tracking-[0.3em] text-stone-500/30 font-serif italic mt-0.5">
              Purva Sagar
            </div>
          </div>

          {/* Indian Ocean */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-[20] pointer-events-none select-none text-center hidden sm:block animate-in fade-in duration-700">
            <div className="text-xs sm:text-sm font-serif font-bold tracking-[0.55em] text-sky-950/25 uppercase">
              INDIAN OCEAN
            </div>
            <div className="text-[9px] tracking-[0.35em] text-stone-500/30 font-serif italic mt-0.5">
              Hind Mahasagar
            </div>
          </div>

          {/* Decorative Nautical Compass Rose */}
          <div className="absolute bottom-16 left-6 z-[20] pointer-events-none select-none hidden lg:block opacity-40 hover:opacity-70 transition-opacity duration-300">
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-stone-600/40 fill-current">
              <polygon points="50,6 53,42 50,38 47,42" fill="rgba(180, 83, 9, 0.6)" />
              <polygon points="50,6 47,42 50,50" fill="rgba(120, 53, 15, 0.8)" />
              <polygon points="50,94 53,58 50,62 47,58" fill="rgba(180, 83, 9, 0.3)" />
              <polygon points="50,94 47,58 50,50" fill="rgba(120, 53, 15, 0.45)" />
              <polygon points="94,50 58,53 62,50 58,47" fill="rgba(180, 83, 9, 0.3)" />
              <polygon points="94,50 58,47 50,50" fill="rgba(120, 53, 15, 0.45)" />
              <polygon points="6,50 42,53 38,50 42,47" fill="rgba(180, 83, 9, 0.3)" />
              <polygon points="6,50 42,47 50,50" fill="rgba(120, 53, 15, 0.45)" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
              <text x="50" y="3" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#78350f" fontFamily="serif">N</text>
            </svg>
          </div>
        </>
      )}

      {/* Subtle Bottom Ambient Status Badge */}
      <div className="absolute bottom-4 right-4 z-[400] hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-stone-300/80 shadow-md text-[11px] text-stone-700 font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span>Living Cultural Atlas • Touch to Discover</span>
      </div>
    </div>
  );
}
