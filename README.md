# DHAROHAR (धरोहर)
### India, in Every Story — Living Interactive Cultural Atlas of India

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js_16-000000.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/UI-React_19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900.svg?logo=leaflet&logoColor=white)](https://leafletjs.com)

**DHAROHAR** is a comprehensive, production-grade Living Cultural Atlas of India built for the Smart India Hackathon (SIH). It bridges 4,000 years of unbroken civilizational knowledge with cutting-edge geospatial intelligence, immutable SHA-256 provenance verification, and grassroots artisan empowerment.

---

## 🏛️ Key Capabilities

- **Pure Vector India Map**: High-performance, unwatermarked interactive GeoJSON vector map across all 36 States and Union Territories.
- **Deep Haryana Pilot (23 Districts)**: Full administrative drill-down through all 23 districts of Haryana — including **Hansi as the 23rd district** (constituted 22 December 2025) with its subdivisions and honest `PENDING_SOURCE` ODOP status.
- **Authoritative Cultural Taxonomy**: 47 verified cultural items spanning 15 distinct domains:
  `CRAFTS` • `TEXTILES` • `FOOD` • `MONUMENTS` • `ARCHAEOLOGY` • `ARCHITECTURE` • `TEMPLES` • `RELIGIOUS_HERITAGE` • `HISTORICAL_PLACES` • `LOCAL_PRODUCTS` • `FESTIVALS` • `DANCE` • `MUSIC` • `TRADITIONS` • `NATURE_RELATED_HERITAGE` • `TRADITIONAL_KNOWLEDGE`
- **Zero Factual Guesswork**: Every cultural entry is cross-referenced with primary government audits: Archaeological Survey of India (ASI), Ministry of Culture, MoFPI ODOP Gazette, GI Registry of India, and Haryana Tourism Corporation.
- **Proximity Recommendations**: Haversine distance engine calculates real-time nearby crafts, food traditions, and heritage points.
- **Living Cultural Stories**: Multi-chapter immersive narrative experiences with authentic field recordings and AI narration.
- **Cryptographic Provenance**: SHA-256 batch token ledger for authenticating traditional handicrafts and protecting artisans from industrial imitation.
- **Voice & Accessibility**: Integrated IVR helpline, bilingual voice assistant, and audio story narration.
- **Geographic Utilities**: One-click Google Maps directions with latitude/longitude coordinates and social sharing with OpenGraph cards.

---

## 🏗️ Architecture

DHAROHAR is organized as a production monorepo:

```
dharohar/
├── backend/                  # Python 3.11+ / FastAPI
│   ├── app.py                # Core REST API & ORM models
│   ├── haryana_geo_data.py   # Curated 23-district cultural database
│   ├── heritage_data.py      # National heritage records
│   ├── requirements.txt      # Python runtime dependencies
│   └── .env.example          # Backend configuration reference
│
├── frontend/                 # Next.js 16.3 (Turbopack) / React 19 / TypeScript
│   ├── app/                  # App router with SSR and client components
│   ├── lib/api.ts            # Centralized Axios API client
│   ├── public/data/          # GeoJSON boundaries (India & Haryana)
│   ├── package.json          # Node dependencies
│   └── .env.example          # Frontend configuration reference
│
├── render.yaml               # Render Infrastructure-as-Code Blueprint
├── DEPLOYMENT.md             # Complete deployment walkthrough
└── README.md
```

---

## 🚀 Quick Start (Local)

### 1. Start the Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment (Render)

DHAROHAR includes a complete `render.yaml` blueprint. Connect your GitHub repository to Render for automatic two-service deployment:
- **Backend**: FastAPI Python Web Service (`rootDir: backend`)
- **Frontend**: Next.js Node Web Service (`rootDir: frontend`)

For detailed step-by-step instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📜 3-Tier Source Verification Architecture

| Tier | Source Category | Examples |
| :--- | :--- | :--- |
| **Tier 1: Official Verified** | Government Portals & Gazettes | ASI, Ministry of Culture, MoFPI, GI Registry, Haryana Tourism |
| **Tier 2: Source Available** | Academic & Cultural Institutions | Sangeet Natak Akademi, UNESCO ICH, ICAR, Universities |
| **Tier 3: Community Audited** | Field Submissions | Village panchayat records, oral lineages awaiting formal gazette |

---

## 👥 Authors & Team
Built with pride for the **Smart India Hackathon (SIH)**.
GitHub: [@kashyaprohit2005](https://github.com/kashyaprohit2005)
