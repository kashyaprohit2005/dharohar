"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { MapLevel } from "./mapTypes";

interface MapControllerProps {
  level: MapLevel;
  center?: [number, number];
  zoom?: number;
  flyDuration?: number;
}

export default function MapController({
  level,
  center,
  zoom,
  flyDuration = 1.2,
}: MapControllerProps) {
  const map = useMap();
  const lastTarget = useRef<string>("");

  useEffect(() => {
    if (!map) return;

    // Invalidate map size to handle resizing / layout animations smoothly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    let targetLat = 22.8;
    let targetLon = 79.5;
    let targetZoom = 5;

    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      targetLat = center[0];
      targetLon = center[1];
    }

    if (typeof zoom === "number" && zoom > 0) {
      targetZoom = zoom;
    } else {
      if (level === "INDIA") {
        targetLat = 22.8;
        targetLon = 79.5;
        targetZoom = 5;
      } else if (level === "STATE") {
        targetZoom = 7.5;
      } else if (level === "DISTRICT") {
        targetZoom = 10.5;
      } else if (level === "ITEM") {
        targetZoom = 13.5;
      }
    }

    const key = `${targetLat.toFixed(3)},${targetLon.toFixed(3)},${targetZoom}`;
    if (key !== lastTarget.current) {
      lastTarget.current = key;
      map.flyTo([targetLat, targetLon], targetZoom, {
        duration: flyDuration,
        easeLinearity: 0.25,
      });
    }

    return () => clearTimeout(timer);
  }, [map, level, center, zoom, flyDuration]);

  return null;
}
