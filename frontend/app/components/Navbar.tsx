"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Bookmark, Sparkles, Navigation, Layers, Compass, Menu, X } from "lucide-react";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Navbar() {
  const [timeStr, setTimeStr] = useState("9:41am");
  const [dateStr, setDateStr] = useState("21 September, 2026");
  const [menuOpen, setMenuOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
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
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80 text-stone-100">
        <div className="shell flex items-center justify-between py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md shadow-amber-950/50 transition-transform group-hover:scale-105 border border-amber-500/40">
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/40" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-tight text-stone-50 block leading-none group-hover:text-amber-300 transition-colors">
                Dharohar
              </span>
              <span className="text-[10px] text-stone-400 font-medium tracking-wider uppercase block mt-0.5">
                Living Heritage • People • Proof
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-stone-300">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link
              href="/around-me"
              className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>📍 Around Me</span>
            </Link>
            <Link href="/map" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>Cultural Atlas</span>
            </Link>
            <Link href="/heritage" className="hover:text-amber-400 transition-colors">
              Traditions
            </Link>
            <Link href="/contribute" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span className="text-amber-400">+</span>
              <span>Contribute</span>
            </Link>
            <Link href="/artisan/register" className="hover:text-amber-400 transition-colors">
              Join Artisan
            </Link>
            <Link
              href={currentArtisanId ? "/artisan/dashboard" : "/artisan/login"}
              className="hover:text-amber-400 transition-colors"
            >
              Artisan Desk
            </Link>
            <Link href="/verify" className="hover:text-amber-400 transition-colors">
              Verify QR
            </Link>
            <Link href="/verifier" className="hover:text-amber-400 transition-colors">
              Verifier Desk
            </Link>
          </nav>

          {/* Right Actions Toolbar */}
          <div className="flex items-center gap-3">
            {/* Passport Bookmarks Button */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-semibold text-amber-300 transition-colors"
              title="Open My Heritage Passport"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-400/20" />
              <span className="hidden sm:inline">Passport</span>
            </button>

            {/* Time Display */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900/60 text-xs text-stone-400">
              <span className="text-stone-500">IST</span>
              <span className="font-semibold text-stone-200 tabular-nums">{timeStr}</span>
              <span className="text-stone-600">·</span>
              <span>{dateStr}</span>
            </div>

            {mounted && currentArtisanId ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/artisan/dashboard"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-stone-950 text-xs font-bold hover:bg-amber-500 transition"
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
                  className="text-xs text-stone-400 hover:text-rose-400 transition font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="xl:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-stone-900 text-xs font-semibold text-stone-200"
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

      {/* Full-screen Mobile Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[120] bg-stone-950 text-stone-100 flex flex-col p-6 sm:p-10 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
                <Sparkles className="w-4 h-4 text-stone-950 fill-stone-950" />
              </div>
              <div>
                <span className="text-lg font-serif font-bold tracking-tight">Dharohar</span>
                <span className="text-[10px] text-stone-400 block">India's Living Heritage</span>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl border border-stone-800 text-xs text-stone-300 hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center gap-4 text-lg font-semibold max-w-xl">
            <Link onClick={() => setMenuOpen(false)} href="/" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>01. Home</span>
              <span className="text-xs text-stone-500 font-normal">Living Heritage</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/around-me" className="text-amber-400 hover:text-amber-300 flex items-center justify-between py-1 border-b border-stone-900">
              <span>02. 📍 Heritage Around Me</span>
              <span className="text-xs text-amber-400/80 font-normal">Geodesic Discovery</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/map" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>03. Cultural Atlas</span>
              <span className="text-xs text-stone-500 font-normal">Interactive India Map</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/heritage" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>04. Traditions Registry</span>
              <span className="text-xs text-stone-500 font-normal">15 Cultural Domains</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/contribute" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>05. + Contribute Heritage</span>
              <span className="text-xs text-stone-500 font-normal">Community Mapping</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/artisan/register" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>06. Practitioner Onboarding</span>
              <span className="text-xs text-stone-500 font-normal">Voice & Form Registration</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href={currentArtisanId ? "/artisan/dashboard" : "/artisan/login"} className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>07. Artisan Passport</span>
              <span className="text-xs text-stone-500 font-normal">Batches, QR & Ledger</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/verify" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>08. Public Provenance Verify</span>
              <span className="text-xs text-stone-500 font-normal">SHA-256 Ledger Scan</span>
            </Link>
            <Link onClick={() => setMenuOpen(false)} href="/verifier" className="hover:text-amber-400 flex items-center justify-between py-1 border-b border-stone-900">
              <span>09. Verifier Desk</span>
              <span className="text-xs text-stone-500 font-normal">Human-in-the-Loop Review</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-stone-800 flex justify-between items-center text-xs text-stone-500">
            <span>Dharohar Platform</span>
            <span>India's Living Heritage</span>
          </div>
        </div>
      )}
    </>
  );
}
