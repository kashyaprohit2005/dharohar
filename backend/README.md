# VirasatSetu — Backend Engine (FastAPI + SQLite + Geodesic Discovery)

India's Living Heritage Platform connecting heritage to people, places, and proof.

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite with SQLAlchemy ORM
- **Geodesic Engine**: Haversine distance discovery (`/api/heritage/nearby`)
- **Living Heritage Registry**: Pure zero-demo-data architecture with 29 real sourced pilot traditions (`heritage_data.py`)

## Quick Start

### 1. Create & Activate Virtual Environment
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Backend Daemon
```bash
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

## Key Endpoints
- `GET /api/heritage` — Filter living traditions by state, domain, and preservation status
- `GET /api/heritage/nearby` — Geodesic discovery with auto-expansion in rural zones
- `GET /api/heritage/geocode` — Curated rural village coordinate resolution
- `POST /api/community/contribute` — Public heritage contribution submission
- `POST /api/verifier/contributions/{id}/review` — Human-in-the-loop review & instant publishing to Atlas
- `POST /api/artisan/register` & `POST /api/artisan/login` — Practitioner onboarding
- `POST /api/admin/clean-reset` — Database reset to clean zero-demo state
