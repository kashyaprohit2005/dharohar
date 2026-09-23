"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, X, Calendar, MapPin, Trash2, Sparkles, ArrowRight } from "lucide-react";
import axios from "axios";

interface FavoriteItem {
  id: number;
  name?: string;
  title?: string;
  category: string;
  state?: string;
  city?: string;
  image_url?: string;
  short_description?: string;
  start_date?: string;
  status?: string;
  event_id?: string;
}

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const [heritages, setHeritages] = useState<FavoriteItem[]>([]);
  const [events, setEvents] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("user-local-device");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let stored = localStorage.getItem("dharohar_user_id");
      if (!stored) {
        stored = "usr-" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("dharohar_user_id", stored);
      }
      setUserId(stored);
    }
  }, []);

  const fetchFavorites = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/favorites?user_id=${userId}`);
      if (res.data) {
        setHeritages(res.data.heritage || []);
        setEvents(res.data.events || []);
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen, userId]);

  const handleRemove = async (type: "heritage" | "event", id: string | number) => {
    try {
      await axios.post("http://localhost:8000/api/favorites/toggle", {
        user_identifier: userId,
        entity_type: type,
        entity_id: String(id)
      });
      fetchFavorites();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const totalCount = heritages.length + events.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100">My Heritage Passport</h2>
              <p className="text-xs text-stone-400">
                {totalCount} saved cultural {totalCount === 1 ? "treasure" : "treasures"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {loading ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-400 animate-spin" />
              <span>Loading saved traditions...</span>
            </div>
          ) : totalCount === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-200">Your Passport is Empty</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                As you explore India's living heritage, tap the bookmark icon on any tradition or live event to save it here.
              </p>
            </div>
          ) : (
            <>
              {/* Traditions Section */}
              {heritages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <span>Saved Living Traditions ({heritages.length})</span>
                  </div>
                  <div className="space-y-2.5">
                    {heritages.map((h) => (
                      <div
                        key={h.id}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/50 hover:border-amber-600/40 transition-all gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                            {h.category} • {h.state}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-stone-100 truncate group-hover:text-amber-300">
                            {h.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/heritage/${h.id}`}
                            onClick={onClose}
                            className="p-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-700/60 transition-colors"
                            title="View Detail"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleRemove("heritage", h.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-700/60 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Events Section */}
              {events.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-400 uppercase tracking-wider">
                    <span>Saved Live Events ({events.length})</span>
                  </div>
                  <div className="space-y-2.5">
                    {events.map((e) => (
                      <div
                        key={e.id}
                        className="group flex items-center justify-between p-3 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/50 hover:border-rose-600/40 transition-all gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-rose-400">
                            <span>{e.category}</span>
                            <span>•</span>
                            <span className="text-stone-400">{e.city}, {e.state}</span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-stone-100 truncate group-hover:text-rose-300">
                            {e.title}
                          </h4>
                          {e.start_date && (
                            <div className="flex items-center gap-1 text-[11px] text-stone-400 pt-0.5">
                              <Calendar className="w-3 h-3 text-amber-400" />
                              <span>{e.start_date}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRemove("event", e.event_id || e.id)}
                            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-700/60 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
