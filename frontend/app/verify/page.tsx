'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function VerifySearchPage() {
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    router.push(`/verify/${encodeURIComponent(tokenInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-semibold text-[#111111]/80 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
            Public Provenance Lookup
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111] mb-3">
            Verify Handloom Authenticity
          </h1>
          <p className="text-sm text-[#8d8d8d] max-w-md mx-auto mb-8">
            Scan your physical product's QR tag or enter the unique batch or token ID to retrieve its tamper-evident provenance history on VirasatSetu.
          </p>

          <div className="p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="Enter QR token or batch ID..."
                  className="w-full px-5 py-3.5 rounded-full bg-white border border-[#e6e5e2] text-sm text-[#111111] text-center font-mono focus:outline-none focus:border-[#b15f2c]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0a0a0a] text-white py-3.5 text-sm font-semibold hover:scale-[1.01] transition"
              >
                Inspect Cryptographic Provenance →
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
