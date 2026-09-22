'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { workshopAPI } from '@/lib/api';

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCraft, setFilterCraft] = useState('');

  useEffect(() => {
    workshopAPI.list()
      .then(res => setWorkshops(res.data))
      .catch(err => console.error("Error fetching workshops:", err))
      .finally(() => setLoading(false));
  }, []);

  const crafts = Array.from(new Set(workshops.map(w => w.craft).filter(Boolean)));
  const filtered = filterCraft
    ? workshops.filter(w => w.craft.toLowerCase() === filterCraft.toLowerCase())
    : workshops;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 shell py-12">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-medium text-[#111111]/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
            Living Master Apprenticeships & Education
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#111111] leading-tight">
            Learn directly from India's heritage practitioners.
          </h1>
          <p className="text-base sm:text-lg text-[#8d8d8d] mt-3 leading-relaxed">
            Request hands-on workshops, lecture demonstrations, and craft apprenticeships hosted by verified master artisans.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#e6e5e2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#8d8d8d]">Filter by Craft:</span>
            <select
              value={filterCraft}
              onChange={(e) => setFilterCraft(e.target.value)}
              className="bg-[#f1f0ee] border border-[#e6e5e2] text-xs rounded-lg px-3 py-2 text-[#111111] font-medium focus:outline-none focus:border-[#b15f2c]"
            >
              <option value="">All Crafts ({workshops.length})</option>
              {crafts.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Link
            href="/artisan/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold hover:bg-[#b15f2c] transition"
          >
            <span>Are you a practitioner? Host a workshop</span>
            <span>→</span>
          </Link>
        </div>

        {/* Workshop Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-[#8d8d8d]">Loading workshops...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2] p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-[#b15f2c] shadow-sm">
              ✦
            </div>
            <h3 className="text-lg font-semibold text-[#111111]">No Workshops Listed Yet</h3>
            <p className="text-xs text-[#8d8d8d] mt-2 max-w-md mx-auto leading-relaxed">
              As verified master artisans register on VirasatSetu, their hands-on and demonstration workshops will appear here.
            </p>
            <div className="mt-6">
              <Link
                href="/artisan/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#b15f2c] transition"
              >
                <span>Register as Artisan to Host</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(w => (
              <div
                key={w.id}
                className="rounded-[2rem] bg-white border border-[#e6e5e2] p-7 flex flex-col justify-between hover:shadow-md hover:border-[#b15f2c]/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f1f0ee] text-[#111111] font-semibold text-[11px]">
                      {w.craft}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {w.workshop_type}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-[#111111] group-hover:text-[#b15f2c] transition-colors mb-2">
                    {w.title}
                  </h3>
                  <p className="text-xs text-[#8d8d8d] line-clamp-3 leading-relaxed mb-4">
                    {w.description}
                  </p>

                  <div className="space-y-1 text-xs text-[#111111]/80 pt-4 border-t border-[#e6e5e2]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8d8d8d]">Practitioner:</span>
                      <span className="font-semibold">{w.artisan?.full_name || 'Master Artisan'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8d8d8d]">Location:</span>
                      <span>{w.location ? `${w.location}, ${w.state}` : 'On-demand'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8d8d8d]">Max Capacity:</span>
                      <span>{w.max_participants} participants</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e6e5e2]">
                  <Link
                    href={`/workshops/${w.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#f1f0ee] group-hover:bg-[#0a0a0a] group-hover:text-white text-xs font-semibold text-[#111111] transition"
                  >
                    <span>Request Workshop</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
