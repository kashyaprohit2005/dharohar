"use client";

import { useMemo, useCallback } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import L, { PathOptions, Layer } from "leaflet";
import { GeoState } from "./mapTypes";

interface IndiaStateLayerProps {
  geoJsonData: any;
  statesRegistry: GeoState[];
  selectedStateCode: string | null;
  onSelectState: (state: GeoState) => void;
  visible: boolean;
  showLabels?: boolean;
}

// Curated Heritage Pigment Palette — Inspired by Indian manuscripts, textiles & temple frescoes
// Terracotta, saffron, deep indigo, peacock teal, muted emerald, mustard, sandstone, rose, plum, copper, maroon, antique gold
const STATE_HERITAGE_PALETTE: Record<string, { fill: string; border: string }> = {
  "IN-AP": { fill: "#7c2d12", border: "#f97316" }, // Terracotta / Kalamkari
  "IN-AR": { fill: "#065f46", border: "#34d399" }, // Rainforest Emerald
  "IN-AS": { fill: "#a16207", border: "#fbbf24" }, // Golden Muga Mustard
  "IN-BR": { fill: "#9a3412", border: "#fb923c" }, // Madhubani Terracotta Red
  "IN-CT": { fill: "#854d0e", border: "#fde047" }, // Bell Metal Bronze
  "IN-GA": { fill: "#0e7490", border: "#38bdf8" }, // Konkan Peacock Teal
  "IN-GJ": { fill: "#c2410c", border: "#fdba74" }, // Patola Vermilion / Saffron
  "IN-HR": { fill: "#d97706", border: "#fde047" }, // Vedic Golden Ochre (Pilot State)
  "IN-HP": { fill: "#1e3a8a", border: "#60a5fa" }, // Himalayan Deep Sapphire
  "IN-JH": { fill: "#78350f", border: "#fbbf24" }, // Dokra Antique Bronze
  "IN-KA": { fill: "#701a75", border: "#f472b6" }, // Mysore Royal Plum
  "IN-KL": { fill: "#047857", border: "#6ee7b7" }, // Malabar Muted Emerald
  "IN-MP": { fill: "#b45309", border: "#fcd34d" }, // Khajuraho Sandstone Buff
  "IN-MH": { fill: "#881337", border: "#fb7185" }, // Paithani Deep Maroon
  "IN-MN": { fill: "#831843", border: "#f472b6" }, // Lotus Rose
  "IN-ML": { fill: "#115e59", border: "#2dd4bf" }, // Living Root Deep Teal
  "IN-MZ": { fill: "#991b1b", border: "#f87171" }, // Puan Scarlet
  "IN-NL": { fill: "#9a3412", border: "#fb923c" }, // Naga Warrior Ochre
  "IN-OR": { fill: "#7c2d12", border: "#fb923c" }, // Konark Sandstone Terracotta
  "IN-PB": { fill: "#ea580c", border: "#fde047" }, // Phulkari Bright Saffron
  "IN-RJ": { fill: "#ca8a04", border: "#fef08a" }, // Thar Antique Gold
  "IN-SK": { fill: "#1d4ed8", border: "#93c5fd" }, // Kanchenjunga Lapis Blue
  "IN-TN": { fill: "#831843", border: "#f472b6" }, // Kanchipuram Madder Rose
  "IN-TG": { fill: "#312e81", border: "#818cf8" }, // Pochampally Deep Indigo
  "IN-TR": { fill: "#0f766e", border: "#5eead4" }, // Cane Bamboo Teal
  "IN-UP": { fill: "#701a75", border: "#e879f9" }, // Banarasi Imperial Plum
  "IN-UT": { fill: "#1e3a8a", border: "#93c5fd" }, // Garhwal Indigo
  "IN-WB": { fill: "#9a3412", border: "#f87171" }, // Bishnupur Terracotta Crimson
  // 8 Union Territories
  "IN-AN": { fill: "#0f766e", border: "#2dd4bf" }, // Bay of Bengal Teal
  "IN-CH": { fill: "#0369a1", border: "#38bdf8" }, // Modernist Cerulean
  "IN-DH": { fill: "#78350f", border: "#fbbf24" }, // Daman Bronze
  "IN-DL": { fill: "#881337", border: "#fb7185" }, // Red Fort Sandstone Maroon
  "IN-JK": { fill: "#4338ca", border: "#a5b4fc" }, // Kashmiri Pashmina Cobalt
  "IN-LA": { fill: "#1e40af", border: "#60a5fa" }, // Ladakh Mountain Sapphire
  "IN-LD": { fill: "#0d9488", border: "#5eead4" }, // Coral Atoll Turquoise
  "IN-PY": { fill: "#9d174d", border: "#f472b6" }, // French Colonial Rose
};

// Default fallback palette if code not matched
const DEFAULT_HERITAGE_COLOR = { fill: "#78350f", border: "#d97706" };

