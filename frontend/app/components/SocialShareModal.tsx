"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Download, Share2, Copy, Check, MessageCircle } from "lucide-react";

export interface ShareItem {
  title: string;
  category: string;
  location: string;
  quoteOrDesc: string;
  url: string;
  imageUrl?: string;
  tag?: string;
}

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ShareItem | null;
}

export default function SocialShareModal({ isOpen, onClose, item }: SocialShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) return;

    // Render Canvas Poster (1200 x 630 standard open-graph landscape)
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setGenerating(true);
    setCanvasReady(false);

    canvas.width = 1200;
    canvas.height = 630;

    // Background Gradient (Deep regal obsidian into rich terracotta)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, "#1c1917"); // stone-900
    bgGrad.addColorStop(0.6, "#292524"); // stone-800
    bgGrad.addColorStop(1, "#451a03"); // amber-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative Borders & Corner Accents
    ctx.strokeStyle = "rgba(217, 119, 6, 0.4)"; // amber-600
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 550);

    // Top Header: Brand Name
    ctx.fillStyle = "#d97706"; // amber-600
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillText("D H A R O H A R", 70, 95);

    ctx.fillStyle = "#a8a29e"; // stone-400
    ctx.font = "italic 18px sans-serif";
    ctx.fillText("India's Living Heritage — Places, People, Stories & Proof", 70, 125);

    // Divider Line
    ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, 145);
    ctx.lineTo(1130, 145);
    ctx.stroke();

    // Category & Location Tag
    const tagText = `${(item.category || "Heritage").toUpperCase()} • ${(item.location || "India").toUpperCase()}`;
    ctx.fillStyle = "#f59e0b"; // amber-500
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(tagText, 70, 200);

    // Title (Wrapped)
    ctx.fillStyle = "#fafaf9"; // stone-50
    ctx.font = "bold 44px Georgia, serif";
    const words = item.title.split(" ");
    let line = "";
    let y = 260;
    const maxWidth = 1050;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 70, y);
        line = words[i] + " ";
        y += 55;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, y);

    // Quote / Description Preview
    y += 45;
    ctx.fillStyle = "#d6d3d1"; // stone-300
    ctx.font = "22px Georgia, serif";
    const desc = item.quoteOrDesc ? `"${item.quoteOrDesc.slice(0, 180)}..."` : "";
    
    const descWords = desc.split(" ");
    let descLine = "";
    for (let i = 0; i < descWords.length; i++) {
      const testLine = descLine + descWords[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(descLine, 70, y);
        descLine = descWords[i] + " ";
        y += 35;
        if (y > 510) break;
      } else {
        descLine = testLine;
      }
    }
    if (y <= 510) ctx.fillText(descLine, 70, y);

    // Footer Verified Seal & URL
    ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
    ctx.fillRect(70, 535, 1060, 50);

    ctx.fillStyle = "#fbbf24"; // amber-400
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("✓ VERIFIED LIVING CULTURAL TRADITION", 90, 566);

    ctx.fillStyle = "#e7e5e4";
    ctx.font = "16px monospace";
    ctx.fillText("Explore on Dharohar Cultural Atlas", 750, 566);

    setGenerating(false);
    setCanvasReady(true);
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `dharohar-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${item.title} — Dharohar Living Heritage`,
          text: `Discover ${item.title} (${item.location}) on the Dharohar Living Cultural Atlas:`,
          url: item.url
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const shareText = encodeURIComponent(`Explore "${item.title}" from ${item.location} on Dharohar — India's Living Heritage Atlas: `);
  const encodedUrl = encodeURIComponent(item.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-100">
              Share Living Heritage
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Card Canvas Preview */}
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Branded Social Card Preview
            </label>
            <div className="w-full aspect-[1200/630] rounded-2xl overflow-hidden border border-stone-700/60 shadow-lg bg-stone-950 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Direct Share Options */}
          <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wider text-stone-400 uppercase">
              Instant Share
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              {/* X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors border border-stone-700"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Post</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-sky-800 hover:bg-sky-700 text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* Native Mobile Share */}
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-stone-950 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share App</span>
              </button>
            </div>
          </div>

          {/* Copy Link & Download Poster */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {/* Download Card PNG */}
            <button
              onClick={handleDownload}
              disabled={!canvasReady}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 hover:text-amber-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Poster (PNG)</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopy}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-amber-700/70 hover:bg-amber-600 text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Direct Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
