'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '@/lib/store';
import { artisanAPI } from '@/lib/api';

export default function ArtisanLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await artisanAPI.login({ phone, password });
      const data = res.data;

      login(data.artisan_id, data.craftproof_id, data.full_name, 'auth-token');
      localStorage.setItem('artisan_id', String(data.artisan_id));
      localStorage.setItem('craftproof_id', data.craftproof_id);
      localStorage.setItem('full_name', data.full_name);

      router.push('/artisan/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-white border border-[#e6e5e2] shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e6e5e2] bg-[#f1f0ee] text-xs font-semibold text-[#111111]/80 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]"></span>
              Practitioner Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111]">
              Sign in to VirasatSetu
            </h1>
            <p className="text-xs text-[#8d8d8d] mt-2">
              Access your digital Artisan Passport, batches, QR tokens, and workshops.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f1f0ee] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8d8d8d] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#f1f0ee] border border-[#e6e5e2] text-sm text-[#111111] focus:outline-none focus:border-[#b15f2c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0a0a0a] text-white text-sm font-semibold hover:bg-[#b15f2c] transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Passport'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#e6e5e2] text-center text-xs text-[#8d8d8d]">
            <span>Don't have an artisan profile yet? </span>
            <Link href="/artisan/register" className="font-semibold text-[#b15f2c] hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}