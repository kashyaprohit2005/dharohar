"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Heritage3DViewer from "./components/Heritage3DViewer";
import EventCard, { CulturalEventData } from "./components/EventCard";
import SocialShareModal, { ShareItem } from "./components/SocialShareModal";
import { heritageAPI } from "@/lib/api";
import { CULTURAL_DOMAINS } from "./data/indiaGeoData";
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  Flame, 
  ExternalLink,
  Award,
  Box,
  QrCode
} from "lucide-react";
import axios from "axios";

const IndiaMap = dynamic(() => import("./components/IndiaMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] rounded-3xl bg-[#FAF6EE] flex flex-col items-center justify-center text-sm text-[#78350F] border border-[#E2D8C3] shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#B45309] border-t-transparent animate-spin"></div>
        <span className="font-serif font-semibold">Opening India's living cultural atlas…</span>
      </div>
      <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase mt-2">Dharohar • Preserving Heritage</span>
    </div>
  ),
});

export default function HomePage() {
  const [heritageList, setHeritageList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<CulturalEventData[]>([]);
  const [atRiskList, setAtRiskList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareItem, setShareItem] = useState<ShareItem | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      heritageAPI.list(),
      heritageAPI.atRisk(),
      axios.get("http://localhost:8000/api/events").then(res => res.data).catch(() => [])
    ])
      .then(([allRes, atRiskRes, evData]) => {
        if (Array.isArray(allRes.data)) setHeritageList(allRes.data);
        if (Array.isArray(atRiskRes.data)) setAtRiskList(atRiskRes.data);
        if (Array.isArray(evData)) setEventsList(evData);
      })
      .catch((err) => console.error("Error fetching homepage heritage:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleShareEvent = (ev: CulturalEventData) => {
    setShareItem({
      title: ev.title,
      category: ev.category,
      location: `${ev.venue}, ${ev.city}, ${ev.state}`,
      quoteOrDesc: ev.description,
      url: typeof window !== "undefined" ? `${window.location.origin}/map?event=${ev.event_id}` : `/map`,
      imageUrl: ev.image_url,
      tag: `Cultural Event • ${ev.status}`
    });
    setShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2A2421] flex flex-col font-sans selection:bg-[#E8DFC8] selection:text-[#2A2421]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6] via-[#FAF6EE] to-[#FAF6EE] pt-14 pb-20 border-b border-[#E5DCD0]">
          {/* Subtle Watermark */}
          <div className="absolute inset-x-0 bottom-2 text-center text-[#2A2421]/[0.03] text-7xl sm:text-9xl font-serif font-black tracking-widest pointer-events-none select-none">
            DHAROHAR
          </div>

          <div className="shell relative z-10 space-y-8">
            <div className="max-w-4xl space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D97706]/30 bg-[#FEF3C7]/60 text-xs font-bold uppercase tracking-wider text-[#92400E]">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Smart India Hackathon 2026 • Living Cultural Platform</span>
              </div>

              {/* H1 Primary Statement */}
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.06] text-[#2A2421]">
                India is not merely a memory.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#C2672B] to-[#97501F] block mt-2">
                  It is living culture in motion.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl text-[#5C524C] font-normal max-w-2xl leading-relaxed">
                Connect deeply to India's crafts, textiles, cuisine, sacred citadels, folk bards, and live festivals — anchored in verified evidence, living practitioners, and cryptographic proof.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/around-me"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3.5 text-sm font-bold shadow-md shadow-[#B45309]/20 hover:scale-[1.02] transition-all"
                >
                  <MapPin className="w-4 h-4 fill-current" />
                  <span>Heritage Around Me</span>
                </Link>

                <Link
                  href="/map"
                  className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-[#F3EBDD] text-[#2A2421] border border-[#D8CBBF] px-6 py-3.5 text-sm font-bold shadow-xs hover:scale-[1.02] transition-all"
                >
                  <Compass className="w-4 h-4 text-[#B45309]" />
                  <span>Explore Cultural Atlas</span>
                </Link>

                <Link
                  href="/artisan/register"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8CBBF] hover:border-[#B45309]/60 bg-white/70 text-[#2A2421] px-5 py-3.5 text-sm font-semibold hover:bg-white transition-colors"
                >
                  <span>Register Practitioner</span>
                  <ArrowRight className="w-4 h-4 text-[#B45309]" />
                </Link>

                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F3EBDD]/70 text-[#5C524C] border border-[#E5DCD0] hover:bg-white hover:text-[#2A2421] px-5 py-3.5 text-sm font-medium transition-colors"
                >
                  <QrCode className="w-4 h-4 text-[#8C7D73]" />
                  <span>Verify Provenance</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#E5DCD0]">
              <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DCD0] shadow-2xs">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#B45309] block">40+</span>
                <span className="text-xs text-[#786B63] uppercase tracking-wider font-semibold">Living Traditions</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DCD0] shadow-2xs">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#2A2421] block">15</span>
                <span className="text-xs text-[#786B63] uppercase tracking-wider font-semibold">Cultural Domains</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DCD0] shadow-2xs">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#C2410C] block">9</span>
                <span className="text-xs text-[#786B63] uppercase tracking-wider font-semibold">Verified Live Events</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 border border-[#E5DCD0] shadow-2xs">
                <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#15803D] block">100%</span>
                <span className="text-xs text-[#786B63] uppercase tracking-wider font-semibold">Source Backed</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE 15 CULTURAL DOMAINS STRIP */}
        <section className="py-12 bg-[#F6F0E6] border-b border-[#E5DCD0]">
          <div className="shell space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                  Living Culture Universe
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A2421]">
                  Explore by Cultural Domain
                </h2>
              </div>
              <Link
                href="/map"
                className="text-xs font-bold text-[#B45309] hover:text-[#92400E] inline-flex items-center gap-1"
              >
                <span>View Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {CULTURAL_DOMAINS.filter(d => d.id !== "all").map((dom) => (
                <Link
                  key={dom.id}
                  href={`/map?category=${dom.id}`}
                  className="group p-3.5 rounded-2xl bg-white hover:bg-[#FCF9F5] border border-[#E5DCD0] hover:border-[#B45309]/50 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                >
                  <div className="text-2xl">{dom.icon}</div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#2A2421] group-hover:text-[#B45309] transition-colors">
                      {dom.label}
                    </h3>
                    <span className="text-[11px] text-[#8C7D73] capitalize">Living Heritage</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LIVE EVENTS SECTION ("What's Happening in India?") */}
        {eventsList.length > 0 && (
          <section className="py-16 bg-[#FAF6EE] border-b border-[#E5DCD0]">
            <div className="shell space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#C2410C] text-xs font-bold uppercase tracking-wider mb-1">
                    <Flame className="w-4 h-4 fill-[#C2410C]" />
                    <span>Live Cultural Events Engine</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2A2421]">
                    What's Happening in India?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
                    Discover living festivals, craft exhibitions, and sacred ceremonies you can attend right now.
                  </p>
                </div>

                <Link
                  href="/map?filter=events"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] hover:bg-[#FEE2E2] transition-colors"
                >
                  <span>All Events ({eventsList.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsList.slice(0, 3).map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    onShare={handleShareEvent}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. INTERACTIVE MAP SECTION */}
        <section className="py-16 bg-[#F5EFE6] border-b border-[#E5DCD0]">
          <div className="shell space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                  Touch-First Interactive Atlas
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2A2421]">
                  The Living India Cultural Map
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
                  Pan, pinch-zoom, and explore living traditions, stepwells, forts, and active practitioners across India.
                </p>
              </div>

              <Link
                href="/map"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#B45309] text-white hover:bg-[#92400E] shadow-2xs transition-colors"
              >
                <span>Launch Fullscreen Atlas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="w-full rounded-3xl overflow-hidden shadow-md border border-[#E5DCD0] bg-[#FAF6EE]">
              <IndiaMap
                heritage={heritageList}
                events={eventsList}
                height="560px"
              />
            </div>
          </div>
        </section>

        {/* 5. 3D HERITAGE ARTIFACTS LAB */}
        <section className="py-16 bg-[#FAF6EE] border-b border-[#E5DCD0]">
          <div className="shell space-y-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                Interactive 3D Cultural Geometry
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2A2421] mt-1">
                Touch & Inspect India's Craftsmanship in 360°
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
                Explore real-time WebGL models of non-clay Blue Pottery, 3,500-step Chand Baori, and seismic-resistant Kath-Kuni masonry with interactive technical hotspots.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Blue Pottery Vase */}
              <div className="space-y-3 p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309] uppercase">Craft Geometry</span>
                  <span className="text-[10px] font-mono bg-[#F3EBDD] px-2 py-0.5 rounded text-[#786B63]">WebGL 360°</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2A2421]">Jaipur Blue Pottery Vase</h3>
                <Heritage3DViewer
                  modelType="BLUE_POTTERY_VASE"
                  title="Blue Pottery"
                  height="260px"
                />
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Crafted without potter's clay from quartz powder, recycled glass, and cobalt oxide.
                </p>
              </div>

              {/* Chand Baori Stepwell */}
              <div className="space-y-3 p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309] uppercase">Water Architecture</span>
                  <span className="text-[10px] font-mono bg-[#F3EBDD] px-2 py-0.5 rounded text-[#786B63]">13 Tiers</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2A2421]">Chand Baori Stepwell</h3>
                <Heritage3DViewer
                  modelType="CHAND_BAORI_MODEL"
                  title="Chand Baori"
                  height="260px"
                />
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  8th-century subterranean geometric cooling sanctuary with 3,500 interlocking stone steps.
                </p>
              </div>

              {/* Kath-Kuni Himalayan Architecture */}
              <div className="space-y-3 p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B45309] uppercase">Timber & Stone</span>
                  <span className="text-[10px] font-mono bg-[#F3EBDD] px-2 py-0.5 rounded text-[#786B63]">Seismic Interlock</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2A2421]">Kath-Kuni Himalayan Citadel</h3>
                <Heritage3DViewer
                  modelType="KATH_KUNI_TOWER"
                  title="Kath-Kuni Tower"
                  height="260px"
                />
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Interlocking deodar cedar beams and dry river stone surviving Himalayan earthquakes for centuries.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. END-TO-END JUDGE WALKTHROUGH PATH */}
        <section className="py-16 bg-[#F6F0E6] border-b border-[#E5DCD0]">
          <div className="shell space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
                End-to-End Live Walkthrough
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2A2421]">
                The Living Heritage Trust Architecture
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E55]">
                Dharohar unites cultural exploration with verifiable authenticity and economic empowerment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] font-bold">
                  01
                </div>
                <h3 className="font-serif text-base font-bold text-[#2A2421]">Explore & Discover</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Explore traditions, listen to audio narratives, view 3D models, and locate live cultural events nearby.
                </p>
                <Link href="/map" className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] hover:underline">
                  <span>Open Atlas</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] font-bold">
                  02
                </div>
                <h3 className="font-serif text-base font-bold text-[#2A2421]">Practitioner Onboarding</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Real artisans register live via multilingual voice or form to claim their generational lineage.
                </p>
                <Link href="/artisan/register" className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] hover:underline">
                  <span>Register Live</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] font-bold">
                  03
                </div>
                <h3 className="font-serif text-base font-bold text-[#2A2421]">Verifier Review</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Lead verifier reviews pending claims, verifies community submissions, and audits records.
                </p>
                <Link href="/verifier" className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] hover:underline">
                  <span>Verifier Desk</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5DCD0] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] font-bold">
                  04
                </div>
                <h3 className="font-serif text-base font-bold text-[#2A2421]">SHA-256 Provenance QR</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Mint cryptographic batches with immutable hash chains, generating verifiable buyer passports.
                </p>
                <Link href="/verify" className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] hover:underline">
                  <span>Scan & Verify</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E5DCD0] bg-[#F5EFE6] py-12 text-[#6B5E55] text-xs">
        <div className="shell flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-[#B45309] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-[#2A2421] block">DHAROHAR</span>
              <span className="text-[11px] text-[#8C7D73]">India's Living Heritage — Places, People, Stories & Proof</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[#5C524C]">
            <Link href="/around-me" className="hover:text-[#B45309]">Around Me</Link>
            <Link href="/map" className="hover:text-[#B45309]">Cultural Atlas</Link>
            <Link href="/heritage" className="hover:text-[#B45309]">Traditions</Link>
            <Link href="/contribute" className="hover:text-[#B45309]">Contribute</Link>
            <Link href="/artisan/register" className="hover:text-[#B45309]">Join Artisan</Link>
            <Link href="/verify" className="hover:text-[#B45309]">Verify QR</Link>
            <Link href="/verifier" className="hover:text-[#B45309]">Verifier Desk</Link>
          </div>

          <div className="text-[#8C7D73] text-[11px]">
            Smart India Hackathon 2026 • Verified Cultural Records
          </div>
        </div>
      </footer>

      {/* Social Poster Share Generator Modal */}
      <SocialShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        item={shareItem}
      />
    </div>
  );
}
