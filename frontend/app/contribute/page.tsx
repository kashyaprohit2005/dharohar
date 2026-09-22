'use client';

import { useState } from 'react';
import Link from 'next/link';
import { communityAPI, heritageAPI } from '@/lib/api';

const CATEGORIES = [
  { id: 'craft', label: '🏺 Traditional Handicraft', desc: 'Pottery, metalwork, stone carving, woodcraft, lacquer' },
  { id: 'textile', label: '🧵 Handloom & Textile Weaving', desc: 'Block print, tie-dye, embroidery, ikat, brocade' },
  { id: 'food', label: '🍲 Culinary Heritage & Fermentation', desc: 'Indigenous recipes, traditional cooking methods, seasonal harvest foods' },
  { id: 'folklore', label: '📜 Oral Lore, Epics & Legends', desc: 'Village ballads, oral genealogies, mythological tales' },
  { id: 'music', label: '🎵 Folk & Devotional Music', desc: 'Ancestral songs, folk instruments, devotional kirtan traditions' },
  { id: 'dance', label: '💃 Ritual Dance & Folk Theatre', desc: 'Community celebration dances, sacred ritual performances' },
  { id: 'architecture', label: '🏛️ Indigenous Architecture', desc: 'Mud houses, stepwells, sacred groves, vernacular engineering' },
  { id: 'festival', label: '🪔 Sacred Festival & Congregation', desc: 'Community seasonal fairs, harvest celebrations, temple rituals' },
  { id: 'clothing', label: '👘 Traditional Costume & Attire', desc: 'Regional tribal clothing, ceremonial wear, turban draping' },
];

const EVIDENCE_TYPES = [
  { id: 'LOCAL_KNOWLEDGE', label: 'Living Community Knowledge', desc: 'Direct testimony from community elders & practitioners' },
  { id: 'FIELD_RESEARCH', label: 'Field Research / Documentation', desc: 'Field survey notes, ethnography, photographs' },
  { id: 'ACADEMIC_STUDY', label: 'Academic Publication / Monograph', desc: 'University study, thesis, or scholarly book' },
  { id: 'COMMUNITY_DOCUMENTATION', label: 'Panchayat / Community Guild Registry', desc: 'Official village council or artisan association record' },
  { id: 'GI_REGISTRY', label: 'Geographical Indications (GI) Filing', desc: 'Government GI application or certificate' },
];

