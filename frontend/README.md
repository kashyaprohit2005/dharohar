# VirasatSetu — Web Platform (Next.js 16 + React 19 + Tailwind CSS 4)

India's Living Heritage Platform connecting heritage to people, places, and proof.

## Key Features
- **Interactive Living Culture Atlas**: Dynamic interactive Leaflet map with 9 cultural domains across pilot states
- **Heritage Around Me (`/around-me`)**: Geodesic discovery with browser geolocation, radius controls, and in-browser audio lore narration
- **Community Heritage Contributions (`/contribute`)**: Public submission workflow with duplicate checking
- **Human-in-the-Loop Verifier Workspace (`/verifier`)**: Governance desk for reviewing artisans and community traditions
- **Artisan Dynamic Passport & Ledgers (`/artisan/*`)**: Live batch creation, QR minting, and provenance chaining
- **Master Workshops (`/workshops`)**: Direct discovery and booking of artisan-led hands-on workshops

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
By default, the frontend connects to `http://localhost:8000`. You can configure it in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```
