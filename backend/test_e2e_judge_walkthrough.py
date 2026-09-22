import urllib.request
import json
import sys

BASE = 'http://localhost:8000'

def post_json(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())

def get_json(path):
    with urllib.request.urlopen(BASE + path) as resp:
        return json.loads(resp.read())

def main():
    print('=== DHAROHAR END-TO-END JUDGE JOURNEY VERIFICATION ===')

    # Step 0: Ensure Clean Baseline
    print('\n[Step 0] Initial Clean Reset Check...')
    post_json('/api/admin/clean-reset', {})
    h0 = get_json('/health')
    print(f'  Artisans: {h0["artisans_count"]}, Traditions: {h0["heritage_count"]}, Events: {h0["events_count"]}')
    assert h0['artisans_count'] == 0
    assert h0['heritage_count'] == 40
    assert h0['events_count'] == 9

    # 1. Favorites Toggle
    print('\n[Step 1] Testing Passport Favorites Toggle...')
    fav_res = post_json('/api/favorites/toggle', {'entity_type': 'heritage', 'entity_id': '1', 'user_identifier': 'judge_session_1'})
    print('  Result:', fav_res)
    fav_list = get_json('/api/favorites?user_id=judge_session_1')
    print('  Heritages in Passport:', len(fav_list.get('heritage', [])))
    assert fav_res['is_favorite'] == True

    # 2. Live Artisan Registration
    print('\n[Step 2] Testing Live Artisan Registration (/api/artisan/register)...')
    artisan_payload = {
        'full_name': 'Ustad Rahim Bux',
        'phone': '+91-98290-11223',
        'password': 'SecurePassword123!',
        'region': 'Bagru, Jaipur',
        'craft': 'Bagru Hand Block Printing',
        'district': 'Jaipur',
        'state': 'Rajasthan',
        'locality': 'Chhipa Mohalla',
        'specialization': 'Natural Indigo & Dabu Mud Resist',
        'experience_years': 34,
        'story': '5th-generation master carver and natural vegetable dyer.'
    }
    reg_res = post_json('/api/artisan/register', artisan_payload)
    artisan_id = reg_res['artisan_id']
    craftproof_id = reg_res['craftproof_id']
    print(f'  Artisan Registered ID: {artisan_id}, CraftProof ID: {craftproof_id}')
    assert reg_res['success'] == True

    # 3. Verifier Approval
    print('\n[Step 3] Testing Verifier Portal Review (/api/verifier/artisan/{id}/review)...')
    approve_payload = {
        'status': 'VERIFIED',
        'notes': 'Verified traditional Dabu workshop with GI compliance.',
        'verified_by': 'National Crafts Council Inspector'
    }
    approve_res = post_json(f'/api/verifier/artisan/{artisan_id}/review', approve_payload)
    print(f'  Artisan Status: {approve_res["new_status"]}')
    assert approve_res['new_status'] == 'VERIFIED'

    # 4. Product Creation
    print(f'\n[Step 4] Testing Product Minting for Artisan {artisan_id}...')
    prod_payload = {
        'name': 'Heritage Indigo Dabu Chanderi Dupatta',
        'craft': 'Bagru Hand Block Printing',
        'material': 'Pure Mulberry Silk-Cotton & Natural Indigo',
        'technique': 'Hand Block Dabu Resist Dyeing',
        'description': 'Hand-dyed natural indigo with Kashish mineral border.',
        'production_date': '2026-03-15'
    }
    prod_res = post_json(f'/api/artisan/{artisan_id}/products', prod_payload)
    prod_id = prod_res['id']
    print(f'  Product Created ID: {prod_id}, Product Code: {prod_res["product_id"]}')
    assert prod_res['success'] == True

    # 5. Batch & Cryptographic SHA-256 Provenance Minting
    print(f'\n[Step 5] Testing Batch & SHA-256 Provenance Minting...')
    batch_payload = {
        'product_id': prod_id,
        'total_units': 15,
        'notes': 'Natural indigo vat fermented with organic jaggery; Teakwood blocks carved by guild.'
    }
    batch_res = post_json(f'/api/artisan/{artisan_id}/batches', batch_payload)
    qr_token = batch_res['qr_token']
    genesis_hash = batch_res['genesis_hash']
    print(f'  Batch Minted ID: {batch_res["batch_id"]}, QR Token: {qr_token}')
    print(f'  Genesis Cryptographic SHA-256 Hash: {genesis_hash}')
    assert len(genesis_hash) == 64

    # 6. Public Cryptographic Verification
    print(f'\n[Step 6] Testing Public Verification via QR Token (/api/verify/{qr_token})...')
    verify_res = get_json(f'/api/verify/{qr_token}')
    print(f'  Verified Status: {verify_res.get("verified")}')
    print(f'  Ledger Valid (Cryptographic Chain Match): {verify_res.get("ledger_valid")}')
    print(f'  Verified Artisan: {verify_res.get("artisan", {}).get("full_name")} ({verify_res.get("artisan", {}).get("verification_status")})')
    print(f'  Verified Product: {verify_res.get("product", {}).get("name")}')
    print(f'  Provenance Chain Events: {len(verify_res.get("provenance_chain", []))}')
    assert verify_res.get('verified') == True
    assert verify_res.get('ledger_valid') == True

    # 7. Calendar .ICS Generation
    print('\n[Step 7] Testing Cultural Calendar .ics Generation...')
    with urllib.request.urlopen(f'{BASE}/api/events/1/calendar.ics') as r:
        ics = r.read().decode('utf-8')
        print(f'  .ics Status: {r.status}, Content-Type: {r.headers.get("Content-Type")}')
        assert 'BEGIN:VCALENDAR' in ics
        assert 'BEGIN:VEVENT' in ics

    # 8. Reset to Clean State
    print('\n[Step 8] Resetting DB to Clean Non-Demo State for Judge Walkthrough...')
    reset_res = post_json('/api/admin/clean-reset', {})
    print(f'  Reset Result: {reset_res.get("message")}')
    health = get_json('/health')
    print(f'  Artisans Count: {health.get("artisans_count")}')
    print(f'  Products Count: {health.get("products_count")}')
    print(f'  Batches Count: {health.get("batches_count")}')
    print(f'  Living Heritage Traditions: {health.get("heritage_count")}')
    print(f'  Live Cultural Events: {health.get("events_count")}')
    assert health.get('artisans_count') == 0
    assert health.get('products_count') == 0
    assert health.get('batches_count') == 0
    assert health.get('heritage_count') == 40
    assert health.get('events_count') == 9

    print('\n*** ALL 8 END-TO-END DHAROHAR TEST STAGES PASSED FLAWLESSLY! ***')

if __name__ == '__main__':
    main()
