-- SAHAKAAR COOPERATIVE MARKETPLACE - FINAL SEED DATA

-- 1. Cooperatives
INSERT INTO cooperatives (id, name, federation_name) VALUES
('HLCS-2021-089', 'Hyderabad Labour Cooperative Society', 'Telangana Federation'),
('TSWF-2022-114', 'Telangana Skilled Workers Federation', 'Telangana Federation'),
('HLCS-2023-042', 'Hyderabad Labour Cooperative Society', 'Telangana Federation'),
('GHPC-2020-019', 'Greater Hyderabad Plumbing Cooperative', 'Telangana Federation'),
('WLCF-2019-302', 'Women Labour Cooperative Federation', 'Telangana Federation'),
('TSWF-2018-055', 'Telangana Skilled Workers Federation', 'Telangana Federation'),
('AWC-2021-034', 'Artisans & Woodworkers Cooperative', 'Telangana Federation'),
('WLCF-2017-011', 'Women Labour Cooperative Federation', 'Telangana Federation'),
('TSWF-2022-088', 'Telangana Skilled Workers Federation', 'Telangana Federation'),
('HLCS-2021-144', 'Hyderabad Labour Cooperative Society', 'Telangana Federation'),
('EGWC-2023-012', 'Eco-Green Worker Cooperative', 'Telangana Federation'),
('TDTC-2019-078', 'Telangana Drivers & Transport Cooperative', 'Telangana Federation')
ON CONFLICT (id) DO NOTHING;

-- 2. Services
INSERT INTO services (id, category, label) VALUES
('electrician', 'electrician', 'Electrician'),
('plumber', 'plumber', 'Plumber'),
('cleaner___helper', 'cleaner___helper', 'Cleaner & Helper'),
('ac_technician', 'ac_technician', 'AC Technician'),
('carpenter', 'carpenter', 'Carpenter'),
('caregiver', 'caregiver', 'Caregiver'),
('painter', 'painter', 'Painter'),
('appliance_repair', 'appliance_repair', 'Appliance Repair'),
('gardener', 'gardener', 'Gardener'),
('driver', 'driver', 'Driver'),
('electrician', 'electrician', 'electrician'),
('plumber', 'plumber', 'plumber')
ON CONFLICT (id) DO NOTHING;

-- 3. Customers
INSERT INTO customers (id, name, phone, address, lat, lng) VALUES
('c-1', 'Priya Sharma', '+91 98765 43210', 'Flat 402, Green Valley Apartments, Road No. 12, Banjara Hills, Hyderabad', 17.385, 78.4867)
ON CONFLICT (id) DO NOTHING;

