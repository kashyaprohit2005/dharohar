'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../../components/Navbar';
import { artisanAPI, verificationAPI, API_BASE_URL } from '@/lib/api';

interface ArtisanData {
  id: number;
  craftproof_id: string;
  full_name: string;
  phone: string;
  region: string;
  craft: string;
  experience_years: number;
  story: string;
  verification_status: string;
  verifier_notes: string | null;
  verified_by: string | null;
  products_count: number;
  batches_count: number;
  orders_count: number;
  payments_count: number;
  knowledge_count: number;
  workshops_count: number;
}

interface ProductItem {
  id: number;
  product_id: string;
  name: string;
  craft: string;
  material: string;
  technique: string;
  description: string;
  production_date: string;
}

interface BatchItem {
  id: number;
  batch_id: string;
  product_name: string;
  total_units: number;
  qr_token: string;
  provenance_events: any[];
  created_at: string;
}

interface OrderItem {
  id: number;
  order_id: string;
  buyer_name: string;
  buyer_organization: string;
  quantity: number;
  total_amount: number;
  order_date: string;
  order_status: string;
}

interface WorkshopItem {
  id: number;
  workshop_id: string;
  title: string;
  description: string;
  craft: string;
  workshop_type: string;
  location: string;
  state: string;
  max_participants: number;
  preferred_dates: string;
  status: string;
}

interface WorkshopRequestItem {
  id: number;
  request_id: string;
  workshop_title: string;
  workshop_id: number;
  requester_name: string;
  requester_phone: string;
  requester_email: string;
  workshop_type: string;
  preferred_date: string;
  participants: number;
  message: string;
  status: string;
  artisan_response: string | null;
  created_at: string;
}

