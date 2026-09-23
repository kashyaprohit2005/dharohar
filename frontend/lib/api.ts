import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const heritageAPI = {
  list: (params?: { category?: string; state?: string; search?: string; preservation_status?: string }) =>
    api.get('/api/heritage', { params }),
  detail: (id: number | string) => api.get(`/api/heritage/${id}`),
  states: () => api.get('/api/heritage/states'),
  stateProfile: (stateName: string) => api.get(`/api/heritage/states/profile/${encodeURIComponent(stateName)}`),
  categories: () => api.get('/api/heritage/categories'),
  atRisk: () => api.get('/api/heritage/at-risk'),
  nearby: (params: { lat: number; lon: number; radius?: number; category?: string; auto_expand?: boolean }) =>
    api.get('/api/heritage/nearby', { params }),
  geocode: (query: string) => api.get('/api/heritage/geocode', { params: { query } }),
  submitClaim: (heritageId: number | string, data: any) => api.post(`/api/heritage/${heritageId}/claim`, data),
};

export const communityAPI = {
  submit: (data: any) => api.post('/api/community/contribute', data),
  list: (params?: { status?: string }) => api.get('/api/community/contributions', { params }),
  get: (id: number | string) => api.get(`/api/community/contributions/${id}`),
};

export const artisanAPI = {
  register: (data: any) => api.post('/api/artisan/register', data),
  login: (data: any) => api.post('/api/artisan/login', data),
  getProfile: (id: number | string) => api.get(`/api/artisan/${id}`),
  createProduct: (id: number | string, data: any) => api.post(`/api/artisan/${id}/products`, data),
  getProducts: (id: number | string) => api.get(`/api/artisan/${id}/products`),
  createBatch: (id: number | string, data: any) => api.post(`/api/artisan/${id}/batches`, data),
  getBatches: (id: number | string) => api.get(`/api/artisan/${id}/batches`),
  createOrder: (id: number | string, data: any) => api.post(`/api/artisan/${id}/orders`, data),
  getOrders: (id: number | string) => api.get(`/api/artisan/${id}/orders`),
  createPayment: (id: number | string, data: any) => api.post(`/api/artisan/${id}/payments`, data),
  getPayments: (id: number | string) => api.get(`/api/artisan/${id}/payments`),
  saveKnowledge: (id: number | string, data: any) => api.post(`/api/artisan/${id}/knowledge`, data),
  getSchemes: (id: number | string) => api.get(`/api/artisan/${id}/schemes`),
  generateReport: (id: number | string, data: any) => api.post(`/api/artisan/${id}/institution-report`, data),
  createWorkshop: (id: number | string, data: any) => api.post(`/api/artisan/${id}/workshops`, data),
  getWorkshopRequests: (id: number | string) => api.get(`/api/artisan/${id}/workshop-requests`),
  updateWorkshopRequest: (artisanId: number | string, reqId: string, data: any) => api.put(`/api/artisan/${artisanId}/workshop-requests/${reqId}`, data),
};

export const workshopAPI = {
  list: () => api.get('/api/workshops'),
  detail: (id: number | string) => api.get(`/api/workshops/${id}`),
  submitRequest: (id: number | string, data: any) => api.post(`/api/workshops/${id}/request`, data),
};

export const verifierAPI = {
  getQueue: () => api.get('/api/verifier/artisans'),
  reviewArtisan: (id: number | string, data: any) => api.post(`/api/verifier/artisan/${id}/review`, data),
  getContributions: (status?: string) => api.get('/api/community/contributions', { params: { status } }),
  reviewContribution: (id: number | string, data: any) => api.post(`/api/verifier/contributions/${id}/review`, data),
  getClaims: () => api.get('/api/verifier/claims'),
  reviewClaim: (id: number | string, data: any) => api.post(`/api/verifier/claims/${id}/review`, data),
  getAuditLog: () => api.get('/api/verifier/audit-log'),
};

export const verificationAPI = {
  verifyToken: (token: string) => api.get(`/api/verify/${token}`),
  verifyLedger: (batchId: string) => api.get(`/api/batches/${batchId}/verify-ledger`),
};

export const searchAPI = {
  search: (query: string) => api.get(`/api/search?q=${encodeURIComponent(query)}`),
};

export const geoAPI = {
  states: () => api.get('/api/geo/states'),
  districts: (stateCode: string = 'HR') => api.get(`/api/geo/states/${stateCode}/districts`),
  district: (districtSlug: string) => api.get(`/api/geo/districts/${districtSlug}`),
  localities: (districtSlug: string) => api.get(`/api/geo/districts/${districtSlug}/localities`),
  locality: (localitySlug: string) => api.get(`/api/geo/localities/${localitySlug}`),
  localityItems: (localitySlug: string) => api.get(`/api/geo/localities/${localitySlug}/items`),
  item: (itemSlug: string | number) => api.get(`/api/geo/items/${itemSlug}`),
  story: (itemSlug: string | number) => api.get(`/api/geo/items/${itemSlug}/story`),
  recommendations: (itemSlug: string | number) => api.get(`/api/geo/items/${itemSlug}/recommendations`),
  related: (itemSlug: string | number) => api.get(`/api/geo/items/${itemSlug}/related`),
  search: (q: string) => api.get('/api/geo/search', { params: { q } }),
  eventsNearby: (params?: { district?: string; lat?: number; lon?: number; radius?: number }) =>
    api.get('/api/geo/events/nearby', { params }),
  categories: () => api.get('/api/geo/categories'),
};

export default api;