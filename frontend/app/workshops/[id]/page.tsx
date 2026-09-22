'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { workshopAPI } from '@/lib/api';

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    requester_name: '',
    requester_phone: '',
    requester_email: '',
    workshop_type: 'HANDS_ON',
    preferred_date: '',
    participants: 1,
    message: ''
  });

  useEffect(() => {
    if (!id) return;
    workshopAPI.detail(id)
      .then(res => {
        setWorkshop(res.data);
        if (res.data.workshop_type) {
          setFormData(prev => ({ ...prev, workshop_type: res.data.workshop_type }));
        }
      })
      .catch(err => {
        console.error("Error loading workshop:", err);
        setErrorMsg("Failed to load workshop details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requester_name.trim() || !formData.requester_phone.trim()) {
      setErrorMsg("Please provide your name and contact phone number.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await workshopAPI.submitRequest(id, formData);
      setSuccessMsg(res.data.message || "Your request has been submitted to the master artisan!");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to submit workshop request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-sm text-[#8d8d8d]">
          Loading workshop...
        </div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 shell py-16 text-center">
          <h2 className="text-xl font-semibold text-[#111111]">Workshop Not Found</h2>
          <Link href="/workshops" className="text-xs text-[#b15f2c] font-semibold mt-4 inline-block hover:underline">
            ← Return to Workshops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 shell py-10 max-w-4xl">
        <Link href="/workshops" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8d8d8d] hover:text-[#111111] transition mb-6">
          <span>←</span>
          <span>Back to Workshops</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Workshop Details Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f1f0ee] text-[#111111] font-semibold text-xs">
                  {workshop.craft}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  {workshop.workshop_type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  Up to {workshop.max_participants} learners
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
                {workshop.title}
              </h1>
            </div>

            <div className="prose prose-sm text-[#8d8d8d] leading-relaxed">
              <p>{workshop.description}</p>
            </div>

            {/* Practitioner Card */}
            {workshop.artisan && (
              <div className="p-5 rounded-2xl bg-[#f1f0ee]/70 border border-[#e6e5e2]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8d8d8d] block mb-1">
                  Hosted by Master Practitioner
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-[#111111]">{workshop.artisan.full_name}</h4>
                    <p className="text-xs text-[#8d8d8d]">{workshop.artisan.craft} · {workshop.artisan.region}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    workshop.artisan.verification_status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {workshop.artisan.verification_status === 'VERIFIED' ? 'Verified Practitioner' : 'Review Pending'}
                  </span>
                </div>
              </div>
            )}

            {workshop.location && (
              <div className="p-4 rounded-xl border border-[#e6e5e2] text-xs text-[#111111] flex items-center gap-2">
                <span className="text-lg">📍</span>
                <span>Location: <strong>{workshop.location}, {workshop.state}</strong></span>
              </div>
            )}
          </div>

          {/* Request Form Column */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2] shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-[#111111] mb-1">
                Request Participation
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-4">
                Submit your details to coordinate directly with the artisan.
              </p>

              {successMsg ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <p className="font-semibold mb-1">✓ Request Recorded Successfully</p>
                  <p className="leading-relaxed">{successMsg}</p>
                  <div className="mt-4 pt-3 border-t border-emerald-200">
                    <Link href="/workshops" className="font-semibold text-emerald-800 hover:underline">
                      ← Browse more workshops
                    </Link>
                  </div>
                </div>
              ) : workshop.status !== 'OPEN' ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <p className="font-semibold">Workshop Inactive</p>
                  <p className="mt-1">This workshop is currently not accepting new requests.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-[#111111] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={formData.requester_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, requester_name: e.target.value }))}
                      className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111111] mb-1">Phone Number (Calling / WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.requester_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, requester_phone: e.target.value }))}
                      className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111111] mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="aditi@example.com"
                      value={formData.requester_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, requester_email: e.target.value }))}
                      className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#111111] mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferred_date: e.target.value }))}
                        className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-2.5 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#111111] mb-1">Participants</label>
                      <input
                        type="number"
                        min="1"
                        max={workshop.max_participants || 20}
                        value={formData.participants}
                        onChange={(e) => setFormData(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                        className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-2.5 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111111] mb-1">Message for Practitioner</label>
                    <textarea
                      rows={3}
                      placeholder="Tell the artisan about your interest or specific learning goals..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-[#f1f0ee] border border-[#e6e5e2] rounded-lg px-3 py-2 text-[#111111] focus:outline-none focus:border-[#b15f2c] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-full bg-[#0a0a0a] text-white font-semibold hover:bg-[#b15f2c] transition disabled:opacity-50 mt-2"
                  >
                    {submitting ? 'Submitting Request...' : 'Send Workshop Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
