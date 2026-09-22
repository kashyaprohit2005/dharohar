"use client";

import { ChevronRight, Globe } from "lucide-react";
import { MapBreadcrumbItem } from "./mapTypes";

interface MapBreadcrumbsProps {
  items: MapBreadcrumbItem[];
  onNavigate: (level: MapBreadcrumbItem["level"], data?: any) => void;
}

export default function MapBreadcrumbs({ items, onNavigate }: MapBreadcrumbsProps) {
  if (!items || items.length <= 1) return null;

  return (
    <div className="absolute bottom-5 left-5 z-[400] max-w-[calc(100vw-2.5rem)]">
      <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#e7dfd5] shadow-lg text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => onNavigate("INDIA")}
          className="flex items-center gap-1 text-stone-500 hover:text-sky-700 font-medium transition-colors cursor-pointer"
          title="Return to Whole India"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span>India</span>
        </button>

        {items.slice(1).map((crumb, idx) => {
          const isLast = idx === items.length - 2;
          return (
            <div key={`${crumb.level}-${crumb.label}`} className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <button
                onClick={() => onNavigate(crumb.level, crumb.data)}
                disabled={isLast}
                className={`font-medium transition-colors ${
                  isLast
                    ? "text-sky-700 font-bold cursor-default"
                    : "text-stone-600 hover:text-sky-700 hover:underline cursor-pointer"
                }`}
              >
                {crumb.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
