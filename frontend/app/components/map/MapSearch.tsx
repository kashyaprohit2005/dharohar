"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin, Sparkles, Utensils, Landmark } from "lucide-react";
import { geoAPI } from "@/lib/api";

interface MapSearchResult {
  query: string;
  places: Array<{ slug: string; name: string; type: string; state: string; lat: number; lon: number; zoom: number; odop?: string | null }>;
  crafts: Array<{ id: number; slug: string; title: string; district: string; category: string; verification_tier: string }>;
  food: Array<{ id: number; slug: string; title: string; district: string; category: string; verification_tier: string }>;
  monuments: Array<{ id: number; slug: string; title: string; district: string; category: string; verification_tier: string }>;
  traditions: Array<{ id: number; slug: string; title: string; district: string; category: string; verification_tier: string }>;
}

interface MapSearchProps {
  onSelectPlace: (place: { slug: string; name: string; type: string; lat: number; lon: number; zoom: number }) => void;
  onSelectItemSlug: (slug: string) => void;
}

export default function MapSearch({ onSelectPlace, onSelectItemSlug }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MapSearchResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await geoAPI.search(query.trim());
        setResults(res.data);
      } catch (err) {
        console.error("Map search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    results &&
    (results.places.length > 0 ||
      results.crafts.length > 0 ||
      results.food.length > 0 ||
      results.monuments.length > 0 ||
      results.traditions.length > 0);

  return (
    <div ref={containerRef} className="relative z-[450] w-full max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search India: Panipat, Hansi, Durrie, Monuments..."
          className="w-full pl-10 pr-9 py-2.5 bg-white/95 hover:bg-white text-stone-900 placeholder-stone-400 rounded-2xl border border-[#e7dfd5] shadow-lg backdrop-blur-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || hasResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-[#e7dfd5] rounded-2xl shadow-2xl overflow-hidden max-h-[360px] overflow-y-auto no-scrollbar text-stone-900">
          {isLoading && (
            <div className="p-4 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
              <span>Searching Dharohar Cultural Atlas...</span>
            </div>
          )}

          {!isLoading && !hasResults && (
            <div className="p-4 text-center text-xs text-stone-500">
              No matching districts or heritage found for &ldquo;{query}&rdquo;. Try searching <span className="text-sky-700 font-semibold">Panipat</span>, <span className="text-sky-700 font-semibold">Hansi</span>, or <span className="text-sky-700 font-semibold">Kurukshetra</span>.
            </div>
          )}

          {!isLoading && results && (
            <div className="p-2 space-y-3">
              {/* Places / Districts */}
              {results.places.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>Districts & Places ({results.places.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.places.map((place) => (
                      <button
                        key={`${place.type}-${place.slug}`}
                        onClick={() => {
                          onSelectPlace(place);
                          setIsOpen(false);
                          setQuery(place.name);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-sky-700 transition-colors">
                            {place.name}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {place.type} • {place.state} {place.odop ? `• ODOP: ${place.odop}` : ""}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          Fly to map →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Crafts */}
              {results.crafts.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Crafts & Textiles ({results.crafts.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.crafts.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => {
                          onSelectItemSlug(item.slug);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-sky-700">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {item.district} • {item.verification_tier.replace("_", " ")}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 group-hover:text-stone-700">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Food */}
              {results.food.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3 h-3 text-orange-600" />
                    <span>Culinary Heritage ({results.food.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.food.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => {
                          onSelectItemSlug(item.slug);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-sky-700">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {item.district}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 group-hover:text-stone-700">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monuments */}
              {results.monuments.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3 h-3 text-blue-600" />
                    <span>Monuments & Architecture ({results.monuments.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {results.monuments.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => {
                          onSelectItemSlug(item.slug);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-900 group-hover:text-sky-700">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {item.district}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 group-hover:text-stone-700">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
