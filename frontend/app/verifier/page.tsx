'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { verifierAPI } from '@/lib/api';

interface VerifierArtisan {
  id: number;
  craftproof_id: string;
  full_name: string;
  phone: string;
  craft: string;
  region: string;
  district?: string;
  state?: string;
  locality?: string;
  specialization: string;
  experience_years: number;
  skills: string;
  story: string;
  verification_status: string;
  verifier_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  registered_at: string;
}

interface CommunityContribution {
  id: number;
  contribution_id: string;
  category: string;
  title: string;
  local_name: string;
  state: string;
  district: string;
  subdistrict: string;
  village: string;
  locality: string;
  lat: number;
  lon: number;
  description: string;
  cultural_significance: string;
  practitioners_info: string;
  contributor_type: string;
  contributor_name: string;
  contributor_contact: string;
  evidence_type: string;
  evidence_source: string;
  evidence_url: string | null;
  local_story: string;
  status: string;
  verifier_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  published_heritage_id: number | null;
}

interface HeritageClaim {
  id: number;
  claim_id: string;
  heritage_id: number;
  heritage_name: string;
  heritage_category: string;
  artisan_id: number;
  artisan_name: string;
  artisan_region: string;
  claim_type: string;
  generation_lineage: number;
  workshop_offered: boolean;
  proof_description: string;
  status: string;
  verifier_notes: string | null;
  reviewed_by: string | null;
  created_at: string;
}

interface AuditItem {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  actor: string;
  details: string;
  timestamp: string;
}