export default function IndiaStateLayer({
  geoJsonData,
  statesRegistry,
  selectedStateCode,
  onSelectState,
  visible,
  showLabels = true,
}: IndiaStateLayerProps) {
  const statesMap = useMemo(() => {
    const map = new Map<string, GeoState>();
    statesRegistry.forEach((s) => {
      map.set(s.code, s);
    });
    return map;
  }, [statesRegistry]);

  const styleFunction = useCallback(
    (feature: any): PathOptions => {
      if (!feature || !feature.properties) {
        return {
          fillColor: "#292524",
          weight: 1,
          opacity: 0.8,
          color: "#78716c",
          fillOpacity: 0.55,
        };
      }

      const code = feature.properties.code;
      const isSelected = selectedStateCode === code;
      const isHaryana = code === "IN-HR";
      const palette = STATE_HERITAGE_PALETTE[code] || DEFAULT_HERITAGE_COLOR;

      if (isSelected) {
        return {
          fillColor: palette.fill,
          weight: 3.5,
          opacity: 1,
          color: "#0284c7", // Glowing cyan highlight border
          fillOpacity: 0.92,
        };
      }

      if (isHaryana) {
        return {
          fillColor: "#d97706",
          weight: 2.5,
          opacity: 1,
          color: "#ffffff",
          fillOpacity: 0.82,
        };
      }

      return {
        fillColor: palette.fill,
        weight: 1.2,
        opacity: 0.9,
        color: "#ffffff",
        fillOpacity: 0.76,
      };
    },
    [selectedStateCode]
  );

  const onEachFeature = useCallback(
    (feature: any, layer: Layer) => {
      if (!feature || !feature.properties) return;
      const code = feature.properties.code;
      const stateObj = statesMap.get(code);
      const name = stateObj?.name || feature.properties.name || "State";
      const tagline = stateObj?.tagline || "";
      const isDeep = stateObj?.is_demo_deep;
      const palette = STATE_HERITAGE_PALETTE[code] || DEFAULT_HERITAGE_COLOR;

      // Rich cultural tooltip
      layer.bindTooltip(
        `
        <div style="
          padding: 10px 12px;
          font-family: Georgia, serif;
          background: #ffffff;
          border: 1px solid #e7dfd5;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          color: #1c1917;
          max-width: 260px;
          text-align: left;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <strong style="font-size: 14px; color: #0f172a; letter-spacing: 0.2px;">${name}</strong>
            ${
              isDeep
                ? `<span style="font-size: 9px; font-weight: 700; background: #0284c7; color: #ffffff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-family: sans-serif;">Active Pilot</span>`
                : `<span style="font-size: 9px; color: #64748b; font-family: sans-serif; font-weight: 600;">${stateObj?.zone || "India"}</span>`
            }
          </div>
          ${
            tagline
              ? `<p style="font-size: 11px; color: #44403c; margin: 4px 0; line-height: 1.35; font-style: italic;">&ldquo;${tagline}&rdquo;</p>`
              : ""
          }
          <div style="font-size: 10px; color: #0284c7; margin-top: 6px; font-family: sans-serif; font-weight: 700;">
            ${isDeep ? "Tap to explore 23 Haryana districts →" : "Tap to open state dossier →"}
          </div>
        </div>
        `,
        {
          sticky: true,
          direction: "auto",
          className: "dharohar-state-tooltip",
          opacity: 0.98,
        }
      );

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            weight: 3,
            color: "#fde047",
            fillOpacity: 0.88,
          });
          if (l.bringToFront) {
            l.bringToFront();
          }
        },
        mouseout: (e) => {
          const l = e.target;
          const isSelected = selectedStateCode === code;
          const isHaryana = code === "IN-HR";
          l.setStyle({
            weight: isSelected ? 3.5 : isHaryana ? 2.8 : 1.2,
            color: isSelected ? "#fde047" : isHaryana ? "#fde047" : palette.border,
            fillOpacity: isSelected ? 0.85 : isHaryana ? 0.75 : 0.6,
          });
        },
        click: () => {
          if (stateObj) {
            onSelectState(stateObj);
          } else {
            onSelectState({
              code,
              name,
              zone: "Central",
              center: [22.8, 79.5],
              zoom: 7,
              tagline: "",
              is_demo_deep: isDeep || false,
            });
          }
        },
      });
    },
    [statesMap, onSelectState, selectedStateCode]
  );

  // Generate State text labels for the map
  const stateLabels = useMemo(() => {
    if (!showLabels || !statesRegistry.length) return [];
    return statesRegistry.map((s) => {
      const isSelected = selectedStateCode === s.code;
      const isPilot = s.code === "IN-HR";

      const labelHtml = `
        <div style="
          font-family: 'Times New Roman', Georgia, serif;
          font-size: ${isPilot ? "13px" : "11px"};
          font-weight: ${isPilot ? "800" : "600"};
          color: ${isSelected ? "#fde047" : isPilot ? "#fde047" : "#fef3c7"};
          text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.9), 0 0 2px #000;
          letter-spacing: 0.4px;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          text-align: center;
        ">
          ${s.name}
          ${isPilot ? `<span style="display: block; font-size: 8px; font-family: sans-serif; font-weight: 700; color: #fde047; text-transform: uppercase; letter-spacing: 0.8px;">★ Living Pilot</span>` : ""}
        </div>
      `;

      const icon = L.divIcon({
        html: labelHtml,
        className: "dharohar-state-label-marker",
        iconSize: [120, 24],
        iconAnchor: [60, 12],
      });

      return {
        code: s.code,
        center: s.center,
        icon,
      };
    });
  }, [showLabels, statesRegistry, selectedStateCode]);

  if (!visible || !geoJsonData) return null;

  return (
    <>
      <GeoJSON
        key={`india-states-${selectedStateCode || "none"}`}
        data={geoJsonData}
        style={styleFunction}
        onEachFeature={onEachFeature}
      />
      {/* State Labels overlay */}
      {stateLabels.map((lbl) => (
        <Marker
          key={`lbl-${lbl.code}`}
          position={lbl.center}
          icon={lbl.icon}
          interactive={false}
        />
      ))}
    </>
  );
}
