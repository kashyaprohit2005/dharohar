'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';
import AudioStoryPlayer from '../../components/AudioStoryPlayer';
import SocialShareModal, { ShareItem } from '../../components/SocialShareModal';
import EventCard, { CulturalEventData } from '../../components/EventCard';
import { recordTrailStop } from '../../components/HeritageTrail';
import { heritageAPI, API_BASE_URL } from '@/lib/api';
import axios from 'axios';

const IndiaMap = dynamic(() => import('../../components/IndiaMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 rounded-xl bg-[#f1f0ee] flex items-center justify-center text-xs text-[#8d8d8d]">
      <span>Loading cluster map...</span>
    </div>
  ),
});

const Heritage3DViewer = dynamic(() => import('../../components/Heritage3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-3xl bg-[#0a0a0a] flex items-center justify-center text-xs text-white/50">
      <span>Loading 3D Cultural Model...</span>
    </div>
  ),
});

export default function HeritagePassportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [heritage, setHeritage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dna' | 'narrative' | 'evidence' | 'graph' | 'practitioners'>('dna');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [connectedEvents, setConnectedEvents] = useState<CulturalEventData[]>([]);
  const [shareItem, setShareItem] = useState<ShareItem | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    heritageAPI.detail(id)
      .then(res => {
        setHeritage(res.data);
        if (res.data) {
          recordTrailStop({
            id: res.data.id,
            name: res.data.name,
            category: res.data.category,
            state: res.data.state
          });
        }
      })
      .catch(err => console.error("Error loading heritage passport:", err))
      .finally(() => setLoading(false));

    axios.get(`${API_BASE_URL}/api/events`)
      .then(res => {
        if (Array.isArray(res.data)) {
          const linked = res.data.filter((ev: any) => 
            ev.linked_heritage_id === Number(id) ||
            (ev.linked_heritage_name && ev.linked_heritage_name.toLowerCase().includes((id || '').toLowerCase()))
          );
          setConnectedEvents(linked);
        }
      })
      .catch(() => {});
  }, [id]);

  // Clean up audio on unmount or tab change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleNarrator = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = heritage.story_text || heritage.description;
      const utterance = new SpeechSynthesisUtterance(
        `Oral Heritage Narrative for ${heritage.name}, ${heritage.region}, ${heritage.state}. ${textToRead}`
      );
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-sm text-[#8d8d8d]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-[#b15f2c] border-t-transparent animate-spin"></div>
            <span>Loading Official Heritage Passport...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!heritage) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 shell py-20 text-center">
          <h2 className="text-xl font-semibold text-[#111111]">Heritage Record Not Found</h2>
          <Link href="/map" className="text-xs text-[#b15f2c] font-semibold mt-4 inline-block hover:underline">
            ← Return to Living Heritage Atlas
          </Link>
        </div>
      </div>
    );
  }

  const category = (heritage.category || '').toLowerCase();
  const dna = heritage.cultural_dna || {};
  const isAtRisk = heritage.preservation_status === 'PRESERVATION_WATCH' ||
    heritage.preservation_status === 'ENDANGERED' ||
    (heritage.at_risk_level && heritage.at_risk_level !== 'STABLE');

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 shell py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8d8d8d] hover:text-[#111111] transition"
          >
            <span>←</span>
            <span>Back to Living Heritage Atlas</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShareItem({
                  title: heritage.name,
                  category: heritage.category,
                  location: `${heritage.district ? heritage.district + ", " : ""}${heritage.state}`,
                  quoteOrDesc: heritage.what_makes_it_special || heritage.short_description || heritage.description,
                  url: typeof window !== "undefined" ? window.location.href : `/heritage/${heritage.id}`,
                  imageUrl: heritage.image_url,
                  tag: heritage.gi_tag || "Living Cultural Tradition"
                });
                setShareOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-600 text-stone-950 hover:bg-amber-500 transition shadow-sm"
            >
              <span>✨</span>
              <span>Share Social Poster</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800 transition"
            >
              <span>🔗</span>
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Passport Identity Hero Banner */}
        <div className="rounded-[2.5rem] bg-[#0a0a0a] text-white p-6 sm:p-10 mb-8 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-white/60">
                <span className="font-semibold text-[#cf8047]">{heritage.category}</span>
                {heritage.subcategory && (
                  <>
                    <span>·</span>
                    <span>{heritage.subcategory}</span>
                  </>
                )}
                <span>·</span>
                <span>
                  {heritage.district ? `${heritage.district}, ` : ''}{heritage.region}, {heritage.state}
                </span>
                {heritage.gi_tag && (
                  <>
                    <span>·</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                      GI Tag: {heritage.gi_tag} ({heritage.gi_number || 'Registered GI'})
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                {heritage.name}
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                {heritage.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/artisan/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0a0a0a] text-xs font-semibold hover:bg-white/90 transition shadow-xs"
                >
                  <span>Claim as Practitioner →</span>
                </Link>

                <Link
                  href="/workshops"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20 hover:bg-white/20 transition"
                >
                  <span>Request Workshop 🛠️</span>
                </Link>
              </div>

              {/* Status & Evidence Stats */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-white/50">Status:</span>
                  {isAtRisk ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      ⚠️ Preservation Watch
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      ✓ Well Documented Living Tradition
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/50">Evidence:</span>
                  <span className="font-semibold text-[#cf8047]">
                    {heritage.evidence?.length || 0} Statutory Citations
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-white/50">Living Practitioners:</span>
                  <span className="font-semibold text-white">
                    {heritage.connected_artisans?.length || 0} Registered
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sourced Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#181818] border border-white/15 relative shadow-xl">
                {heritage.image_url && !imageError ? (
                  <img
                    src={heritage.image_url}
                    alt={heritage.image_alt || heritage.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950">
                    <span className="text-6xl mb-2">🏺</span>
                    <span className="font-serif text-lg font-bold text-stone-200">{heritage.name}</span>
                    <span className="text-xs text-amber-400/80 uppercase tracking-wider font-semibold mt-1">
                      {heritage.category} • {heritage.state}
                    </span>
                  </div>
                )}

                {/* Sourced Image Credit Tag */}
                {heritage.image_source_name && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-white/80 border border-white/10">
                    <span className="truncate">📷 Source: {heritage.image_source_name}</span>
                    {heritage.image_source_url && (
                      <a
                        href={heritage.image_source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#cf8047] font-semibold hover:underline shrink-0 ml-2"
                      >
                        Verify ↗
                      </a>
                    )}
                  </div>
                )}

                {heritage.has_3d && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold flex items-center gap-1">
                    <span>🔍</span>
                    <span>3D Inspectable</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listen to India Audio Story Experience */}
        {(heritage.story_text || heritage.description) && (
          <div className="mb-8">
            <AudioStoryPlayer
              title={heritage.name}
              category={heritage.category}
              location={`${heritage.district ? heritage.district + ", " : ""}${heritage.state}`}
              storyText={heritage.story_text || heritage.description}
              audioUrl={heritage.audio_url}
            />
          </div>
        )}

        {/* Connected Live Cultural Events */}
        {connectedEvents.length > 0 && (
          <div className="mb-8 p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-serif font-bold text-lg">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Live Cultural Events Linked to {heritage.name}</span>
              </div>
              <span className="text-xs text-stone-400">{connectedEvents.length} active events</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedEvents.map(ev => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}

        {/* TRUTH & EVIDENCE HIGHLIGHT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* WHY HERE? */}
          <div className="p-6 rounded-3xl bg-[#faf9f8] border border-[#e6e5e2] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🌿</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#b15f2c]">
                  Why Here? (Why This Place?)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                {heritage.why_here ||
                  `Rooted in the distinctive micro-climate, soil chemistry, community migrations, and historical patronage of ${heritage.region}, ${heritage.state}.`}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e6e5e2] text-[11px] text-[#8d8d8d]">
              <span>📍 Geographical anchor: {heritage.region}, {heritage.state}</span>
            </div>
          </div>

          {/* WHAT MAKES IT SPECIAL? */}
          <div className="p-6 rounded-3xl bg-[#faf9f8] border border-[#e6e5e2] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✨</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                  What Makes It Special?
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                {heritage.what_makes_it_special ||
                  heritage.techniques ||
                  "Distinctive formulation, materials, motifs, and manual techniques passed down through generations."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e6e5e2] text-[11px] text-[#8d8d8d]">
              <span>✓ Ancestral technique & material integrity</span>
            </div>
          </div>

          {/* DISTINCTIVENESS */}
          <div className="p-6 rounded-3xl bg-[#faf9f8] border border-[#e6e5e2] flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a]">
                    Distinctiveness
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {heritage.distinctiveness_type?.replace(/_/g, ' ') || 'REGIONAL ASSOCIATION'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                {heritage.distinctiveness_statement ||
                  "Distinctively associated with this region and documented across statutory cultural registries."}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e6e5e2] text-[11px] text-[#8d8d8d] truncate">
              <span>Source: {heritage.distinctiveness_source || "National Cultural Archives"}</span>
            </div>
          </div>
        </div>

        {/* 3D STRUCTURAL INSPECTION VIEWER (IF APPLICABLE) */}
        {heritage.has_3d && (
          <div className="mb-8">
            <Heritage3DViewer
              hotspots={heritage.hotspots_3d}
              modelType={heritage.model_3d_type}
              accentColor={heritage.color_accent}
              title={`Interactive 3D Cultural Inspection: ${heritage.name}`}
            />
          </div>
        )}

        {/* Preservation Advisory Alert (If Applicable) */}
        {isAtRisk && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="text-sm font-semibold mb-1">Preservation Watch Advisory</h4>
                <p className="text-xs text-amber-800 leading-relaxed mb-3">
                  {heritage.preservation_reason || heritage.at_risk_reason || "This tradition is facing reduced practitioner lineages and requires cultural documentation and youth apprenticeships."}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <Link href="/artisan/register" className="font-semibold text-[#b15f2c] hover:underline">
                    Register as Custodian Practitioner →
                  </Link>
                  <Link href="/workshops" className="font-semibold text-amber-900 hover:underline">
                    Request an Apprenticeship Workshop →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e6e5e2] mb-8 overflow-x-auto scrollbar-none">
          {[
            { key: 'dna', label: '01. Cultural DNA & Lineage' },
            { key: 'narrative', label: '02. Living Oral Narrative' },
            { key: 'evidence', label: `03. Evidence Citations (${heritage.evidence?.length || 0})` },
            { key: 'graph', label: '04. Relationship Graph' },
            { key: 'practitioners', label: `05. Practitioners & Workshops (${heritage.connected_artisans?.length || 0})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-5 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-[#b15f2c] text-[#111111]'
                  : 'border-transparent text-[#8d8d8d] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CULTURAL DNA & LINEAGE */}
        {activeTab === 'dna' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Category-Adaptive Cultural DNA Box */}
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#faf9f8] to-[#f4f2ee] border border-[#e6e5e2]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b15f2c] block">
                    Domain-Specific Cultural DNA
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-[#e6e5e2] font-semibold text-[#111111] capitalize">
                    {category} Structure
                  </span>
                </div>

                {/* FOOD DNA */}
                {category === 'food' && (
                  <div className="space-y-4">
                    {dna.ingredients && (
                      <div>
                        <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">
                          Key Sourced Ingredients:
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {dna.ingredients.map((ing: string, i: number) => (
                            <span key={i} className="px-3 py-1 rounded-xl bg-white border border-[#e6e5e2] text-xs font-medium text-[#111111]">
                              🍲 {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {dna.cooking_technique && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Cooking Technique:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.cooking_technique}</p>
                      </div>
                    )}
                    {dna.occasion && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Ritual & Festive Occasion:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.occasion}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* FOLKLORE DNA */}
                {category === 'folklore' && (
                  <div className="space-y-4">
                    {dna.oral_form && (
                      <div>
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Poetic Meter & Oral Form:</span>
                        <p className="text-sm font-semibold text-[#111111]">{dna.oral_form}</p>
                      </div>
                    )}
                    {dna.instruments && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Accompanying Bardic Instruments:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {dna.instruments.map((inst: string, i: number) => (
                            <span key={i} className="px-3 py-1 rounded-xl bg-white border border-[#e6e5e2] text-xs font-medium">
                              🎻 {inst}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {dna.performing_community && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Custodian Bard Lineage:</span>
                        <p className="text-xs text-[#111111] font-medium">{dna.performing_community}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* MUSIC & DANCE DNA */}
                {(category === 'music' || category === 'dance') && (
                  <div className="space-y-4">
                    {dna.primary_instrument && (
                      <div>
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Primary Instrument / Accompaniment:</span>
                        <p className="text-sm font-semibold text-[#111111]">🎵 {dna.primary_instrument}</p>
                      </div>
                    )}
                    {dna.repertoire && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Repertoire & Musical Styles:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.repertoire}</p>
                      </div>
                    )}
                    {dna.community && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Lineage Custodians:</span>
                        <p className="text-xs text-[#111111] font-medium">{dna.community}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ARCHITECTURE DNA */}
                {category === 'architecture' && (
                  <div className="space-y-4">
                    {dna.architectural_style && (
                      <div>
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Architectural Order & Style:</span>
                        <p className="text-sm font-semibold text-[#111111]">{dna.architectural_style}</p>
                      </div>
                    )}
                    {dna.engineering_marvel && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Structural & Engineering Principle:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.engineering_marvel}</p>
                      </div>
                    )}
                    {dna.geometry && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Geometric Plan:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.geometry}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* FESTIVAL DNA */}
                {category === 'festival' && (
                  <div className="space-y-4">
                    {dna.focal_deity && (
                      <div>
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Focal Deity & Origin:</span>
                        <p className="text-sm font-semibold text-[#111111]">🪔 {dna.focal_deity}</p>
                      </div>
                    )}
                    {dna.ceremony_type && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Ritual & Ceremonial Format:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.ceremony_type}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TEXTILE / CLOTHING / CRAFT DNA */}
                {(category === 'craft' || category === 'textile' || category === 'clothing') && (
                  <div className="space-y-4">
                    {dna.materials && (
                      <div>
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-2">Raw Materials:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(dna.materials) ? (
                            dna.materials.map((m: string, i: number) => (
                              <span key={i} className="px-3 py-1 rounded-xl bg-white border border-[#e6e5e2] text-xs font-medium">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#111111]">{dna.materials}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {dna.technique && (
                      <div className="pt-3 border-t border-[#e6e5e2]">
                        <span className="text-xs font-semibold text-[#8d8d8d] block mb-1">Master Technique:</span>
                        <p className="text-xs text-[#111111] leading-relaxed">{dna.technique}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Historical Context & Evolution */}
              <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block mb-2">
                  Historical Lineage
                </span>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">Origins & Evolution</h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-4">
                  {heritage.history}
                </p>
                {heritage.historical_context && (
                  <div className="p-4 rounded-xl bg-[#f1f0ee]/70 text-xs text-[#111111] border border-[#e6e5e2]">
                    <span className="font-semibold block mb-1">Historical Context:</span>
                    <p className="leading-relaxed text-[#555555]">{heritage.historical_context}</p>
                  </div>
                )}
              </div>

              {/* Techniques & Raw Materials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block mb-2">
                    Ancestral Techniques
                  </span>
                  <h4 className="text-base font-semibold text-[#111111] mb-2">How It Is Practiced</h4>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {heritage.techniques || 'Documented hereditary practices transmitted across generations.'}
                  </p>
                </div>

                <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block mb-2">
                    Natural Materials
                  </span>
                  <h4 className="text-base font-semibold text-[#111111] mb-2">Raw Elements</h4>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    {heritage.materials || 'Locally harvested natural elements and tools.'}
                  </p>
                </div>
              </div>

              {/* Cultural Stewardship */}
              <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b15f2c] block mb-2">
                  Cultural Stewardship
                </span>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">Social & Community Significance</h3>
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed mb-4">
                  {heritage.cultural_significance}
                </p>
                {heritage.current_practice && (
                  <div className="pt-3 border-t border-[#e6e5e2] text-xs">
                    <span className="font-semibold text-[#111111] block mb-1">Current Living Practice:</span>
                    <p className="text-[#555555] leading-relaxed">{heritage.current_practice}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Context */}
            <div className="lg:col-span-4 space-y-6">
              {/* Geographic Cluster Map */}
              <div className="p-5 rounded-[2rem] bg-white border border-[#e6e5e2]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block mb-3">
                  Geographic Epicenter
                </span>
                <div className="rounded-xl overflow-hidden mb-3">
                  <IndiaMap heritage={[heritage]} height="220px" />
                </div>
                <div className="text-xs space-y-1.5 pt-2 border-t border-[#e6e5e2]">
                  <p><strong>District:</strong> {heritage.district || heritage.region}</p>
                  <p><strong>Cluster:</strong> {heritage.region}</p>
                  <p><strong>State:</strong> {heritage.state}</p>
                  <p className="text-[#8d8d8d]">
                    Coordinates: {heritage.lat.toFixed(4)}°N, {heritage.lon.toFixed(4)}°E
                  </p>
                </div>
              </div>

              {/* Preservation Call to Action */}
              <div className="p-6 rounded-[2rem] bg-[#0a0a0a] text-white">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#cf8047] block mb-2">
                  Preservation Action
                </span>
                <h4 className="text-base font-semibold mb-2">
                  Are you a practitioner of {heritage.name}?
                </h4>
                <p className="text-xs text-white/70 leading-relaxed mb-4">
                  Create your tamper-evident Artisan Passbook, mint cryptographic batches, and preserve your family lineage on VirasatSetu.
                </p>
                <Link
                  href="/artisan/register"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-white text-[#0a0a0a] text-xs font-semibold hover:bg-[#f1f0ee] transition"
                >
                  Register as Verified Practitioner →
                </Link>
              </div>

              {/* Workshop Request */}
              <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/70 border border-[#e6e5e2]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b15f2c] block mb-1">
                  Living Apprenticeship
                </span>
                <h4 className="text-sm font-semibold text-[#111111] mb-2">
                  Want to learn this tradition?
                </h4>
                <p className="text-xs text-[#8d8d8d] leading-relaxed mb-4">
                  Request a hands-on master workshop or demonstration from registered cultural custodians.
                </p>
                <Link
                  href="/workshops"
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition"
                >
                  Explore Master Workshops →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVING ORAL NARRATIVE */}
        {activeTab === 'narrative' && (
          <div className="max-w-3xl space-y-6">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-50 via-white to-amber-50 border border-purple-100">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-700 block mb-1">
                    Living Oral Tradition & Voice Archive
                  </span>
                  <h3 className="text-xl font-semibold text-[#111111]">
                    The Living Narrative of {heritage.name}
                  </h3>
                </div>

                <button
                  onClick={handleToggleNarrator}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition ${
                    isPlayingAudio
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-[#111111] text-white hover:bg-black'
                  }`}
                >
                  <span>{isPlayingAudio ? '⏹ Pause Narration' : '🔊 Listen with AI Voice Narrator'}</span>
                </button>
              </div>

              {/* Narrative Audio Wave Bar */}
              {isPlayingAudio && (
                <div className="mb-6 p-3 rounded-xl bg-purple-100/70 border border-purple-200 flex items-center justify-between text-xs text-purple-900">
                  <div className="flex items-center gap-2">
                    <span className="animate-spin text-base">📻</span>
                    <span className="font-semibold">Playing oral narrative in browser...</span>
                  </div>
                  <span className="text-[10px] font-medium text-purple-700">Web Speech API</span>
                </div>
              )}

              {/* Story Content */}
              <div className="prose prose-sm max-w-none text-[#333333] leading-relaxed space-y-4">
                <blockquote className="border-l-4 border-purple-300 pl-4 italic text-sm text-[#444444] bg-white/60 p-4 rounded-r-xl">
                  "{heritage.story_text || heritage.description}"
                </blockquote>

                <div className="pt-4 border-t border-[#e6e5e2] text-xs text-[#8d8d8d] space-y-2">
                  <p>
                    <strong>Cultural Dialect / Origin:</strong> {dna.language || dna.dialect || `${heritage.region}, ${heritage.state}`}
                  </p>
                  <p>
                    <strong>Bardic / Community Custodians:</strong> {dna.community || dna.performing_community || 'Living community elders'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EVIDENCE & TRUST CITATIONS */}
        {activeTab === 'evidence' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-6 rounded-2xl bg-[#f1f0ee]/70 border border-[#e6e5e2]">
              <h3 className="text-base font-semibold text-[#111111] mb-1">
                Authoritative Proof & Verification Layer
              </h3>
              <p className="text-xs text-[#8d8d8d] leading-relaxed">
                VirasatSetu connects living culture to verified statutory documentation. Every tradition in this passport is certified by statutory bodies, museum collections, or peer-reviewed ethnographic field studies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heritage.evidence?.map((ev: any) => (
                <div
                  key={ev.id}
                  className="p-5 rounded-2xl bg-white border border-[#e6e5e2] flex flex-col justify-between hover:border-[#b15f2c]/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ✓ {ev.verification_status || 'VERIFIED'}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#8d8d8d]">
                        {ev.source_type}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#111111] mb-4 leading-relaxed">
                      "{ev.claim}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#f1f0ee] flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#8d8d8d] line-clamp-1">
                      {ev.source_name}
                    </span>
                    {ev.source_url && (
                      <a
                        href={ev.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b15f2c] font-semibold hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>Official Source</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RELATIONSHIP GRAPH */}
        {activeTab === 'graph' && (
          <div className="p-8 rounded-[2rem] bg-white border border-[#e6e5e2]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b15f2c] block mb-1">
              Living Ecosystem Topology
            </span>
            <h3 className="text-xl font-semibold text-[#111111] mb-2">
              Cultural Relationship Graph
            </h3>
            <p className="text-xs text-[#8d8d8d] mb-8 max-w-2xl leading-relaxed">
              Visualizing how {heritage.name} connects place, ancestral community, registered practitioners, and statutory proof.
            </p>

            {/* Visual Node Flowchart */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Node 1: Place */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-2xl block mb-2">📍</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 block">
                  Epicenter
                </span>
                <p className="text-xs font-semibold text-amber-950 mt-1">
                  {heritage.district || heritage.region}
                </p>
                <p className="text-[10px] text-amber-800/80">{heritage.state}</p>
              </div>

              <div className="hidden md:flex justify-center text-[#8d8d8d] text-lg">→</div>

              {/* Node 2: Living Tradition */}
              <div className="p-4 rounded-2xl bg-[#0a0a0a] text-white text-center shadow-md">
                <span className="text-2xl block mb-2">✨</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cf8047] block">
                  Tradition
                </span>
                <p className="text-xs font-semibold text-white mt-1 line-clamp-1">
                  {heritage.name}
                </p>
                <p className="text-[10px] text-white/60 capitalize">{category}</p>
              </div>

              <div className="hidden md:flex justify-center text-[#8d8d8d] text-lg">→</div>

              {/* Node 3: Custodian Community */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-2xl block mb-2">👥</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-800 block">
                  Custodians
                </span>
                <p className="text-xs font-semibold text-purple-950 mt-1 line-clamp-1">
                  {dna.community || dna.performing_community || 'Living Lineage'}
                </p>
                <p className="text-[10px] text-purple-800/80">Oral Transmission</p>
              </div>
            </div>

            {/* Evidence & Practitioners Convergence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[#e6e5e2]">
              <div className="p-5 rounded-2xl bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📜</span>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    Statutory Evidence Anchors
                  </h4>
                </div>
                <p className="text-xs text-[#8d8d8d] mb-3">
                  {heritage.evidence?.length || 0} citations anchoring this living tradition:
                </p>
                <ul className="text-xs space-y-1.5 text-[#111111]">
                  {heritage.evidence?.map((e: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="font-medium">{e.source_name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">🔨</span>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                    Living Practitioner Anchors
                  </h4>
                </div>
                <p className="text-xs text-[#8d8d8d] mb-3">
                  {heritage.connected_artisans?.length || 0} registered practitioners in the database:
                </p>
                {heritage.connected_artisans?.length > 0 ? (
                  <ul className="text-xs space-y-1.5 text-[#111111]">
                    {heritage.connected_artisans.map((a: any) => (
                      <li key={a.id} className="flex items-center justify-between">
                        <span className="font-medium">{a.full_name} ({a.craftproof_id})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800">
                          {a.verification_status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#8d8d8d] italic">
                    No artisans registered yet for this craft. Register through the Artisan Onboarding flow to anchor this tradition!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRACTITIONERS & WORKSHOPS */}
        {activeTab === 'practitioners' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Registered Artisans */}
            <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
              <h3 className="text-base font-semibold text-[#111111] mb-2">
                Verified Practitioners ({heritage.connected_artisans?.length || 0})
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-6">
                Active master artisans and custodians registered on VirasatSetu:
              </p>

              {heritage.connected_artisans?.length > 0 ? (
                <div className="space-y-3">
                  {heritage.connected_artisans.map((artisan: any) => (
                    <div
                      key={artisan.id}
                      className="p-4 rounded-xl border border-[#e6e5e2] bg-[#f1f0ee]/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111]">{artisan.full_name}</h4>
                        <p className="text-xs text-[#8d8d8d]">{artisan.region} · {artisan.craft}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {artisan.verification_status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#f1f0ee] text-center space-y-3">
                  <p className="text-xs text-[#8d8d8d]">
                    Zero demo artisans are pre-seeded. Register a new practitioner via the live onboarding flow!
                  </p>
                  <Link
                    href="/artisan/register"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold hover:bg-black"
                  >
                    <span>Register as Practitioner</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Master Workshops */}
            <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2]">
              <h3 className="text-base font-semibold text-[#111111] mb-2">
                Open Workshops & Apprenticeships ({heritage.workshops?.length || 0})
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-6">
                Master practitioner-led workshops open for booking:
              </p>

              {heritage.workshops?.length > 0 ? (
                <div className="space-y-3">
                  {heritage.workshops.map((w: any) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-xl border border-[#e6e5e2] bg-[#f1f0ee]/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-[#111111]">{w.title}</h4>
                        <p className="text-xs text-[#8d8d8d]">Format: {w.workshop_type}</p>
                      </div>
                      <Link
                        href={`/workshops/${w.id}`}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-[#b15f2c] text-white hover:bg-[#964f24]"
                      >
                        Book Workshop →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#f1f0ee] text-center space-y-3">
                  <p className="text-xs text-[#8d8d8d]">
                    No open workshops listed currently for this craft.
                  </p>
                  <Link
                    href="/workshops"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black"
                  >
                    <span>View All Platform Workshops</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Poster Share Generator Modal */}
        <SocialShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          item={shareItem}
        />
      </main>
    </div>
  );
}
