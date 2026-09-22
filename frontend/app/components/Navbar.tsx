"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { 
  Bookmark, 
  Sparkles, 
  Navigation, 
  Layers, 
  Compass, 
  Menu, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  BookOpen, 
  QrCode,
  Users
} from "lucide-react";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Navbar() {
  const [timeStr, setTimeStr] = useState("9:41am");
  const [dateStr, setDateStr] = useState("22 September, 2026");
  const [menuOpen, setMenuOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { artisanId, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}${ampm}`);
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      setDateStr(`${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentArtisanId = mounted
    ? artisanId || (typeof window !== "undefined" ? localStorage.getItem("artisan_id") : null)
    : null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#e7dfd5] text-stone-900 shadow-sm">
        <div className="shell flex items-center justify-between py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 border border-amber-500/40">
              <Sparkles className="w-4 h-4 text-white fill-white/30" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-900 block leading-none group-hover:text-amber-800 transition-colors">
                DHAROHAR
              </span>
              <span className="text-[10px] text-amber-800 font-medium tracking-wider block mt-0.5 font-serif italic">
                India, in Every Story.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3.5 text-xs font-semibold text-stone-700">
            <Link href="/" className="hover:text-sky-700 transition-colors">
              Living Atlas
            </Link>
            <Link
              href="/around-me"
              className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 hover:bg-emerald-100 transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Around Me</span>
            </Link>
            <Link href="/workshops" className="hover:text-sky-700 transition-colors">
              Workshops
            </Link>
            <Link href="/artisan/register" className="hover:text-sky-700 transition-colors">
              Artisan
            </Link>
            <Link href="/verify" className="hover:text-sky-700 transition-colors">
              Verify
            </Link>
            <Link href="/verifier" className="hover:text-sky-700 transition-colors">
              Verifier
            </Link>

            {/* Why Dharohar? Modal Trigger */}
            <button
              onClick={() => setWhyModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer text-xs font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Why Dharohar?</span>
            </button>
          </nav>

          {/* Right Actions Toolbar */}
          <div className="flex items-center gap-3">
            {/* Passport Bookmarks Button */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#e7dfd5] text-xs font-semibold text-stone-800 transition-colors shadow-sm cursor-pointer"
              title="Open My Heritage Passport"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Passport</span>
            </button>

            {/* Time Display */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#e7dfd5] bg-white text-xs text-stone-500 shadow-sm">
              <span className="text-stone-400 font-medium">IST</span>
              <span className="font-semibold text-stone-800 tabular-nums">{timeStr}</span>
              <span className="text-stone-300">·</span>
              <span>{dateStr}</span>
            </div>

            {mounted && currentArtisanId ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/artisan/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition shadow-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    if (typeof window !== "undefined") {
                      localStorage.clear();
                      window.location.href = "/";
                    }
                  }}
                  className="text-xs text-stone-500 hover:text-rose-600 transition font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e7dfd5] bg-white text-xs font-semibold text-stone-800 shadow-sm cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Favorites Passport Drawer */}
      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* "Why Dharohar?" Explainer Modal */}
      {whyModalOpen && (
        <div className="fixed inset-0 z-[150] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="bg-[#FAF6EE] border border-[#e7dfd5] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-900 font-sans relative">
            <button
              onClick={() => setWhyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white hover:bg-stone-100 border border-[#e7dfd5] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                  Product Vision & Impact
                </span>
                <span className="text-xs text-stone-500">SIH National Cultural Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Why Dharohar?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif italic">
                India is not a flat territory on a screen. It is an unbroken tapestry of 4,000 years of living civilizational knowledge.
              </p>
            </div>

            {/* The Problem & The Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1.5">
                <div className="font-bold text-rose-900">The Challenge</div>
                <p className="text-stone-600 leading-relaxed">
                  India&apos;s cultural heritage is fragmented across disconnected directories, generic travel blogs, and unverified social posts. Rural artisans and village master traditions remain invisible.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                <div className="font-bold text-emerald-900">The Dharohar Engine</div>
                <p className="text-stone-600 leading-relaxed">
                  A hierarchical, verifiable living atlas that drills from India → State → District → Tehsil → Village → Master Artisan, backed by immutable SHA-256 provenance.
                </p>
              </div>
            </div>

            {/* The Living Product Loop */}
            <div className="p-4 rounded-2xl bg-white border border-[#e7dfd5] space-y-2.5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                The 9-Step Living Heritage Loop
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-700 flex-wrap gap-1">
                {["Discover", "Explore", "Understand", "Verify", "Experience", "Visit", "Support", "Share", "Preserve"].map((step, i) => (
                  <span key={step} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                      {i + 1}. {step}
                    </span>
                    {i < 8 && <span className="text-stone-300">→</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* 3-Tier Verification Hierarchy */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Authoritative Source Auditing
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">Tier 1: Official Government Verified</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Archaeological Survey of India (ASI), Ministry of Culture, MoFPI ODOP Gazette, GI Registry of India, Haryana Tourism Corporation.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">Tier 2: Institutional & Scholarly Sourced</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Sangeet Natak Akademi, Lalit Kala Akademi, UNESCO ICH listings, ICAR documentation, university archaeological reports.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200 flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">Tier 3: Community & Grassroots Audited</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Field verified by verifiers, village panchayat records, oral lineages awaiting formal gazette notification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e7dfd5] flex items-center justify-between">
              <span className="text-[11px] text-stone-500 italic">
                Dharohar — Built for Smart India Hackathon
              </span>
              <button
                onClick={() => setWhyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Atlas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Mobile Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[120] bg-[#FAF6EE] text-stone-900 flex flex-col p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-[#e7dfd5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4 text-white fill-white/40" />
              </div>
              <div>
                <span className="text-lg font-serif font-bold tracking-tight text-stone-900">DHAROHAR</span>
                <span className="text-[10px] text-stone-500 block">India&apos;s Living Heritage</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl border border-[#e7dfd5] bg-white text-xs text-stone-700 hover:bg-stone-100 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center gap-3 text-base font-semibold max-w-xl">
            <Link onClick={() => setMenuOpen(false)} href="/" className="hover:text-sky-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>01. Home</span>
              <span className="text-xs text-stone-500 font-normal">Living Atlas</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/around-me" className="text-emerald-800 hover:text-emerald-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>02. 📍 Heritage Around Me</span>
              <span className="text-xs text-emerald-600 font-normal">Geodesic Discovery</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/workshops" className="hover:text-sky-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>03. Artisan Workshops</span>
              <span className="text-xs text-stone-500 font-normal">Master Crafts</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/artisan/register" className="hover:text-sky-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>04. Practitioner Onboarding</span>
              <span className="text-xs text-stone-500 font-normal">Voice & Form Registration</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/verify" className="hover:text-sky-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>05. Public Provenance Verify</span>
              <span className="text-xs text-stone-500 font-normal">SHA-256 Ledger Scan</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/verifier" className="hover:text-sky-700 flex items-center justify-between py-2 border-b border-stone-200">
              <span>06. Verifier Desk</span>
              <span className="text-xs text-stone-500 font-normal">Human-in-the-Loop Review</span>
            </Link>
            <button 
              onClick={() => {
                setMenuOpen(false);
                setWhyModalOpen(true);
              }} 
              className="text-amber-800 hover:text-amber-900 flex items-center justify-between py-2 border-b border-stone-200 text-left font-bold"
            >
              <span>07. ✦ Why Dharohar?</span>
              <span className="text-xs text-amber-700 font-normal">Vision & Impact</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-[#e7dfd5] flex justify-between items-center text-xs text-stone-500">
            <span>Dharohar Platform</span>
            <span>India&apos;s Living Heritage</span>
          </div>
        </div>
      )}
    </>
  );
}
