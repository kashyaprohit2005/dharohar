'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { heritageAPI } from '@/lib/api';
import HeritageCard from '../components/HeritageCard';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';

// Dynamically import map component for SSR safety
const AroundMeMap = dynamic(() => import('../components/AroundMeMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-[1.5rem] bg-[#f7f6f4] flex items-center justify-center text-sm text-[#8d8d8d] border border-[#e6e5e2]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 border-[#b15f2c] border-t-transparent animate-spin"></div>
        <span>Loading Geodesic Discovery Radar...</span>
      </div>
    </div>
  )
});

const RURAL_PRESETS = [
  { name: 'Bagru (Jaipur, Rajasthan)', lat: 26.8122, lon: 75.5447 },
  { name: 'Abhaneri (Dausa, Rajasthan)', lat: 27.0097, lon: 76.5986 },
  { name: 'Barsana (Mathura, UP)', lat: 27.6467, lon: 77.3756 },
  { name: 'Naggar (Kullu, HP)', lat: 32.1384, lon: 77.1689 },
  { name: 'Swamimalai (Thanjavur, TN)', lat: 10.9578, lon: 79.3325 },
  { name: 'Majuli (Brahmaputra, Assam)', lat: 26.9535, lon: 94.2037 },
  { name: 'Karaikudi (Chettinad, TN)', lat: 10.0673, lon: 78.7733 },
  { name: 'Varanasi (Ghats, UP)', lat: 25.3176, lon: 82.9739 },
];

const RADIUS_OPTIONS = [
  { value: 5, label: '5 km · Village / Town' },
  { value: 25, label: '25 km · Block' },
  { value: 50, label: '50 km · District' },
  { value: 100, label: '100 km · Sub-Region' },
  { value: 200, label: '200 km · Regional Corridor' },
];

const CATEGORIES = [
  { id: 'ALL', label: 'All Domains', icon: '✨' },
  { id: 'craft', label: 'Crafts', icon: '🏺' },
  { id: 'textile', label: 'Textiles', icon: '🧵' },
  { id: 'food', label: 'Food', icon: '🍲' },
  { id: 'folklore', label: 'Folklore', icon: '📜' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'dance', label: 'Dance', icon: '💃' },
  { id: 'architecture', label: 'Architecture', icon: '🏛️' },
  { id: 'festival', label: 'Festivals', icon: '🪔' },
];

