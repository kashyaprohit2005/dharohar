"use client";

import React from "react";
import { X, Sparkles, ExternalLink, Film, ShieldCheck } from "lucide-react";

export interface VideoItem {
  title: string;
  category: string;
  location: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description: string;
  archivalSource?: string;
}

interface VideoExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: VideoItem | null;
}

export default function VideoExperienceModal({ isOpen, onClose, item }: VideoExperienceModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Watch India • Living Cultural Archive
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-stone-100 line-clamp-1">
                {item.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Visual Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="relative w-full h-full">
              {item.thumbnailUrl && (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-60 filter blur-xs"
                />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500/60 flex items-center justify-center text-rose-300 shadow-xl">
                  <Film className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="font-serif text-xl font-bold text-stone-100">{item.title}</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-800/90 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Curated from Sangeet Natak Akademi Archives</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Context & Source Details */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="px-3 py-1 rounded-full font-semibold uppercase tracking-wider bg-stone-800 text-stone-300">
              {item.category} • {item.location}
            </span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Authentic Documentation</span>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            {item.description}
          </p>

          {item.archivalSource && (
            <div className="text-xs text-stone-400 pt-2 border-t border-stone-800 flex items-center justify-between">
              <span>Source: <strong>{item.archivalSource}</strong></span>
              <a
                href="https://sangeetnatak.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
              >
                <span>National Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
