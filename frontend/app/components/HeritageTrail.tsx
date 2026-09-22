"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, ChevronRight, Sparkles } from "lucide-react";

export interface TrailStop {
  id: number;
  name: string;
  category: string;
  state: string;
  timestamp: number;
}

export function recordTrailStop(stop: Omit<TrailStop, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("dharohar_trail") || "[]";
    let list: TrailStop[] = JSON.parse(raw);
    list = list.filter((item) => item.id !== stop.id);
    list.unshift({ ...stop, timestamp: Date.now() });
    if (list.length > 8) list = list.slice(0, 8);
    localStorage.setItem("dharohar_trail", JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

export default function HeritageTrail() {
  const [trail, setTrail] = useState<TrailStop[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("dharohar_trail") || "[]";
        setTrail(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (trail.length === 0) return null;

  return (
    <div className="w-full bg-stone-900/60 border border-stone-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2.5">
        <Compass className="w-4 h-4 text-amber-400" />
        <span className="uppercase tracking-wider">Your Cultural Trail Across India</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {trail.map((stop, idx) => (
          <React.Fragment key={stop.id}>
            <Link
              href={`/heritage/${stop.id}`}
              className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700/60 text-stone-200 hover:text-amber-300 transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-amber-400/80">{stop.category}</span>
              <span className="font-serif font-medium truncate max-w-[120px]">{stop.name}</span>
            </Link>
            {idx < trail.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