export default function ArtisanDashboard() {
  const router = useRouter();
  const [artisan, setArtisan] = useState<ArtisanData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [schemeFactors, setSchemeFactors] = useState<any>({});
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [workshopRequests, setWorkshopRequests] = useState<WorkshopRequestItem[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'batches' | 'economics' | 'workshops' | 'schemes' | 'knowledge'>('overview');
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  // Forms state
  const [newProduct, setNewProduct] = useState({
    name: '',
    material: '',
    technique: '',
    description: '',
    production_date: new Date().toISOString().split('T')[0]
  });
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [newBatch, setNewBatch] = useState({
    product_id: 0,
    total_units: 1,
    notes: ''
  });
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  const [newOrder, setNewOrder] = useState({
    buyer_name: '',
    buyer_organization: '',
    quantity: 1,
    total_amount: 5000,
    order_date: new Date().toISOString().split('T')[0]
  });
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [knowledgeText, setKnowledgeText] = useState({
    technique: '',
    story: ''
  });
  const [isSavingKnowledge, setIsSavingKnowledge] = useState(false);

  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    workshop_type: 'HANDS_ON',
    location: '',
    state: '',
    max_participants: 10,
    preferred_dates: ''
  });
  const [isCreatingWorkshop, setIsCreatingWorkshop] = useState(false);

  // Ledger Verification State
  const [ledgerVerification, setLedgerVerification] = useState<any>(null);
  const [selectedBatchForVerification, setSelectedBatchForVerification] = useState<string | null>(null);

  // Institution Report State
  const [reportResult, setReportResult] = useState<any>(null);
  const [institutionName, setInstitutionName] = useState('State Bank of India — MSME Desk');

  useEffect(() => {
    const artisanId = typeof window !== 'undefined' ? localStorage.getItem('artisan_id') : null;
    if (!artisanId) {
      router.push('/artisan/login');
      return;
    }
    loadAllData(parseInt(artisanId));
  }, []);

  const loadAllData = async (id: number) => {
    setLoading(true);
    try {
      // First fetch the profile to verify the artisan exists
      let profileData: any = null;
      try {
        const profRes = await artisanAPI.getProfile(id);
        profileData = profRes.data;
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          // Stale local storage ID after database reset!
          if (typeof window !== 'undefined') {
            localStorage.removeItem('artisan_id');
            localStorage.removeItem('craftproof_id');
            localStorage.removeItem('full_name');
          }
          setNotFoundError(true);
          setLoading(false);
          return;
        }
        throw err;
      }

      setArtisan(profileData);
      setNewWorkshop(prev => ({
        ...prev,
        location: profileData.region || '',
        state: profileData.region?.split(',').pop()?.trim() || ''
      }));

      // Fetch related data in parallel with safe error fallbacks
      const [prodRes, batchRes, orderRes, schemeRes, wsReqRes] = await Promise.all([
        artisanAPI.getProducts(id).then(r => r.data).catch(() => []),
        artisanAPI.getBatches(id).then(r => r.data).catch(() => []),
        artisanAPI.getOrders(id).then(r => r.data).catch(() => []),
        artisanAPI.getSchemes(id).then(r => r.data).catch(() => ({ factors: {}, schemes: [] })),
        artisanAPI.getWorkshopRequests(id).then(r => r.data).catch(() => []),
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(batchRes)) setBatches(batchRes);
      if (Array.isArray(orderRes)) setOrders(orderRes);
      if (schemeRes.schemes) {
        setSchemes(schemeRes.schemes);
        setSchemeFactors(schemeRes.factors || {});
      }
      if (Array.isArray(wsReqRes)) setWorkshopRequests(wsReqRes);

      // Fetch workshops from public listing for this artisan
      const allWsRes = await fetch(`${API_BASE_URL}/api/workshops`).then(r => r.json()).catch(() => []);
      if (Array.isArray(allWsRes)) {
        setWorkshops(allWsRes.filter((w: any) => w.artisan?.id === id));
      }
    } catch (e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setIsCreatingProduct(true);
    try {
      const res = await artisanAPI.createProduct(artisan.id, {
        ...newProduct,
        craft: artisan.craft
      });
      if (res.data.success) {
        setNewProduct({ name: '', material: '', technique: '', description: '', production_date: new Date().toISOString().split('T')[0] });
        loadAllData(artisan.id);
        setActiveTab('products');
      }
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan || !newBatch.product_id) return;
    setIsCreatingBatch(true);
    try {
      const res = await artisanAPI.createBatch(artisan.id, newBatch);
      if (res.data.success) {
        setNewBatch({ product_id: 0, total_units: 1, notes: '' });
        loadAllData(artisan.id);
        setActiveTab('batches');
      }
    } finally {
      setIsCreatingBatch(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setIsCreatingOrder(true);
    try {
      const res = await artisanAPI.createOrder(artisan.id, newOrder);
      if (res.data.success) {
        await artisanAPI.createPayment(artisan.id, {
          amount: newOrder.total_amount,
          reference_no: `UPI-${Math.floor(100000 + Math.random() * 900000)}`,
          payment_date: newOrder.order_date
        });
        setNewOrder({ buyer_name: '', buyer_organization: '', quantity: 1, total_amount: 5000, order_date: new Date().toISOString().split('T')[0] });
        loadAllData(artisan.id);
        setActiveTab('economics');
      }
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setIsCreatingWorkshop(true);
    try {
      const res = await artisanAPI.createWorkshop(artisan.id, {
        ...newWorkshop,
        craft: artisan.craft
      });
      if (res.data.success) {
        setNewWorkshop({
          title: '',
          description: '',
          workshop_type: 'HANDS_ON',
          location: artisan.region || '',
          state: '',
          max_participants: 10,
          preferred_dates: ''
        });
        loadAllData(artisan.id);
        setActiveTab('workshops');
      }
    } finally {
      setIsCreatingWorkshop(false);
    }
  };

  const handleUpdateWorkshopRequest = async (requestId: string, status: 'ACCEPTED' | 'DECLINED') => {
    if (!artisan) return;
    try {
      await artisanAPI.updateWorkshopRequest(artisan.id, requestId, {
        status,
        artisan_response: status === 'ACCEPTED' ? 'Accepted by master practitioner.' : 'Declined due to scheduling.'
      });
      loadAllData(artisan.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan) return;
    setIsSavingKnowledge(true);
    try {
      await artisanAPI.saveKnowledge(artisan.id, {
        craft: artisan.craft,
        ...knowledgeText
      });
      setKnowledgeText({ technique: '', story: '' });
      loadAllData(artisan.id);
    } finally {
      setIsSavingKnowledge(false);
    }
  };

  const handleVerifyLedger = async (batchId: string) => {
    setSelectedBatchForVerification(batchId);
    try {
      const res = await verificationAPI.verifyLedger(batchId);
      setLedgerVerification(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateReport = async () => {
    if (!artisan) return;
    try {
      const res = await artisanAPI.generateReport(artisan.id, {
        institution_name: institutionName,
        purpose: 'Institutional Working Capital / Scheme Underwriting',
        shared_sections: ['IDENTITY', 'PRODUCTION', 'ORDERS', 'PAYMENTS']
      });
      setReportResult(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-[#8d8d8d]">
          <div className="w-4 h-4 rounded-full border-2 border-[#b15f2c] border-t-transparent animate-spin" />
          <span>Loading Living Artisan Passport...</span>
        </div>
      </div>
    );
  }

  if (notFoundError || !artisan) {
    return (
      <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
        <Navbar />
        <main className="flex-1 shell py-20 flex items-center justify-center">
          <div className="max-w-md w-full p-8 rounded-[2rem] bg-[#f1f0ee] border border-[#e6e5e2] text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl font-bold mb-4">
              👤
            </div>
            <h2 className="text-xl font-semibold text-[#111111] mb-2">No Active Practitioner Session</h2>
            <p className="text-xs text-[#8d8d8d] mb-6 leading-relaxed">
              The previous session expired or the database was reset. Register a new practitioner or sign in to open your live dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/artisan/register"
                className="w-full py-2.5 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold hover:bg-[#b15f2c] transition"
              >
                Register as Practitioner →
              </Link>
              <Link
                href="/artisan/login"
                className="w-full py-2.5 rounded-full bg-white border border-[#e6e5e2] text-[#111111] text-xs font-semibold hover:bg-[#e3e2df] transition"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col selection:bg-[#b15f2c] selection:text-white">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="shell space-y-8">
          {/* ARTISAN IDENTITY HERO */}
          <div className="rounded-[2.5rem] bg-[#0a0a0a] text-white p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative overflow-hidden">
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#cf8047] to-[#97501f] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg">
                {artisan.full_name[0]}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                    {artisan.full_name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${
                    artisan.verification_status === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : artisan.verification_status === 'UNDER_REVIEW'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {artisan.verification_status}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-1">
                  {artisan.craft} · {artisan.region} · {artisan.experience_years} years practice
                </p>
                <span className="text-[11px] font-mono text-[#cf8047] mt-1 block">
                  VirasatSetu ID: {artisan.craftproof_id}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs relative z-10">
              <Link
                href="/verifier"
                className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition text-white/80"
              >
                Review in Verifier Desk 🛡️
              </Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  router.push('/artisan/login');
                }}
                className="px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* VERIFIER NOTICE IF NOT YET VERIFIED */}
          {artisan.verification_status !== 'VERIFIED' && (
            <div className="p-4 rounded-[1.25rem] bg-[#f1f0ee] border border-[#e6e5e2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#111111]/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>
                  Status: <strong>{artisan.verification_status}</strong>. Your account has been registered live with 0 demo data. Verifier review occurs at the Verifier Desk.
                </span>
              </div>
              <Link href="/verifier" className="font-semibold text-[#b15f2c] hover:underline whitespace-nowrap">
                Open Verifier Desk →
              </Link>
            </div>
          )}

          {/* REAL STATS COUNTER BAR (NO FAKE DATA) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Products', val: products.length },
              { label: 'Batches', val: batches.length },
              { label: 'Workshops', val: workshops.length },
              { label: 'Orders', val: orders.length },
              { label: 'Revenue', val: `₹${orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}` }
            ].map(s => (
              <div key={s.label} className="p-4 rounded-[1.25rem] bg-[#f1f0ee]/70 border border-[#e6e5e2] text-center">
                <span className="text-2xl font-bold text-[#111111] block font-mono">{s.val}</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8d8d8d]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex flex-wrap gap-2 border-b border-[#e6e5e2] pb-3 text-sm font-semibold">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'products', label: `Products (${products.length})` },
              { key: 'batches', label: `Batches & QR (${batches.length})` },
              { key: 'workshops', label: `Workshops (${workshops.length})` },
              { key: 'economics', label: `Orders & Ledger (${orders.length})` },
              { key: 'schemes', label: 'Scheme Readiness' },
              { key: 'knowledge', label: 'Oral Knowledge Archive' }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`px-4 py-2 rounded-full transition text-xs sm:text-sm ${
                  activeTab === t.key
                    ? 'bg-[#0a0a0a] text-white shadow-sm'
                    : 'text-[#8d8d8d] hover:text-[#111111]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/50 border border-[#e6e5e2]">
                  <h3 className="text-base font-semibold text-[#111111] mb-2">Practitioner Heritage Story</h3>
                  <p className="text-sm text-[#8d8d8d] leading-relaxed">
                    {artisan.story || "No personal story entered yet. Add one in the Oral Knowledge Archive tab to link your practice to the Living Heritage Passport."}
                  </p>
                </div>

                <div className="p-6 rounded-[2rem] bg-[#f1f0ee]/50 border border-[#e6e5e2]">
                  <h3 className="text-base font-semibold text-[#111111] mb-2">Next Recommended Actions</h3>
                  <ul className="text-xs text-[#8d8d8d] space-y-2 mt-3">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]" />
                      <span>Create your first authenticated craft product in the <strong>Products</strong> tab.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]" />
                      <span>Mint a production batch to generate a tamper-evident SHA-256 hash and dynamic QR.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]" />
                      <span>Host a hands-on or demonstration workshop in the <strong>Workshops</strong> tab.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b15f2c]" />
                      <span>Record an oral knowledge record to preserve traditional generational techniques.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Create New Product Record</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Every product created here receives a unique VirasatSetu Product ID. Zero pre-seeded items.
                </p>

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="e.g. Pure Mulberry Silk Handloom Saree"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Raw Material *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.material}
                      onChange={e => setNewProduct({ ...newProduct, material: e.target.value })}
                      placeholder="e.g. Certified Katan Silk & Gold Zari"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Technique *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.technique}
                      onChange={e => setNewProduct({ ...newProduct, technique: e.target.value })}
                      placeholder="e.g. Kadhua Handloom Brocading"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Production Date *</label>
                    <input
                      type="date"
                      required
                      value={newProduct.production_date}
                      onChange={e => setNewProduct({ ...newProduct, production_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Describe the craft details, motif inspiration, and time taken to weave..."
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingProduct}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-6 py-2.5 text-xs font-semibold hover:scale-[1.02] transition"
                    >
                      {isCreatingProduct ? 'Saving...' : 'Add Product to Registry →'}
                    </button>
                  </div>
                </form>
              </div>

              {/* PRODUCTS LIST */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#111111]">Registered Products ({products.length})</h3>
                {products.length === 0 ? (
                  <div className="p-8 rounded-[1.5rem] bg-[#f1f0ee]/40 border border-[#e6e5e2] text-center text-xs text-[#8d8d8d]">
                    No products created yet. Use the form above to add your first craft piece.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="p-5 rounded-[1.5rem] bg-white border border-[#e6e5e2] flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#8d8d8d] mb-1">
                            <span>{p.product_id}</span>
                            <span>{p.production_date}</span>
                          </div>
                          <h4 className="text-base font-semibold text-[#111111]">{p.name}</h4>
                          <p className="text-xs text-[#8d8d8d] mt-1">{p.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-[#f1f0ee] text-[#111111]">Material: {p.material}</span>
                            <span className="px-2 py-0.5 rounded bg-[#f1f0ee] text-[#111111]">Technique: {p.technique}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#e6e5e2] flex justify-end">
                          <button
                            onClick={() => {
                              setNewBatch(prev => ({ ...prev, product_id: p.id }));
                              setActiveTab('batches');
                            }}
                            className="text-xs font-semibold text-[#b15f2c] hover:underline"
                          >
                            Mint Batch for this Product →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BATCHES & QR */}
          {activeTab === 'batches' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Mint Production Batch & QR</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Minting a batch creates a genesis event on the tamper-evident SHA-256 hash-chained ledger and generates a public verification QR.
                </p>

                <form onSubmit={handleCreateBatch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Select Product *</label>
                    <select
                      required
                      value={newBatch.product_id}
                      onChange={e => setNewBatch({ ...newBatch, product_id: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    >
                      <option value={0}>-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.product_id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Total Units in Batch *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newBatch.total_units}
                      onChange={e => setNewBatch({ ...newBatch, total_units: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Batch Notes</label>
                    <input
                      type="text"
                      value={newBatch.notes}
                      onChange={e => setNewBatch({ ...newBatch, notes: e.target.value })}
                      placeholder="e.g. Festive Loom Batch #1"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingBatch || products.length === 0}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-6 py-2.5 text-xs font-semibold hover:scale-[1.02] transition disabled:opacity-50"
                    >
                      {isCreatingBatch ? 'Minting...' : 'Mint Batch & Generate Dynamic QR →'}
                    </button>
                  </div>
                </form>
              </div>

              {/* BATCHES LIST */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#111111]">Minted Production Batches ({batches.length})</h3>
                {batches.length === 0 ? (
                  <div className="p-8 rounded-[1.5rem] bg-[#f1f0ee]/40 border border-[#e6e5e2] text-center text-xs text-[#8d8d8d]">
                    No batches minted yet. Create a product first, then mint a production batch.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batches.map(b => (
                      <div key={b.id} className="p-6 rounded-[2rem] bg-white border border-[#e6e5e2] flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <span className="text-[10px] font-mono text-[#8d8d8d] block">{b.batch_id}</span>
                              <h4 className="text-lg font-semibold text-[#111111]">{b.product_name}</h4>
                              <p className="text-xs text-[#8d8d8d] mt-0.5">{b.total_units} unit(s) · Minted {b.created_at}</p>
                            </div>

                            {/* DYNAMIC QR CODE */}
                            <div className="p-2 bg-white rounded-xl border border-[#e6e5e2] shadow-sm">
                              <QRCodeSVG
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${b.qr_token}`}
                                size={80}
                                level="M"
                              />
                            </div>
                          </div>

                          {/* PROVENANCE LEDGER CHAIN */}
                          <div className="mt-4 pt-3 border-t border-[#e6e5e2]">
                            <span className="text-[10px] font-semibold uppercase text-[#8d8d8d] block mb-2">
                              Provenance Ledger ({b.provenance_events?.length || 1} Event)
                            </span>
                            <div className="space-y-1.5 font-mono text-[11px]">
                              {b.provenance_events?.map((ev: any, i: number) => (
                                <div key={ev.event_id || i} className="p-2 rounded bg-[#f1f0ee] flex items-center justify-between text-[#111111]">
                                  <span>{ev.event_type}</span>
                                  <span className="text-[#8d8d8d] text-[10px]">{ev.current_hash}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3 border-t border-[#e6e5e2] flex items-center justify-between">
                          <button
                            onClick={() => handleVerifyLedger(b.batch_id)}
                            className="text-xs font-semibold text-[#b15f2c] hover:underline"
                          >
                            Verify SHA-256 Ledger Integrity 🔍
                          </button>
                          <Link
                            href={`/verify/${b.qr_token}`}
                            target="_blank"
                            className="text-xs font-semibold text-[#111111] hover:underline"
                          >
                            Open Public Verification ↗
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* LEDGER VERIFICATION RESULT MODAL */}
                {ledgerVerification && (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">
                        {ledgerVerification.valid ? '✓ Ledger Integrity Confirmed' : '✕ Ledger Verification Failed'}
                      </span>
                      <button onClick={() => setLedgerVerification(null)} className="text-[#8d8d8d]">✕</button>
                    </div>
                    <p className="leading-relaxed">
                      {ledgerVerification.message} Verified batch: <strong>{selectedBatchForVerification}</strong> with {ledgerVerification.chain_length} chained blocks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WORKSHOPS & APPRENTICESHIPS */}
          {activeTab === 'workshops' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Host a Master Workshop</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Offer hands-on workshops, masterclasses, or lectures directly to students, designers, and tourists.
                </p>

                <form onSubmit={handleCreateWorkshop} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Workshop Title *</label>
                    <input
                      type="text"
                      required
                      value={newWorkshop.title}
                      onChange={e => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
                      placeholder="e.g. Masterclass in Traditional Brocade Loom Setup"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Workshop Type *</label>
                    <select
                      value={newWorkshop.workshop_type}
                      onChange={e => setNewWorkshop({ ...newWorkshop, workshop_type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    >
                      <option value="HANDS_ON">Hands-On Apprentice Workshop</option>
                      <option value="DEMONSTRATION">Master Technique Demonstration</option>
                      <option value="LECTURE">Oral Heritage Lecture & History</option>
                      <option value="ONLINE">Live Virtual Masterclass</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Location / Atelier *</label>
                    <input
                      type="text"
                      required
                      value={newWorkshop.location}
                      onChange={e => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                      placeholder="e.g. Weaving Shed, Madanpura, Varanasi"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Max Participants</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newWorkshop.max_participants}
                      onChange={e => setNewWorkshop({ ...newWorkshop, max_participants: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Workshop Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={newWorkshop.description}
                      onChange={e => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                      placeholder="Describe what participants will learn, materials provided, duration, and prior experience needed..."
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingWorkshop}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-6 py-2.5 text-xs font-semibold hover:scale-[1.02] transition"
                    >
                      {isCreatingWorkshop ? 'Publishing...' : 'Publish Workshop to National Discovery →'}
                    </button>
                  </div>
                </form>
              </div>

              {/* INCOMING WORKSHOP REQUESTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#111111]">
                    Incoming Participant Requests ({workshopRequests.length})
                  </h3>
                  <span className="text-xs text-[#8d8d8d]">Live requests submitted by users</span>
                </div>

                {workshopRequests.length === 0 ? (
                  <div className="p-8 rounded-[1.5rem] bg-[#f1f0ee]/40 border border-[#e6e5e2] text-center text-xs text-[#8d8d8d]">
                    No requests received yet. As public users browse your workshops, requests will appear here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workshopRequests.map(r => (
                      <div key={r.id} className="p-5 rounded-2xl bg-white border border-[#e6e5e2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1 text-xs">
                            <span className="font-semibold text-[#111111]">{r.requester_name}</span>
                            <span className="text-[#8d8d8d]">·</span>
                            <span className="text-[#8d8d8d]">{r.requester_phone}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              r.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                              r.status === 'DECLINED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#8d8d8d]">
                            Workshop: <strong>{r.workshop_title}</strong> · {r.participants} participant(s) · Preferred: {r.preferred_date || 'Flexible'}
                          </p>
                          {r.message && (
                            <p className="text-xs text-[#111111]/70 mt-2 bg-[#f1f0ee] p-2.5 rounded-lg italic">
                              "{r.message}"
                            </p>
                          )}
                        </div>

                        {r.status === 'PENDING' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateWorkshopRequest(r.request_id, 'ACCEPTED')}
                              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateWorkshopRequest(r.request_id, 'DECLINED')}
                              className="px-4 py-2 rounded-full border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & ECONOMIC LEDGER */}
          {activeTab === 'economics' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Log Real Sales Order</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Every order recorded here automatically mints a payment receipt to establish verifiable institutional credit history.
                </p>

                <form onSubmit={handleCreateOrder} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Buyer Name *</label>
                    <input
                      type="text"
                      required
                      value={newOrder.buyer_name}
                      onChange={e => setNewOrder({ ...newOrder, buyer_name: e.target.value })}
                      placeholder="e.g. Sangeeta Rao"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Buyer Organization</label>
                    <input
                      type="text"
                      value={newOrder.buyer_organization}
                      onChange={e => setNewOrder({ ...newOrder, buyer_organization: e.target.value })}
                      placeholder="e.g. FabIndia / Private Collector"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Total Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newOrder.total_amount}
                      onChange={e => setNewOrder({ ...newOrder, total_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCreatingOrder}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-6 py-2.5 text-xs font-semibold hover:scale-[1.02] transition"
                    >
                      {isCreatingOrder ? 'Recording...' : 'Log Verified Sale & Payment Receipt →'}
                    </button>
                  </div>
                </form>
              </div>

              {/* ORDERS LIST */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#111111]">Logged Orders ({orders.length})</h3>
                {orders.length === 0 ? (
                  <div className="p-8 rounded-[1.5rem] bg-[#f1f0ee]/40 border border-[#e6e5e2] text-center text-xs text-[#8d8d8d]">
                    No economic orders logged yet. Use the form above to add a real sale.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(o => (
                      <div key={o.id} className="p-4 rounded-xl bg-white border border-[#e6e5e2] flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-[#8d8d8d] block">{o.order_id}</span>
                          <span className="font-semibold text-[#111111] text-sm">{o.buyer_name}</span>
                          {o.buyer_organization && <span className="text-[#8d8d8d]"> ({o.buyer_organization})</span>}
                          <span className="text-[#8d8d8d] block">{o.order_date} · {o.quantity} unit(s)</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold font-mono text-[#111111] block">₹{o.total_amount.toLocaleString()}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {o.order_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SCHEME READINESS */}
          {activeTab === 'schemes' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Government Scheme & Credit Readiness</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Truthful qualification factors derived strictly from your verified database records. No arbitrary AI scores.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-white border border-[#e6e5e2]">
                    <span className="text-[10px] uppercase font-semibold text-[#8d8d8d] block">Identity Verified</span>
                    <span className={`text-sm font-semibold ${schemeFactors.identity_verified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {schemeFactors.identity_verified ? '✓ Verified' : 'Pending Review'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#e6e5e2]">
                    <span className="text-[10px] uppercase font-semibold text-[#8d8d8d] block">Products Logged</span>
                    <span className="text-sm font-semibold text-[#111111]">
                      {products.length} registered
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#e6e5e2]">
                    <span className="text-[10px] uppercase font-semibold text-[#8d8d8d] block">Batches Minted</span>
                    <span className="text-sm font-semibold text-[#111111]">
                      {batches.length} minted
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-[#e6e5e2]">
                    <span className="text-[10px] uppercase font-semibold text-[#8d8d8d] block">Documented Revenue</span>
                    <span className="text-sm font-semibold text-[#111111]">
                      ₹{orders.reduce((sum, o) => sum + o.total_amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* SCHEMES CARDS */}
                <div className="space-y-4">
                  {schemes.map((s: any) => (
                    <div key={s.name} className="p-5 rounded-2xl bg-white border border-[#e6e5e2] space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8d8d8d] block">{s.ministry}</span>
                          <h4 className="text-base font-semibold text-[#111111]">{s.name}</h4>
                          <p className="text-xs text-[#8d8d8d] mt-0.5">{s.relevant_because}</p>
                        </div>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-[#b15f2c] hover:underline whitespace-nowrap"
                        >
                          Official Portal ↗
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#e6e5e2]">
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-800 uppercase block mb-1">Requirements Met:</span>
                          <ul className="space-y-0.5 text-[#111111]/80">
                            {s.requirements_met?.map((m: string) => (
                              <li key={m} className="flex items-center gap-1.5">
                                <span className="text-emerald-600">✓</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-amber-800 uppercase block mb-1">Missing Evidence:</span>
                          <ul className="space-y-0.5 text-[#111111]/80">
                            {s.requirements_missing?.length === 0 ? (
                              <li className="text-emerald-700 font-medium">All prerequisite criteria recorded!</li>
                            ) : (
                              s.requirements_missing?.map((m: string) => (
                                <li key={m} className="flex items-center gap-1.5 text-amber-900">
                                  <span>○</span>
                                  <span>{m}</span>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CONSENT REPORT GENERATOR */}
                <div className="mt-8 pt-6 border-t border-[#e6e5e2]">
                  <h4 className="text-sm font-semibold text-[#111111] mb-2">
                    Generate Consent-Based Institution Evidence Report
                  </h4>
                  <p className="text-xs text-[#8d8d8d] mb-4">
                    Creates a cryptographically hashed evidence summary for commercial banks or government loan officers.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={institutionName}
                      onChange={e => setInstitutionName(e.target.value)}
                      placeholder="Receiving Institution Name"
                      className="px-4 py-2 rounded-xl bg-white border border-[#e6e5e2] text-xs text-[#111111] w-72"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateReport}
                      className="px-5 py-2 rounded-full bg-[#0a0a0a] text-white text-xs font-semibold hover:bg-[#b15f2c] transition"
                    >
                      Sign Consent & Generate Report →
                    </button>
                  </div>

                  {reportResult && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                      <p className="font-semibold mb-1">✓ Evidence Report Generated</p>
                      <p>Report ID: <code className="font-mono">{reportResult.report_id}</code></p>
                      <Link
                        href={reportResult.report_url}
                        target="_blank"
                        className="font-semibold text-emerald-800 underline mt-2 inline-block"
                      >
                        View Tamper-Evident Report ↗
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ORAL KNOWLEDGE PRESERVATION */}
          {activeTab === 'knowledge' && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-[2rem] bg-[#f1f0ee]/60 border border-[#e6e5e2]">
                <h3 className="text-lg font-semibold text-[#111111] mb-1">Preserve Oral Craft Knowledge</h3>
                <p className="text-xs text-[#8d8d8d] mb-6">
                  Safeguard unwritten generational techniques directly from the master artisan. Linked permanently to your Living Heritage record.
                </p>

                <form onSubmit={handleSaveKnowledge} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Technique Name *</label>
                    <input
                      type="text"
                      required
                      value={knowledgeText.technique}
                      onChange={e => setKnowledgeText({ ...knowledgeText, technique: e.target.value })}
                      placeholder="e.g. Natural Indigo Dyeing Fermentation Cycles"
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#8d8d8d] uppercase mb-1">Oral Story / Spoken Transcript *</label>
                    <textarea
                      rows={4}
                      required
                      value={knowledgeText.story}
                      onChange={e => setKnowledgeText({ ...knowledgeText, story: e.target.value })}
                      placeholder="Detail the sequence, traditional temperature checks, herbal additions..."
                      className="w-full px-4 py-2.5 rounded-[0.875rem] bg-white border border-[#e6e5e2] text-sm text-[#111111] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingKnowledge}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] text-white px-6 py-2.5 text-xs font-semibold hover:scale-[1.02] transition"
                  >
                    {isSavingKnowledge ? 'Archiving...' : 'Permanently Archive Knowledge Record →'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}