"use client";

import { useEffect, useMemo, useState } from 'react';
import type { DivIcon } from 'leaflet';
import { Marker, Popup, TileLayer, MapContainer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { NORTH_MONUMENTS, Monument } from '../data/tourismData';
import { ExternalLink, Landmark, MapPin, Navigation, Search } from 'lucide-react';

function FlyTo({ monument }: { monument: Monument | null }) {
  const map = useMap();
  useEffect(() => {
    if (monument) map.flyTo([monument.lat, monument.lon], 10, { duration: 1.1 });
  }, [monument, map]);
  return null;
}

export default function TouristMap() {
  const [mounted, setMounted] = useState(false);
  const [monumentIcon, setMonumentIcon] = useState<DivIcon | null>(null);
  const [active, setActive] = useState<Monument | null>(NORTH_MONUMENTS[0]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Dynamically import Leaflet so window is guaranteed to exist
    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      const icon = new L.DivIcon({
        className: 'tourist-pin',
        html: '<div class="tourist-pin-core">◆</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });
      setMonumentIcon(icon);
    });
  }, []);

  const filtered = useMemo(
    () =>
      NORTH_MONUMENTS.filter((m) =>
        `${m.name} ${m.city} ${m.state}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  if (!mounted || !monumentIcon) {
    return (
      <div className="tourist-map-shell w-full min-h-[480px] bg-stone-900 rounded-2xl flex items-center justify-center border border-stone-800 text-stone-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
          <span className="font-serif text-sm">Initializing North India Live Atlas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tourist-map-shell">
      <div className="tourist-map-sidebar">
        <div className="map-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a monument or city"
          />
        </div>
        <div className="map-list">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m)}
              className={`map-place ${active?.id === m.id ? 'active' : ''}`}
            >
              <img src={m.image} alt="" />
              <span>
                <b>{m.name}</b>
                <small>
                  {m.city}, {m.state}
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="tourist-map-canvas">
        <MapContainer
          center={[27.5, 78.5]}
          zoom={5}
          minZoom={4}
          maxZoom={15}
          scrollWheelZoom={true}
          touchZoom={true}
          dragging={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {NORTH_MONUMENTS.map((m) => (
            <Marker
              key={m.id}
              position={[m.lat, m.lon]}
              icon={monumentIcon}
              eventHandlers={{ click: () => setActive(m) }}
            >
              <Popup>
                <div className="map-popup">
                  <img src={m.image} alt="" />
                  <div>
                    <strong>{m.name}</strong>
                    <span>
                      {m.city}, {m.state}
                    </span>
                    <p>{m.history}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lon}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open directions <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          <FlyTo monument={active} />
        </MapContainer>
        <div className="map-hint">
          <MapPin size={14} /> Touch, drag and zoom to explore North India
        </div>
      </div>
      {active && (
        <aside className="map-story">
          <div className="story-image">
            <img src={active.image} alt={active.name} />
            <span>{active.tag}</span>
          </div>
          <div className="story-copy">
            <div className="eyebrow">
              <Landmark size={14} /> Monument story
            </div>
            <h3>{active.name}</h3>
            <p className="location">
              <MapPin size={14} />
              {active.city}, {active.state}
            </p>
            <p>{active.history}</p>
            <div className="story-highlights">
              {active.highlights.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <a
              className="direction-btn"
              href={`https://www.google.com/maps/search/?api=1&query=${active.lat},${active.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={16} /> Get directions
            </a>
          </div>
        </aside>
      )}
    </div>
  );
}
