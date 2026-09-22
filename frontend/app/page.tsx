"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import StateDetailPanel from "./components/panels/StateDetailPanel";
import DistrictDetailPanel from "./components/panels/DistrictDetailPanel";
import CulturalItemPanel from "./components/panels/CulturalItemPanel";
import CulturalStoryModal from "./components/panels/CulturalStoryModal";
import { GeoState, GeoDistrict, CulturalItem } from "./components/map/mapTypes";
import { geoAPI } from "@/lib/api";

// Dynamically import DharoharMap with ssr: false for Leaflet
const DharoharMap = dynamic(() => import("./components/map/DharoharMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-[#FAF6EE] flex flex-col items-center justify-center text-stone-600">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-sky-600/20 border-t-sky-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-sky-600 text-sm">
            ✦
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            DHAROHAR Living Cultural Atlas
          </h3>
          <p className="text-xs text-stone-500 font-sans">
            Loading geographic vector boundaries & verified heritage registry...
          </p>
        </div>
      </div>
    </div>
  ),
});

function AtlasContent() {
  const searchParams = useSearchParams();

  const [selectedState, setSelectedState] = useState<GeoState | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<GeoDistrict | null>(null);
  const [selectedItem, setSelectedItem] = useState<CulturalItem | null>(null);
  const [activeStorySlug, setActiveStorySlug] = useState<string | null>(null);
  const [allDistricts, setAllDistricts] = useState<GeoDistrict[]>([]);

  // Update browser URL query params without reloading
  const updateUrlParams = useCallback((params: { state?: string; district?: string; item?: string }) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (params.item) {
      url.searchParams.set("item", params.item);
      url.searchParams.delete("district");
      url.searchParams.delete("state");
    } else if (params.district) {
      url.searchParams.set("district", params.district);
      url.searchParams.delete("item");
      url.searchParams.delete("state");
    } else if (params.state) {
      url.searchParams.set("state", params.state);
      url.searchParams.delete("district");
      url.searchParams.delete("item");
    } else {
      url.searchParams.delete("item");
      url.searchParams.delete("district");
      url.searchParams.delete("state");
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  // Handle URL deep-linking on initial mount
  useEffect(() => {
    const itemParam = searchParams.get("item");
    const districtParam = searchParams.get("district");
    const stateParam = searchParams.get("state");

    if (itemParam) {
      geoAPI
        .itemDetail(itemParam)
        .then((res) => {
          setSelectedItem(res.data);
          // Also set district context if available
          if (res.data.district_slug) {
            geoAPI.districtDetail(res.data.district_slug).then((dRes) => {
              setSelectedDistrict(dRes.data);
            }).catch(() => {});
          }
        })
        .catch((err) => console.warn("Failed to load deep-linked item:", err));
    } else if (districtParam) {
      geoAPI
        .districtDetail(districtParam)
        .then((res) => {
          setSelectedDistrict(res.data);
        })
        .catch((err) => console.warn("Failed to load deep-linked district:", err));
    } else if (stateParam) {
      geoAPI
        .states()
        .then((res) => {
          const found = res.data.find(
            (s: GeoState) => s.code.toLowerCase() === stateParam.toLowerCase()
          );
          if (found) setSelectedState(found);
        })
        .catch((err) => console.warn("Failed to load deep-linked state:", err));
    }
  }, [searchParams]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState?.code) {
      geoAPI
        .districts(selectedState.code)
        .then((res) => {
          setAllDistricts(res.data);
        })
        .catch((err) => console.error("Failed to load districts for state:", err));
    } else {
      setAllDistricts([]);
    }
  }, [selectedState]);

  // State selection handler
  const handleSelectState = (state: GeoState) => {
    setSelectedState(state);
    setSelectedDistrict(null);
    setSelectedItem(null);
    updateUrlParams({ state: state.code });
  };

  // District selection handler
  const handleSelectDistrict = (district: GeoDistrict) => {
    setSelectedDistrict(district);
    setSelectedItem(null);
    updateUrlParams({ district: district.slug });
  };

  // Cultural item selection handler
  const handleSelectItem = (item: CulturalItem) => {
    setSelectedItem(item);
    updateUrlParams({ item: item.slug });
  };

  // Select item by slug (from recommendations or search)
  const handleSelectItemSlug = (slug: string) => {
    geoAPI
      .itemDetail(slug)
      .then((res) => {
        setSelectedItem(res.data);
        updateUrlParams({ item: slug });
      })
      .catch((err) => console.error("Failed to load item by slug:", err));
  };

  // Reset navigation to whole India
  const handleResetToIndia = () => {
    setSelectedState(null);
    setSelectedDistrict(null);
    setSelectedItem(null);
    updateUrlParams({});
  };

  // Jump to Haryana pilot
  const handleJumpToHaryana = () => {
    const haryanaState: GeoState = {
      code: "IN-HR",
      name: "Haryana",
      zone: "North",
      center: [29.0588, 76.0856],
      zoom: 8,
      tagline:
        "Cradle of Vedic Saraswati Civilisation, Mahabharata Kurukshetra & Panipat Handloom",
      is_demo_deep: true,
    };
    setSelectedState(haryanaState);
    setSelectedDistrict(null);
    setSelectedItem(null);
    updateUrlParams({ state: "IN-HR" });
  };

  // Back to Haryana from district panel
  const handleBackToState = () => {
    setSelectedDistrict(null);
    setSelectedItem(null);
    if (selectedState) {
      updateUrlParams({ state: selectedState.code });
    } else {
      updateUrlParams({});
    }
  };

  // Back to district from item panel
  const handleBackToDistrict = () => {
    setSelectedItem(null);
    if (selectedDistrict) {
      updateUrlParams({ district: selectedDistrict.slug });
    } else if (selectedState) {
      updateUrlParams({ state: selectedState.code });
    } else {
      updateUrlParams({});
    }
  };

  return (
    <div className="h-screen w-screen bg-[#FAF6EE] text-stone-900 flex flex-col overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* Standard Header Navigation */}
      <Navbar />

      {/* Main Map Container Viewport */}
      <main className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
        <DharoharMap
          onSelectState={handleSelectState}
          onSelectDistrict={handleSelectDistrict}
          onSelectItem={handleSelectItem}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedItem={selectedItem}
          onResetToIndia={handleResetToIndia}
          onClosePanels={() => {
            setSelectedState(null);
            setSelectedDistrict(null);
            setSelectedItem(null);
            updateUrlParams({});
          }}
        />

        {/* Sliding State Dossier Panel (Shown when state is selected, without district) */}
        {selectedState && !selectedDistrict && !selectedItem && (
          <StateDetailPanel
            state={selectedState}
            districts={allDistricts}
            onSelectDistrict={handleSelectDistrict}
            onClose={() => {
              setSelectedState(null);
              updateUrlParams({});
            }}
            onJumpToHaryana={handleJumpToHaryana}
          />
        )}

        {/* Sliding District Dossier Panel (Shown when district is selected, without item) */}
        {selectedDistrict && !selectedItem && (
          <DistrictDetailPanel
            district={selectedDistrict}
            onSelectItem={handleSelectItem}
            onBackToState={handleBackToState}
            onClose={() => {
              setSelectedDistrict(null);
              if (selectedState) updateUrlParams({ state: selectedState.code });
              else updateUrlParams({});
            }}
          />
        )}

        {/* Sliding Cultural Item Dossier Panel (Shown when item is selected) */}
        {selectedItem && (
          <CulturalItemPanel
            item={selectedItem}
            onBackToDistrict={handleBackToDistrict}
            onClose={() => {
              setSelectedItem(null);
              if (selectedDistrict) updateUrlParams({ district: selectedDistrict.slug });
              else if (selectedState) updateUrlParams({ state: selectedState.code });
              else updateUrlParams({});
            }}
            onOpenStory={(slug) => setActiveStorySlug(slug)}
            onSelectItemSlug={handleSelectItemSlug}
          />
        )}

        {/* Multi-Chapter Cultural Story Modal */}
        <CulturalStoryModal
          storySlug={activeStorySlug}
          onClose={() => setActiveStorySlug(null)}
        />
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#FAF6EE] flex items-center justify-center text-stone-600">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
            <span className="text-xs font-serif">Loading DHAROHAR Living Atlas...</span>
          </div>
        </div>
      }
    >
      <AtlasContent />
    </Suspense>
  );
}
