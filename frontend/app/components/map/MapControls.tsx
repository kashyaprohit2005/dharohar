"use client";

import { useState, useEffect } from "react";
import { 
  Compass, 
  Navigation2, 
  Layers, 
  Plus, 
  Minus, 
  Info, 
  X, 
  Check, 
  Volume2,
  VolumeX,
  Phone
} from "lucide-react";
import Link from "next/link";
import { CategoryFilterConfig } from "./mapTypes";

interface MapControlsProps {
  categories: CategoryFilterConfig[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isIndiaView: boolean;
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layerKey: string) => void;
}

export default function MapControls({
  categories,
  selectedCategory,
  onSelectCategory,
  onResetView,
  onZoomIn,
  onZoomOut,
  isIndiaView,
  activeLayers,
  onToggleLayer,
}: MapControlsProps) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [ivrOpen, setIvrOpen] = useState(false);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleVoiceGuide = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech audio guide is not supported in this browser.");
      return;
    }

    if (isSpeakingGuide) {
      window.speechSynthesis.cancel();
      setIsSpeakingGuide(false);
    } else {
      const guideText = isIndiaView
        ? "Welcome to Dharohar, India's Living Digital Cultural Atlas. Touch any state on the map to open its cultural dossier, or explore Haryana to discover our pilot deep demonstration down to rural craft clusters, tehsils, and living masters."
        : "You are exploring the living cultural geography of Dharohar. Select any district or subdivision to examine verified one-district one-product items, living folklore, and master artisans.";
      const utterance = new SpeechSynthesisUtterance(guideText);
      utterance.rate = 0.92;
      utterance.onend = () => setIsSpeakingGuide(false);
      utterance.onerror = () => setIsSpeakingGuide(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeakingGuide(true);
    }
  };

  const MAP_LAYERS = [
    { key: "districts", label: "District Boundaries", icon: "🗺️" },
    { key: "labels", label: "Geographic Names", icon: "🏷️" },
    { key: "crafts", label: "Crafts & Textiles", icon: "🏺" },
    { key: "food", label: "Culinary Traditions", icon: "🍲" },
    { key: "monuments", label: "Protected Monuments", icon: "🏰" },
    { key: "traditions", label: "Living Folklore", icon: "📜" },
    { key: "events", label: "Cultural Events", icon: "🎪" },
    { key: "knowledge", label: "Traditional Knowledge", icon: "🌿" },
  ];

  return (
    <>
      {/* Floating Vertical Map-Side Toolbar (Right Side) — NO top category bar */}
      <div className="absolute top-16 right-4 sm:right-6 z-[410] flex flex-col gap-2 pointer-events-auto">
        {/* Whole India / Recenter */}
        <button
          onClick={onResetView}
          className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-md flex items-center justify-center group ${
            !isIndiaView
              ? "bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-amber-900/20 animate-pulse"
              : "bg-white/95 hover:bg-stone-50 text-stone-700 hover:text-amber-700 border-[#e7dfd5]"
          }`}
          title="Recenter to Whole India Atlas"
        >
          <Compass className="w-5 h-5" />
          <span className="sr-only">Recenter India</span>
        </button>

        {/* Explore Around Me */}
        <Link
          href="/around-me"
          className="p-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-600 shadow-md transition-all flex items-center justify-center group"
          title="📍 Explore Around Me (GPS Proximity Discovery)"
        >
          <Navigation2 className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          <span className="sr-only">Explore Around Me</span>
        </Link>

        {/* Audio / Voice Guide */}
        <button
          onClick={toggleVoiceGuide}
          className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-md flex items-center justify-center ${
            isSpeakingGuide
              ? "bg-sky-600 text-white border-sky-500 animate-pulse"
              : "bg-white/95 hover:bg-stone-50 text-stone-700 hover:text-sky-600 border-[#e7dfd5]"
          }`}
          title={isSpeakingGuide ? "Stop Voice Narration" : "Play Cultural Voice Guide"}
        >
          {isSpeakingGuide ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span className="sr-only">Voice Guide</span>
        </button>

        {/* Layers & Categories Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setLayersOpen(!layersOpen);
              setLegendOpen(false);
              setIvrOpen(false);
            }}
            className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-md flex items-center justify-center ${
              layersOpen
                ? "bg-sky-600 text-white border-sky-500"
                : "bg-white/95 hover:bg-stone-50 text-stone-700 hover:text-amber-700 border-[#e7dfd5]"
            }`}
            title="Toggle Layers & Categories"
          >
            <Layers className="w-5 h-5" />
            <span className="sr-only">Layers & Categories</span>
          </button>

          {/* Floating Layers + Category Drawer */}
          {layersOpen && (
            <div className="absolute top-0 right-14 w-64 bg-white/98 backdrop-blur-2xl border border-[#e7dfd5] rounded-2xl shadow-2xl p-3 space-y-3 animate-in fade-in slide-in-from-right-2 text-stone-800 max-h-[70vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs font-bold text-stone-900">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Layers & Categories</span>
                </span>
                <button
                  onClick={() => setLayersOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cultural Category Filters */}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider px-1">Cultural Filters</p>
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? "bg-sky-600 text-white shadow-sm"
                            : "text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
                        }`}
                      >
                        <span className="text-xs">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Map Layer Toggles */}
              <div className="space-y-1 pt-1 border-t border-stone-100">
                <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider px-1">Map Layers</p>
                {MAP_LAYERS.map((item) => {
                  const isActive = activeLayers[item.key] ?? true;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onToggleLayer(item.key)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        isActive
                          ? "bg-sky-50 text-sky-900 border border-sky-200 font-medium"
                          : "text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isActive
                            ? "bg-sky-600 text-white font-bold"
                            : "border border-stone-300"
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-2xl border border-[#e7dfd5] overflow-hidden shadow-md">
          <button
            onClick={onZoomIn}
            className="p-2.5 text-stone-700 hover:text-sky-600 hover:bg-stone-100 transition-colors border-b border-stone-200 flex items-center justify-center cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2.5 text-stone-700 hover:text-sky-600 hover:bg-stone-100 transition-colors flex items-center justify-center cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Heritage Palette Legend */}
        <div className="relative">
          <button
            onClick={() => {
              setLegendOpen(!legendOpen);
              setLayersOpen(false);
              setIvrOpen(false);
            }}
            className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-md flex items-center justify-center ${
              legendOpen
                ? "bg-sky-600 text-white border-sky-500"
                : "bg-white/95 hover:bg-stone-50 text-stone-700 hover:text-amber-700 border-[#e7dfd5]"
            }`}
            title="Cultural Palette & Symbols Legend"
          >
            <Info className="w-5 h-5" />
            <span className="sr-only">Legend</span>
          </button>

          {legendOpen && (
            <div className="absolute top-0 right-14 w-68 bg-white/98 backdrop-blur-2xl border border-[#e7dfd5] rounded-2xl shadow-2xl p-4 space-y-3 text-xs animate-in fade-in slide-in-from-right-2 font-sans text-stone-800">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-serif font-bold text-stone-900">
                <span>Dharohar Heritage Pigments</span>
                <button
                  onClick={() => setLegendOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 text-[11px] text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#d97706] border border-[#fde047] shrink-0"></span>
                  <span><strong>Golden Ochre:</strong> Vedic Heritage / Active Pilot</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#7c2d12] border border-[#f97316] shrink-0"></span>
                  <span><strong>Terracotta:</strong> Clay, Frescoes & Handlooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#312e81] border border-[#818cf8] shrink-0"></span>
                  <span><strong>Deep Indigo:</strong> Weaving Guilds & Classical Arts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#047857] border border-[#6ee7b7] shrink-0"></span>
                  <span><strong>Muted Emerald:</strong> Sacred Groves & Agro-lore</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#881337] border border-[#fb7185] shrink-0"></span>
                  <span><strong>Imperial Maroon:</strong> Fortresses & Stone Architecture</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500 leading-relaxed font-serif italic">
                Tap any state or district boundary to open its verified cultural dossier.
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-1">
                <span className="font-bold text-[11px] text-stone-900 block">From Map to Impact</span>
                <p className="text-[10px] text-stone-600 leading-tight">
                  Every pin on Dharohar bridges ancient civilizational memory to living master artisans, authentic workshops, and verifiable cryptographic proof.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* IVR / Toll-Free Heritage Helpline */}
        <div className="relative">
          <button
            onClick={() => {
              setIvrOpen(!ivrOpen);
              setLayersOpen(false);
              setLegendOpen(false);
            }}
            className={`p-2.5 rounded-2xl backdrop-blur-xl border transition-all shadow-md flex items-center justify-center ${
              ivrOpen
                ? "bg-sky-600 text-white border-sky-500"
                : "bg-white/95 hover:bg-stone-50 text-stone-700 hover:text-teal-600 border-[#e7dfd5]"
            }`}
            title="Heritage Helpline / IVR"
          >
            <Phone className="w-5 h-5" />
            <span className="sr-only">Heritage Helpline</span>
          </button>

          {ivrOpen && (
            <div className="absolute top-0 right-14 w-64 bg-white/98 backdrop-blur-2xl border border-[#e7dfd5] rounded-2xl shadow-2xl p-4 space-y-2 text-xs animate-in fade-in slide-in-from-right-2 text-stone-800">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 font-bold text-stone-900">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>DHAROHAR Heritage Helpline</span>
                </span>
                <button
                  onClick={() => setIvrOpen(false)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Speak to a heritage guide in <strong>Hindi</strong> or <strong>English</strong>. Ask about crafts, directions, artisan workshops, or cultural events near you.
              </p>
              <div className="flex items-center gap-2 p-2 bg-teal-50 rounded-xl border border-teal-200">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-sm font-bold text-teal-800">1800-XXX-XXXX</span>
                <span className="text-[10px] text-teal-600">(Toll-Free)</span>
              </div>
              <p className="text-[10px] text-stone-400 italic">IVR system integration pending deployment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
