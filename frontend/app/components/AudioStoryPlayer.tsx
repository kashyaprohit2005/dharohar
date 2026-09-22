"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  Sparkles 
} from "lucide-react";

interface AudioStoryPlayerProps {
  title: string;
  category?: string;
  location?: string;
  storyText: string;
  audioUrl?: string | null;
  autoPlay?: boolean;
}

export default function AudioStoryPlayer({
  title,
  category = "Oral Tradition",
  location = "India",
  storyText,
  audioUrl,
  autoPlay = false
}: AudioStoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [usingSpeechSynth, setUsingSpeechSynth] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Synthesis Utterance for text fallback
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const cleanText = storyText.replace(/[\r\n]+/g, " ");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speed;
      utterance.pitch = 1.0;

      // Estimate duration from word count (approx 130 words per min)
      const words = cleanText.split(" ").length;
      const estimatedSecs = Math.max(20, Math.round((words / 130) * 60));
      setDuration(estimatedSecs);

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(estimatedSecs);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      };

      speechRef.current = utterance;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [storyText]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (isPlaying) {
      // Pause
      if (audioRef.current && !usingSpeechSynth) {
        audioRef.current.pause();
      } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setIsPlaying(false);
    } else {
      // Start Play
      if (audioUrl && audioRef.current) {
        audioRef.current.playbackRate = speed;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setUsingSpeechSynth(false);
        }).catch(() => {
          // Fallback to speech synthesis if real audio url fails to load
          playSpeechSynth();
        });
      } else {
        playSpeechSynth();
      }
    }
  };

  const playSpeechSynth = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && speechRef.current) {
      window.speechSynthesis.cancel();
      speechRef.current.rate = speed;
      window.speechSynthesis.speak(speechRef.current);
      setIsPlaying(true);
      setUsingSpeechSynth(true);

      const startTime = Date.now() - (currentTime * 1000);
      progressTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(Math.min(duration, Math.round(elapsed)));
        setProgress(Math.min(100, (elapsed / duration) * 100));
      }, 500);
    }
  };

  const handleRestart = () => {
    if (audioRef.current && !usingSpeechSynth) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) audioRef.current.play();
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setSpeed(newSpeed);

    if (audioRef.current && !usingSpeechSynth) {
      audioRef.current.playbackRate = newSpeed;
    } else if (isPlaying) {
      // Re-trigger speech with updated rate
      if (speechRef.current) speechRef.current.rate = newSpeed;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-600/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Hidden real audio element if url provided */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(Math.round(audioRef.current.currentTime));
              setDuration(Math.round(audioRef.current.duration) || duration);
              setProgress((audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(100);
          }}
        />
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Listen to India
              </span>
              <span className="text-xs text-stone-500">•</span>
              <span className="text-xs text-stone-400">{category}</span>
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-stone-100 line-clamp-1">
              {title}
            </h4>
          </div>
        </div>

        {/* Speed Toggle */}
        <button
          onClick={handleSpeedChange}
          className="px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300 bg-stone-800/80 hover:bg-stone-700 border border-amber-600/20 transition-colors"
          title="Playback Speed"
        >
          {speed}x
        </button>
      </div>

      {/* Audio Waveform / Visualizer Animation */}
      <div className="flex items-center justify-center gap-1.5 h-10 py-1">
        {[40, 75, 55, 90, 30, 80, 65, 95, 50, 85, 35, 70, 90, 45, 60, 80, 50, 75, 40, 85].map((h, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-amber-400"
                : i <= (progress / 100) * 20
                ? "bg-amber-500/60"
                : "bg-stone-700"
            }`}
            style={{
              height: isPlaying ? `${Math.max(15, (h * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : `${h * 0.4}%`,
              transition: isPlaying ? "height 0.15s ease" : "height 0.3s ease"
            }}
          />
        ))}
      </div>

      {/* Seek Progress Bar */}
      <div className="space-y-1.5">
        <div className="relative w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls Toolbar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {/* Main Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
            title={isPlaying ? "Pause Story" : "Play Oral Story"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Reset / Rewind */}
          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl text-stone-400 hover:text-stone-200 bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 transition-colors"
            title="Rewind to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Transcript Expander Toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-amber-300 bg-stone-800/80 hover:bg-stone-700 border border-stone-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showTranscript ? "Hide Transcript" : "Read Transcript"}</span>
          {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Oral Narrative Transcript Body */}
      {showTranscript && (
        <div className="mt-4 pt-4 border-t border-stone-800 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oral Memory & Lore of {location}</span>
          </div>
          <p className="font-serif text-sm sm:text-base text-stone-200 leading-relaxed italic bg-black/40 p-4 rounded-2xl border border-stone-800">
            "{storyText}"
          </p>
        </div>
      )}
    </div>
  );
}
