"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MapPin, 
  Layers, 
  Mic, 
  RotateCcw, 
  Info, 
  X, 
  Check, 
  Volume2, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass
} from "lucide-react";

export interface LayerState {
  crafts: boolean;
  places: boolean;
  food: boolean;
  events: boolean;
  knowledge: boolean;
}

interface IndiaMapToolbarProps {
  onSearchOpen: () => void;
  onRecenter: () => void;
  layers: LayerState;
  onToggleLayer: (key: keyof LayerState) => void;
  selectedState?: string;
  onSelectState?: (state: string) => void;
  onVoiceTrigger?: (query: string) => void;
}

export default function IndiaMapToolbar({
  onSearchOpen,
  onRecenter,
  layers,
  onToggleLayer,
  selectedState = "ALL",
  onSelectState,
  onVoiceTrigger,
}: IndiaMapToolbarProps) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);

  const startVoiceRecognition = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      setVoiceListening(true);
      setVoiceResponse(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        setVoiceListening(false);
        handleVoiceQuery(transcript);
      };

      recognition.onerror = () => {
        setVoiceListening(false);
      };

      recognition.onend = () => {
        setVoiceListening(false);
      };

      recognition.start();
    } else {
      // Fallback for browsers without speech recognition API
      setVoiceListening(false);
      setVoiceResponse("Voice input ready. Type or tap an example question below.");
    }
  };

  const handleVoiceQuery = (query: string) => {
    const q = query.toLowerCase();
    if (onVoiceTrigger) {
      onVoiceTrigger(query);
    }

    if (q.includes("panipat") || q.includes("craft") || q.includes("loom")) {
      setVoiceResponse("Panipat is India's historic Weaving City. In Samalkha and Hathwala villages, artisans practice authentic Punja handloom weaving.");
      if (onSelectState) onSelectState("Haryana");
    } else if (q.includes("hansi") || q.includes("fort")) {
      setVoiceResponse("Hansi features the historic 12th-century Asigarh Fort of Prithviraj Chauhan and the Char Qutub Sufi sanctuary.");
      if (onSelectState) onSelectState("Haryana");
    } else if (q.includes("kurukshetra") || q.includes("gita") || q.includes("temple")) {
      setVoiceResponse("Kurukshetra is the cradle of the Bhagavad Gita at Jyotisar, holding Brahma Sarovar and the Sheikh Chilli monument.");
      if (onSelectState) onSelectState("Haryana");
    } else if (q.includes("village") || q.includes("rural")) {
      setVoiceResponse("Haryana has a verified registry of 41+ settlements. Hathwala has active weaving documentation, while unverified villages state: 'Geographic record available. Cultural documentation not yet verified.'");
    } else {
      setVoiceResponse(`Searching Dharohar cultural database for "${query}"...`);
    }
  };

  return (
    <aside aria-label="Atlas navigation tools" className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2.5 pointer-events-auto select-none">
      {/* Floating Action Button Column (Warm Ivory / Parchment) */}
      <div className="flex flex-col items-center gap-2 p-1.5 rounded-2xl bg-[#FAF6EE]/95 backdrop-blur-md border border-[#E0D5BE] shadow-xl text-[#2A2421]">
        
        {/* 1. Search */}
        <button
          onClick={onSearchOpen}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#EFE7D5] text-[#78350F] transition border border-transparent hover:border-[#E0D5BE]"
          title="Search places, crafts, food, traditions..."
        >
          <Search className="w-4 h-4" />
        </button>

        {/* 2. Around Me (Section 11 Requirement) */}
        <Link
          href="/around-me"
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#EFE7D5] text-[#B45309] transition border border-transparent hover:border-[#E0D5BE]"
          title="Explore Cultural Heritage Around Me"
        >
          <MapPin className="w-4 h-4 text-[#B45309]" />
        </Link>

        {/* 3. Layers Toggle */}
        <button
          onClick={() => {
            setLayersOpen(!layersOpen);
            setLegendOpen(false);
            setVoiceOpen(false);
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
            layersOpen
              ? "bg-[#2A2421] text-white border-[#2A2421]"
              : "hover:bg-[#EFE7D5] text-[#78350F] border-transparent hover:border-[#E0D5BE]"
          }`}
          title="Cultural Layers"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* 4. Voice Guide (Section 37 Requirement) */}
        <button
          onClick={() => {
            setVoiceOpen(!voiceOpen);
            setLayersOpen(false);
            setLegendOpen(false);
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
            voiceOpen
              ? "bg-[#B45309] text-white border-[#B45309]"
              : "hover:bg-[#EFE7D5] text-[#78350F] border-transparent hover:border-[#E0D5BE]"
          }`}
          title="Cultural Voice Guide"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* 5. Recenter */}
        <button
          onClick={onRecenter}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#EFE7D5] text-[#78350F] transition border border-transparent hover:border-[#E0D5BE]"
          title="Recenter to All-India View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 6. Legend */}
        <button
          onClick={() => {
            setLegendOpen(!legendOpen);
            setLayersOpen(false);
            setVoiceOpen(false);
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition border ${
            legendOpen
              ? "bg-[#2A2421] text-white border-[#2A2421]"
              : "hover:bg-[#EFE7D5] text-[#78350F] border-transparent hover:border-[#E0D5BE]"
          }`}
          title="Map Legend & Verification Standards"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* EXPANDABLE PANEL 1: CULTURAL LAYERS (Section 72 - Starts Collapsed) */}
      {layersOpen && (
        <div className="w-64 p-4 rounded-2xl bg-[#FAF6EE]/98 backdrop-blur-md border border-[#E0D5BE] shadow-2xl space-y-3 animate-fadeIn text-[#2A2421]">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#78350F]">
              Cultural Layers
            </span>
            <button onClick={() => setLayersOpen(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              { key: "crafts", label: "Crafts, Textiles & Weaves", icon: "🏺" },
              { key: "places", label: "Citadels, Forts & Shrines", icon: "🏰" },
              { key: "food", label: "Regional Food & Dhabas", icon: "🍲" },
              { key: "events", label: "Live Fairs & Melas", icon: "🎪" },
              { key: "knowledge", label: "Rural Practices & Knowledge", icon: "🌿" },
            ].map((layer) => {
              const isActive = layers[layer.key as keyof LayerState];
              return (
                <button
                  key={layer.key}
                  onClick={() => onToggleLayer(layer.key as keyof LayerState)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left ${
                    isActive
                      ? "bg-white border border-[#E0D5BE] text-[#1C1917] font-semibold shadow-xs"
                      : "text-stone-400 hover:text-stone-700 hover:bg-[#EFE7D5]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{layer.icon}</span>
                    <span>{layer.label}</span>
                  </span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isActive ? "bg-[#B45309] text-white" : "border border-stone-300"
                  }`}>
                    {isActive && <Check className="w-2.5 h-2.5" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* EXPANDABLE PANEL 2: VOICE CULTURAL GUIDE (Section 37) */}
      {voiceOpen && (
        <div className="w-80 p-4 rounded-2xl bg-[#FAF6EE]/98 backdrop-blur-md border border-[#E0D5BE] shadow-2xl space-y-3 animate-fadeIn text-[#2A2421]">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <div className="flex items-center gap-1.5 text-[#B45309] font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dharohar Voice Guide</span>
            </div>
            <button onClick={() => setVoiceOpen(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && voiceInput.trim() && handleVoiceQuery(voiceInput)}
              placeholder="Ask: 'What can I explore in Panipat?'"
              className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#E0D5BE] text-xs text-[#2A2421] placeholder-stone-400 focus:outline-none focus:border-[#B45309]"
            />
            <button
              onClick={startVoiceRecognition}
              className={`p-2 rounded-xl text-white transition ${
                voiceListening ? "bg-rose-600 animate-pulse" : "bg-[#B45309] hover:bg-[#92400E]"
              }`}
              title="Speak Question"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

          {voiceListening && (
            <div className="text-[11px] text-[#B45309] font-medium flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>Listening to your voice...</span>
            </div>
          )}

          {voiceResponse && (
            <div className="p-3 rounded-xl bg-white border border-[#E0D5BE] text-xs text-[#3D3531] space-y-1 shadow-xs">
              <div className="font-bold text-[#B45309] flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Verified Response:</span>
              </div>
              <p className="leading-relaxed font-serif">{voiceResponse}</p>
            </div>
          )}

          {/* Preset Example Prompts */}
          <div className="space-y-1 pt-1 border-t border-[#E8DFC8]">
            <span className="text-[10px] text-stone-500 uppercase font-semibold">Example Queries:</span>
            {[
              "What can I explore in Panipat?",
              "Tell me about Hansi Fort.",
              "Which villages have cultural records?",
              "Show me sacred places in Kurukshetra."
            ].map((eg, i) => (
              <button
                key={i}
                onClick={() => {
                  setVoiceInput(eg);
                  handleVoiceQuery(eg);
                }}
                className="w-full text-left text-[11px] text-[#78350F] hover:text-[#B45309] hover:underline truncate"
              >
                • {eg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EXPANDABLE PANEL 3: MAP LEGEND (Section 71) */}
      {legendOpen && (
        <div className="w-72 p-4 rounded-2xl bg-[#FAF6EE]/98 backdrop-blur-md border border-[#E0D5BE] shadow-2xl space-y-3 animate-fadeIn text-[#2A2421]">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#78350F]">
              Atlas Legend & Trust
            </span>
            <button onClick={() => setLegendOpen(false)} className="text-stone-400 hover:text-stone-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="font-semibold text-stone-500 block text-[10px] uppercase mb-1">
                Verification Standards:
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-stone-700 font-medium">✓ Verified Living Record (ASI / GI / Govt)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-stone-700 font-medium">◐ Under Cultural Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                  <span className="text-stone-500 italic">○ Geographic Record Available</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DFC8]">
              <span className="font-semibold text-stone-500 block text-[10px] uppercase mb-1">
                Regional Palette:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#b15f2c]"></span>
                  <span>North & West (Terracotta)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#0f766e]"></span>
                  <span>South & East (Emerald)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#d48b28]"></span>
                  <span>Central (Antique Brass)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#1e3a8a]"></span>
                  <span>Himalayan (Indigo)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
