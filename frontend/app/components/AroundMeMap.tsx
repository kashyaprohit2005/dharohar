'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCategoryColor, getCategoryIcon } from './IndiaMap';

interface AroundMeMapProps {
  userLocation: [number, number] | null;
  radiusKm: number;
  items: any[];
  practitioners?: any[];
  activeId?: number | null;
  onSelectItem?: (id: number) => void;
  height?: string;
}

function MapViewController({
  userLocation,
  radiusKm,
  activeId,
  items
}: {
  userLocation: [number, number] | null;
  radiusKm: number;
  activeId?: number | null;
  items: any[];
}) {
  const map = useMap();

  useEffect(() => {
    if (activeId && items.length > 0) {
      const active = items.find(i => i.id === activeId);
      if (active && active.lat && active.lon) {
        map.flyTo([active.lat, active.lon], 11, { duration: 1.2 });
        return;
      }
    }

    if (userLocation) {
      // Calculate appropriate zoom based on radius
      let zoom = 11;
      if (radiusKm <= 10) zoom = 12;
      else if (radiusKm <= 30) zoom = 10.5;
      else if (radiusKm <= 60) zoom = 9.5;
      else if (radiusKm <= 120) zoom = 8.5;
      else zoom = 7.5;

      map.flyTo(userLocation, zoom, { duration: 1.2 });
    }
  }, [userLocation, radiusKm, activeId, items, map]);

  return null;
}

