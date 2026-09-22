'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { heritageAPI } from '@/lib/api';

const IndiaMap = dynamic(() => import('../components/IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-[1.5rem] bg-[#f1f0ee] flex items-center justify-center text-xs text-[#8d8d8d]">
      <span>Loading Interactive Map...</span>
    </div>
  ),
});

import HeritageCard from '../components/HeritageCard';

const CATEGORY_TABS = [
  { key: 'ALL', label: 'All Domains' },
  { key: 'RISK', label: '⚠️ Preservation Watch' },
  { key: 'craft', label: 'Crafts' },
  { key: 'textile', label: 'Textiles' },
  { key: 'food', label: 'Food & Culinary' },
  { key: 'folklore', label: 'Folklore & Epics' },
  { key: 'music', label: 'Music' },
  { key: 'dance', label: 'Dance' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'festival', label: 'Festivals' },
];

function HeritageExplorerContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'risk' ? 'RISK' : 'ALL';

  const [heritageList, setHeritageList] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialTab === 'RISK' ? 'RISK' : 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      heritageAPI.list(),
      heritageAPI.states(),
    ])
      .then(([hRes, sRes]) => {
        setHeritageList(hRes.data);
        setStates(sRes.data);
      })
      .catch((err) => console.error("Error loading heritage explorer:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHeritage = heritageList.filter(h => {
    if (selectedState && h.state.toLowerCase() !== selectedState.toLowerCase()) return false;

    if (selectedCategory === 'RISK') {
      const isAtRisk = h.preservation_status === 'PRESERVATION_WATCH' ||
        h.preservation_status === 'ENDANGERED' ||
        (h.at_risk_level && h.at_risk_level !== 'STABLE');
      if (!isAtRisk) return false;
    } else if (selectedCategory !== 'ALL') {
      if (h.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchRegion = h.region?.toLowerCase().includes(q);
      const matchState = h.state?.toLowerCase().includes(q);
      const matchDistrict = h.district?.toLowerCase().includes(q);
      const matchGI = h.gi_tag?.toLowerCase().includes(q);
      if (!matchName && !matchRegion && !matchState && !matchDistrict && !matchGI) return false;
    }

    return true;
  });

  return (
    <main className="flex-1 shell py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-semibold text-[#111111]/80 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
            National Living Heritage Registry
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111111]">
            Heritage Explorer
          </h1>
          <p className="text-sm text-[#8d8d8d] mt-2 max-w-2xl">
            Authentic Indian traditions across 9 cultural domains—crafts, textiles, culinary arts, folklore, music, dance, architecture, and festivals.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[#f1f0ee] p-1 rounded-full border border-[#e6e5e2]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              viewMode === 'grid' ? 'bg-[#0a0a0a] text-white' : 'text-[#8d8d8d] hover:text-[#111111]'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              viewMode === 'map' ? 'bg-[#0a0a0a] text-white' : 'text-[#8d8d8d] hover:text-[#111111]'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#f1f0ee]/70 border border-[#e6e5e2] mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Search traditions, districts, recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e6e5e2] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#b15f2c]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#8d8d8d] hover:text-[#111111]"
              >
                ✕
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-[#8d8d8d]">Filter State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-white border border-[#e6e5e2] text-xs rounded-xl px-3 py-2 text-[#111111] font-medium focus:outline-none focus:border-[#b15f2c]"
            >
              <option value="">All Pilot States ({heritageList.length})</option>
              {states.map(s => (
                <option key={s.state} value={s.state}>
                  {s.state} ({s.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map(cat => {
            const isRisk = cat.key === 'RISK';
            const isSelected = selectedCategory.toLowerCase() === cat.key.toLowerCase();
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? isRisk
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-[#0a0a0a] text-white shadow-sm'
                    : isRisk
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-white text-[#8d8d8d] border border-[#e6e5e2] hover:text-[#111111]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Content */}
      {loading ? (
        <div className="py-24 text-center text-sm text-[#8d8d8d]">
          Loading living heritage registry...
        </div>
      ) : filteredHeritage.length === 0 ? (
        <div className="p-12 text-center rounded-[2rem] bg-[#f1f0ee] border border-[#e6e5e2] max-w-md mx-auto my-12">
          <p className="text-sm font-semibold text-[#111111]">No traditions match your filter</p>
          <p className="text-xs text-[#8d8d8d] mt-1">Try resetting state or category filters.</p>
          <button
            onClick={() => {
              setSelectedState('');
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="space-y-4">
          <p className="text-xs text-[#8d8d8d]">
            Showing {filteredHeritage.length} traditions on interactive map
          </p>
          <IndiaMap heritage={filteredHeritage} height="600px" selectedState={selectedState} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHeritage.map((item) => (
            <HeritageCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function HeritageExplorerPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 shell py-24 text-center text-sm text-[#8d8d8d]">
          Loading Heritage Explorer...
        </div>
      }>
        <HeritageExplorerContent />
      </Suspense>
    </div>
  );
}
