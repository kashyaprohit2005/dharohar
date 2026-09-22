import requests

BASE = 'http://localhost:8000'

print('--- 1. CLEAN STATE CHECK ---')
h = requests.get(f'{BASE}/health').json()
print('Health:', h)
assert h['mode'] == 'PURE_DYNAMIC_NO_DEMO_DATA'

print('\n--- 2. ARTISAN REGISTRATION ---')
reg_payload = {
    'full_name': 'Ustad Mohammed Kabir',
    'phone': '9876543210',
    'password': 'secret_password_123',
    'region': 'Madanpura, Varanasi, UP',
    'craft': 'Banarasi Brocade Weaving',
    'specialization': 'Kadhua Gold Brocading',
    'experience_years': 28,
    'skills': 'Jacquard loom, pure zari selection, floral jaal drafting',
    'story': 'Fourth generation master-weaver family preserving pure mulberry silk brocade techniques.'
}
r_reg = requests.post(f'{BASE}/api/artisan/register', json=reg_payload).json()
print('Register result:', r_reg)
assert r_reg['success'] is True
artisan_id = r_reg['artisan_id']
vs_id = r_reg['craftproof_id']

print('\n--- 3. ARTISAN LOGIN ---')
r_login = requests.post(f'{BASE}/api/artisan/login', json={'phone': '9876543210', 'password': 'secret_password_123'}).json()
print('Login result:', r_login)
assert r_login['success'] is True
assert r_login['verification_status'] == 'PENDING'

print('\n--- 4. VERIFIER HUMAN-IN-THE-LOOP APPROVAL ---')
r_review = requests.post(f'{BASE}/api/verifier/artisan/{artisan_id}/review', json={
    'status': 'VERIFIED',
    'notes': 'Physical inspection of loom in Madanpura cluster conducted. Silk source verified.',
    'verified_by': 'UP State Handloom Inspector'
}).json()
print('Review result:', r_review)
assert r_review['new_status'] == 'VERIFIED'

print('\n--- 5. PRODUCT CREATION ---')
prod_payload = {
    'name': 'Shikargah Kadhua Pure Silk Saree',
    'craft': 'Banarasi Brocade Weaving',
    'material': 'Certified Katan Mulberry Silk & Silver-Gilt Zari',
    'technique': 'Kadhua Handloom Interlock Weave',
    'description': 'Royal hunting scene motif woven over 3 months with 4800 hand-punched jacquard cards.',
    'production_date': '2026-09-20'
}
r_prod = requests.post(f'{BASE}/api/artisan/{artisan_id}/products', json=prod_payload).json()
print('Product result:', r_prod)
assert r_prod['success'] is True
prod_id = r_prod['id']

print('\n--- 6. BATCH MINTING & GENESIS PROVENANCE ---')
batch_payload = {
    'product_id': prod_id,
    'total_units': 1,
    'notes': 'Heirloom bridal commission.'
}
r_batch = requests.post(f'{BASE}/api/artisan/{artisan_id}/batches', json=batch_payload).json()
print('Batch result:', r_batch)
assert r_batch['success'] is True
batch_id = r_batch['batch_id']
qr_token = r_batch['qr_token']

print('\n--- 7. APPEND PROVENANCE EVENT ---')
event_payload = {
    'event_type': 'QUALITY_INSPECTED',
    'actor': 'Varanasi Master Weavers Guild',
    'detail': 'Microscopic thread count: 120 ends/inch warp, 80 picks/inch weft confirmed pure silk.'
}
r_ev = requests.post(f'{BASE}/api/batches/{batch_id}/provenance', json=event_payload).json()
print('Append provenance result:', r_ev)
assert r_ev['success'] is True

print('\n--- 8. VERIFY TAMPER-EVIDENT LEDGER ---')
r_ledger = requests.get(f'{BASE}/api/batches/{batch_id}/verify-ledger').json()
print('Ledger integrity result:', r_ledger)
assert r_ledger['valid'] is True
assert r_ledger['chain_length'] == 2

