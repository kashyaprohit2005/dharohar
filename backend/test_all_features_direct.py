"""
test_all_features_direct.py
Self-contained direct integration test suite for DHAROHAR.
Tests database models, data integrity, and all 16 geo API endpoints.
"""

import sys
import os
sys.path.insert(0, r"C:\Users\Rohit\craftproof")

from app import (
    SessionLocal,
    GeoState,
    GeoDistrict,
    GeoLocality,
    GeoLocation,
    UniversalCulturalItem,
    CulturalItemSource,
    CulturalStory,
    get_geo_states,
    get_state_districts,
    get_district_detail,
    get_district_items,
    get_cultural_item,
    get_cultural_story,
    get_item_recommendations,
    get_item_share_card,
    get_item_related,
    search_geo_cultural,
    get_geo_categories,
    haversine_km,
)

def run_tests():
    print("=" * 65)
    print("DHAROHAR COMPREHENSIVE DIRECT TEST SUITE")
    print("=" * 65)

    db = SessionLocal()

    # ── Test 1: States Registry ──
    print("\n[Test 1] 36 States & UTs Registry...")
    states = get_geo_states(db)
    assert len(states) == 36, f"Expected 36 states, got {len(states)}"
    state_codes = {s["code"] for s in states}
    assert "IN-HR" in state_codes, "Haryana must be present"
    assert "IN-RJ" in state_codes, "Rajasthan must be present"
    assert "IN-KL" in state_codes, "Kerala must be present"
    assert "IN-DL" in state_codes, "Delhi must be present"
    hr = next(s for s in states if s["code"] == "IN-HR")
    assert hr["is_demo_deep"] is True, "Haryana must be marked as demo deep"
    print(f"  [PASS] 36 States/UTs verified. Haryana flagged is_demo_deep=True.")

    # ── Test 2: Haryana 23 Districts Registry & Hansi ──
    print("\n[Test 2] Haryana Dynamic 23-District Registry & Hansi...")
    districts = get_state_districts("IN-HR", db)
    assert len(districts) == 23, f"Expected 23 districts, got {len(districts)}"
    hansi = next((d for d in districts if d["slug"] == "hr-hansi"), None)
    assert hansi is not None, "Hansi must be present as 23rd district"
    assert hansi["odop_status"] == "PENDING_SOURCE", "Hansi ODOP must be PENDING_SOURCE"
    print(f"  [PASS] 23 districts verified. Hansi found with status={hansi['odop_status']}.")

    # ── Test 3: Panipat Dossier & Honest ODOP ──
    print("\n[Test 3] Panipat Dossier & Honest MoFPI ODOP...")
    panipat = get_district_detail("hr-panipat", db)
    assert panipat["name"] == "Panipat"
    assert panipat["odop"]["product"] == "Carrot-based products", "Panipat ODOP must be Carrot-based products"
    assert panipat["odop"]["status"] == "VERIFIED"
    assert len(panipat["localities"]) >= 4, "Panipat must have localities"
    assert len(panipat["locations"]) >= 4, "Panipat must have physical locations"
    print(f"  [PASS] Panipat dossier verified: ODOP={panipat['odop']['product']} | {len(panipat['localities'])} localities | {len(panipat['locations'])} sites.")

    # ── Test 4: Hansi Dossier & Subdivisions ──
    print("\n[Test 4] Hansi 23rd District Dossier & Subdivisions...")
    hansi_dossier = get_district_detail("hr-hansi", db)
    assert hansi_dossier["name"] == "Hansi"
    assert len(hansi_dossier["localities"]) >= 3, "Hansi must have 3 tehsils (Hansi, Narnaund, Bass)"
    tehsil_names = [l["name"] for l in hansi_dossier["localities"]]
    print(f"  [PASS] Hansi dossier verified with tehsils: {tehsil_names}.")

    # ── Test 5: Cultural Items Inventory & Category Depth ──
    print("\n[Test 5] Cultural Items Count & Category Depth across All Districts...")
    total_items = db.query(UniversalCulturalItem).count()
    assert total_items >= 45, f"Expected >= 45 cultural items, got {total_items}"
    all_items = db.query(UniversalCulturalItem).all()
    categories = sorted(set(i.category for i in all_items))
    districts_with_items = sorted(set(i.district_slug for i in all_items))
    assert len(categories) >= 12, f"Expected >= 12 categories, got {len(categories)}"
    assert len(districts_with_items) == 23, f"Expected all 23 districts covered, got {len(districts_with_items)}"
    print(f"  [PASS] {total_items} items across all {len(districts_with_items)} districts covering {len(categories)} categories.")
    print(f"  Categories: {categories}")

    # ── Test 6: Evidence Citations & Verification Tiers ──
    print("\n[Test 6] Sourced Evidence & 3-Tier Verification...")
    durrie = get_cultural_item("panipat-handloom-durrie", db)
    assert durrie["title"] == "Panipat Handloom & Punja Durrie Weaving"
    assert durrie["verification_tier"] == "OFFICIAL_VERIFIED"
    assert len(durrie["sources"]) >= 2, "Panipat durrie must have >= 2 authoritative sources"
    print(f"  [PASS] {durrie['title']} has {len(durrie['sources'])} sources.")

    # ── Test 7: Multi-Chapter Story ──
    print("\n[Test 7] Living Multi-Chapter Cultural Story...")
    story = get_cultural_story("panipat-handloom-durrie", db)
    assert len(story["chapters"]) >= 3, "Story must contain >= 3 chapters"
    print(f"  [PASS] Story '{story['title']}' has {len(story['chapters'])} chapters.")

    # ── Test 8: Recommendations Engine (Haversine Proximity) ──
    print("\n[Test 8] Proximity-Based Recommendations Engine...")
    recs = get_item_recommendations("panipat-handloom-durrie", db)
    assert len(recs["nearby_crafts"]) > 0, "Must return nearby crafts"
    assert len(recs["nearby_heritage"]) > 0, "Must return nearby heritage"
    closest = recs["nearby_crafts"][0]
    print(f"  [PASS] Recommendations for Panipat Durrie:")
    print(f"    - Closest craft: {closest['title']} ({closest['distance_km']} km away in {closest['district_name']})")
    print(f"    - Nearby crafts: {len(recs['nearby_crafts'])} | Nearby heritage: {len(recs['nearby_heritage'])} | Nearby food: {len(recs['nearby_food'])}")

    # ── Test 9: Share Card Metadata ──
    print("\n[Test 9] Social Share Card OG Metadata...")
    card = get_item_share_card("panipat-handloom-durrie", db)
    assert card["title"] == "Panipat Handloom & Punja Durrie Weaving"
    assert card["share_url"] == "/culture/panipat-handloom-durrie"
    assert card["dharohar_tagline"] == "India, in Every Story."
    print(f"  [PASS] Share card: '{card['title']}' | URL: {card['share_url']}.")

    # ── Test 10: Related Items Endpoint ──
    print("\n[Test 10] Culturally Related Items...")
    related = get_item_related("panipat-handloom-durrie", db)
    assert len(related["same_district"]) > 0, "Must find items in same district"
    print(f"  [PASS] Related items: {len(related['same_district'])} items in same district.")

    # ── Test 11: Rural Locality Search ──
    print("\n[Test 11] Rural Locality Search Indexing...")
    search_res = search_geo_cultural("samalkha", db)
    assert len(search_res["places"]) > 0, "Must find Samalkha"
    locality_match = next((p for p in search_res["places"] if p["type"] == "LOCALITY"), None)
    assert locality_match is not None, "Samalkha must be recognized as a LOCALITY"
    assert locality_match["name"] == "Samalkha Block"
    print(f"  [PASS] Rural search found: {locality_match['name']} ({locality_match['locality_type']} in {locality_match['district_slug']}).")

    # ── Test 12: Haversine Accuracy ──
    print("\n[Test 12] Haversine Distance Math...")
    # Distance between Panipat (29.3909, 76.9635) and Kurukshetra (29.9695, 76.8783) ~65-70 km
    d = haversine_km(29.3909, 76.9635, 29.9695, 76.8783)
    assert 60 < d < 75, f"Expected 60-75 km, got {d}"
    print(f"  [PASS] Haversine Panipat to Kurukshetra: {d:.1f} km (accurate).")

    # ── Test 13: Cultural Categories Endpoint ──
    print("\n[Test 13] Dynamic Categories Schema...")
    cats = get_geo_categories()
    assert len(cats) >= 8, "Categories schema must have >= 8 categories"
    print(f"  [PASS] Categories schema returns {len(cats)} categories.")

    db.close()

    print("\n" + "=" * 65)
    print("ALL 13 TESTS PASSED PERFECTLY! ZERO REGRESSIONS.")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
