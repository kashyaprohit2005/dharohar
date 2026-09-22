"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Navigation, 
  Share2, 
  Clock, 
  Sparkles, 
  Download, 
  Building2, 
  ExternalLink 
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export interface CulturalEventData {
  id: number;
  event_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  venue: string;
  city: string;
  district?: string;
  state: string;
  lat: number;
  lon: number;
  distance_km?: number;
  organizer?: string;
  official_url?: string;
  ticket_url?: string;
  image_url?: string;
  source_name?: string;
  status: string; // LIVE NOW, THIS WEEK, THIS MONTH, UPCOMING, ENDING SOON, COMPLETED
  linked_heritage_id?: number;
  linked_heritage_name?: string;
  is_happening_today?: boolean;
  directions_url?: string;
  calendar_url?: string;
}

interface EventCardProps {
  event: CulturalEventData;
  onShare?: (event: CulturalEventData) => void;
  compact?: boolean;
}

export default function EventCard({ event, onShare, compact = false }: EventCardProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackPoster = (
    <div className="w-full h-full bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 flex flex-col items-center justify-center p-4 text-center">
      <Sparkles className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
      <span className="text-xs tracking-widest uppercase font-semibold text-amber-300">Dharohar Live</span>
      <span className="text-sm font-serif text-stone-200 mt-1 line-clamp-2">{event.title}</span>
    </div>
  );

  const isLive = event.status === "LIVE NOW" || event.is_happening_today;
  const isEndingSoon = event.status === "ENDING SOON";

  const getStatusBadge = () => {
    if (isLive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-600 text-white shadow-sm shadow-rose-900/30 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white"></span>
          Live Now
        </span>
      );
    }
    if (isEndingSoon) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500 text-stone-950 shadow-sm">
          ⏳ Ending Soon
        </span>
      );
    }
    if (event.status === "THIS WEEK") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-700/80 text-amber-100 border border-amber-600/40">
          ⚡ This Week
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-stone-800 text-stone-300 border border-stone-700">
        🗓️ Upcoming
      </span>
    );
  };

  const calendarDownloadUrl = `${API_BASE_URL}/api/events/${event.event_id}/calendar.ics`;
  const directionsLink = event.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lon}`;

  return (
    <article className="group flex flex-col bg-stone-900/90 border border-stone-800 hover:border-amber-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 transition-all duration-300">
      {/* Header Image & Badges */}
      <div className="relative w-full aspect-[16/9] bg-stone-950 overflow-hidden">
        {event.image_url && !imgError ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          fallbackPoster
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div>{getStatusBadge()}</div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-black/60 backdrop-blur-md text-amber-200 border border-amber-500/30">
            {event.category.replace("_", " ")}
          </span>
        </div>

        {/* Distance Badge if Geolocation active */}
        {typeof event.distance_km === "number" && (
          <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-amber-300 flex items-center gap-1 border border-amber-500/20">
            <Navigation className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{event.distance_km < 1 ? "Under 1 km" : `${event.distance_km.toFixed(1)} km away`}</span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Dates & Timing */}
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1 text-amber-200 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {event.start_date === event.end_date ? event.start_date : `${event.start_date} → ${event.end_date}`}
            </span>
            {event.start_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                {event.start_time}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-1.5 text-xs text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1 font-medium">
              {event.venue}, {event.city}, {event.state}
            </span>
          </div>

          {/* Description */}
          {!compact && (
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {/* Linked Heritage Tradition link */}
          {event.linked_heritage_name && (
            <div className="pt-1">
              <Link
                href={event.linked_heritage_id ? `/heritage/${event.linked_heritage_id}` : "/map"}
                className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 hover:text-amber-300 underline underline-offset-2"
              >
                <span>Part of living tradition:</span>
                <strong className="font-serif">{event.linked_heritage_name}</strong>
              </Link>
            </div>
          )}

          {/* Organizer */}
          {event.organizer && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-1">
              <Building2 className="w-3 h-3 text-stone-500" />
              <span className="truncate">Organized by {event.organizer}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
          {/* Directions Button */}
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>Directions</span>
          </a>

          {/* Calendar Download (.ics) */}
          <a
            href={calendarDownloadUrl}
            download={`${event.event_id}.ics`}
            title="Download .ics Calendar Invite"
            className="inline-flex items-center justify-center p-2 rounded-xl text-stone-300 hover:text-amber-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          {/* Official URL */}
          {event.official_url && (
            <a
              href={event.official_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Official Event Portal"
              className="inline-flex items-center justify-center p-2 rounded-xl text-stone-300 hover:text-amber-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Share Button */}
          {onShare && (
            <button
              onClick={() => onShare(event)}
              title="Share Event Poster"
              className="inline-flex items-center justify-center p-2 rounded-xl text-stone-300 hover:text-amber-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