export default function AroundMeMap({
  userLocation,
  radiusKm,
  items = [],
  practitioners = [],
  activeId,
  onSelectItem,
  height = '520px'
}: AroundMeMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-[1.5rem] bg-[#f7f6f4] flex items-center justify-center text-sm text-[#8d8d8d] border border-[#e6e5e2]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full border-2 border-[#b15f2c] border-t-transparent animate-spin"></div>
          <span className="font-serif">Initializing Geodesic Radar Map...</span>
        </div>
      </div>
    );
  }

  const center: [number, number] = userLocation || [26.8122, 75.5447]; // default Bagru/Jaipur

  return (
    <div style={{ height }} className="w-full relative rounded-[1.5rem] overflow-hidden border border-[#e6e5e2] shadow-sm">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapViewController
          userLocation={userLocation}
          radiusKm={radiusKm}
          activeId={activeId}
          items={items}
        />

        {/* User Location Radar Marker & Radius Boundary */}
        {userLocation && (
          <>
            {/* Search Radius Circle */}
            <Circle
              center={userLocation}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#b15f2c',
                fillColor: '#b15f2c',
                fillOpacity: 0.04,
                weight: 1.5,
                dashArray: '6, 6'
              }}
            />

            {/* Pulsing User Radar Ring */}
            <CircleMarker
              center={userLocation}
              radius={18}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                weight: 1
              }}
            />

            {/* User Center Pin */}
            <CircleMarker
              center={userLocation}
              radius={8}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#2563eb',
                fillOpacity: 1,
                weight: 3
              }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <div className="font-bold text-[#111111] flex items-center gap-1 mb-1">
                    <span>📍</span> Your Search Location
                  </div>
                  <p className="text-[11px] text-[#666666]">
                    Coordinates: {userLocation[0].toFixed(4)}°N, {userLocation[1].toFixed(4)}°E
                  </p>
                  <div className="mt-1 text-[10px] font-semibold text-[#b15f2c]">
                    Discovery Radius: {radiusKm} km
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* Nearby Living Heritage Markers */}
        {items.map((item) => {
          if (!item.lat || !item.lon) return null;
          const isSelected = activeId === item.id;
          const color = getCategoryColor(item.category);
          const icon = getCategoryIcon(item.category);
          const isAtRisk =
            item.preservation_status === 'PRESERVATION_WATCH' ||
            item.preservation_status === 'ENDANGERED' ||
            (item.at_risk_level && item.at_risk_level !== 'STABLE');

          return (
            <CircleMarker
              key={`h-${item.id}`}
              center={[item.lat, item.lon]}
              radius={isSelected ? 12 : isAtRisk ? 9 : 8}
              pathOptions={{
                color: isSelected ? '#111111' : isAtRisk ? '#b45309' : color,
                fillColor: color,
                fillOpacity: isSelected ? 1 : 0.85,
                weight: isSelected ? 3.5 : isAtRisk ? 2.5 : 1.5
              }}
              eventHandlers={{
                click: () => {
                  if (onSelectItem) onSelectItem(item.id);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <div className="text-[11px] font-semibold flex items-center gap-1 text-[#111111]">
                  <span>{icon}</span>
                  <span>{item.name}</span>
                  {item.distance_km !== undefined && (
                    <span className="text-[#b15f2c] font-bold">({item.distance_km} km)</span>
                  )}
                </div>
              </Tooltip>

              <Popup>
                <div className="p-1 min-w-[220px] max-w-[270px]">
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] flex items-center gap-1">
                      <span>{icon}</span>
                      <span>{item.category}</span>
                    </span>
                    {item.distance_km !== undefined && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#b15f2c]/10 text-[#b15f2c]">
                        {item.distance_km} km away
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-[#111111] leading-tight mb-1">
                    {item.name}
                  </h4>

                  <p className="text-[11px] text-[#666666] line-clamp-2 mb-2 leading-relaxed">
                    {item.short_description || item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f1f0ee] text-[11px]">
                    <span className="text-[#8d8d8d]">
                      {item.village ? `${item.village}, ` : ''}{item.district || item.region}
                    </span>
                    <Link
                      href={`/heritage/${item.id}`}
                      className="font-semibold text-[#b15f2c] hover:underline"
                    >
                      View Passport →
                    </Link>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Nearby Living Practitioners Markers */}
        {practitioners.map((p) => {
          if (!p.lat || !p.lon) return null;
          return (
            <CircleMarker
              key={`p-${p.id}`}
              center={[p.lat, p.lon]}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#9333ea', // purple for practitioner
                fillOpacity: 0.95,
                weight: 2
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                <div className="text-[11px] font-medium flex items-center gap-1 text-purple-900">
                  <span>🧑‍🎨</span>
                  <span>{p.full_name} ({p.craft})</span>
                </div>
              </Tooltip>

              <Popup>
                <div className="p-1 min-w-[210px] max-w-[250px]">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      Verified Practitioner
                    </span>
                    {p.distance_km !== undefined && (
                      <span className="text-[10px] font-bold text-[#b15f2c]">
                        {p.distance_km} km away
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] mb-0.5">
                    {p.full_name}
                  </h4>
                  <p className="text-[11px] text-[#666666] mb-1">
                    Master of {p.craft} ({p.experience_years} yrs exp)
                  </p>
                  <p className="text-[10px] text-[#8d8d8d] mb-2">
                    Locality: {p.locality || p.district || p.state}
                  </p>
                  {p.open_workshops_count > 0 ? (
                    <Link
                      href={`/workshops`}
                      className="inline-block w-full text-center py-1 rounded bg-[#b15f2c] text-white text-[10px] font-semibold hover:bg-[#964f24]"
                    >
                      Request Workshop →
                    </Link>
                  ) : (
                    <span className="text-[10px] text-[#8d8d8d] italic">
                      ID: {p.craftproof_id}
                    </span>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#e6e5e2] text-[10px] shadow-sm z-[1000] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></div>
          <span className="font-medium text-[#444]">Your Location</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#059669]"></div>
          <span className="font-medium text-[#444]">Craft / Tradition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9333ea]"></div>
          <span className="font-medium text-[#444]">Practitioner</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full border border-amber-600 bg-amber-100"></div>
          <span className="font-medium text-[#444]">Watch List</span>
        </div>
      </div>
    </div>
  );
}
