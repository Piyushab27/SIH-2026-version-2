import { MOCK_WORKERS } from './src/data/mockWorkers.ts';
import { INITIAL_BOOKINGS } from './src/data/mockBookings.ts';
import fs from 'fs';

let seed = `-- SAHAKAAR COOPERATIVE MARKETPLACE - COMPLETE SEED DATA\n\n`;

// 1. Cooperatives
const cooperatives = new Map();
MOCK_WORKERS.forEach(w => {
  if (w.cooperativeId) {
    cooperatives.set(w.cooperativeId, w.cooperativeName);
  }
});
seed += `-- 1. Cooperatives\nINSERT INTO cooperatives (id, name, federation_name) VALUES\n`;
const coopArr = Array.from(cooperatives.entries()).map(([id, name]) => `('${id}', '${name.replace(/'/g, "''")}', 'Telangana Federation')`);
seed += coopArr.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// 2. Services (Categories)
const services = new Set();
MOCK_WORKERS.forEach(w => services.add(w.categoryLabel));
INITIAL_BOOKINGS.forEach(b => services.add(b.serviceCategory));
seed += `-- 2. Services\nINSERT INTO services (id, category, label) VALUES\n`;
const servArr = Array.from(services).map(s => {
  const cat = typeof s === 'string' ? s.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'unknown';
  return `('${cat}', '${cat}', '${String(s).replace(/'/g, "''")}')`;
});
seed += servArr.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// 3. Customers
const customers = new Map();
INITIAL_BOOKINGS.forEach(b => {
  customers.set('c-1', { // Hardcoded for demo since all are Priya
    id: 'c-1',
    name: b.customerName,
    phone: b.customerPhone,
    address: b.customerAddress,
    lat: b.customerLat,
    lng: b.customerLng
  });
});
seed += `-- 3. Customers\nINSERT INTO customers (id, name, phone, address, lat, lng) VALUES\n`;
const custArr = Array.from(customers.values()).map(c => `('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.phone}', '${c.address.replace(/'/g, "''")}', ${c.lat}, ${c.lng})`);
seed += custArr.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// 4. Workers
seed += `-- 4. Workers\nINSERT INTO workers (id, cooperative_id, name, photo, category, category_label, rating, jobs_completed, experience_years, distance_km, is_available, base_price, verification_status, verification_badge, bio, lat, lng, current_workload) VALUES\n`;
const workerArr = MOCK_WORKERS.map(w => `('${w.id}', '${w.cooperativeId}', '${w.name.replace(/'/g, "''")}', '${w.photo}', '${w.category}', '${w.categoryLabel}', ${w.rating}, ${w.jobsCompleted}, ${w.experienceYears}, ${w.distanceKm}, ${w.isAvailable}, ${w.basePrice}, '${w.verificationStatus}', '${w.verificationBadge}', '${w.bio.replace(/'/g, "''")}', ${w.lat}, ${w.lng}, '${w.currentWorkload}')`);
seed += workerArr.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// Worker Welfare
seed += `-- Worker Welfare\nINSERT INTO welfare (worker_id, status, fund_balance) VALUES\n`;
const welfareArr = MOCK_WORKERS.map(w => `('${w.id}', '${w.welfareStatus || 'pending'}', ${w.welfareFundBalance || 0})`);
seed += welfareArr.join(',\n') + '\nON CONFLICT (worker_id) DO NOTHING;\n\n';

// Worker Insurance
seed += `-- Worker Insurance\nINSERT INTO insurance (worker_id, coverage_details, status) VALUES\n`;
const insArr = MOCK_WORKERS.map(w => `('${w.id}', '${(w.insuranceCoverage || '').replace(/'/g, "''")}', 'active')`);
seed += insArr.join(',\n') + '\nON CONFLICT (worker_id) DO NOTHING;\n\n';

// Worker Skills
seed += `-- 5. Worker Skills\nINSERT INTO worker_skills (worker_id, service_id, skill) VALUES\n`;
let skillArr: string[] = [];
MOCK_WORKERS.forEach(w => {
  w.skills?.forEach(s => {
    skillArr.push(`('${w.id}', '${w.categoryLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}', '${s.replace(/'/g, "''")}')`);
  });
});
seed += skillArr.join(',\n') + '\nON CONFLICT (worker_id, skill) DO NOTHING;\n\n';

// Worker Languages
seed += `-- Worker Languages\nINSERT INTO worker_languages (worker_id, language) VALUES\n`;
let langArr: string[] = [];
MOCK_WORKERS.forEach(w => {
  w.languages?.forEach(l => {
    langArr.push(`('${w.id}', '${l.replace(/'/g, "''")}')`);
  });
});
seed += langArr.join(',\n') + '\nON CONFLICT (worker_id, language) DO NOTHING;\n\n';

// Worker Certifications
seed += `-- Worker Certifications\nINSERT INTO worker_certifications (worker_id, certification) VALUES\n`;
let certArr: string[] = [];
MOCK_WORKERS.forEach(w => {
  w.certifications?.forEach(c => {
    certArr.push(`('${w.id}', '${c.replace(/'/g, "''")}')`);
  });
});
seed += certArr.join(',\n') + '\nON CONFLICT (worker_id, certification) DO NOTHING;\n\n';

// Bookings
seed += `-- 6. Bookings\nINSERT INTO bookings (id, customer_id, worker_id, service_category, service_title, scheduled_date, scheduled_time, problem_description, photo_url, is_emergency, status, estimated_price, wage_total_paid, wage_worker_earnings, wage_cooperative_contribution, wage_welfare_contribution, created_at) VALUES\n`;
const bkArr = INITIAL_BOOKINGS.map(b => `('${b.id}', 'c-1', '${b.workerId}', '${b.serviceCategory}', '${b.serviceTitle.replace(/'/g, "''")}', '${b.scheduledDate}', '${b.scheduledTime}', '${b.problemDescription.replace(/'/g, "''")}', ${b.photoUrl ? `'${b.photoUrl}'` : 'NULL'}, ${b.isEmergency}, '${b.status}', ${b.estimatedPrice}, ${b.wageBreakdown?.totalPaid || b.estimatedPrice}, ${b.wageBreakdown?.workerEarnings || 0}, ${b.wageBreakdown?.cooperativeContribution || 0}, ${b.wageBreakdown?.welfareContribution || 0}, '${b.createdAt}')`);
seed += bkArr.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n\n';

// Complaints (Mocking one for the existing logic)
seed += `-- 7. Complaints\nINSERT INTO complaints (id, booking_id, customer_id, category, description, amount, details, status, created_at) VALUES\n`;
seed += `('DSP-8812', 'BK-2026-8812', 'c-1', 'Overcharging', 'Worker asked for ₹200 extra for unused materials.', 200, 'Attached receipt does not match requested amount.', 'UNDER REVIEW', '2026-09-07T10:00:00Z')\n`;
seed += `ON CONFLICT (id) DO NOTHING;\n\n`;

fs.writeFileSync('seed.sql', seed);
console.log('Seed SQL generated.');