-- 4. Workers
INSERT INTO workers (id, cooperative_id, name, photo, category, category_label, rating, jobs_completed, experience_years, distance_km, is_available, is_emergency_ready, base_price, verification_status, verification_badge, bio, lat, lng, current_workload) VALUES
('w-1', 'HLCS-2021-089', 'Ravi Kumar', 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80', 'electrician', 'Electrician', 4.9, 128, 8, 2.1, true, true, 350, 'verified', 'Verified Cooperative Member', 'Punctual, certified electrician with 8+ years experience serving residential and commercial properties in Hyderabad. Dedicated member of Hyderabad Labour Cooperative.', 17.385, 78.4867, 'low'),
('w-2', 'TSWF-2022-114', 'Suresh Kumar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 'electrician', 'Electrician', 4.8, 94, 6, 3.4, true, true, 350, 'verified', 'Verified Cooperative Member', 'Specialist in apartment lighting setups and emergency power restoration.', 17.392, 78.491, 'low'),
('w-3', 'HLCS-2023-042', 'Anil Reddy', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', 'electrician', 'Electrician', 4.7, 76, 5, 4.1, false, false, 300, 'verified', 'Verified Cooperative Member', 'Experienced worker specializing in household appliances and geyser wiring.', 17.378, 78.475, 'medium'),
('w-4', 'GHPC-2020-019', 'Vikram Singh', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', 'plumber', 'Plumber', 4.8, 142, 9, 2.5, true, true, 350, 'verified', 'Verified Cooperative Member', 'Master plumber with 9+ years experience resolving complex leaks and drainage problems.', 17.389, 78.482, 'low'),
('w-5', 'WLCF-2019-302', 'Sunita Devi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 'cleaner', 'Cleaner & Helper', 4.9, 210, 7, 1.8, true, false, 400, 'verified', 'Verified Cooperative Member', 'Dedicated deep cleaning specialist. Passionate cooperative worker delivering squeaky clean homes.', 17.386, 78.489, 'low'),
('w-6', 'TSWF-2018-055', 'Rajesh Sharma', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', 'ac_technician', 'AC Technician', 4.9, 185, 10, 3.1, true, true, 450, 'verified', 'Verified Cooperative Member', '10 years experience in HVAC servicing. Solves cooling issues, gas leaks, and seasonal maintenance.', 17.394, 78.481, 'low'),
('w-7', 'AWC-2021-034', 'Mohammad Arshad', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80', 'carpenter', 'Carpenter', 4.7, 110, 8, 2.8, true, false, 400, 'verified', 'Verified Cooperative Member', 'Custom woodworking, door latch fixes, and modular furniture assembly.', 17.382, 78.495, 'medium'),
('w-8', 'WLCF-2017-011', 'Lakshmi Prasad', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80', 'caregiver', 'Caregiver', 5, 160, 11, 1.2, true, false, 500, 'verified', 'Verified Cooperative Member', 'Compassionate caregiver with 11 years of experience assisting seniors and post-op patients.', 17.387, 78.484, 'low'),
('w-9', 'TSWF-2022-088', 'Ramesh Verma', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80', 'painter', 'Painter', 4.6, 85, 6, 3.6, true, false, 400, 'verified', 'Verified Cooperative Member', 'Clean, mess-free wall painting and damp proofing services.', 17.375, 78.49, 'low'),
('w-10', 'HLCS-2021-144', 'Venkatesh Rao', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80', 'appliance_repair', 'Appliance Repair', 4.8, 118, 7, 2.2, true, true, 350, 'verified', 'Verified Cooperative Member', 'Quick diagnostic and repair service for washing machines, fridges, and water purifiers.', 17.384, 78.488, 'low'),
('w-11', 'EGWC-2023-012', 'Priya Nambiar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 'gardener', 'Gardener', 4.9, 64, 5, 4.5, true, false, false, 300, 'verified', 'Verified Cooperative Member', 'Terrace garden expert, lawn setup, and organic plant nutrition specialist.', 17.399, 78.47, 'low'),
('w-12', 'TDTC-2019-078', 'K. Srinivas', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80', 'driver', 'Driver', 4.8, 240, 9, 1.9, true, false, 400, 'verified', 'Verified Cooperative Member', 'Professional, punctual driver with pristine driving record across South India.', 17.3865, 78.4872, 'low')
ON CONFLICT (id) DO NOTHING;

-- 5. Worker Skills
INSERT INTO worker_skills (worker_id, service_id, skill) VALUES
('w-1', 'electrician', 'Residential Wiring'),
('w-1', 'electrician', 'Fan Installation'),
('w-1', 'electrician', 'Switchboard Repair'),
('w-1', 'electrician', 'Motor & Inverter Repair'),
('w-1', 'electrician', 'Circuit Breaker Fixes'),
('w-1', 'electrician', 'Solar Panel Hookup')
ON CONFLICT (worker_id, skill) DO NOTHING;

-- 6. Worker Languages
INSERT INTO worker_languages (worker_id, language) VALUES
('w-1', 'Telugu'),
('w-1', 'Hindi'),
('w-1', 'English'),
('w-2', 'Telugu'),
('w-2', 'Hindi'),
('w-2', 'English'),
('w-3', 'Telugu'),
('w-3', 'Hindi'),
('w-3', 'English'),
('w-4', 'Telugu'),
('w-4', 'Hindi'),
('w-4', 'English'),
('w-5', 'Telugu'),
('w-5', 'Hindi'),
('w-5', 'English'),
('w-6', 'Telugu'),
('w-6', 'Hindi'),
('w-6', 'English'),
('w-7', 'Telugu'),
('w-7', 'Hindi'),
('w-7', 'English'),
('w-8', 'Telugu'),
('w-8', 'Hindi'),
('w-8', 'English'),
('w-9', 'Telugu'),
('w-9', 'Hindi'),
('w-9', 'English'),
('w-10', 'Telugu'),
('w-10', 'Hindi'),
('w-10', 'English'),
('w-11', 'Telugu'),
('w-11', 'Hindi'),
('w-11', 'English'),
('w-12', 'Telugu'),
('w-12', 'Hindi'),
('w-12', 'English')
ON CONFLICT (worker_id, language) DO NOTHING;

-- 7. Worker Certifications
INSERT INTO worker_certifications (worker_id, certification) VALUES
('w-1', 'National Trade Certificate (NTC) — Electrical'),
('w-1', 'State Cooperative Skill Verification Badge'),
('w-1', 'Safety & High-Voltage Handling Standard'),
('w-2', 'ITI Electrical Diploma'),
('w-2', 'Cooperative Safety Certificate'),
('w-3', 'Vocational Training - Plumbing'),
('w-4', 'Certified Master Plumber'),
('w-4', 'Cooperative Hydro-Tech Safety'),
('w-5', 'Cooperative Home Care Specialist'),
('w-5', 'Hygiene & Eco-Products Training'),
('w-6', 'HVAC Certified Technician'),
('w-6', 'Refrigerant Handling Standard'),
('w-7', 'Craftsmanship & Woodworking Certificate'),
('w-8', 'Certified Nursing Assistant (CNA)'),
('w-8', 'CPR & First Aid Specialist'),
('w-9', 'Cooperative Surface Care & Safety'),
('w-10', 'Certified Home Appliance Specialist'),
('w-11', 'Horticulture Basic Certification'),
('w-12', 'Commercial Driving License (Heavy/Light)'),
('w-12', 'Defensive Driving Badge')
ON CONFLICT (worker_id, certification) DO NOTHING;

-- 8. Worker Welfare
INSERT INTO welfare (worker_id, status, fund_balance) VALUES
('w-1', 'active', 18450),
('w-2', 'active', 12300),
('w-3', 'active', 9800),
('w-4', 'active', 21500),
('w-5', 'active', 24800),
('w-6', 'active', 31000),
('w-7', 'active', 16200),
('w-8', 'active', 29400),
('w-9', 'active', 11000),
('w-10', 'active', 17500),
('w-11', 'active', 8400),
('w-12', 'active', 26000)
ON CONFLICT (worker_id) DO NOTHING;

-- 9. Worker Insurance
INSERT INTO insurance (worker_id, coverage_details, status) VALUES
('w-1', '₹5,00,000 Group Accident & Health Cover', 'active'),
('w-2', '₹5,00,000 Group Health Cover', 'active'),
('w-3', '₹3,00,000 Basic Cover', 'active'),
('w-4', '₹5,00,000 Group Accident & Health Cover', 'active'),
('w-5', '₹5,00,000 Comprehensive Family Health Cover', 'active'),
('w-6', '₹5,00,000 Full Cover', 'active'),
('w-7', '₹3,00,000 Standard Cover', 'active'),
('w-8', '₹5,00,000 Health Cover', 'active'),
('w-9', '₹3,00,000 Standard Cover', 'active'),
('w-10', '₹5,00,000 Full Cover', 'active'),
('w-11', '₹3,00,000 Standard Cover', 'active'),
('w-12', '₹5,00,000 Commercial Driver Health & Life Cover', 'active')
ON CONFLICT (worker_id) DO NOTHING;

-- 10. Bookings
INSERT INTO bookings (id, customer_id, worker_id, service_id, service_category, service_title, scheduled_date, scheduled_time, problem_description, photo_url, address, lat, lng, is_emergency, status, estimated_price, wage_total_paid, wage_worker_earnings, wage_cooperative_contribution, wage_welfare_contribution, created_at) VALUES
('BK-2026-9041', 'c-1', 'w-1', 'electrician', 'electrician', 'Main Switchboard Repair & Fan Wiring', 'Today', '05:00 PM', 'Main circuit breaker keeps tripping when AC and ceiling fan are turned on together.', NULL, 'Flat 402, Green Valley Apartments, Road No. 12, Banjara Hills, Hyderabad', 17.385, 78.4867, false, 'accepted', 500, 500, 425, 50, 25, '2026-09-06T16:00:00Z'),
('BK-2026-8812', 'c-1', 'w-4', 'plumber', 'plumber', 'Bathroom Tap Leakage Repair', 'Yesterday', '11:00 AM', 'Kitchen sink tap leaking heavily underneath.', NULL, 'Flat 402, Green Valley Apartments, Road No. 12, Banjara Hills, Hyderabad', 17.385, 78.4867, false, 'completed', 450, 450, 383, 45, 22, '2026-09-05T10:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- 11. Booking Status History
INSERT INTO booking_status_history (booking_id, status, changed_at, notes) VALUES
('BK-2026-9041', 'accepted', '2026-09-06T16:00:00Z', 'Initial seeded status'),
('BK-2026-8812', 'completed', '2026-09-05T10:30:00Z', 'Initial seeded status');

-- 12. Invoices
INSERT INTO invoices (id, booking_id, customer_id, worker_id, service_fee, total, worker_share, cooperative_share, welfare_share, status) VALUES
('INV-BK-2026-9041', 'BK-2026-9041', 'c-1', 'w-1', 500, 500, 425, 50, 25, 'pending'),
('INV-BK-2026-8812', 'BK-2026-8812', 'c-1', 'w-4', 450, 450, 383, 45, 22, 'paid')
ON CONFLICT (id) DO NOTHING;

-- 13. Payments
INSERT INTO payments (id, invoice_id, amount, payment_method, status) VALUES
('PAY-BK-2026-8812', 'INV-BK-2026-8812', 450, 'UPI', 'completed')
ON CONFLICT (id) DO NOTHING;

-- 14. Complaints
INSERT INTO complaints (id, booking_id, customer_id, worker_id, category, description, amount, details, status, created_at) VALUES
('DSP-8812', 'BK-2026-8812', 'c-1', 'w-4', 'Overcharging', 'Worker asked for ₹200 extra for unused materials.', 200, 'Attached receipt does not match requested amount.', 'UNDER REVIEW', '2026-09-07T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

