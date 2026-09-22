'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface VisualHeritageItem {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  state: string;
  region: string;
  district?: string;
  village?: string;
  lat: number;
  lon: number;
  description: string;
  short_description?: string;
  image_url?: string | null;
  image_source_name?: string;
  image_source_url?: string | null;
  image_alt?: string;
  why_here?: string;
  what_makes_it_special?: string;
  distinctiveness_type?: string;
  distinctiveness_statement?: string;
  distinctiveness_source?: string;
  has_3d?: boolean;
  model_3d_type?: string | null;
  preservation_status?: string;
  at_risk_level?: string;
  gi_tag?: string | null;
  gi_number?: string | null;
  cultural_dna?: string | any;
  story_text?: string;
  evidence_count?: number;
  active_artisans_count?: number;
  distance_km?: number;
}

interface VisualCultureCardProps {
  item: VisualHeritageItem;
  isSelected?: boolean;
  onSelect?: () => void;
  variant?: 'spotlight' | 'compact' | 'minimal';
  onLocate?: () => void;
  onShare?: (item: VisualHeritageItem) => void;
}

export const getCategoryConfig = (category: string = '') => {
  switch (category.toLowerCase()) {
    case 'food':
      return {
        icon: '🍲',
        label: 'Culinary Heritage',
        bgBadge: 'bg-amber-50 text-amber-900 border-amber-200',
        accentColor: '#ea580c',
        adaptiveLabel: 'Traditional Elements'
      };
    case 'art':
      return {
        icon: '🎨',
        label: 'Art & Art Style',
        bgBadge: 'bg-teal-50 text-teal-900 border-teal-200',
        accentColor: '#0d9488',
        adaptiveLabel: 'Medium & Pigments'
      };
    case 'folklore':
      return {
        icon: '📜',
        label: 'Oral Folklore',
        bgBadge: 'bg-purple-50 text-purple-900 border-purple-200',
        accentColor: '#9333ea',
        adaptiveLabel: 'Epic Ballad Lore'
      };
    case 'music':
      return {
        icon: '🎵',
        label: 'Folk Music Lineage',
        bgBadge: 'bg-amber-50 text-amber-900 border-amber-200',
        accentColor: '#d97706',
        adaptiveLabel: 'Instrument & Raga'
      };
    case 'dance':
      return {
        icon: '💃',
        label: 'Living Dance',
        bgBadge: 'bg-rose-50 text-rose-900 border-rose-200',
        accentColor: '#e11d48',
        adaptiveLabel: 'Formation & Rhythm'
      };
    case 'architecture':
      return {
        icon: '🏛️',
        label: 'Monument & Architecture',
        bgBadge: 'bg-slate-100 text-slate-900 border-slate-300',
        accentColor: '#475569',
        adaptiveLabel: 'Masonry & Engineering'
      };
    case 'festival':
      return {
        icon: '🪔',
        label: 'Living Festival',
        bgBadge: 'bg-violet-50 text-violet-900 border-violet-200',
        accentColor: '#7c3aed',
        adaptiveLabel: 'Ritual Season'
      };
    case 'clothing':
      return {
        icon: '👗',
        label: 'Traditional Attire',
        bgBadge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
        accentColor: '#4f46e5',
        adaptiveLabel: 'Embroidery & Cut'
      };
    case 'textile':
      return {
        icon: '🧵',
        label: 'Handloom Textile',
        bgBadge: 'bg-blue-50 text-blue-900 border-blue-200',
        accentColor: '#2563eb',
        adaptiveLabel: 'Weave & Yarn'
      };
    case 'craft':
    default:
      return {
        icon: '🏺',
        label: 'Master Handicraft',
        bgBadge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        accentColor: '#059669',
        adaptiveLabel: 'Material & Tool'
      };
  }
};

