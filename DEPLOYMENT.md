# DHAROHAR — Deployment Guide (GitHub + Render)

This guide walks through deploying **DHAROHAR (Living Interactive Cultural Atlas of India)** to GitHub and Render using the monorepo pattern.

---

## 1. Repository Structure

```
dharohar/
├── backend/                  # FastAPI Python Backend
│   ├── app.py                # Main application entrypoint
│   ├── haryana_geo_data.py   # 47 cultural records across all 23 districts
│   ├── heritage_data.py      # National heritage database
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Sample environment variables
│
├── frontend/                 # Next.js 16 (Turbopack) Frontend
│   ├── app/                  # App Router pages & components
│   ├── lib/api.ts            # Centralized API client
│   ├── public/data/          # GeoJSON boundaries for India & Haryana
│   ├── package.json          # Node dependencies
│   └── .env.example          # Sample environment variables
│
├── render.yaml               # Render Infrastructure-as-Code Blueprint
├── .gitignore                # Production git exclusion rules
├── README.md                 # Project documentation
└── DEPLOYMENT.md             # This deployment manual
```

---

## 2. Deploying on Render (Two Options)

### Option A: 1-Click Blueprint Deployment (Recommended)
1. Push this repository to GitHub: `https://github.com/kashyaprohit2005/dharohar`
2. Log in to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** → **Blueprint**.
4. Connect your GitHub repository `kashyaprohit2005/dharohar`.
5. Render will automatically detect `render.yaml` and configure both services:
   - `dharohar-backend` (Python Web Service)
   - `dharohar-frontend` (Node.js Web Service)
6. Click **Apply**. Both services will build and link their URLs automatically!

---

### Option B: Manual Service Creation

If configuring manually via the Render Dashboard:

#### Service 1: Backend API (FastAPI)
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect `kashyaprohit2005/dharohar`.
3. Configure settings:
   - **Name**: `dharohar-backend`
   - **Region**: Oregon (or nearest)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.9` | Python runtime version |
   | `ENVIRONMENT` | `production` | Production mode flag |
   | `DATABASE_URL` | `sqlite:///./craftproof.db` | Database connection |
   | `SECRET_KEY` | *(Click Generate or paste 32+ random chars)* | JWT encryption key |
   | `FRONTEND_URL` | `https://dharohar-frontend.onrender.com` | URL of deployed frontend (for CORS) |
5. Click **Create Web Service**. Note your backend URL (e.g. `https://dharohar-backend.onrender.com`).

#### Service 2: Frontend App (Next.js)
1. Click **New +** → **Web Service**.
2. Connect `kashyaprohit2005/dharohar`.
3. Configure settings:
   - **Name**: `dharohar-frontend`
   - **Region**: Same region as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_VERSION` | `20.18.0` | Node.js LTS version |
   | `NODE_ENV` | `production` | Node production flag |
   | `NEXT_PUBLIC_API_BASE_URL` | `https://dharohar-backend.onrender.com` | **Your deployed backend URL** |
5. Click **Create Web Service**.

---

## 3. Database & Persistence Note

> [!NOTE]
> The current prototype uses SQLite (`craftproof.db`). On Render's Free tier, the filesystem is ephemeral (it resets on restarts/deploys). The pre-seeded cultural data (47 items across 23 districts) automatically re-seeds upon startup, so the cultural atlas always functions flawlessly.
> 
> For persistent user-created artisan registrations and batches in production, add a free Render PostgreSQL database and set `DATABASE_URL=postgresql://...` in the backend environment variables. The SQLAlchemy ORM models will automatically create the tables on PostgreSQL without code changes.

---

## 4. Local Development

To run locally:
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
venv\Scripts\activate  # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
