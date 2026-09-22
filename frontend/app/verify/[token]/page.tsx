'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { verificationAPI } from '@/lib/api';

interface VerifiedData {
  verified: boolean;
  ledger_valid: boolean;
  product: {
    name: string;
    craft: string;
    material: string;
    technique: string;
    description: string;
  };
  artisan: {
    craftproof_id: string;
    full_name: string;
    region: string;
    craft: string;
    verification_status: string;
  };
  batch: {
    batch_id: string;
    total_units: number;
    created_at: string;
  };
  provenance_chain: {
    event_id: string;
    event_type: string;
    actor: string;
    detail: string;
    timestamp: string;
    hash: string;
  }[];
}

export default function TokenVerificationPage() {
  const params = useParams();
  const token = params?.token as string;
  const [data, setData] = useState<VerifiedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    verificationAPI.verifyToken(token)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.detail || "No record found in the authentic VirasatSetu registry."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#b15f2c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8d8d8d]">Verifying cryptographic token across ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto text-2xl font-bold mb-4">
              ✕
            </div>
            <h2 className="text-2xl font-semibold mb-2">Unverified Token</h2>
            <p className="text-xs text-[#8d8d8d] mb-6">
              Token <span className="font-mono font-bold text-[#111111]">{token}</span> is not registered on the authentic VirasatSetu ledger. This piece may be an uncertified reproduction.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold"
            >
              ← Search Another Token
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="shell max-w-4xl mx-auto space-y-8">
          {/* VERIFIED HEADER BADGE */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0a0a0a] text-white border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 mb-3">
                  <span>✓</span>
                  <span>Cryptographically Verified Handcraft</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {data.product.name}
                </h1>
                <p className="text-sm text-white/70 mt-1">
                  Batch #{data.batch.batch_id} · Minted {data.batch.created_at} · {data.batch.total_units} unit(s)
                </p>
              </div>

              <div className="p-4 rounded-[1.25rem] bg-white/5 border border-white/10 text-right">
                <span className="text-[10px] uppercase font-mono text-white/40 block">Verification Token</span>
                <span className="text-xs font-mono font-bold text-[#cf8047] block break-all">{token}</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  {data.ledger_valid ? '✓ SHA-256 Ledger Intact' : '✕ Hash Inconsistency'}
                </span>
              </div>
            </div>
          </div>

          {/* TWO COLUMN SPECIFICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Specifications */}
            <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
              <span className="text-[10px] uppercase font-bold text-[#b15f2c] tracking-wider block mb-2">
                Physical Specifications
              </span>
              <h3 className="text-lg font-semibold text-[#111111] mb-4">{data.product.name}</h3>

              <div className="space-y-2 text-xs text-[#111111]/80">
                <div className="flex justify-between py-1 border-b border-[#e6e5e2]">
                  <span className="text-[#8d8d8d]">Craft Tradition:</span>
                  <span className="font-semibold">{data.product.craft}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e6e5e2]">
                  <span className="text-[#8d8d8d]">Fibers & Materials:</span>
                  <span className="font-semibold">{data.product.material}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e6e5e2]">
                  <span className="text-[#8d8d8d]">Weaving Technique:</span>
                  <span className="font-semibold">{data.product.technique}</span>
                </div>
                {data.product.description && (
                  <p className="pt-2 text-xs text-[#8d8d8d] leading-relaxed">
                    {data.product.description}
                  </p>
                )}
              </div>
            </div>

            {/* Artisan Information */}
            <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2] flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#b15f2c] tracking-wider block mb-2">
                  Artisan Provenance
                </span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center font-bold text-sm">
                    {data.artisan.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#111111]">{data.artisan.full_name}</h4>
                    <span className="text-xs text-[#8d8d8d] font-mono">{data.artisan.craftproof_id}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#111111]/80">
                  <div className="flex justify-between py-1 border-b border-[#e6e5e2]">
                    <span className="text-[#8d8d8d]">Cluster Location:</span>
                    <span className="font-semibold">{data.artisan.region}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#e6e5e2]">
                    <span className="text-[#8d8d8d]">Identity Verification:</span>
                    <span className="font-semibold text-emerald-700">{data.artisan.verification_status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#e6e5e2] flex justify-between items-center text-xs">
                <span className="text-[#8d8d8d]">Verified through VirasatSetu</span>
                <Link
                  href="/heritage"
                  className="text-xs font-semibold text-[#b15f2c] hover:underline"
                >
                  Explore Traditions →
                </Link>
              </div>
            </div>
          </div>

          {/* CRYPTOGRAPHIC PROVENANCE TIMELINE */}
          <div className="p-8 rounded-[2rem] bg-white border border-[#e6e5e2] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-semibold text-[#b15f2c] uppercase tracking-widest block mb-1">
                  Tamper-Evident Ledger
                </span>
                <h3 className="text-xl font-semibold text-[#111111]">
                  Provenance Event Chain
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Cryptographic Chain Valid
              </span>
            </div>

            <div className="space-y-4">
              {data.provenance_chain.map((ev, i) => (
                <div key={ev.event_id || i} className="p-4 rounded-[1.25rem] bg-[#f1f0ee]/50 border border-[#e6e5e2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#b15f2c]">
                        #{i + 1} {ev.event_type}
                      </span>
                      <span className="text-[10px] text-[#8d8d8d]">by {ev.actor}</span>
                    </div>
                    <p className="text-xs font-medium text-[#111111]">{ev.detail}</p>
                    <span className="text-[10px] font-mono text-[#8d8d8d] block mt-1 break-all">
                      Hash: {ev.hash}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8d8d8d] whitespace-nowrap font-mono">{ev.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