export default function HeritageAroundMePage() {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locationTitle, setLocationTitle] = useState<string>('');
  const [radius, setRadius] = useState<number>(50);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Results from backend
  const [nearbyHeritage, setNearbyHeritage] = useState<any[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [hiddenHeritage, setHiddenHeritage] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [autoExpanded, setAutoExpanded] = useState<boolean>(false);
  const [expansionMessage, setExpansionMessage] = useState<string>('');
  const [effectiveRadius, setEffectiveRadius] = useState<number>(50);
  const [activeHeritageId, setActiveHeritageId] = useState<number | null>(null);

  // Story TTS state
  const [activePlayingStory, setActivePlayingStory] = useState<number | null>(null);

  // Load default location on first render (Bagru craft hub)
  useEffect(() => {
    applyLocation(26.8122, 75.5447, 'Bagru, Jaipur (Heritage Hub)');
  }, []);

  const fetchNearbyData = async (lat: number, lon: number, rad: number, cat: string) => {
    setLoading(true);
    setGeoError(null);
    try {
      const res = await heritageAPI.nearby({
        lat,
        lon,
        radius: rad,
        category: cat === 'ALL' ? undefined : cat,
        auto_expand: true
      });
      const data = res.data;
      setNearbyHeritage(data.nearby_heritage || []);
      setNearbyEvents(data.nearby_events || []);
      setHiddenHeritage(data.hidden_heritage || []);
      setStories(data.stories_from_region || []);
      setPractitioners(data.nearby_practitioners || []);
      setAutoExpanded(data.auto_expanded || false);
      setExpansionMessage(data.message || '');
      setEffectiveRadius(data.effective_radius_km || rad);
    } catch (err: any) {
      console.error('Failed to fetch nearby heritage:', err);
      setGeoError('Unable to load heritage traditions for this location. Please try another place.');
    } finally {
      setLoading(false);
    }
  };

  const applyLocation = (lat: number, lon: number, title: string) => {
    setUserCoords([lat, lon]);
    setLocationTitle(title);
    fetchNearbyData(lat, lon, radius, selectedCategory);
  };

  // Browser Geolocation Trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGeoLocating(false);
        applyLocation(lat, lon, `Your GPS Location (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`);
      },
      (error) => {
        setGeoLocating(false);
        let msg = 'Could not retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can still search any village, district, or town below!';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please select a village preset below.';
        }
        setGeoError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Manual Geocode Search
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setGeoError(null);
    try {
      const res = await heritageAPI.geocode(searchQuery.trim());
      if (res.data.found && res.data.matches.length > 0) {
        const first = res.data.matches[0];
        applyLocation(first.lat, first.lon, first.display_name);
        setSearchQuery('');
      } else {
        setGeoError(`No coordinates found for "${searchQuery}". Please try selecting one of the pilot village presets below.`);
      }
    } catch (err) {
      setGeoError('Search failed. Please select one of the suggested places.');
    } finally {
      setLoading(false);
    }
  };

  // Change radius
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userCoords) {
      fetchNearbyData(userCoords[0], userCoords[1], newRadius, selectedCategory);
    }
  };

  // Change category
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (userCoords) {
      fetchNearbyData(userCoords[0], userCoords[1], radius, cat);
    }
  };

  // Play oral story narration
  const handlePlayStory = (storyId: number, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (activePlayingStory === storyId) {
      window.speechSynthesis.cancel();
      setActivePlayingStory(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setActivePlayingStory(null);
      utterance.onerror = () => setActivePlayingStory(null);
      window.speechSynthesis.speak(utterance);
      setActivePlayingStory(storyId);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#111111] pb-24">
      <Navbar />
      {/* 1. Header Banner & Consent Statement */}
      <section className="bg-[#1c1917] text-white pt-12 pb-14 border-b border-[#292524] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#b15f2c]/20 text-[#e89d6c] border border-[#b15f2c]/40 mb-3">
                <span>📍</span>
                <span>GEODESIC HERITAGE DISCOVERY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight leading-tight">
                Heritage Around Me
              </h1>
              <p className="mt-3 text-base text-[#a8a29e] leading-relaxed">
                Discover unrepresented living culture, village crafts, folk music, regional cuisine, oral epics, and verified master practitioners rooted within reach of your current coordinates.
              </p>

              {/* Explicit Privacy & Location Consent */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#8d8d8d] bg-[#292524]/60 p-2.5 rounded-xl border border-[#3e3835] w-fit">
                <span className="text-emerald-400">🛡️</span>
                <span>
                  <strong>Privacy Assurance:</strong> Your location is used only inside your browser to calculate geodesic distances. We never store or transmit your coordinates.
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={handleUseCurrentLocation}
                disabled={geoLocating}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#b15f2c] text-white font-semibold hover:bg-[#964f24] transition shadow-md disabled:opacity-50"
              >
                {geoLocating ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Locating GPS...</span>
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/20 transition"
              >
                <span>➕</span>
                <span>Contribute Local Heritage</span>
              </Link>
            </div>
          </div>

          {/* Manual Location Search Bar & Preset Badges */}
          <div className="mt-8 pt-6 border-t border-[#292524]">
            <form onSubmit={handleSearchLocation} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3.5 text-[#8d8d8d]">🔍</span>
                <input
                  type="text"
                  placeholder="Or enter a village, district, or landmark (e.g. Bagru, Majuli, Naggar)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#292524] border border-[#3e3835] text-white text-sm placeholder-[#78716c] focus:outline-none focus:border-[#b15f2c]"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#e6e5e2] text-[#111111] font-semibold text-sm hover:bg-white transition disabled:opacity-50"
              >
                Search Place
              </button>
            </form>

            {/* Rural Location Preset Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#8d8d8d]">Quick Explore:</span>
              {RURAL_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyLocation(p.lat, p.lon, p.name)}
                  className="px-2.5 py-1 rounded-lg bg-[#292524] hover:bg-[#3e3835] text-[#d6d3d1] border border-[#3e3835] transition"
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Control Bar: Radius & Category Selection */}
      <section className="bg-white border-b border-[#e6e5e2] sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Radius Selection Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8d8d8d] shrink-0">
                Radius:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleRadiusChange(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      radius === opt.value
                        ? 'bg-[#b15f2c] text-white shadow-xs'
                        : 'bg-[#f5f4f0] text-[#555] hover:bg-[#e6e5e2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Location Indicator */}
            <div className="text-xs text-[#555] flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Center: <strong>{locationTitle}</strong></span>
            </div>
          </div>

          {/* Cultural Domain Filter Pills */}
          <div className="mt-3 pt-3 border-t border-[#f1f0ee] flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#111111] text-white'
                    : 'bg-white border border-[#e6e5e2] text-[#666] hover:border-[#b15f2c]/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Error Notification */}
        {geoError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Notice</p>
              <p className="text-xs text-rose-800 mt-0.5">{geoError}</p>
            </div>
          </div>
        )}

        {/* Auto Expansion Notice (Rural Smart Discovery) */}
        {autoExpanded && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <span className="text-lg">📡</span>
            <div className="flex-1">
              <p className="font-semibold">Rural Range Auto-Expanded</p>
              <p className="text-xs text-amber-800 mt-0.5">{expansionMessage}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200/80 text-amber-900">
              {effectiveRadius} km
            </span>
          </div>
        )}

        {/* 3. Interactive Radar Map */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#111111] flex items-center gap-2">
                <span>🗺️</span>
                <span>Geodesic Living Radar</span>
              </h2>
              <p className="text-xs text-[#8d8d8d]">
                Dashed circle shows your {effectiveRadius} km discovery boundary. Click any marker to view heritage details.
              </p>
            </div>
            <span className="text-xs font-bold text-[#b15f2c] bg-[#b15f2c]/10 px-3 py-1 rounded-full">
              {nearbyHeritage.length} Traditions in Radius
            </span>
          </div>

          <AroundMeMap
            userLocation={userCoords}
            radiusKm={effectiveRadius}
            items={nearbyHeritage}
            practitioners={practitioners}
            activeId={activeHeritageId}
            onSelectItem={(id) => setActiveHeritageId(id)}
            height="480px"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-[#b15f2c] border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-base font-serif font-bold text-[#111111]">Scanning Cultural Landscape...</p>
            <p className="text-xs text-[#8d8d8d] mt-1">Calculating geodesic distances across rural and regional registries.</p>
          </div>
        ) : (
          <>
            {/* 4. Heritage Near You (Primary Grid) */}
            <section className="mb-14">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#111111]">
                    Heritage Near You
                  </h2>
                  <p className="text-xs text-[#8d8d8d] mt-0.5">
                    Ranked strictly by calculated geodesic distance from your location.
                  </p>
                </div>
                <span className="text-xs text-[#666]">
                  Showing <strong>{nearbyHeritage.length}</strong> living traditions
                </span>
              </div>

              {nearbyHeritage.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-[#e6e5e2] text-center max-w-xl mx-auto">
                  <div className="text-4xl mb-3">🧭</div>
                  <h3 className="text-lg font-bold text-[#111111] mb-1">No Traditions Found in This Range</h3>
                  <p className="text-xs text-[#8d8d8d] leading-relaxed mb-4">
                    Try expanding the radius to 100 km or 200 km, or select a nearby heritage hub to explore traditions in this cultural zone.
                  </p>
                  <button
                    onClick={() => handleRadiusChange(100)}
                    className="px-4 py-2 rounded-full bg-[#b15f2c] text-white text-xs font-semibold hover:bg-[#964f24]"
                  >
                    Expand to 100 km
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyHeritage.map((item) => (
                    <HeritageCard
                      key={item.id}
                      item={item}
                      isSelected={activeHeritageId === item.id}
                      onSelect={() => setActiveHeritageId(item.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* 5. Hidden & Endangered Heritage Near You */}
            {hiddenHeritage.length > 0 && (
              <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#faf6f0] to-[#f4ebe1] border border-[#ebd8c8]">
                <div className="max-w-3xl mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/60 text-amber-900 border border-amber-300 mb-2">
                    <span>⚠️</span>
                    <span>PRESERVATION PRIORITY</span>
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-[#111111]">
                    Hidden Heritage Near You
                  </h2>
                  <p className="text-xs text-[#666] mt-1 leading-relaxed">
                    Traditions in this region facing limited documentation, generational decline, or community-led revival. Discover and support these cultural roots before they fade.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hiddenHeritage.map((hh) => (
                    <div
                      key={`hidden-${hh.id}`}
                      className="p-5 rounded-2xl bg-white/95 border border-[#e8d5c4] shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                            {hh.preservation_status || 'Watch List'}
                          </span>
                          <span className="text-[11px] font-bold text-[#b15f2c]">
                            🧭 {hh.distance_km} km away
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#111111] mb-1">
                          {hh.name}
                        </h4>
                        <p className="text-xs text-[#777] mb-2">
                          {hh.village ? `${hh.village}, ` : ''}{hh.district || hh.region} · {hh.state}
                        </p>
                        <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                          {hh.short_description || hh.description}
                        </p>
                        {hh.at_risk_reason && (
                          <div className="mt-2.5 p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900 italic">
                            &quot;{hh.at_risk_reason}&quot;
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#f1f0ee] flex items-center justify-between text-xs">
                        <span className="text-[#8d8d8d]">
                          {hh.evidence_count} Verified Citation(s)
                        </span>
                        <Link
                          href={`/heritage/${hh.id}`}
                          className="font-bold text-[#b15f2c] hover:underline"
                        >
                          View Full Evidence →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Live Cultural Events Near You */}
            {nearbyEvents.length > 0 && (
              <section className="mb-14">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-[#111111] flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
                      <span>Live Cultural Events Near You</span>
                    </h2>
                    <p className="text-xs text-[#8d8d8d] mt-0.5">
                      Fairs, festivals, exhibitions, and ceremonies happening within discovery radius.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {nearbyEvents.length} Active Events
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nearbyEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} />
                  ))}
                </div>
              </section>
            )}

            {/* 6. Stories From This Region (Oral Lore Narration) */}
            {stories.length > 0 && (
              <section className="mb-14">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold font-serif text-[#111111] flex items-center gap-2">
                    <span>🎙️</span>
                    <span>Stories From This Region</span>
                  </h2>
                  <p className="text-xs text-[#8d8d8d] mt-0.5">
                    Centuries-old oral legends, myths, and folklore narrated by regional communities. Tap to listen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stories.map((s) => {
                    const isPlaying = activePlayingStory === s.heritage_id;
                    return (
                      <div
                        key={`story-${s.heritage_id}`}
                        className="p-5 rounded-2xl bg-white border border-[#e6e5e2] flex flex-col justify-between shadow-xs hover:border-[#b15f2c]/50 transition"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                            <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              Oral Lore · {s.category}
                            </span>
                            <span className="font-bold text-[#b15f2c] text-[11px]">
                              🧭 {s.distance_km} km away
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-[#111111] mb-1">
                            {s.name}
                          </h4>
                          <p className="text-xs text-[#8d8d8d] mb-3">
                            📍 {s.location}
                          </p>

                          <div className="p-3 rounded-xl bg-[#faf9f7] border border-[#f1f0ee] text-xs text-[#444] italic leading-relaxed line-clamp-4">
                            &quot;{s.story_text}&quot;
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#f1f0ee] flex items-center justify-between gap-2">
                          <button
                            onClick={() => handlePlayStory(s.heritage_id, `${s.name}. Story from ${s.location}. ${s.story_text}`)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                              isPlaying
                                ? 'bg-purple-600 text-white animate-pulse'
                                : 'bg-[#f5f4f0] text-[#111111] hover:bg-[#b15f2c] hover:text-white'
                            }`}
                          >
                            <span>{isPlaying ? '⏹ Pause Narration' : '🔊 Listen Story'}</span>
                          </button>

                          <Link
                            href={`/heritage/${s.heritage_id}`}
                            className="text-xs font-semibold text-[#b15f2c] hover:underline"
                          >
                            Read Passport →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 7. People Keeping It Alive (Verified Practitioners & Workshops) */}
            <section className="mb-14">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#111111] flex items-center gap-2">
                    <span>🧑‍🎨</span>
                    <span>People Keeping It Alive</span>
                  </h2>
                  <p className="text-xs text-[#8d8d8d] mt-0.5">
                    Hereditary master practitioners and cultural guardians practicing in your immediate area.
                  </p>
                </div>
                <span className="text-xs text-[#666]">
                  {practitioners.length} Practitioner(s) Nearby
                </span>
              </div>

              {practitioners.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-[#e6e5e2] text-center">
                  <p className="text-sm text-[#8d8d8d]">
                    No registered practitioners recorded yet in this immediate radius.
                  </p>
                  <p className="text-xs text-[#b15f2c] mt-1 font-semibold">
                    Are you a practitioner in this area? Register your practice or submit a workshop to be discovered!
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <Link
                      href="/artisan-portal"
                      className="px-4 py-2 rounded-full bg-[#b15f2c] text-white text-xs font-semibold hover:bg-[#964f24]"
                    >
                      Practitioner Registration →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {practitioners.map((p) => (
                    <div
                      key={`practitioner-${p.id}`}
                      className="p-5 rounded-2xl bg-white border border-[#e6e5e2] flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Verified Practitioner
                          </span>
                          <span className="text-xs font-bold text-[#b15f2c]">
                            🧭 {p.distance_km} km away
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[#111111] mb-0.5">
                          {p.full_name}
                        </h4>
                        <p className="text-xs text-[#666] font-medium mb-1">
                          Master of {p.craft} ({p.experience_years} years experience)
                        </p>
                        <p className="text-xs text-[#8d8d8d] mb-3">
                          📍 {p.locality || p.district}, {p.state}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#f1f0ee] flex items-center justify-between text-xs">
                        <span className="text-[#8d8d8d] text-[11px]">
                          ID: {p.craftproof_id}
                        </span>
                        <Link
                          href="/workshops"
                          className="px-3 py-1.5 rounded-lg bg-[#b15f2c] text-white font-semibold hover:bg-[#964f24] transition text-[11px]"
                        >
                          Request Workshop →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 8. Callout Banner: "Know a local tradition not here? + Contribute" */}
            <section className="rounded-3xl bg-[#1c1917] text-white p-8 sm:p-10 border border-[#292524] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="max-w-2xl">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#b15f2c]/20 text-[#e89d6c] border border-[#b15f2c]/40 inline-block mb-3">
                  COMMUNITY HERITAGE MAPPING
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif">
                  Know a Local Tradition Not on the Map?
                </h3>
                <p className="mt-2 text-sm text-[#a8a29e] leading-relaxed">
                  Every village and district in India preserves unique songs, culinary practices, sacred groves, weave patterns, and folklore that official registries haven&apos;t yet recorded. Submit your local heritage for peer review and inclusion in the National Living Heritage Atlas.
                </p>
              </div>

              <Link
                href="/contribute"
                className="shrink-0 px-6 py-3.5 rounded-full bg-[#b15f2c] hover:bg-[#964f24] text-white font-semibold transition shadow-md flex items-center gap-2"
              >
                <span>➕</span>
                <span>Contribute Local Heritage</span>
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
