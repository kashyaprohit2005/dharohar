"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "../components/Navbar";
import VisualCultureCard from "../components/VisualCultureCard";
import MobileHeritageSheet from "../components/MobileHeritageSheet";
import EventCard, { CulturalEventData } from "../components/EventCard";
import SocialShareModal, { ShareItem } from "../components/SocialShareModal";
import HeritageTrail, { recordTrailStop } from "../components/HeritageTrail";
import { heritageAPI, API_BASE_URL } from "@/lib/api";
import { CULTURAL_DOMAINS, INDIA_STATES_DATA, REGIONAL_ZONES } from "../data/indiaGeoData";
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  Calendar, 
  Compass, 
  Search, 
  Share2, 
  Volume2, 
  Flame, 
  ShieldCheck, 
  Filter 
} from "lucide-react";
import axios from "axios";

const IndiaMap = dynamic(() => import("../components/IndiaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-3xl bg-stone-900 flex items-center justify-center text-sm text-stone-400 border border-stone-800">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
        <span className="font-serif">Initializing Dharohar Living Culture Atlas...</span>
      </div>
    </div>
  ),
});

export default function AtlasMapPage() {
  const [heritageList, setHeritageList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<CulturalEventData[]>([]);
  const [statesSummary, setStatesSummary] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [showAtRiskOnly, setShowAtRiskOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeritageId, setActiveHeritageId] = useState<number | null>(null);
  const [stateProfile, setStateProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // View Mode: map | gallery | events
  const [viewMode, setViewMode] = useState<"map" | "gallery" | "events">("map");
  const [eventTimeFilter, setEventTimeFilter] = useState<string>("all");

  // Share Modal State
  const [shareItem, setShareItem] = useState<ShareItem | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  // Initial load
  useEffect(() => {
    Promise.all([
      heritageAPI.list(), 
      heritageAPI.states(),
      axios.get(`${API_BASE_URL}/api/events`).then(res => res.data).catch(() => [])
    ])
      .then(([hRes, sRes, evData]) => {
        setHeritageList(hRes.data || []);
        setStatesSummary(sRes.data || []);
        setEventsList(evData || []);
      })
      .catch((err) => console.error("Error loading Atlas data:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch full state cultural profile whenever a state is selected
  useEffect(() => {
    if (selectedState && selectedState !== "ALL") {
      heritageAPI
        .stateProfile(selectedState)
        .then((res) => setStateProfile(res.data))
        .catch(() => setStateProfile(null));
    } else {
      setStateProfile(null);
    }
  }, [selectedState]);

  // Client-side filtering of heritage traditions
  const filteredHeritage = useMemo(() => {
    return heritageList.filter((h) => {
      if (selectedState !== "ALL" && h.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      if (selectedCategory !== "all" && h.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedZone !== "All") {
        const stateKey = h.state.toLowerCase();
        const stateInfo = INDIA_STATES_DATA[stateKey];
        if (!stateInfo || stateInfo.zone.toLowerCase() !== selectedZone.toLowerCase()) {
          return false;
        }
      }
      if (showAtRiskOnly) {
        const isAtRisk =
          h.preservation_status === "PRESERVATION_WATCH" ||
          h.preservation_status === "ENDANGERED" ||
          (h.at_risk_level && h.at_risk_level !== "STABLE");
        if (!isAtRisk) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchRegion = h.region?.toLowerCase().includes(q);
        const matchDistrict = h.district?.toLowerCase().includes(q);
        const matchState = h.state?.toLowerCase().includes(q);
        const matchCategory = h.category?.toLowerCase().includes(q);
        const matchGI = h.gi_tag?.toLowerCase().includes(q);
        const matchDesc = h.description?.toLowerCase().includes(q);
        if (!matchName && !matchRegion && !matchDistrict && !matchState && !matchCategory && !matchGI && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [heritageList, selectedState, selectedCategory, selectedZone, showAtRiskOnly, searchQuery]);

  // Filtered live events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((e) => {
      if (selectedState !== "ALL" && e.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
      if (eventTimeFilter === "live_now" && e.status !== "LIVE NOW" && e.status !== "ENDING SOON" && !e.is_happening_today) {
        return false;
      }
      if (eventTimeFilter === "this_week" && !["LIVE NOW", "ENDING SOON", "THIS WEEK"].includes(e.status)) {
        return false;
      }
      if (eventTimeFilter === "upcoming" && !["UPCOMING", "THIS WEEK", "THIS MONTH"].includes(e.status)) {
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
  }, [eventsList, selectedState, eventTimeFilter, searchQuery]);

  // Handle active selection from map
  const activeHeritage = useMemo(() => {
    if (!activeHeritageId) return null;
    return heritageList.find((h) => h.id === activeHeritageId) || null;
  }, [activeHeritageId, heritageList]);

  const handleSelectHeritage = (id: number) => {
    setActiveHeritageId(id);
    const item = heritageList.find((h) => h.id === id);
    if (item) {
      recordTrailStop({
        id: item.id,
        name: item.name,
        category: item.category,
        state: item.state,
      });
    }
  };

  const handleShareHeritage = (h: any) => {
    setShareItem({
      title: h.name,
      category: h.category,
      location: `${h.district ? h.district + ", " : ""}${h.state}`,
      quoteOrDesc: h.what_makes_it_special || h.short_description || h.description,
      url: typeof window !== "undefined" ? `${window.location.origin}/heritage/${h.id}` : `/heritage/${h.id}`,
      imageUrl: h.image_url,
      tag: h.gi_tag || "Living Cultural Tradition"
    });
    setShareOpen(true);
  };

  const handleShareEvent = (ev: CulturalEventData) => {
    setShareItem({
      title: ev.title,
      category: ev.category,
      location: `${ev.venue}, ${ev.city}, ${ev.state}`,
      quoteOrDesc: ev.description,
      url: typeof window !== "undefined" ? `${window.location.origin}/map?event=${ev.event_id}` : `/map`,
      imageUrl: ev.image_url,
      tag: `Cultural Event • ${ev.status}`
    });
    setShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />

      {/* Hero Cultural Header */}
      <section className="relative border-b border-stone-800/80 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 pt-8 pb-6">
        <div className="shell space-y-5">
          {/* Breadcrumb / Heritage Trail */}
          <HeritageTrail />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dharohar Cultural Atlas</span>
                </span>
                <span className="text-xs text-stone-500">•</span>
                <span className="text-xs text-stone-400">15 Living Domains & Verified Events</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-50 tracking-tight leading-tight">
                India's Living Cultural Universe
              </h1>
              <p className="text-sm sm:text-base text-stone-400 leading-relaxed">
                Connect directly to what India looks like, tastes like, sings, weaves, builds, and celebrates across places, living practitioners, and proof.
              </p>
            </div>

            {/* Quick Metrics & View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 bg-stone-900 rounded-2xl border border-stone-800 shadow-inner">
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "map"
                      ? "bg-amber-600 text-stone-950 shadow-md"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Map Atlas</span>
                </button>
                <button
                  onClick={() => setViewMode("gallery")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "gallery"
                      ? "bg-amber-600 text-stone-950 shadow-md"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Traditions ({filteredHeritage.length})</span>
                </button>
                <button
                  onClick={() => setViewMode("events")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "events"
                      ? "bg-rose-600 text-white shadow-md"
                      : "text-stone-400 hover:text-rose-300"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Live Events ({eventsList.length})</span>
                </button>
              </div>

              {/* Around Me Shortcut Button */}
              <Link
                href="/around-me"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Heritage Around Me</span>
              </Link>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tradition, fort, food, city..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            {/* Zone Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar text-xs">
              <span className="text-stone-500 text-[11px] font-semibold uppercase shrink-0 mr-1">Zone:</span>
              {REGIONAL_ZONES.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-medium transition ${
                    selectedZone === zone
                      ? "bg-stone-100 text-stone-950 font-bold"
                      : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* 15 Cultural Domain Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {CULTURAL_DOMAINS.map((dom) => {
              const isActive = selectedCategory.toLowerCase() === dom.id.toLowerCase();
              return (
                <button
                  key={dom.id}
                  onClick={() => setSelectedCategory(dom.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-600 text-stone-950 shadow-md font-bold"
                      : "bg-stone-900 hover:bg-stone-800/80 text-stone-300 border border-stone-800"
                  }`}
                >
                  <span>{dom.icon}</span>
                  <span>{dom.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 shell py-6 space-y-6">
        {/* VIEW 1: MAP VIEW */}
        {viewMode === "map" && (
          <div className="space-y-6">
            {/* Interactive India Map */}
            <IndiaMap
              heritage={filteredHeritage}
              events={filteredEvents}
              height="620px"
              selectedState={selectedState}
              activeId={activeHeritageId}
              onSelectHeritage={handleSelectHeritage}
              onSelectState={setSelectedState}
              onSelectEvent={handleShareEvent}
            />

            {/* Quick Traditions Carousel Under Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
                  {selectedState !== "ALL" ? `${selectedState} Traditions` : "Highlighted Traditions Across India"}
                </h3>
                <span className="text-xs text-stone-400">
                  Showing {filteredHeritage.length} traditions
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredHeritage.slice(0, 8).map((h) => (
                  <VisualCultureCard
                    key={h.id}
                    item={h}
                    onShare={handleShareHeritage}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRADITIONS GALLERY */}
        {viewMode === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-400 pb-2 border-b border-stone-800">
              <span>Displaying {filteredHeritage.length} verified living traditions</span>
              <button
                onClick={() => setShowAtRiskOnly(!showAtRiskOnly)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  showAtRiskOnly
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {showAtRiskOnly ? "✓ Showing Preservation Watch Only" : "Filter: Preservation Watch"}
              </button>
            </div>

            {filteredHeritage.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Compass className="w-10 h-10 mx-auto text-stone-600" />
                <h3 className="font-serif text-xl font-bold text-stone-300">No traditions match your filters</h3>
                <p className="text-xs text-stone-500">Try selecting "All India" or clearing your search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredHeritage.map((h) => (
                  <VisualCultureCard
                    key={h.id}
                    item={h}
                    onShare={handleShareHeritage}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: LIVE CULTURAL EVENTS */}
        {viewMode === "events" && (
          <div className="space-y-6">
            {/* Live Events Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500 fill-rose-500/30" />
                <h2 className="font-serif text-xl font-bold text-stone-100">
                  What's Happening in India?
                </h2>
              </div>

              {/* Time Filters */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-2xl border border-stone-800 text-xs">
                {[
                  { id: "all", label: "All Events" },
                  { id: "live_now", label: "🔴 Live Now" },
                  { id: "this_week", label: "⚡ This Week" },
                  { id: "upcoming", label: "🗓️ Upcoming" },
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setEventTimeFilter(tf.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                      eventTimeFilter === tf.id
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Calendar className="w-10 h-10 mx-auto text-stone-600" />
                <h3 className="font-serif text-xl font-bold text-stone-300">No events found</h3>
                <p className="text-xs text-stone-500">Try changing the time filter or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    onShare={handleShareEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Drawer for interactive map browsing */}
      {viewMode === "map" && (
        <MobileHeritageSheet
          items={filteredHeritage}
          selectedItem={activeHeritage}
          onSelectItem={(id) => setActiveHeritageId(id)}
          categories={CULTURAL_DOMAINS.map((d) => ({ key: d.id, label: d.label, icon: d.icon }))}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedState={selectedState}
          onClearState={() => setSelectedState("ALL")}
        />
      )}

      {/* Social Poster Share Generator Modal */}
      <SocialShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        item={shareItem}
      />
    </div>
  );
}
