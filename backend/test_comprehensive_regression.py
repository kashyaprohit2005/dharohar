import urllib.request
import json
import sys

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"

def get_json(path):
    with urllib.request.urlopen(BACKEND_URL + path) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_frontend(path):
    with urllib.request.urlopen(FRONTEND_URL + path) as resp:
        return resp.status, resp.read().decode("utf-8")

def main():
    print("================================================================")
    print("DHAROHAR MASTER REGRESSION & VISUAL ACCEPTANCE VERIFICATION")
    print("================================================================")

    # 1. Health & Database Integrity
    print("\n[Stage 1] Verifying Backend Health & Seeding Counts...")
    health = get_json("/health")
    print(f"  System: {health.get('system')}")
    print(f"  States: {health.get('geo_states_count')} (Expected 36: 28 States + 8 UTs)")
    print(f"  Districts: {health.get('geo_districts_count')} (Expected 23: All Haryana Districts)")
    print(f"  Cultural Items: {health.get('cultural_items_count')} (Expected >= 9)")
    assert health.get("geo_states_count") == 36, "States count must be exactly 36"
    assert health.get("geo_districts_count") == 23, "Districts count must be exactly 23"
    print("  [OK] Stage 1 Passed!")

    # 2. States Registry (Mode A)
    print("\n[Stage 2] Verifying All 36 States & UTs for India Cultural Atlas...")
    states = get_json("/api/geo/states")
    assert len(states) == 36, f"Expected 36 states, got {len(states)}"
    state_codes = {s["code"] for s in states}
    assert "IN-HR" in state_codes, "Haryana must be present"
    assert "IN-RJ" in state_codes, "Rajasthan must be present"
    assert "IN-KL" in state_codes, "Kerala must be present"
    assert "IN-AS" in state_codes, "Assam must be present"
    assert "IN-DL" in state_codes, "Delhi must be present"
    print(f"  [OK] Stage 2 Passed! 36 States/UTs verified.")

    # 3. Haryana Deep Explorer & Hansi (Mode B)
    print("\n[Stage 3] Verifying Haryana 23 Districts Dynamic Registry & Hansi...")
    hr_districts = get_json("/api/geo/states/IN-HR/districts")
    assert len(hr_districts) == 23, f"Expected 23 Haryana districts, got {len(hr_districts)}"
    hansi = next((d for d in hr_districts if d["slug"] == "hr-hansi"), None)
    assert hansi is not None, "Hansi must be present as Haryana's 23rd district"
    print(f"  Hansi Found: {hansi['name']} | HQ: {hansi['headquarters']} | Status: {hansi['odop_status']}")
    assert hansi["odop_status"] == "PENDING_SOURCE", "Hansi ODOP must be honestly marked as PENDING_SOURCE"
    print("  [OK] Stage 3 Passed! 23 Haryana districts verified with Hansi.")

    # 4. District Dossier & Hierarchy (Panipat & Kurukshetra)
    print("\n[Stage 4] Verifying District Dossier & Administrative Hierarchy...")
    panipat = get_json("/api/geo/districts/hr-panipat")
    assert panipat["name"] == "Panipat"
    assert panipat["odop"]["product"] == "Carrot-based products", "Panipat official ODOP is carrot-based agro-products"
    assert panipat["odop"]["status"] == "VERIFIED"
    assert len(panipat["localities"]) >= 4, "Panipat must have tehsils/blocks"
    assert len(panipat["locations"]) >= 3, "Panipat must have physical sites"
    print(f"  Panipat ODOP: {panipat['odop']['product']} (Status: {panipat['odop']['status']})")
    print(f"  Panipat Tehsils/Blocks: {len(panipat['localities'])} | Physical Sites: {len(panipat['locations'])}")
    print("  [OK] Stage 4 Passed! Panipat dossier & administrative hierarchy verified.")

    # 5. Cultural Items & Multi-Source Evidence Audit
    print("\n[Stage 5] Verifying Cultural Items & 3-Tier Multi-Source Evidence...")
    durrie = get_json("/api/geo/items/panipat-handloom-durrie")
    assert durrie["title"] == "Panipat Handloom & Punja Durrie Weaving"
    assert durrie["verification_tier"] == "OFFICIAL_VERIFIED"
    assert len(durrie["sources"]) >= 2, "Must contain multiple authoritative sources"
    print(f"  Item: {durrie['title']}")
    print(f"  Verification Tier: {durrie['verification_tier']}")
    print(f"  Audio Narration Type: {durrie['audio_type']}")
    for s in durrie["sources"]:
        print(f"    - Source: {s['name']} | Tier: {s['tier']} | Pub: {s['publisher']}")
    print("  [OK] Stage 5 Passed! Evidence citations and audio transparency verified.")

    # 6. Multi-Chapter Cultural Story Mode
    print("\n[Stage 6] Verifying Multi-Chapter Living Cultural Story...")
    story = get_json("/api/geo/items/panipat-handloom-durrie/story")
    assert story["title"] is not None
    assert len(story["chapters"]) >= 3, "Story must contain multi-chapter narrative"
    print(f"  Story Title: {story['title']}")
    print(f"  Subtitle: {story['subtitle']}")
    print(f"  Chapters Count: {len(story['chapters'])}")
    print("  [OK] Stage 6 Passed! Immersive living story verified.")

    # 7. Global Search (Grouped Auto-Complete)
    print("\n[Stage 7] Verifying Global Search across Places, Crafts, Food...")
    search_hansi = get_json("/api/geo/search?q=Hansi")
    assert len(search_hansi["places"]) >= 1, "Hansi district must be found in places"
    search_durrie = get_json("/api/geo/search?q=Durrie")
    assert len(search_durrie["crafts"]) >= 1, "Durrie craft must be found in crafts"
    print(f"  Search 'Hansi': {len(search_hansi['places'])} place(s) returned")
    print(f"  Search 'Durrie': {len(search_durrie['crafts'])} craft(s) returned")
    print("  [OK] Stage 7 Passed! Grouped search verified.")

    # 8. Frontend Route Availability & Zero Breakage
    print("\n[Stage 8] Verifying Frontend Flagship Homepage & Existing Routes...")
    routes_to_test = [
        ("/", "Flagship Living Cultural Map"),
        ("/map", "Heritage Atlas"),
        ("/around-me", "Around Me GPS Proximity"),
        ("/artisan/register", "Artisan Onboarding"),
        ("/artisan/login", "Artisan Login"),
        ("/verifier", "Verifier Portal"),
        ("/verify", "QR & Provenance Verification"),
        ("/workshops", "Workshops"),
        ("/contribute", "Community Contribution"),
    ]

    for path, name in routes_to_test:
        status, html = get_frontend(path)
        assert status == 200, f"Route {path} failed with status {status}"
        assert len(html) > 500, f"Route {path} returned empty HTML"
        print(f"  [OK] {path} ({name}): HTTP {status} OK (Size: {len(html)} bytes)")

    print("\n================================================================")
    print("ALL 8 MASTER REGRESSION & VISUAL ACCEPTANCE STAGES PASSED!")
    print("================================================================")

if __name__ == "__main__":
    main()
