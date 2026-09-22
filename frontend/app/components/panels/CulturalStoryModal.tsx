"use client";

import { useState, useEffect } from "react";
import { X, Volume2, VolumeX, ChevronRight, ChevronLeft } from "lucide-react";
import { CulturalStory } from "../map/mapTypes";
import { geoAPI } from "@/lib/api";

interface CulturalStoryModalProps {
  storySlug: string | null;
  onClose: () => void;
}

export default function CulturalStoryModal({ storySlug, onClose }: CulturalStoryModalProps) {
  const [story, setStory] = useState<CulturalStory | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!storySlug) {
      setStory(null);
      return;
    }

    setIsLoading(true);
    // Find story by item slug or direct story slug
    geoAPI
      .itemStory(storySlug)
      .then((res) => {
        setStory(res.data);
        setActiveChapterIndex(0);
      })
      .catch((err) => {
        console.error("Error loading cultural story:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [storySlug]);

  if (!storySlug) return null;

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const activeChap = story?.chapters?.[activeChapterIndex];
      const textToRead = activeChap ? `${activeChap.title}. ${activeChap.text}` : story?.audio_script || "";
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#faf7f2] border border-[#e7dfd5] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#1c1917]">
        {/* Header Controls: Back to Map & Close */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-stone-800 hover:text-sky-700 transition-colors border border-[#e7dfd5] shadow-lg text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← Back to Map</span>
          </button>
          <button
            onClick={onClose}
            className="pointer-events-auto p-2 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 transition-colors border border-[#e7dfd5] shadow-lg cursor-pointer"
            title="Close Story View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading || !story ? (
          <div className="p-16 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
            <span className="font-serif">Loading living heritage story...</span>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-stone-900">
              {story.hero_image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={story.hero_image}
                  alt={story.title}
                  className="w-full h-full object-cover opacity-75"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-[#1c1917]/50 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-widest">
                    Living Cultural Narrative
                  </span>
                  <span className="text-[10px] text-stone-300 font-medium">
                    {story.chapters.length} Chapters
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                  {story.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 font-serif italic">
                  {story.subtitle}
                </p>
              </div>
            </div>

            {/* Audio Bar & Chapter Indicators */}
            <div className="px-6 py-3 border-b border-[#e7dfd5] bg-white/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {story.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      if (isPlayingAudio) {
                        window.speechSynthesis.cancel();
                        setIsPlayingAudio(false);
                      }
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      activeChapterIndex === idx
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-white text-stone-600 border border-[#e7dfd5] hover:bg-stone-50"
                    }`}
                  >
                    Chapter {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={toggleSpeech}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] text-sky-700 text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow-sm"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Chapter</span>
                  </>
                )}
              </button>
            </div>

            {/* Chapter Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {story.chapters[activeChapterIndex] && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {story.chapters[activeChapterIndex].title}
                  </h3>

                  {story.chapters[activeChapterIndex].image && (
                    <div className="w-full h-52 rounded-2xl overflow-hidden bg-stone-100 border border-[#e7dfd5] shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.chapters[activeChapterIndex].image}
                        alt={story.chapters[activeChapterIndex].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-sm text-stone-800 leading-relaxed font-serif whitespace-pre-line bg-white p-5 rounded-2xl border border-[#e7dfd5] shadow-sm">
                    {story.chapters[activeChapterIndex].text}
                  </p>
                </div>
              )}
            </div>

            {/* Chapter Navigation Footer */}
            <div className="p-4 border-t border-[#e7dfd5] bg-white/80 flex items-center justify-between">
              <button
                onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeChapterIndex === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-stone-700 transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="text-xs text-stone-500 font-medium">
                Chapter {activeChapterIndex + 1} of {story.chapters.length}
              </span>

              <button
                onClick={() =>
                  setActiveChapterIndex((prev) => Math.min(story.chapters.length - 1, prev + 1))
                }
                disabled={activeChapterIndex === story.chapters.length - 1}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