print('\n--- 9. PUBLIC QR VERIFICATION ---')
r_verify = requests.get(f'{BASE}/api/verify/{qr_token}').json()
print('Public verification:', r_verify['product']['name'], '| Artisan:', r_verify['artisan']['full_name'], '| Ledger valid:', r_verify['ledger_valid'])
assert r_verify['ledger_valid'] is True

print('\n--- 10. HOST WORKSHOP ---')
ws_payload = {
    'title': 'Masterclass in Kadhua Brocade Loom Setup',
    'description': 'Hands-on three day intensive training on traditional pit-loom card setup and gold zari shuttle handling.',
    'craft': 'Banarasi Brocade Weaving',
    'workshop_type': 'HANDS_ON',
    'location': 'Madanpura Weaving Atelier, Varanasi',
    'state': 'Uttar Pradesh',
    'max_participants': 6,
    'preferred_dates': 'First weekend of every month'
}
r_ws = requests.post(f'{BASE}/api/artisan/{artisan_id}/workshops', json=ws_payload).json()
print('Workshop creation result:', r_ws)
assert r_ws['success'] is True
ws_id = r_ws['id']

print('\n--- 11. PUBLIC WORKSHOP REQUEST ---')
req_payload = {
    'requester_name': 'Meera Subramanian',
    'requester_phone': '9845012345',
    'requester_email': 'meera@craftstudies.in',
    'workshop_type': 'HANDS_ON',
    'preferred_date': '2026-10-05',
    'participants': 2,
    'message': 'Textile design researchers from NID seeking immersion in authentic Kadhua technique.'
}
r_req = requests.post(f'{BASE}/api/workshops/{ws_id}/request', json=req_payload).json()
print('Workshop request result:', r_req)
assert r_req['success'] is True
request_id = r_req['request_id']

print('\n--- 12. ARTISAN ACCEPTS WORKSHOP REQUEST ---')
r_accept = requests.put(f'{BASE}/api/artisan/{artisan_id}/workshop-requests/{request_id}', json={
    'status': 'ACCEPTED',
    'artisan_response': 'Delighted to host NID researchers. Atelier looms will be reserved.'
}).json()
print('Workshop accept result:', r_accept)
assert r_accept['new_status'] == 'ACCEPTED'

print('\n--- 13. LOG ORDER & PAYMENT ---')
order_payload = {
    'product_id': prod_id,
    'buyer_name': 'National Museum Gallery Shop',
    'buyer_organization': 'Ministry of Culture',
    'quantity': 1,
    'total_amount': 85000.0,
    'order_date': '2026-09-20'
}
r_order = requests.post(f'{BASE}/api/artisan/{artisan_id}/orders', json=order_payload).json()
print('Order result:', r_order)
assert r_order['success'] is True

print('\n--- 14. PRESERVE ORAL KNOWLEDGE ---')
know_payload = {
    'craft': 'Banarasi Brocade Weaving',
    'technique': 'Kadhua Needle-Pick Shuttle Control',
    'story': 'In pure Kadhua weaving, each floral booti is woven individually with extra weft spools so no floating threads exist on the reverse side.'
}
r_know = requests.post(f'{BASE}/api/artisan/{artisan_id}/knowledge', json=know_payload).json()
print('Knowledge result:', r_know)
assert r_know['success'] is True

print('\n--- 15. INSTITUTION UNDERWRITING REPORT ---')
rpt_payload = {
    'institution_name': 'SIDBI Artisan Enterprise Desk',
    'purpose': 'Working capital loan underwriting for new loom expansion',
    'shared_sections': ['IDENTITY', 'PRODUCTION', 'ORDERS', 'PAYMENTS', 'LEDGER']
}
r_rpt = requests.post(f'{BASE}/api/artisan/{artisan_id}/institution-report', json=rpt_payload).json()
print('Report generated:', r_rpt['report_id'])
assert r_rpt['success'] is True

r_rpt_view = requests.get(f"{BASE}/api/institution/report/{r_rpt['report_id']}").json()
print('Report view metrics:', r_rpt_view['verified_metrics'])
assert r_rpt_view['verified_metrics']['orders_count'] == 1
assert r_rpt_view['verified_metrics']['total_sales'] == 85000.0

print('\n🎉 ALL 15 CRITICAL E2E WORKFLOWS VERIFIED WITH 100% LIVE DB DATA!')

