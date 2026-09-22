"use client";

import { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { CulturalItem } from "./mapTypes";

interface CulturalMarkersLayerProps {
  items: CulturalItem[];
  selectedItemSlug: string | null;
  onSelectItem: (item: CulturalItem) => void;
  visible: boolean;
  selectedCategory: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  CRAFTS: { bg: "#d97706", border: "#fde047", icon: "🏺" },
  FOOD: { bg: "#ea580c", border: "#fdba74", icon: "🍲" },
  MONUMENTS: { bg: "#2563eb", border: "#93c5fd", icon: "🏰" },
  TRADITIONS: { bg: "#7c3aed", border: "#c4b5fd", icon: "📜" },
  EVENTS: { bg: "#db2777", border: "#f9a8d4", icon: "🎪" },
  ART: { bg: "#059669", border: "#6ee7b7", icon: "🎨" },
  PEOPLE: { bg: "#4f46e5", border: "#a5b4fc", icon: "👥" },
};

function createMarkerDivIcon(
  category: string,
  verificationTier: string,
  isSelected: boolean
): L.DivIcon {
  const catKey = (category || "CRAFTS").toUpperCase();
  const cfg = CATEGORY_COLORS[catKey] || { bg: "#d97706", border: "#fbbf24", icon: "📍" };
  const size = isSelected ? 44 : 36;
  const isVerified = verificationTier === "OFFICIAL_VERIFIED";

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer; user-select: none;">
      ${
        isSelected
          ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background-color: ${cfg.bg}; opacity: 0.45; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ""
      }
      <div style="
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        background: ${cfg.bg};
        border: 2.5px solid ${isSelected ? "#ffffff" : cfg.border};
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55), 0 0 10px ${cfg.bg}80;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? "20px" : "16px"};
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      ">
        <span>${cfg.icon}</span>
      </div>
      <!-- Verification Badge Dot -->
      <div style="
        position: absolute;
        top: -2px;
        right: -2px;
        width: 11px;
        height: 11px;
        border-radius: 9999px;
        background: ${isVerified ? "#10b981" : "#f59e0b"};
        border: 2px solid #1c1917;
      " title="${verificationTier}"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "dharohar-custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2 - 4],
  });
}

export default function CulturalMarkersLayer({
  items,
  selectedItemSlug,
  onSelectItem,
  visible,
  selectedCategory,
}: CulturalMarkersLayerProps) {
  const filteredItems = useMemo(() => {
    if (!items || !items.length) return [];
    return items.filter((it) => {
      if (!it.lat || !it.lon) return false;
      if (!selectedCategory || selectedCategory.toLowerCase() === "all") return true;
      return it.category.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [items, selectedCategory]);

  if (!visible || !filteredItems.length) return null;

  return (
    <>
      {filteredItems.map((item) => {
        const isSelected = selectedItemSlug === item.slug;
        const icon = createMarkerDivIcon(item.category, item.verification_tier, isSelected);

        return (
          <Marker
            key={item.slug}
            position={[item.lat!, item.lon!]}
            icon={icon}
            eventHandlers={{
              click: () => onSelectItem(item),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
              <div className="text-left font-sans max-w-xs p-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/50 font-medium uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded font-semibold ${
                      item.verification_tier === "OFFICIAL_VERIFIED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                        : "bg-amber-950 text-amber-300 border border-amber-700"
                    }`}
                  >
                    {item.verification_tier === "OFFICIAL_VERIFIED" ? "✓ Verified" : "★ Sourced"}
                  </span>
                </div>
                <div className="font-serif font-bold text-stone-900 text-sm">{item.title}</div>
                {item.location_name && (
                  <div className="text-[11px] text-stone-600 mt-0.5">📍 {item.location_name}</div>
                )}
                <div className="text-[10px] text-amber-700 font-medium mt-1">
                  Tap to view full cultural dossier →
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