export default function VerifierPage() {
  const [activeTab, setActiveTab] = useState<'artisans' | 'contributions' | 'claims' | 'audit'>('artisans');

  const [artisans, setArtisans] = useState<VerifierArtisan[]>([]);
  const [contributions, setContributions] = useState<CommunityContribution[]>([]);
  const [claims, setClaims] = useState<HeritageClaim[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Artisan Modal State
  const [selectedArtisan, setSelectedArtisan] = useState<VerifierArtisan | null>(null);
  const [artisanReviewStatus, setArtisanReviewStatus] = useState('VERIFIED');
  const [artisanReviewNotes, setArtisanReviewNotes] = useState('Identity and craft credentials verified against regional cluster documentation.');
  const [isSubmittingArtisan, setIsSubmittingArtisan] = useState(false);

  // Contribution Modal State
  const [selectedContrib, setSelectedContrib] = useState<CommunityContribution | null>(null);
  const [contribReviewStatus, setContribReviewStatus] = useState('APPROVED');
  const [contribPreservationStatus, setContribPreservationStatus] = useState('WELL_DOCUMENTED');
  const [contribNotes, setContribNotes] = useState('Verified authentic living cultural tradition with verified community documentation.');
  const [isSubmittingContrib, setIsSubmittingContrib] = useState(false);
  const [publishSuccessBanner, setPublishSuccessBanner] = useState<string | null>(null);

  // Claim Review State
  const [selectedClaim, setSelectedClaim] = useState<HeritageClaim | null>(null);
  const [claimReviewStatus, setClaimReviewStatus] = useState('APPROVED');
  const [claimNotes, setClaimNotes] = useState('Verified hereditary master practitioner connection.');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [artRes, contribRes, claimsRes, logRes] = await Promise.all([
        verifierAPI.getQueue(),
        verifierAPI.getContributions(),
        verifierAPI.getClaims(),
        verifierAPI.getAuditLog()
      ]);
      if (Array.isArray(artRes.data)) setArtisans(artRes.data);
      if (Array.isArray(contribRes.data)) setContributions(contribRes.data);
      if (Array.isArray(claimsRes.data)) setClaims(claimsRes.data);
      if (Array.isArray(logRes.data)) setAuditLogs(logRes.data);
    } catch (e) {
      console.error('Failed to load verifier data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Submit Artisan Review
  const handleArtisanReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtisan) return;
    setIsSubmittingArtisan(true);
    try {
      const res = await verifierAPI.reviewArtisan(selectedArtisan.id, {
        status: artisanReviewStatus,
        notes: artisanReviewNotes,
        verified_by: 'National Heritage Verification Board'
      });
      if (res.data.success) {
        setSelectedArtisan(null);
        loadData();
      }
    } finally {
      setIsSubmittingArtisan(false);
    }
  };

  // Submit Community Contribution Review
  const handleContribReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContrib) return;
    setIsSubmittingContrib(true);
    setPublishSuccessBanner(null);
    try {
      const res = await verifierAPI.reviewContribution(selectedContrib.contribution_id, {
        status: contribReviewStatus,
        notes: contribNotes,
        verified_by: 'National Living Heritage Review Board',
        preservation_status: contribPreservationStatus
      });
      if (res.data.success) {
        setPublishSuccessBanner(res.data.message);
        setSelectedContrib(null);
        loadData();
      }
    } catch (err) {
      alert('Failed to review contribution.');
    } finally {
      setIsSubmittingContrib(false);
    }
  };

  // Submit Claim Review
  const handleClaimReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;
    setIsSubmittingClaim(true);
    try {
      const res = await verifierAPI.reviewClaim(selectedClaim.claim_id, {
        status: claimReviewStatus,
        notes: claimNotes,
        verified_by: 'Practitioner Certification Desk'
      });
      if (res.data.success) {
        setSelectedClaim(null);
        loadData();
      }
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const pendingContribCount = contributions.filter(c => c.status === 'PENDING_REVIEW' || c.status === 'IN_REVIEW').length;
  const pendingArtisanCount = artisans.filter(a => a.verification_status === 'PENDING' || a.verification_status === 'UNDER_REVIEW').length;
  const pendingClaimCount = claims.filter(c => c.status === 'PENDING_REVIEW').length;

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-semibold text-[#111111]/80 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
                National Living Heritage Verification Desk
              </div>
              <h1 className="text-3xl font-bold font-serif tracking-tight text-[#111111]">
                Governance &amp; Moderation Workspace
              </h1>
              <p className="text-xs sm:text-sm text-[#8d8d8d] mt-1">
                Authentic human-in-the-loop review. Verify artisan credentials, moderate community submissions, and approve claims to the Living Atlas.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="px-4 py-2 rounded-full border border-[#e6e5e2] text-xs font-semibold hover:bg-[#f1f0ee] transition flex items-center gap-1.5"
              >
                <span>↻</span>
                <span>Refresh Live Desks</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {publishSuccessBanner && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎉</span>
                <strong>{publishSuccessBanner}</strong>
              </div>
              <button onClick={() => setPublishSuccessBanner(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
                ✕
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e6e5e2] overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'artisans'
                  ? 'border-[#b15f2c] text-[#b15f2c] bg-amber-50/40'
                  : 'border-transparent text-[#666] hover:text-[#111]'
              }`}
            >
              <span>🧑‍🎨 Artisans Queue</span>
              {pendingArtisanCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#b15f2c] text-white">
                  {pendingArtisanCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('contributions')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'contributions'
                  ? 'border-[#b15f2c] text-[#b15f2c] bg-amber-50/40'
                  : 'border-transparent text-[#666] hover:text-[#111]'
              }`}
            >
              <span>👥 Community Heritage Contributions</span>
              {pendingContribCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                  {pendingContribCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'claims'
                  ? 'border-[#b15f2c] text-[#b15f2c] bg-amber-50/40'
                  : 'border-transparent text-[#666] hover:text-[#111]'
              }`}
            >
              <span>📜 Practitioner Claims</span>
              {pendingClaimCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                  {pendingClaimCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 flex items-center gap-2 ${
                activeTab === 'audit'
                  ? 'border-[#b15f2c] text-[#b15f2c] bg-amber-50/40'
                  : 'border-transparent text-[#666] hover:text-[#111]'
              }`}
            >
              <span>🛡️ Audit Trail ({auditLogs.length})</span>
            </button>
          </div>

          {/* TAB 1: ARTISANS QUEUE */}
          {activeTab === 'artisans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-serif text-[#111111]">
                  Live Artisan Verification Desk ({artisans.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-[#8d8d8d]">Loading queue...</div>
              ) : artisans.length === 0 ? (
                <div className="p-12 text-center rounded-[2rem] border border-dashed border-[#e6e5e2] text-[#8d8d8d]">
                  <p className="text-sm font-semibold">No artisans currently registered.</p>
                  <p className="text-xs mt-1">Register a new artisan to review them through this desk.</p>
                  <Link
                    href="/artisan-portal"
                    className="mt-4 inline-block text-xs text-[#b15f2c] font-semibold hover:underline"
                  >
                    Go to Practitioner Registration →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artisans.map(a => (
                    <div
                      key={a.id}
                      className="p-6 rounded-[1.5rem] bg-white border border-[#e6e5e2] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[#b15f2c] bg-[#f1f0ee] px-2 py-0.5 rounded-md">
                            {a.craftproof_id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            a.verification_status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.verification_status === 'UNDER_REVIEW'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {a.verification_status}
                          </span>
                        </div>

                        <h4 className="text-base font-semibold text-[#111111]">{a.full_name}</h4>
                        <p className="text-xs text-[#8d8d8d]">{a.craft} · {a.locality || a.district || a.region}</p>
                        <p className="text-xs text-[#111111]/70 mt-1 font-mono">Phone: {a.phone}</p>

                        {a.story && (
                          <p className="text-xs text-[#8d8d8d] mt-2 italic line-clamp-2">
                            &quot;{a.story}&quot;
                          </p>
                        )}

                        {a.verifier_notes && (
                          <div className="mt-3 p-2.5 rounded-[0.75rem] bg-[#f1f0ee] text-[11px] text-[#111111]/80">
                            <strong>Verifier Note:</strong> {a.verifier_notes}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-[#e6e5e2] flex justify-between items-center text-xs">
                        <span className="text-[#8d8d8d]">Registered: {a.registered_at}</span>
                        <button
                          onClick={() => {
                            setSelectedArtisan(a);
                            setArtisanReviewStatus(a.verification_status);
                            setArtisanReviewNotes(a.verifier_notes || 'Credentials verified against regional heritage register.');
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#0a0a0a] text-white font-semibold hover:bg-[#b15f2c] transition"
                        >
                          Inspect &amp; Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMMUNITY CONTRIBUTIONS QUEUE */}
          {activeTab === 'contributions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#111111]">
                    Community Heritage Moderation Desk ({contributions.length})
                  </h3>
                  <p className="text-xs text-[#8d8d8d]">
                    Review public submissions. Approving automatically writes the tradition to the live Heritage Atlas and creates public evidence citations.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-[#8d8d8d]">Loading submissions...</div>
              ) : contributions.length === 0 ? (
                <div className="p-12 text-center rounded-[2rem] border border-dashed border-[#e6e5e2] text-[#8d8d8d]">
                  <p className="text-sm font-semibold">No community submissions recorded yet.</p>
                  <p className="text-xs mt-1">Submit a local village tradition to test this review pipeline.</p>
                  <Link
                    href="/contribute"
                    className="mt-4 inline-block text-xs text-[#b15f2c] font-semibold hover:underline"
                  >
                    + Submit a Local Heritage Tradition →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {contributions.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 rounded-[1.5rem] bg-white border border-[#e6e5e2] shadow-sm flex flex-col justify-between hover:border-[#b15f2c]/40 transition"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[#b15f2c] bg-[#f1f0ee] px-2 py-0.5 rounded-md">
                            {c.contribution_id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            c.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-[#8d8d8d] mb-1">
                          <span className="font-semibold uppercase text-purple-700">{c.category}</span>
                          <span>·</span>
                          <span>{c.village ? `${c.village}, ` : ''}{c.district}, {c.state}</span>
                        </div>

                        <h4 className="text-lg font-bold font-serif text-[#111111] mb-1">
                          {c.title}
                        </h4>
                        {c.local_name && (
                          <p className="text-xs text-[#b15f2c] font-medium mb-2">
                            Local: {c.local_name}
                          </p>
                        )}

                        <p className="text-xs text-[#555] line-clamp-3 leading-relaxed mb-3">
                          {c.description}
                        </p>

                        <div className="p-3 rounded-xl bg-[#faf9f7] border border-[#f1f0ee] text-xs space-y-1 mb-3">
                          <div>
                            <strong>Contributor:</strong> {c.contributor_name} ({c.contributor_type})
                          </div>
                          <div>
                            <strong>Evidence:</strong> {c.evidence_source || c.evidence_type}
                          </div>
                          {c.evidence_url && (
                            <div>
                              <strong>Link:</strong>{' '}
                              <a href={c.evidence_url} target="_blank" rel="noreferrer" className="text-[#b15f2c] hover:underline truncate inline-block max-w-[250px]">
                                {c.evidence_url}
                              </a>
                            </div>
                          )}
                        </div>

                        {c.verifier_notes && (
                          <div className="p-2.5 rounded-lg bg-amber-50 text-[11px] text-amber-900 mb-2">
                            <strong>Verifier Note:</strong> {c.verifier_notes}
                          </div>
                        )}

                        {c.published_heritage_id && (
                          <div className="p-2 rounded-lg bg-emerald-50 text-[11px] text-emerald-900 font-semibold mb-2 flex items-center justify-between">
                            <span>Published in Atlas as Heritage #{c.published_heritage_id}</span>
                            <Link href={`/heritage/${c.published_heritage_id}`} className="underline text-emerald-800">
                              View Passport →
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#f1f0ee] flex items-center justify-between text-xs">
                        <span className="text-[#8d8d8d]">Submitted: {c.created_at}</span>
                        <button
                          onClick={() => {
                            setSelectedContrib(c);
                            setContribReviewStatus(c.status === 'PENDING_REVIEW' ? 'APPROVED' : c.status);
                            setContribNotes(c.verifier_notes || 'Verified authentic living cultural tradition with verified community documentation.');
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#111111] text-white font-semibold hover:bg-[#b15f2c] transition"
                        >
                          Review &amp; Moderate →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRACTITIONER CLAIMS */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-serif text-[#111111]">
                Practitioner Heritage Claims Desk ({claims.length})
              </h3>
              <p className="text-xs text-[#8d8d8d]">
                Review artisans claiming to be verified hereditary practitioners or custodians of recognized traditions.
              </p>

              {claims.length === 0 ? (
                <div className="p-12 text-center rounded-[2rem] border border-dashed border-[#e6e5e2] text-[#8d8d8d]">
                  <p className="text-sm font-semibold">No practitioner claims pending review.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {claims.map((cl) => (
                    <div
                      key={cl.id}
                      className="p-6 rounded-[1.5rem] bg-white border border-[#e6e5e2] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-[#b15f2c] bg-[#f1f0ee] px-2 py-0.5 rounded-md">
                            {cl.claim_id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            cl.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {cl.status}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-[#111111] mb-0.5">
                          {cl.artisan_name}
                        </h4>
                        <p className="text-xs text-[#666] mb-2">
                          Claims Practice: <strong>{cl.heritage_name}</strong> ({cl.heritage_category})
                        </p>

                        <div className="p-3 rounded-xl bg-[#faf9f7] border border-[#f1f0ee] text-xs space-y-1 mb-3">
                          <div><strong>Claim Role:</strong> {cl.claim_type}</div>
                          <div><strong>Generational Lineage:</strong> {cl.generation_lineage} generation(s)</div>
                          <div><strong>Offers Workshops:</strong> {cl.workshop_offered ? 'Yes' : 'No'}</div>
                          {cl.proof_description && (
                            <div className="text-[#555] mt-1 italic">&quot;{cl.proof_description}&quot;</div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#f1f0ee] flex items-center justify-between text-xs">
                        <span className="text-[#8d8d8d]">Submitted: {cl.created_at}</span>
                        <button
                          onClick={() => {
                            setSelectedClaim(cl);
                            setClaimReviewStatus('APPROVED');
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#111111] text-white font-semibold hover:bg-[#b15f2c] transition"
                        >
                          Review Claim →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-serif text-[#111111]">
                Cryptographic System Audit Trail ({auditLogs.length} Events)
              </h3>
              <p className="text-xs text-[#8d8d8d]">
                Chronological immutable audit log of registrations, verifier approvals, community submissions, and reports.
              </p>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-[#faf9f7] border border-[#e6e5e2] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#b15f2c]">{log.action}</span>
                      <span className="text-[#8d8d8d] ml-2 font-mono">[{log.entity_type} {log.entity_id}]</span>
                      <span className="text-[#111111] ml-3">{log.details}</span>
                    </div>
                    <span className="text-[10px] text-[#8d8d8d] font-mono shrink-0 ml-4">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: ARTISAN REVIEW */}
      {selectedArtisan && (
        <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-[#e6e5e2]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#b15f2c]">
                  Artisan Compliance Review
                </span>
                <h3 className="text-xl font-bold font-serif text-[#111111] mt-0.5">
                  Review {selectedArtisan.full_name} ({selectedArtisan.craftproof_id})
                </h3>
              </div>
              <button onClick={() => setSelectedArtisan(null)} className="text-[#8d8d8d] hover:text-[#111111]">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf9f7] text-xs text-[#555] mb-4 space-y-1">
              <div><strong>Craft:</strong> {selectedArtisan.craft}</div>
              <div><strong>Location:</strong> {selectedArtisan.locality || selectedArtisan.region}</div>
              <div><strong>Experience:</strong> {selectedArtisan.experience_years} years</div>
            </div>

            <form onSubmit={handleArtisanReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Status Decision
                </label>
                <select
                  value={artisanReviewStatus}
                  onChange={e => setArtisanReviewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                >
                  <option value="VERIFIED">VERIFIED (Full Approval &amp; Verified Badge)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Hold for Further Review)</option>
                  <option value="NEEDS_CORRECTION">NEEDS_CORRECTION (Request Additional Proof)</option>
                  <option value="REJECTED">REJECTED (Disqualified)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Verifier Inspection Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={artisanReviewNotes}
                  onChange={e => setArtisanReviewNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#e6e5e2] text-xs text-[#111111] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedArtisan(null)}
                  className="px-4 py-2 rounded-full border border-[#e6e5e2] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingArtisan}
                  className="px-6 py-2 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold hover:bg-[#b15f2c] transition disabled:opacity-50"
                >
                  {isSubmittingArtisan ? 'Recording...' : 'Commit Status Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COMMUNITY CONTRIBUTION REVIEW */}
      {selectedContrib && (
        <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-xl w-full shadow-2xl border border-[#e6e5e2] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#b15f2c]">
                  Living Heritage Moderation Desk
                </span>
                <h3 className="text-xl font-bold font-serif text-[#111111] mt-0.5">
                  Review &amp; Publish &quot;{selectedContrib.title}&quot;
                </h3>
              </div>
              <button onClick={() => setSelectedContrib(null)} className="text-[#8d8d8d] hover:text-[#111111]">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#faf9f7] border border-[#f1f0ee] text-xs space-y-2 mb-4">
              <div><strong>Domain:</strong> {selectedContrib.category}</div>
              <div><strong>Location:</strong> {selectedContrib.village ? `${selectedContrib.village}, ` : ''}{selectedContrib.district}, {selectedContrib.state} ({selectedContrib.lat}, {selectedContrib.lon})</div>
              <div><strong>Contributor:</strong> {selectedContrib.contributor_name} ({selectedContrib.contributor_type})</div>
              <div><strong>Evidence Type:</strong> {selectedContrib.evidence_type} — {selectedContrib.evidence_source}</div>
              {selectedContrib.local_story && (
                <div className="italic text-[#555] bg-white p-2 rounded border border-[#e6e5e2]">
                  &quot;{selectedContrib.local_story}&quot;
                </div>
              )}
            </div>

            <form onSubmit={handleContribReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Moderation Decision
                </label>
                <select
                  value={contribReviewStatus}
                  onChange={e => setContribReviewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                >
                  <option value="APPROVED">✓ APPROVE &amp; PUBLISH to National Living Heritage Atlas</option>
                  <option value="NEEDS_CORRECTION">⚠️ Request Correction / Additional Evidence</option>
                  <option value="REJECTED">✗ REJECT Submission</option>
                  <option value="IN_REVIEW">Under Closer Investigation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Atlas Preservation Status Rating
                </label>
                <select
                  value={contribPreservationStatus}
                  onChange={e => setContribPreservationStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                >
                  <option value="WELL_DOCUMENTED">WELL_DOCUMENTED (Stable Active Living Heritage)</option>
                  <option value="PRESERVATION_WATCH">PRESERVATION_WATCH (Watch List / Vulnerable Practice)</option>
                  <option value="ENDANGERED">ENDANGERED (Immediate Documentation Needed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Verifier Review Notes &amp; Citations
                </label>
                <textarea
                  rows={3}
                  required
                  value={contribNotes}
                  onChange={e => setContribNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#e6e5e2] text-xs text-[#111111] resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Instant Publishing Guarantee:</strong> Approving this record will immediately mint it into the database, display it on the India Map, list it in &quot;Heritage Around Me&quot;, and issue an immutable Heritage Passport.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedContrib(null)}
                  className="px-4 py-2 rounded-full border border-[#e6e5e2] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingContrib}
                  className="px-6 py-2 rounded-full bg-[#b15f2c] text-white text-xs font-semibold hover:bg-[#964f24] transition disabled:opacity-50 shadow-sm"
                >
                  {isSubmittingContrib ? 'Publishing to Atlas...' : 'Publish Decision →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRACTITIONER CLAIM REVIEW */}
      {selectedClaim && (
        <div className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl border border-[#e6e5e2]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#b15f2c]">
                  Practitioner Claim Review
                </span>
                <h3 className="text-xl font-bold font-serif text-[#111111] mt-0.5">
                  Review Connection for {selectedClaim.artisan_name}
                </h3>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="text-[#8d8d8d] hover:text-[#111111]">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf9f7] text-xs text-[#555] mb-4 space-y-1">
              <div><strong>Tradition:</strong> {selectedClaim.heritage_name}</div>
              <div><strong>Lineage:</strong> {selectedClaim.generation_lineage} generations</div>
              <div><strong>Role:</strong> {selectedClaim.claim_type}</div>
            </div>

            <form onSubmit={handleClaimReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Decision
                </label>
                <select
                  value={claimReviewStatus}
                  onChange={e => setClaimReviewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                >
                  <option value="APPROVED">APPROVE Practitioner Association</option>
                  <option value="REJECTED">REJECT Claim</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8d8d8d] uppercase mb-1">
                  Verifier Notes
                </label>
                <textarea
                  rows={3}
                  value={claimNotes}
                  onChange={e => setClaimNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#e6e5e2] text-xs text-[#111111] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 rounded-full border border-[#e6e5e2] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="px-6 py-2 rounded-full bg-[#111111] text-white text-xs font-semibold hover:bg-[#b15f2c] transition disabled:opacity-50"
                >
                  {isSubmittingClaim ? 'Saving...' : 'Save Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