export default function ContributeHeritagePage() {
  const [formData, setFormData] = useState({
    title: '',
    local_name: '',
    category: 'craft',
    state: 'Rajasthan',
    district: '',
    subdistrict: '',
    village: '',
    locality: '',
    lat: 26.8122,
    lon: 75.5447,
    description: '',
    cultural_significance: '',
    practitioners_info: '',
    contributor_type: 'PUBLIC',
    contributor_name: '',
    contributor_contact: '',
    evidence_type: 'LOCAL_KNOWLEDGE',
    evidence_source: '',
    evidence_url: '',
    local_story: ''
  });

  const [loading, setLoading] = useState(false);
  const [geoLocating, setGeoLocating] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset error when user edits
    if (errorMessage) setErrorMessage(null);
  };

  // Browser GPS auto-fill
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported in this browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        setFormData((prev) => ({
          ...prev,
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4))
        }));
      },
      (err) => {
        setGeoLocating(false);
        alert('Could not obtain GPS location. Please enter coordinates or village name manually.');
      },
      { timeout: 8000 }
    );
  };

  // Village geocode lookup
  const handleGeocodeVillage = async () => {
    const query = formData.village || formData.district;
    if (!query) return;
    try {
      const res = await heritageAPI.geocode(query);
      if (res.data.found && res.data.matches.length > 0) {
        const m = res.data.matches[0];
        setFormData((prev) => ({
          ...prev,
          district: prev.district || m.district,
          state: m.state || prev.state,
          lat: m.lat,
          lon: m.lon
        }));
      }
    } catch (err) {
      console.warn('Geocoding query error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setDuplicateWarning(null);

    // Basic client validation
    if (!formData.title.trim()) {
      setErrorMessage('Please enter the name of the heritage tradition.');
      setLoading(false);
      return;
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      setErrorMessage('Please provide a meaningful description (at least 20 characters).');
      setLoading(false);
      return;
    }
    if (!formData.contributor_name.trim()) {
      setErrorMessage('Please enter your name as the contributor.');
      setLoading(false);
      return;
    }

    try {
      const res = await communityAPI.submit(formData);
      if (res.data.success) {
        setSubmittedReceipt(res.data);
        if (res.data.warning) {
          setDuplicateWarning(res.data.warning);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit heritage contribution. Please check your details.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#111111] pb-24">
      {/* Header Banner */}
      <section className="bg-[#1c1917] text-white pt-12 pb-14 border-b border-[#292524]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#b15f2c]/20 text-[#e89d6c] border border-[#b15f2c]/40 mb-3">
            <span>🏛️</span>
            <span>COMMUNITY LIVING HERITAGE REGISTRY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight">
            Contribute Local Heritage
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#a8a29e] leading-relaxed">
            Help map India&apos;s living cultural wealth. Submit unrepresented village traditions, craft techniques, folk songs, sacred recipes, or local folklore. Once verified by the National Living Heritage Review Board, your contribution will be permanently published to the Atlas with public citations.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        {/* Success Receipt State */}
        {submittedReceipt ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e6e5e2] shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 text-3xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              STATUS: {submittedReceipt.status}
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#111111] mt-3 mb-2">
              Contribution Successfully Recorded!
            </h2>
            <p className="text-sm text-[#666] max-w-xl mx-auto leading-relaxed">
              {submittedReceipt.message}
            </p>

            {/* Tracking ID Badge */}
            <div className="my-6 p-4 rounded-2xl bg-[#faf9f7] border border-[#e6e5e2] max-w-md mx-auto">
              <span className="text-xs text-[#8d8d8d] uppercase tracking-wider block mb-1">
                Official Tracking ID
              </span>
              <span className="text-xl font-mono font-bold text-[#b15f2c]">
                {submittedReceipt.contribution_id}
              </span>
            </div>

            {duplicateWarning && (
              <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left max-w-lg mx-auto">
                ⚠️ {duplicateWarning}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 text-left max-w-lg mx-auto mb-8">
              <strong className="block font-semibold mb-1">What Happens Next?</strong>
              <ul className="list-disc list-inside space-y-1 text-purple-800/90">
                <li>Your submission has been queued for peer &amp; verifier review in the moderation workspace.</li>
                <li>When approved, a permanent Heritage Record with GI &amp; evidence citations is created immediately in the live database.</li>
                <li>It will instantly appear on the India Map, in &quot;Heritage Around Me&quot;, and receive an immutable Heritage Passport.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/verifier"
                className="px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-black transition"
              >
                Open Verifier Review Queue →
              </Link>
              <Link
                href="/around-me"
                className="px-6 py-3 rounded-full bg-[#b15f2c] text-white text-xs font-semibold hover:bg-[#964f24] transition"
              >
                Back to Heritage Around Me
              </Link>
              <button
                onClick={() => {
                  setSubmittedReceipt(null);
                  setFormData({
                    title: '',
                    local_name: '',
                    category: 'craft',
                    state: 'Rajasthan',
                    district: '',
                    subdistrict: '',
                    village: '',
                    locality: '',
                    lat: 26.8122,
                    lon: 75.5447,
                    description: '',
                    cultural_significance: '',
                    practitioners_info: '',
                    contributor_type: 'PUBLIC',
                    contributor_name: '',
                    contributor_contact: '',
                    evidence_type: 'LOCAL_KNOWLEDGE',
                    evidence_source: '',
                    evidence_url: '',
                    local_story: ''
                  });
                }}
                className="px-6 py-3 rounded-full border border-[#e6e5e2] text-xs font-semibold text-[#555] hover:bg-[#f5f4f0]"
              >
                Submit Another Tradition
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#e6e5e2] shadow-sm">
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Cultural Identity */}
            <div>
              <h3 className="text-lg font-bold font-serif text-[#111111] flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-[#b15f2c] text-white text-xs font-bold flex items-center justify-center">1</span>
                <span>Cultural Tradition &amp; Domain</span>
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-4">
                Classify the living tradition across India&apos;s cultural domains.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Cultural Domain <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm bg-white focus:outline-none focus:border-[#b15f2c]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Name of Heritage Tradition <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Molela Terracotta Plaques"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Local Vernacular / Dialect Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="local_name"
                    placeholder="e.g. मोलेला मिट्टी की मूर्तियाँ (Mewari / Hindi)"
                    value={formData.local_name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Rural Location & Coordinates */}
            <div className="pt-6 border-t border-[#f1f0ee]">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="text-lg font-bold font-serif text-[#111111] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#b15f2c] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>Root Location &amp; Coordinates</span>
                </h3>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={geoLocating}
                  className="text-xs font-semibold text-[#b15f2c] hover:underline flex items-center gap-1"
                >
                  <span>📍</span>
                  <span>{geoLocating ? 'Detecting GPS...' : 'Use Current Device GPS'}</span>
                </button>
              </div>
              <p className="text-xs text-[#8d8d8d] mb-4">
                Anchor this tradition to its village, district, and coordinates for discovery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    placeholder="e.g. Rajsamand"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Village / Town / Locality
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      name="village"
                      placeholder="e.g. Molela"
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                    />
                    <button
                      type="button"
                      onClick={handleGeocodeVillage}
                      title="Auto-lookup coordinates for village"
                      className="px-2.5 rounded-xl bg-[#f5f4f0] hover:bg-[#e6e5e2] text-xs font-semibold text-[#555]"
                    >
                      Geocode
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Subdistrict / Tehsil
                  </label>
                  <input
                    type="text"
                    name="subdistrict"
                    placeholder="e.g. Nathdwara"
                    value={formData.subdistrict}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Latitude (°N) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm font-mono focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Longitude (°E) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    name="lon"
                    value={formData.lon}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm font-mono focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center text-xs text-[#8d8d8d] italic">
                  💡 Tip: Coordinates will place your tradition on the Geodesic Radar Map.
                </div>
              </div>
            </div>

            {/* Step 3: Description, Significance & Oral Story */}
            <div className="pt-6 border-t border-[#f1f0ee]">
              <h3 className="text-lg font-bold font-serif text-[#111111] flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-[#b15f2c] text-white text-xs font-bold flex items-center justify-center">3</span>
                <span>Tradition Details, Lore &amp; Significance</span>
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-4">
                Describe the craft, recipe, festival, or legend in depth.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Detailed Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    name="description"
                    placeholder="Describe the materials, techniques, cultural practice, historical background, and how it is created or performed..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#444] mb-1.5">
                      Cultural Significance &amp; Historical Roots
                    </label>
                    <textarea
                      rows={3}
                      name="cultural_significance"
                      placeholder="Why is this tradition irreplaceable? What community values or rituals does it embody?"
                      value={formData.cultural_significance}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#444] mb-1.5">
                      Practitioners &amp; Community Info
                    </label>
                    <textarea
                      rows={3}
                      name="practitioners_info"
                      placeholder="Which families, clans, or community groups keep this alive? How many active masters remain?"
                      value={formData.practitioners_info}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Oral Story / Village Legend (For Audio Narration)
                  </label>
                  <textarea
                    rows={3}
                    name="local_story"
                    placeholder="An oral folktale or legend associated with this tradition. Visitors can listen to this story in 'Heritage Around Me'..."
                    value={formData.local_story}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Evidence Citations & Contributor Info */}
            <div className="pt-6 border-t border-[#f1f0ee]">
              <h3 className="text-lg font-bold font-serif text-[#111111] flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full bg-[#b15f2c] text-white text-xs font-bold flex items-center justify-center">4</span>
                <span>Evidence Citations &amp; Contributor Credit</span>
              </h3>
              <p className="text-xs text-[#8d8d8d] mb-4">
                Ground your claims in verifiable sources to help reviewers fast-track approval.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Evidence Source Type
                  </label>
                  <select
                    name="evidence_type"
                    value={formData.evidence_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm bg-white focus:outline-none focus:border-[#b15f2c]"
                  >
                    {EVIDENCE_TYPES.map((et) => (
                      <option key={et.id} value={et.id}>
                        {et.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Citation Title / Publication / Elder Name
                  </label>
                  <input
                    type="text"
                    name="evidence_source"
                    placeholder="e.g. Oral Testimony of Master Potter Mohanlal"
                    value={formData.evidence_source}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Evidence Link / Reference URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="evidence_url"
                    placeholder="https://..."
                    value={formData.evidence_url}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Your Role / Contributor Type
                  </label>
                  <select
                    name="contributor_type"
                    value={formData.contributor_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm bg-white focus:outline-none focus:border-[#b15f2c]"
                  >
                    <option value="PUBLIC">Public Citizen / Cultural Enthusiast</option>
                    <option value="ARTISAN">Hereditary Artisan / Practitioner</option>
                    <option value="RESEARCHER">Field Researcher / Scholar</option>
                    <option value="COMMUNITY_ORGANIZATION">Community Organization / NGO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contributor_name"
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={formData.contributor_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#444] mb-1.5">
                    Your Contact (Phone or Email)
                  </label>
                  <input
                    type="text"
                    name="contributor_contact"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.contributor_contact}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e5e2] text-sm focus:outline-none focus:border-[#b15f2c]"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-6 border-t border-[#f1f0ee] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#8d8d8d]">
                By submitting, you affirm that this heritage tradition is rooted in genuine community practice.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#b15f2c] hover:bg-[#964f24] text-white font-semibold text-sm transition shadow-md disabled:opacity-50"
              >
                {loading ? 'Submitting to Review Board...' : 'Submit Heritage for Review →'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
