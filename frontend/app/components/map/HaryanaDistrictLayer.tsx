"use client";

import { useMemo, useCallback } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import L, { PathOptions, Layer } from "leaflet";
import { GeoDistrict } from "./mapTypes";

interface HaryanaDistrictLayerProps {
  geoJsonData: any;
  districtsList: GeoDistrict[];
  selectedDistrictSlug: string | null;
  onSelectDistrict: (district: GeoDistrict) => void;
  visible: boolean;
  showLabels?: boolean;
}

// Coordinated heritage palette for Haryana districts
const DISTRICT_PALETTE: Record<string, { fill: string; border: string }> = {
  "hr-panipat": { fill: "#b45309", border: "#fde047" }, // Handloom & Durrie Gold
  "hr-hansi": { fill: "#78350f", border: "#fbbf24" },   // 23rd District Asigarh Fort Ochre
  "hr-hisar": { fill: "#854d0e", border: "#f59e0b" },   // Firoz Shah Sandstone
  "hr-kurukshetra": { fill: "#9a3412", border: "#f97316" }, // Gita Janmasthali Terracotta
  "hr-rewari": { fill: "#854d0e", border: "#fbbf24" },  // Brass & Tilledari Bronze
  "hr-rohtak": { fill: "#7c2d12", border: "#f97316" },  // Gajak & Revadi Warm Terracotta
  "hr-ambala": { fill: "#0f766e", border: "#2dd4bf" },  // Scientific Instruments Teal
  "hr-karnal": { fill: "#065f46", border: "#34d399" },  // Rice & Agriculture Emerald
  "hr-sonipat": { fill: "#881337", border: "#fb7185" },  // Dhabas & Monuments Maroon
  "hr-gurugram": { fill: "#1e3a8a", border: "#60a5fa" }, // Heritage Shrines & Tech Cobalt
  "hr-faridabad": { fill: "#701a75", border: "#f472b6" },// Surajkund Craft Fair Plum
  "hr-bhiwani": { fill: "#a16207", border: "#fcd34d" },  // Charkhi Dadri Gateway Mustard
  "hr-fatehabad": { fill: "#78350f", border: "#fbbf24" },// Kunal Indus Mound Bronze
  "hr-jind": { fill: "#9a3412", border: "#fb923c" },    // Heart of Haryana Terracotta
  "hr-jhajjar": { fill: "#b45309", border: "#fde047" }, // Clay Pottery & Bhindawas
  "hr-kaithal": { fill: "#7c2d12", border: "#f97316" }, // Razia Sultana Tomb
  "hr-mahendragarh": { fill: "#854d0e", border: "#f59e0b" }, // Dhosi Hill & Madhogarh Fort
  "hr-nuh": { fill: "#115e59", border: "#5eead4" },      // Mewat Sheikh Musa
  "hr-palwal": { fill: "#881337", border: "#fb7185" },  // Panchvati Temple & Gandhiji Ashram
  "hr-panchkula": { fill: "#1e40af", border: "#93c5fd" },// Pinjore Gardens & Morni Hills
  "hr-sirsa": { fill: "#a16207", border: "#fde047" },   // Sarsuti Riverbed Heritage
  "hr-yamunanagar": { fill: "#047857", border: "#6ee7b7" }, // Kapal Mochan & Sugh Emerald
  "hr-charkhi-dadri": { fill: "#78350f", border: "#fbbf24" }, // Shampur Stone & Folk Lore
};

const DEFAULT_DIST_COLOR = { fill: "#854d0e", border: "#f59e0b" };

