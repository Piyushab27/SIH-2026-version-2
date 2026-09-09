-- SAHAKAAR COOPERATIVE MARKETPLACE - FINAL SUPABASE SCHEMA

-- 1. Profiles (Prepared for future Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('customer', 'worker', 'admin', 'cooperative_admin', 'federation_admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Cooperatives
CREATE TABLE cooperatives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    federation_name TEXT
);

-- 3. Services
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    label TEXT NOT NULL
);

-- 4. Customers
CREATE TABLE customers (
    id TEXT PRIMARY KEY, 
    profile_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Workers
CREATE TABLE workers (
    id TEXT PRIMARY KEY, 
    profile_id UUID REFERENCES profiles(id),
    cooperative_id TEXT REFERENCES cooperatives(id),
    name TEXT NOT NULL,
    photo TEXT,
    category TEXT NOT NULL,
    category_label TEXT,
    rating NUMERIC DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    experience_years INTEGER DEFAULT 0,
    distance_km NUMERIC,
    is_available BOOLEAN DEFAULT true,
    base_price NUMERIC,
    verification_status TEXT DEFAULT 'pending',
    verification_badge TEXT,
    bio TEXT,
    lat NUMERIC,
    lng NUMERIC,
    current_workload TEXT DEFAULT 'low',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Worker Skills & Certifications
CREATE TABLE worker_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(id),
    skill TEXT NOT NULL,
    UNIQUE(worker_id, skill)
);

CREATE TABLE worker_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    certification TEXT NOT NULL,
    UNIQUE(worker_id, certification)
);

CREATE TABLE worker_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    UNIQUE(worker_id, language)
);

CREATE TABLE worker_reviews (
    id TEXT PRIMARY KEY,
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    customer_id TEXT REFERENCES customers(id),
    rating NUMERIC,
    date TEXT,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Worker Welfare & Insurance
CREATE TABLE welfare (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    fund_balance NUMERIC DEFAULT 0,
    UNIQUE(worker_id)
);

CREATE TABLE insurance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id TEXT REFERENCES workers(id) ON DELETE CASCADE,
    coverage_details TEXT,
    status TEXT DEFAULT 'active',
    UNIQUE(worker_id)
);

-- 8. Bookings
CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id),
    worker_id TEXT REFERENCES workers(id),
    service_category TEXT,
    service_title TEXT,
    scheduled_date TEXT,
    scheduled_time TEXT,
    problem_description TEXT,
    photo_url TEXT,
    is_emergency BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'requested',
    estimated_price NUMERIC,
    final_price NUMERIC,
    wage_total_paid NUMERIC,
    wage_worker_earnings NUMERIC,
    wage_cooperative_contribution NUMERIC,
    wage_welfare_contribution NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    rating NUMERIC,
    review_comment TEXT
);

CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    notes TEXT
);

-- 9. Emergency Requests
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT REFERENCES customers(id),
    lat NUMERIC,
    lng NUMERIC,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE emergency_request_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emergency_request_id UUID REFERENCES emergency_requests(id) ON DELETE CASCADE,
    service_id TEXT REFERENCES services(id),
    UNIQUE(emergency_request_id, service_id)
);

-- 10. Invoices & Payments
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES bookings(id),
    customer_id TEXT REFERENCES customers(id),
    worker_id TEXT REFERENCES workers(id),
    service_fee NUMERIC,
    materials_fee NUMERIC DEFAULT 0,
    travel_fee NUMERIC DEFAULT 0,
    total NUMERIC,
    worker_share NUMERIC,
    cooperative_share NUMERIC,
    welfare_share NUMERIC,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. Complaints & Evidence
CREATE TABLE complaints (
    id TEXT PRIMARY KEY,
    booking_id TEXT REFERENCES bookings(id),
    customer_id TEXT REFERENCES customers(id),
    worker_id TEXT REFERENCES workers(id),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC,
    details TEXT,
    status TEXT DEFAULT 'UNDER REVIEW' CHECK (status IN ('UNDER REVIEW', 'RESOLVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE complaint_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id TEXT REFERENCES complaints(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX idx_workers_category ON workers(category);
CREATE INDEX idx_workers_available ON workers(is_available);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_worker ON bookings(worker_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_emergency_requests_status ON emergency_requests(status);

-- =========================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- NOTE: Authentication is NOT implemented yet. 
-- These policies represent the intended security model once 
-- Supabase Auth is integrated. For now, we leave RLS disabled 
-- (or enabled with development bypass) to allow DemoContext to function.
-- =========================================================

-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Future Auth Policies:
-- CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Customers view own data" ON customers FOR SELECT USING (auth.uid() = profile_id);
-- CREATE POLICY "Workers view own data" ON workers FOR SELECT USING (auth.uid() = profile_id);
-- CREATE POLICY "Participants view bookings" ON bookings FOR SELECT USING (
--     auth.uid() IN (SELECT profile_id FROM customers WHERE id = bookings.customer_id) OR 
--     auth.uid() IN (SELECT profile_id FROM workers WHERE id = bookings.worker_id)
-- );