export default function VisualCultureCard({
  item,
  isSelected = false,
  onSelect,
  variant = 'spotlight',
  onLocate,
  onShare,
}: VisualCultureCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const cfg = getCategoryConfig(item.category);

  // Parse DNA safely
  let dna: Record<string, any> = {};
  if (typeof item.cultural_dna === 'string') {
    try {
      dna = JSON.parse(item.cultural_dna);
    } catch {
      dna = {};
    }
  } else if (item.cultural_dna && typeof item.cultural_dna === 'object') {
    dna = item.cultural_dna;
  }

  const formatField = (field: any): string => {
    if (!field) return '';
    if (Array.isArray(field)) return field.filter(Boolean).join(', ');
    if (typeof field === 'string') return field.trim();
    return String(field);
  };

  // Determine category-adaptive metadata value
  const getAdaptiveMetadata = () => {
    const cat = item.category.toLowerCase();
    if (cat === 'food') {
      return formatField(dna.components) || formatField(dna.key_courses) || 'Slow-simmered regional ingredients';
    }
    if (cat === 'art') {
      return formatField(dna.pigments) || formatField(dna.medium) || 'Natural minerals on hand-prepped canvas';
    }
    if (cat === 'textile' || cat === 'clothing') {
      return formatField(dna.weave_style) || formatField(dna.key_stitches) || formatField(dna.materials) || 'Handloom interlock technique';
    }
    if (cat === 'music') {
      return formatField(dna.primary_instrument) || formatField(dna.instruments) || 'Hereditary microtonal oral repertoire';
    }
    if (cat === 'dance') {
      return formatField(dna.formation) || formatField(dna.recognition) || 'Serpentine synchronized community rhythm';
    }
    if (cat === 'architecture') {
      return formatField(dna.construction_method) || formatField(dna.technique_name) || formatField(dna.significance) || 'Indigenous dry-stone timber joinery';
    }
    if (cat === 'folklore') {
      return formatField(dna.poetic_meter) || formatField(dna.language) || 'Oral couplet epic in regional dialect';
    }
    if (cat === 'festival') {
      return formatField(dna.season) || formatField(dna.venue) || 'Living community assembly & festive procession';
    }
    return formatField(dna.materials) || formatField(dna.technique) || 'Handcrafted ancestral method';
  };

  const adaptiveValue = getAdaptiveMetadata();

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const narrative = item.story_text || item.short_description || item.description;
      const utterance = new SpeechSynthesisUtterance(`${item.name}. ${narrative}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const isAtRisk =
    item.preservation_status === 'PRESERVATION_WATCH' ||
    item.preservation_status === 'ENDANGERED' ||
    (item.at_risk_level && item.at_risk_level !== 'STABLE');

  // COMPACT VARIANT: For scrollable lists & mobile peek drawer
  if (variant === 'compact') {
    return (
      <div
        onClick={onSelect}
        className={`group p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
          isSelected
            ? 'bg-amber-50/70 border-[#b15f2c] shadow-sm ring-2 ring-[#b15f2c]/30'
            : 'bg-white border-[#e6e5e2] hover:border-[#b15f2c]/50 hover:bg-[#faf9f8]'
        }`}
      >
        {/* Thumbnail Image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#f1f0ee] shrink-0 relative border border-[#e6e5e2]">
          {item.image_url && !imgFailed ? (
            <img
              src={item.image_url}
              alt={item.image_alt || item.name}
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-center p-1"
              style={{ backgroundColor: `${cfg.accentColor}15` }}
            >
              <span className="text-2xl">{cfg.icon}</span>
            </div>
          )}
          {item.has_3d && (
            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[9px] font-bold">
              3D
            </span>
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] truncate">
              {cfg.icon} {item.category} · {item.state}
            </span>
            {isAtRisk && (
              <span className="shrink-0 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-100 text-amber-800">
                Watch
              </span>
            )}
          </div>

          <h4 className="text-sm font-semibold text-[#111111] truncate group-hover:text-[#b15f2c] transition-colors">
            {item.name}
          </h4>

          <p className="text-[11px] text-[#8d8d8d] truncate mt-0.5">
            📍 {item.district ? `${item.district}, ` : ''}{item.region}
          </p>

          <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-[#f1f0ee] text-[11px]">
            <span className="text-[#666666] truncate text-[10px]">
              {item.gi_tag ? '✓ GI Protected' : adaptiveValue}
            </span>
            <Link
              href={`/heritage/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-[#b15f2c] shrink-0 hover:underline flex items-center gap-0.5"
            >
              <span>Passport</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SPOTLIGHT VARIANT: Rich visual cultural discovery card
  return (
    <div
      onClick={onSelect}
      className={`group rounded-3xl border transition-all duration-300 overflow-hidden bg-white cursor-pointer flex flex-col ${
        isSelected
          ? 'border-[#b15f2c] shadow-lg ring-2 ring-[#b15f2c]/20'
          : 'border-[#e6e5e2] hover:border-[#b15f2c]/40 hover:shadow-md'
      }`}
    >
      {/* Visual Image Header */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-[#f1f0ee] overflow-hidden">
        {item.image_url && !imgFailed ? (
          <img
            src={item.image_url}
            alt={item.image_alt || item.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{
              background: `radial-gradient(circle, ${cfg.accentColor}25 0%, #faf9f8 100%)`
            }}
          >
            <span className="text-5xl sm:text-6xl mb-2 drop-shadow-sm">{cfg.icon}</span>
            <span className="text-xs font-semibold text-[#8d8d8d] uppercase tracking-wider">
              {item.category} Heritage of {item.state}
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${cfg.bgBadge} bg-white/95`}>
            <span>{cfg.icon}</span>
            <span>{cfg.label}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {item.has_3d && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-[#111111] border border-white/60 shadow-xs flex items-center gap-1">
                <span>🔍</span>
                <span>3D Model</span>
              </span>
            )}

            {isAtRisk ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 backdrop-blur-md text-white border border-amber-400 shadow-xs">
                ⚠️ Preservation Watch
              </span>
            ) : item.gi_tag ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400 shadow-xs">
                ✓ GI Registered
              </span>
            ) : null}
          </div>
        </div>

        {/* Bottom Bar on Image: Region & Image Attribution */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 z-10 text-white">
          <div>
            <span className="text-[11px] font-medium tracking-wide uppercase text-white/80 block">
              {item.state}
            </span>
            <h3 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
              {item.name}
            </h3>
          </div>

          {item.image_source_name && (
            <span
              title={`Source: ${item.image_source_name}`}
              className="text-[9px] px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white/70 max-w-[140px] truncate"
            >
              📷 {item.image_source_name}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Geographical Anchor */}
        <div className="flex items-center justify-between text-xs text-[#8d8d8d]">
          <span className="flex items-center gap-1 font-medium text-[#111111]">
            <span>📍</span>
            <span>{item.district ? `${item.district}, ` : ''}{item.region}</span>
          </span>
          {item.distance_km !== undefined && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b15f2c]/10 text-[#b15f2c] border border-[#b15f2c]/20">
              🧭 {item.distance_km.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed line-clamp-3">
          {item.short_description || item.description}
        </p>

        {/* WHY HERE? Badge */}
        {item.why_here && (
          <div className="p-3 rounded-xl bg-[#faf9f8] border border-[#e6e5e2] text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b15f2c] flex items-center gap-1">
              <span>🌿</span>
              <span>Why This Place?</span>
            </span>
            <p className="text-[11px] text-[#555555] leading-relaxed line-clamp-2">
              {item.why_here}
            </p>
          </div>
        )}

        {/* Category-Adaptive Cultural Metadata Pill */}
        <div className="p-2.5 rounded-xl bg-[#f8f7f5] border border-[#e6e5e2]/80 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-[#8d8d8d] uppercase tracking-wider block">
              {cfg.adaptiveLabel}
            </span>
            <span className="font-medium text-[#111111] truncate block text-[11px]">
              {adaptiveValue}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Storyteller Button */}
            <button
              onClick={handleToggleAudio}
              type="button"
              aria-label={isPlayingAudio ? "Stop oral narrative" : "Listen to oral narrative"}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 border ${
                isPlayingAudio
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : 'bg-white text-[#111111] border-[#e6e5e2] hover:bg-[#faf9f8]'
              }`}
            >
              <span>{isPlayingAudio ? '⏹️' : '🔊'}</span>
              <span className="text-[11px]">{isPlayingAudio ? 'Playing' : 'Listen'}</span>
            </button>

            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(item);
                }}
                type="button"
                aria-label="Share tradition"
                className="shrink-0 px-2 py-1 rounded-lg text-xs font-semibold bg-white text-[#111111] border border-[#e6e5e2] hover:bg-[#faf9f8] transition flex items-center gap-1"
                title="Create Shareable Cultural Poster"
              >
                <span>📤</span>
                <span className="text-[11px]">Share</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-[#f1f0ee] flex items-center justify-between gap-2">
          {onLocate ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLocate();
              }}
              className="text-xs font-semibold text-[#8d8d8d] hover:text-[#111111] transition flex items-center gap-1"
            >
              <span>🎯</span>
              <span>Pin on Map</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#8d8d8d]">
              {item.evidence_count || 2} verified citations
            </span>
          )}

          <Link
            href={`/heritage/${item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111111] text-white hover:bg-[#b15f2c] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Explore Living Passport</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
