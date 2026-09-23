'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';

interface ReportData {
  report_id: string;
  report_hash: string;
  generated_at: string;
  institution_name: string;
  purpose: string;
  artisan: {
    craftproof_id: string;
    full_name: string;
    craft: string;
    region: string;
    verification_status: string;
    experience_years: number;
  };
  verified_metrics: {
    batches_count: number;
    orders_count: number;
    payments_count: number;
    total_sales: number;
  };
  disclaimer: string;
}

export default function InstitutionReportView() {
  const params = useParams();
  const reportId = params?.id as string;
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    fetch(`http://localhost:8000/api/institution/report/${reportId}`)
      .then(res => {
        if (!res.ok) throw new Error("Report not found or consent has expired.");
        return res.json();
      })
      .then(d => setReport(d))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#b15f2c] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#8d8d8d]">Verifying institution report credentials...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-2">Report Not Accessible</h2>
            <p className="text-xs text-[#8d8d8d] mb-4">{error}</p>
            <Link href="/" className="text-xs text-[#b15f2c] font-semibold hover:underline">← Return Home</Link>
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
          {/* Header */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0a0a0a] text-white border border-white/10 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <span className="text-xs font-mono text-[#cf8047] font-semibold">
                Official Institutional Underwriting Audit · VirasatSetu
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ✓ Consent Authorized
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              Practitioner Evidence Summary
            </h1>
            <p className="text-sm text-white/70">
              Prepared for <strong className="text-white">{report.institution_name}</strong>
            </p>
            <p className="text-xs text-white/50 mt-1 font-mono">
              Report ID: {report.report_id} · Generated {report.generated_at}
            </p>
          </div>

          {/* ARTISAN IDENTITY VERIFICATION */}
          <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
            <h3 className="text-sm uppercase tracking-wider font-bold text-[#b15f2c] mb-3">
              1. Verified Identity & Craft Claims
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#8d8d8d] block">Artisan Name</span>
                <span className="font-semibold text-sm text-[#111111]">{report.artisan.full_name}</span>
              </div>
              <div>
                <span className="text-[#8d8d8d] block">VirasatSetu ID</span>
                <span className="font-mono font-semibold text-[#111111]">{report.artisan.craftproof_id}</span>
              </div>
              <div>
                <span className="text-[#8d8d8d] block">Craft Tradition</span>
                <span className="font-semibold text-[#111111]">{report.artisan.craft}</span>
              </div>
              <div>
                <span className="text-[#8d8d8d] block">Verification</span>
                <span className="font-semibold text-emerald-700">{report.artisan.verification_status}</span>
              </div>
            </div>
          </div>

          {/* VERIFIED PRODUCTION & TURNOVER METRICS */}
          <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
            <h3 className="text-sm uppercase tracking-wider font-bold text-[#b15f2c] mb-3">
              2. Documented Commercial Proof
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-[1.25rem] bg-white border border-[#e6e5e2]">
                <span className="text-2xl font-bold font-mono text-[#111111] block">
                  {report.verified_metrics.batches_count}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#8d8d8d]">Minted Batches</span>
              </div>
              <div className="p-4 rounded-[1.25rem] bg-white border border-[#e6e5e2]">
                <span className="text-2xl font-bold font-mono text-[#111111] block">
                  {report.verified_metrics.orders_count}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#8d8d8d]">Recorded Orders</span>
              </div>
              <div className="p-4 rounded-[1.25rem] bg-white border border-[#e6e5e2]">
                <span className="text-2xl font-bold font-mono text-[#111111] block">
                  {report.verified_metrics.payments_count}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#8d8d8d]">Confirmed Receipts</span>
              </div>
              <div className="p-4 rounded-[1.25rem] bg-white border border-[#e6e5e2]">
                <span className="text-2xl font-bold font-mono text-emerald-600 block">
                  ₹{report.verified_metrics.total_sales.toLocaleString()}
                </span>
                <span className="text-[10px] uppercase font-semibold text-[#8d8d8d]">Turnover Volume</span>
              </div>
            </div>
          </div>

          {/* CRYPTOGRAPHIC INTEGRITY AUDIT HASH */}
          <div className="p-6 rounded-[1.5rem] bg-white border border-[#e6e5e2] text-xs space-y-2">
            <span className="font-semibold text-[#111111] block">Cryptographic Tamper-Evidence</span>
            <p className="text-[#8d8d8d]">
              This report hash was committed to the VirasatSetu audit log at time of consent:
            </p>
            <p className="font-mono text-[11px] text-[#b15f2c] bg-[#f1f0ee] p-3 rounded-[0.875rem] break-all">
              {report.report_hash}
            </p>
          </div>

          {/* LEGAL DISCLAIMER */}
          <div className="p-4 rounded-[1rem] bg-[#f1f0ee] text-[11px] text-[#8d8d8d] italic">
            Notice: {report.disclaimer}
          </div>
        </div>
      </main>
    </div>
  );
}
