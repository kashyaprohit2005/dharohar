'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface HeritageItem {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  state: string;
  region: string;
  district?: string;
  lat: number;
  lon: number;
  description: string;
  short_description?: string;
  history?: string;
  historical_context?: string;
  techniques?: string;
  materials?: string;
  cultural_significance?: string;
  current_practice?: string;
  preservation_status?: string;
  preservation_reason?: string | null;
  featured?: boolean;
  color_accent?: string;
  gi_tag?: string | null;
  gi_number?: string | null;
  cultural_dna?: string | any;
  story_text?: string;
  evidence_count?: number;
  active_artisans_count?: number;
  at_risk_level?: string;
  distance_km?: number;
  village?: string;
  subdistrict?: string;
  locality?: string;
  why_this_matters?: string;
  source_type?: string;
  contributor_name?: string;
}

interface HeritageCardProps {
  item: HeritageItem;
  isSelected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

export default function HeritageCard({ item, isSelected = false, onSelect, compact = false }: HeritageCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse cultural DNA safely
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

  const category = (item.category || '').toLowerCase();

  // Category visual themes & iconography
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'food':
        return {
          icon: '🍲',
          label: 'Culinary Heritage',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
          accent: '#ea580c',
          badgeText: 'Authentic Traditional Recipe'
        };
      case 'folklore':
        return {
          icon: '📜',
          label: 'Oral Epic & Legend',
          badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
          accent: '#9333ea',
          badgeText: 'Centuries-Old Bardic Lore'
        };
      case 'music':
        return {
          icon: '🎵',
          label: 'Folk & Devotional Music',
          badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
          accent: '#d97706',
          badgeText: 'Oral Musical Lineage'
        };
      case 'dance':
        return {
          icon: '💃',
          label: 'Living Dance & Theatre',
          badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
          accent: '#e11d48',
          badgeText: 'Ritual Community Performance'
        };
      case 'architecture':
        return {
          icon: '🏛️',
          label: 'Living Architecture',
          badgeBg: 'bg-slate-100 text-slate-900 border-slate-300',
          accent: '#475569',
          badgeText: 'Indigenous Engineering'
        };
      case 'festival':
        return {
          icon: '🪔',
          label: 'Sacred Living Festival',
          badgeBg: 'bg-violet-50 text-violet-900 border-violet-200',
          accent: '#7c3aed',
          badgeText: 'Living Community Congregation'
        };
      case 'clothing':
      case 'textile':
        return {
          icon: '🧵',
          label: 'Handloom & Textile',
          badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
          accent: '#2563eb',
          badgeText: 'Ancestral Weave'
        };
      case 'craft':
      default:
        return {
          icon: '🏺',
          label: 'Traditional Handicraft',
          badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          accent: '#059669',
          badgeText: 'Master Artisan Craft'
        };
    }
  };

  const meta = getCategoryMeta(category);

  // In-browser text-to-speech
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = item.story_text || item.short_description || item.description;
      const utterance = new SpeechSynthesisUtterance(`${item.name}. ${textToRead}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const isAtRisk = item.preservation_status === 'PRESERVATION_WATCH' ||
    item.preservation_status === 'ENDANGERED' ||
    (item.at_risk_level && item.at_risk_level !== 'STABLE');

  if (compact) {
    return (
      <div
        onClick={onSelect}
        className={`p-4 rounded-xl border transition cursor-pointer ${
          isSelected
            ? 'bg-amber-50/50 border-[#b15f2c] shadow-sm ring-1 ring-[#b15f2c]'
            : 'bg-white border-[#e6e5e2] hover:border-[#b15f2c]/50 hover:bg-[#faf9f8]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{meta.icon}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d]">
              {item.category} · {item.state}
            </span>
          </div>
          {isAtRisk ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-800">
              Watch
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-700">
              Verified
            </span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-[#111111] line-clamp-1 mb-1">
          {item.name}
        </h4>
        <p className="text-xs text-[#8d8d8d] line-clamp-2 leading-relaxed">
          {item.short_description || item.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f1f0ee] text-[11px]">
          <span className="text-[#8d8d8d]">
            {item.district ? `${item.district}, ` : ''}{item.region}
          </span>
          <Link
            href={`/heritage/${item.id}`}
            className="font-semibold text-[#b15f2c] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Passport →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border transition overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'bg-[#ffffff] border-[#b15f2c] ring-2 ring-[#b15f2c]/30 shadow-md'
          : 'bg-white border-[#e6e5e2] hover:border-[#b15f2c]/40 hover:shadow-sm'
      }`}
    >
      {/* Top Banner Accent */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: item.color_accent || meta.accent }}
      />

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-base">{meta.icon}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${meta.badgeBg}`}>
                {meta.label}
              </span>
              {item.distance_km !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#b15f2c]/10 text-[#b15f2c] border border-[#b15f2c]/30 inline-flex items-center gap-1">
                  <span>🧭</span>
                  <span>{item.distance_km} km</span>
                </span>
              )}
              {item.source_type === 'COMMUNITY_CONTRIBUTED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  👥 Community
                </span>
              )}
            </div>

            {isAtRisk ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                <span>⚠️</span>
                <span>Preservation Watch</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <span>✓</span>
                <span>Well Documented</span>
              </span>
            )}
          </div>

          {/* Title and Region */}
          <h3 className="text-base sm:text-lg font-semibold text-[#111111] mb-1 leading-snug">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#8d8d8d] mb-3">
            <span>📍</span>
            <span className="font-medium text-[#111111]/80">
              {item.village ? `${item.village}, ` : ''}{item.district ? `${item.district}, ` : ''}{item.region} · {item.state}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-[#666666] leading-relaxed mb-3 line-clamp-3">
            {item.short_description || item.description}
          </p>

          {/* Why This Matters Localized Callout */}
          {item.why_this_matters && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-[#faf7f4] border border-[#ebdcd2] text-[11px] text-[#4d3629] leading-relaxed">
              <span className="font-semibold text-[#b15f2c] block mb-0.5">🌟 Why This Matters:</span>
              {item.why_this_matters}
            </div>
          )}

          {/* Domain-Specific Cultural Highlights */}
          {category === 'food' && dna.ingredients && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px]">
              <span className="font-semibold text-amber-900 block mb-1">Key Ingredients:</span>
              <div className="flex flex-wrap gap-1">
                {dna.ingredients.slice(0, 4).map((ing: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-200 text-[10px]">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {category === 'folklore' && (
            <div className="mb-4 p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-semibold text-purple-900">Oral Story Excerpt</span>
                {item.story_text && (
                  <button
                    onClick={handleToggleAudio}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                      isPlaying
                        ? 'bg-purple-600 text-white border-purple-600 animate-pulse'
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
                    }`}
                  >
                    <span>{isPlaying ? '⏹ Pause Audio' : '🔊 Listen Story'}</span>
                  </button>
                )}
              </div>
              <p className="text-purple-900/80 italic text-[11px] line-clamp-2">
                "{item.story_text || item.description}"
              </p>
            </div>
          )}

          {category === 'music' && dna.primary_instrument && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-900">
                <span className="font-semibold">Primary Instrument:</span>
                <span>{dna.primary_instrument}</span>
              </div>
              {dna.repertoire && (
                <div className="text-[10px] text-amber-800/80 mt-1">
                  Repertoire: {dna.repertoire}
                </div>
              )}
            </div>
          )}

          {category === 'architecture' && (
            <div className="mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
              <div className="text-slate-800 font-medium">
                {dna.architectural_style || dna.engineering_marvel || 'Historic Indigenous Architecture'}
              </div>
              {dna.geometry && (
                <div className="text-[10px] text-slate-600 mt-0.5">
                  Geometry: {dna.geometry}
                </div>
              )}
            </div>
          )}

          {category === 'festival' && (
            <div className="mb-4 p-2.5 rounded-xl bg-violet-50/70 border border-violet-100 text-[11px]">
              <div className="text-violet-900 font-medium">
                {dna.ceremony_type || dna.mythological_root || 'Living Community Tradition'}
              </div>
            </div>
          )}

          {(category === 'craft' || category === 'textile' || category === 'clothing') && item.gi_tag && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#f1f0ee] text-[#111111] border border-[#e6e5e2]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                GI Tag: {item.gi_tag}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#e6e5e2] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#8d8d8d] text-[11px]">
            <span>📚 {item.evidence_count || 2} Sources</span>
            <span>·</span>
            <span>👥 {item.active_artisans_count || 0} Artisans</span>
          </div>

          <div className="flex items-center gap-2">
            {item.story_text && !isPlaying && (
              <button
                onClick={handleToggleAudio}
                title="Listen to story"
                className="w-7 h-7 rounded-full bg-[#f1f0ee] hover:bg-[#e6e5e2] text-[#111111] flex items-center justify-center text-xs transition"
              >
                🔊
              </button>
            )}
            <Link
              href={`/heritage/${item.id}`}
              className="inline-flex items-center gap-1 font-semibold text-xs text-[#b15f2c] hover:underline"
            >
              <span>Passport</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
