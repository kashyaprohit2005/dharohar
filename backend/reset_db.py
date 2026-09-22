"""
CraftProof — Database Reset Script
Run this directly to reset the demo database to canonical state:
  python reset_db.py

Equivalent to calling POST /admin/demo-reset via the API.
Demo credentials: Phone 9876543210 | Pass test123 | PIN 1234
Demo product: CP-BNS-2026-0001 (Banarasi Katan Silk Saree by Ramesh Kumar)
"""

import sys
import os

# Set UTF-8 for Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app import (
    Base,
    engine,
    SessionLocal,
    bootstrap_database,
)


def reset_database():
    print("CraftProof -- Demo Database Reset")
    print("=" * 45)

    print("Step 1: Flushing existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("        [OK] All tables dropped")

    print("Step 2: Re-creating schema...")
    Base.metadata.create_all(bind=engine)
    print("        [OK] Schema created")

    print("Step 3: Seeding demo data (Ramesh Kumar / CP-BNS-2026-0001)...")
    bootstrap_database()
    print("        [OK] Artisan: Ramesh Kumar, Verified, Varanasi")
    print("        [OK] Product: Banarasi Katan Silk Saree -- CP-BNS-2026-0001")
    print("        [OK] Fabric evidence: HANDLOOM_CONSISTENT, periodicity 0.88")
    print("        [OK] QR token + PIN 1234")
    print("        [OK] SHA-256 ledger events (5 events)")
    print("        [OK] Financial profile: 14 verified products, 18 events")
    print("        [OK] Legacy batch: BNS-2026-001 with tokens CP-1-1..CP-1-5")

    print("\n" + "=" * 45)
    print("[SUCCESS] DEMO READY")
    print("  Backend: uvicorn app:app --port 8000 --reload")
    print("  Frontend: cd ../craftproof-web && npm run dev")
    print("  Login: 9876543210 / test123 | PIN: 1234")
    print("  Demo product: CP-BNS-2026-0001")


if __name__ == "__main__":
    reset_database()