export default function HaryanaDistrictLayer({
  geoJsonData,
  districtsList,
  selectedDistrictSlug,
  onSelectDistrict,
  visible,
  showLabels = true,
}: HaryanaDistrictLayerProps) {
  const districtsMap = useMemo(() => {
    const map = new Map<string, GeoDistrict>();
    districtsList.forEach((d) => {
      map.set(d.slug.toLowerCase(), d);
    });
    return map;
  }, [districtsList]);

  const styleFunction = useCallback(
    (feature: any): PathOptions => {
      if (!feature || !feature.properties) {
        return {
          fillColor: "#1c1917",
          weight: 1.5,
          opacity: 0.85,
          color: "#78716c",
          fillOpacity: 0.55,
        };
      }

      const slug = (feature.properties.slug || "").toLowerCase();
      const isSelected = selectedDistrictSlug?.toLowerCase() === slug;
      const isHansi = slug === "hr-hansi";
      const isPanipat = slug === "hr-panipat";
      const palette = DISTRICT_PALETTE[slug] || DEFAULT_DIST_COLOR;

      if (isSelected) {
        return {
          fillColor: palette.fill,
          weight: 3.5,
          opacity: 1,
          color: "#0284c7", // Glowing cyan highlight outline
          fillOpacity: 0.92,
        };
      }

      if (isHansi) {
        return {
          fillColor: palette.fill,
          weight: 2.5,
          opacity: 1,
          color: "#0284c7",
          dashArray: "4, 3", // Distinct dotted border indicating newly constituted 23rd district
          fillOpacity: 0.78,
        };
      }

      if (isPanipat) {
        return {
          fillColor: palette.fill,
          weight: 2.5,
          opacity: 1,
          color: "#ffffff",
          fillOpacity: 0.82,
        };
      }

      return {
        fillColor: palette.fill,
        weight: 1.5,
        opacity: 0.9,
        color: "#ffffff",
        fillOpacity: 0.75,
      };
    },
    [selectedDistrictSlug]
  );

  const onEachFeature = useCallback(
    (feature: any, layer: Layer) => {
      if (!feature || !feature.properties) return;
      const slug = (feature.properties.slug || "").toLowerCase();
      const distObj = districtsMap.get(slug);
      const name = distObj?.name || feature.properties.name || "District";
      const hq = distObj?.headquarters || feature.properties.headquarters || name;
      const odop = distObj?.odop_product;
      const odopStatus = distObj?.odop_status;
      const isHansi = slug === "hr-hansi";
      const palette = DISTRICT_PALETTE[slug] || DEFAULT_DIST_COLOR;

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
          max-width: 270px;
          text-align: left;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px;">
            <strong style="font-size: 14px; color: #0f172a; letter-spacing: 0.2px;">${name}</strong>
            ${
              isHansi
                ? `<span style="font-size: 9px; font-weight: 700; background: #0284c7; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-family: sans-serif;">23rd District (2025)</span>`
                : `<span style="font-size: 10px; color: #64748b; font-family: sans-serif; font-weight: 600;">HQ: ${hq}</span>`
            }
          </div>
          ${
            odop
              ? `<div style="font-size: 11px; color: #334155; margin: 4px 0 2px 0; font-family: sans-serif;">
                  <span style="color: #0284c7; font-weight: 600;">ODOP:</span> ${odop}
                 </div>`
              : odopStatus === "PENDING_SOURCE"
              ? `<div style="font-size: 10px; color: #64748b; margin: 4px 0 2px 0; font-style: italic; font-family: sans-serif;">
                  ODOP: Gazette Notification Pending
                 </div>`
              : ""
          }
          <div style="font-size: 10px; color: #0284c7; margin-top: 6px; font-family: sans-serif; font-weight: 700;">
            Tap to open district dossier & cultural records →
          </div>
        </div>
        `,
        {
          sticky: true,
          direction: "auto",
          className: "dharohar-district-tooltip",
          opacity: 0.98,
        }
      );

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({
            weight: 3.5,
            color: "#fde047",
            fillOpacity: 0.88,
          });
          if (l.bringToFront) {
            l.bringToFront();
          }
        },
        mouseout: (e) => {
          const l = e.target;
          const isSelected = selectedDistrictSlug?.toLowerCase() === slug;
          const isHansi = slug === "hr-hansi";
          const isPanipat = slug === "hr-panipat";
          l.setStyle({
            weight: isSelected ? 3.5 : isHansi || isPanipat ? 2.5 : 1.5,
            color: isSelected ? "#fde047" : isHansi ? "#fbbf24" : isPanipat ? "#fde047" : palette.border,
            fillOpacity: isSelected ? 0.88 : isHansi ? 0.72 : isPanipat ? 0.75 : 0.58,
          });
        },
        click: () => {
          if (distObj) {
            onSelectDistrict(distObj);
          } else {
            onSelectDistrict({
              slug,
              name,
              headquarters: hq,
              state_code: "IN-HR",
              center: [29.1, 76.2],
              zoom: 10.5,
              odop_status: "PENDING_SOURCE",
              cultural_intro: "",
            });
          }
        },
      });
    },
    [districtsMap, onSelectDistrict, selectedDistrictSlug]
  );

  // Generate District text labels for all 23 districts
  const districtLabels = useMemo(() => {
    if (!showLabels || !districtsList.length) return [];
    return districtsList.map((d) => {
      const isSelected = selectedDistrictSlug === d.slug;
      const isHansi = d.slug === "hr-hansi";

      const labelHtml = `
        <div style="
          font-family: Georgia, serif;
          font-size: ${isHansi ? "12px" : "11px"};
          font-weight: 700;
          color: ${isSelected ? "#fde047" : isHansi ? "#fde047" : "#fef3c7"};
          text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9);
          letter-spacing: 0.3px;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          text-align: center;
        ">
          ${d.name}
          ${isHansi ? `<span style="display: block; font-size: 8px; font-family: sans-serif; font-weight: 700; color: #fde047; text-transform: uppercase;">23rd Dist.</span>` : ""}
        </div>
      `;

      const icon = L.divIcon({
        html: labelHtml,
        className: "dharohar-district-label-marker",
        iconSize: [110, 20],
        iconAnchor: [55, 10],
      });

      return {
        slug: d.slug,
        center: d.center,
        icon,
      };
    });
  }, [showLabels, districtsList, selectedDistrictSlug]);

  if (!visible || !geoJsonData) return null;

  return (
    <>
      <GeoJSON
        key={`haryana-districts-${selectedDistrictSlug || "none"}`}
        data={geoJsonData}
        style={styleFunction}
        onEachFeature={onEachFeature}
      />
      {districtLabels.map((lbl) => (
        <Marker
          key={`dist-lbl-${lbl.slug}`}
          position={lbl.center}
          icon={lbl.icon}
          interactive={false}
        />
      ))}
    </>
  );
}
