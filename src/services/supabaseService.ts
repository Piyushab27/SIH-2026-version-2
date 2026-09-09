import { supabase } from '../lib/supabase';
import { Worker, Booking, ServiceCategory, FairWageBreakdown } from '../types';

export const getSupabaseWorkers = async (): Promise<Worker[]> => {
  const { data: workersData, error } = await supabase
    .from('workers')
    .select(`
      *,
      cooperatives ( name ),
      worker_skills ( skill ),
      worker_languages ( language ),
      worker_certifications ( certification ),
      welfare ( status, fund_balance ),
      insurance ( coverage_details, status )
    `);

  if (error) {
    console.error('Error fetching workers:', error);
    return [];
  }

  return workersData.map((w: any) => ({
    id: w.id,
    name: w.name,
    photo: w.photo,
    category: w.category as ServiceCategory,
    categoryLabel: w.category_label,
    rating: Number(w.rating),
    jobsCompleted: w.jobs_completed,
    experienceYears: w.experience_years,
    distanceKm: Number(w.distance_km),
    isAvailable: w.is_available,
    isEmergencyReady: w.is_emergency_ready,
    basePrice: Number(w.base_price),
    cooperativeName: w.cooperatives?.name || 'Unknown Cooperative',
    cooperativeId: w.cooperative_id,
    verificationStatus: w.verification_status,
    verificationBadge: w.verification_badge,
    skills: w.worker_skills?.map((s: any) => s.skill) || [],
    languages: w.worker_languages?.map((l: any) => l.language) || [],
    certifications: w.worker_certifications?.map((c: any) => c.certification) || [],
    bio: w.bio,
    lat: Number(w.lat),
    lng: Number(w.lng),
    currentWorkload: w.current_workload,
    reviews: [], // Would fetch from worker_reviews if needed
    welfareStatus: w.welfare?.[0]?.status || 'pending',
    welfareFundBalance: Number(w.welfare?.[0]?.fund_balance || 0),
    insuranceCoverage: w.insurance?.[0]?.coverage_details || '',
  }));
};

export const getSupabaseBookings = async (customerId?: string): Promise<Booking[]> => {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      workers ( name, photo, cooperatives ( name ), rating ),
      customers ( name, phone, address, lat, lng )
    `);
    
  if (customerId) {
    query = query.eq('customer_id', customerId);
  }

  const { data: bookingsData, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return bookingsData.map((b: any) => {
    const total = Number(b.wage_total_paid);
    const wageBreakdown: FairWageBreakdown = {
      totalPaid: total,
      workerEarnings: Number(b.wage_worker_earnings),
      cooperativeContribution: Number(b.wage_cooperative_contribution),
      welfareContribution: Number(b.wage_welfare_contribution),
      workerPercentage: 85,
      cooperativePercentage: 10,
      welfarePercentage: 5,
    };

    return {
      id: b.id,
      serviceCategory: b.service_category as ServiceCategory,
      serviceTitle: b.service_title,
      workerId: b.worker_id,
      workerName: b.workers?.name,
      workerPhoto: b.workers?.photo,
      workerCooperative: b.workers?.cooperatives?.name || 'Cooperative',
      workerRating: Number(b.workers?.rating || 0),
      customerName: b.customers?.name,
      customerPhone: b.customers?.phone,
      customerAddress: b.address || b.customers?.address,
      customerLat: Number(b.lat || b.customers?.lat),
      customerLng: Number(b.lng || b.customers?.lng),
      scheduledDate: b.scheduled_date,
      scheduledTime: b.scheduled_time,
      problemDescription: b.problem_description,
      photoUrl: b.photo_url,
      isEmergency: b.is_emergency,
      status: b.status,
      estimatedPrice: Number(b.estimated_price),
      finalPrice: b.final_price ? Number(b.final_price) : undefined,
      wageBreakdown,
      createdAt: b.created_at,
      completedAt: b.completed_at,
      rating: b.rating ? Number(b.rating) : undefined,
      reviewComment: b.review_comment
    };
  });
};

export const createEmergencyRequest = async (customerId: string, services: string[]) => {
  const { data: req, error: reqErr } = await supabase
    .from('emergency_requests')
    .insert([{ customer_id: customerId, status: 'active' }])
    .select()
    .single();

  if (reqErr) throw reqErr;

  const requestServices = services.map(s => ({
    emergency_request_id: req.id,
    service_id: s
  }));

  const { error: srvErr } = await supabase
    .from('emergency_request_services')
    .insert(requestServices);

  if (srvErr) throw srvErr;
  return req;
};

export const createSupabaseComplaint = async (
  bookingId: string, 
  customerId: string, 
  workerId: string, 
  category: string, 
  description: string,
  amount: number
) => {
  const { data, error } = await supabase
    .from('complaints')
    .insert([{
      id: `DSP-${Math.floor(Math.random() * 10000)}`,
      booking_id: bookingId,
      customer_id: customerId,
      worker_id: workerId,
      category,
      description,
      amount,
      status: 'UNDER REVIEW'
    }]);

  if (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
  return data;
};

export const updateSupabaseBookingStatus = async (bookingId: string, newStatus: string) => {
  await updateBookingStatus(bookingId, newStatus);
};
/*
  const { error } = await supabase
    .from('bookings')
    .update({ status: newStatus })
    .eq('id', bookingId);

  if (error) throw error;
};
*/

export const getSupabaseServices = async () => {
  const { data, error } = await supabase.from('services').select('*');
  if (error) throw error;
  return data;
};

export const getSupabaseInvoice = async (bookingId: string) => {
  const { data, error } = await supabase.from('invoices').select('*').eq('booking_id', bookingId).single();
  if (error && error.code !== 'PGRST116') console.error(error);
  return data;
};

export const getWorkerProfile = async (workerId: string) => {
  const { data, error } = await supabase
    .from('workers')
    .select(`
      *,
      cooperatives ( name ),
      worker_skills ( skill ),
      worker_languages ( language ),
      worker_certifications ( certification, issue_date, expiry_date ),
      welfare ( status, fund_balance, last_contribution_date ),
      insurance ( coverage_details, status, policy_number )
    `)
    .eq('id', workerId)
    .single();
  if (error) throw error;
  return data;
};

export const getWorkerBookings = async (workerId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      workers ( name, photo, cooperatives ( name ), rating ),
      customers ( name, phone, address, lat, lng )
    `)
    .eq('worker_id', workerId);
  if (error) throw error;
  
  return data.map((b: any) => ({
    id: b.id,
    serviceCategory: b.service_category as ServiceCategory,
    serviceTitle: b.service_title,
    workerId: b.worker_id,
    workerName: b.workers?.name,
    workerPhoto: b.workers?.photo,
    workerCooperative: b.workers?.cooperatives?.name || 'Cooperative',
    workerRating: Number(b.workers?.rating || 0),
    customerName: b.customers?.name,
    customerPhone: b.customers?.phone,
    customerAddress: b.address || b.customers?.address,
    customerLat: Number(b.lat || b.customers?.lat),
    customerLng: Number(b.lng || b.customers?.lng),
    scheduledDate: b.scheduled_date,
    scheduledTime: b.scheduled_time,
    problemDescription: b.problem_description,
    photoUrl: b.photo_url,
    isEmergency: b.is_emergency,
    status: b.status,
    estimatedPrice: Number(b.estimated_price),
    finalPrice: b.final_price ? Number(b.final_price) : undefined,
    wageBreakdown: {
      totalPaid: Number(b.wage_total_paid),
      workerEarnings: Number(b.wage_worker_earnings),
      cooperativeContribution: Number(b.wage_cooperative_contribution),
      welfareContribution: Number(b.wage_welfare_contribution),
      workerPercentage: 85,
      cooperativePercentage: 10,
      welfarePercentage: 5,
    },
    createdAt: b.created_at,
    completedAt: b.completed_at,
    rating: b.rating ? Number(b.rating) : undefined,
    reviewComment: b.review_comment
  }));
};

export const getWorkerEmergencyRequests = async (workerId: string) => {
  // Mock logic to simulate assigned requests for this worker based on skills/availability
  const { data, error } = await supabase
    .from('emergency_requests')
    .select(`
      *,
      customers ( name, phone, address, lat, lng )
    `)
    .eq('status', 'active');
  if (error) throw error;
  return data; // Further filtering can be applied in the UI
};

export const updateWorkerAvailability = async (workerId: string, isAvailable: boolean) => {
  const { error } = await supabase.from('workers').update({ is_available: isAvailable }).eq('id', workerId);
  if (error) throw error;
};

export const updateWorkerEmergencyReady = async (workerId: string, isReady: boolean) => {
  const { error } = await supabase.from('workers').update({ is_emergency_ready: isReady }).eq('id', workerId);
  if (error) throw error;
};

export const acceptBooking = async (bookingId: string) => {
  return updateBookingStatus(bookingId, 'accepted');
};

export const updateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
  if (error) throw error;
  
  // Create history entry
  const { error: histErr } = await supabase.from('booking_status_history').insert([{
    booking_id: bookingId,
    status: status,
    notes: notes || null
  }]);
  if (histErr) throw histErr;
};

export const getWorkerEarnings = async (workerId: string) => {
  const { data, error } = await supabase.from('invoices').select('*').eq('worker_id', workerId);
  if (error) throw error;
  return data;
};

export const getWorkerWelfare = async (workerId: string) => {
  const { data, error } = await supabase.from('welfare').select('*').eq('worker_id', workerId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getWorkerInsurance = async (workerId: string) => {
  const { data, error } = await supabase.from('insurance').select('*').eq('worker_id', workerId).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getWorkerCertifications = async (workerId: string) => {
  const { data, error } = await supabase.from('worker_certifications').select('*').eq('worker_id', workerId);
  if (error) throw error;
  return data;
};

export const createSupabaseBooking = async (booking: any) => {
  const { data, error } = await supabase.from('bookings').insert([{
    id: booking.id,
    customer_id: 'c-1',
    worker_id: booking.workerId,
    service_category: booking.serviceCategory,
    service_title: booking.serviceTitle,
    address: booking.customerAddress,
    lat: booking.customerLat,
    lng: booking.customerLng,
    scheduled_date: booking.scheduledDate,
    scheduled_time: booking.scheduledTime,
    problem_description: booking.problemDescription,
    photo_url: booking.photoUrl,
    is_emergency: booking.isEmergency,
    status: 'requested',
    estimated_price: booking.estimatedPrice,
    wage_total_paid: booking.estimatedPrice,
    wage_worker_earnings: booking.wageBreakdown.workerEarnings,
    wage_cooperative_contribution: booking.wageBreakdown.cooperativeContribution,
    wage_welfare_contribution: booking.wageBreakdown.welfareContribution,
    created_at: new Date().toISOString()
  }]).select().single();
  
  if (error) throw error;
  
  await supabase.from('booking_status_history').insert([{
    booking_id: booking.id,
    status: 'requested'
  }]);

  return data;
};

export const getCooperative = async (coopId: string) => {
  const { data, error } = await supabase.from('cooperatives').select('*').eq('id', coopId).single();
  if (error) throw error;
  return data;
};

export const getCooperativeWorkers = async (coopId: string) => {
  const { data, error } = await supabase.from('workers').select('*, worker_skills(skill), worker_certifications(certification), welfare(status, fund_balance), insurance(status, coverage_details)').eq('cooperative_id', coopId);
  if (error) throw error;
  return data;
};

export const getCooperativeBookings = async (coopId: string) => {
  const { data, error } = await supabase.from('bookings').select('*, workers!inner(cooperative_id)').eq('workers.cooperative_id', coopId);
  if (error) throw error;
  return data;
};

export const getWorkerDetails = async (workerId: string) => {
  return getWorkerProfile(workerId);
};

export const updateWorkerVerification = async (workerId: string, status: string) => {
  const { error } = await supabase.from('workers').update({ verification_status: status }).eq('id', workerId);
  if (error) throw error;
};

export const getBookingDetails = async (bookingId: string) => {
  const { data, error } = await supabase.from('bookings').select('*, workers(name, rating, category, cooperatives(name)), customers(name, phone, address, lat, lng)').eq('id', bookingId).single();
  if (error) throw error;
  return data;
};

export const getBookingStatusHistory = async (bookingId: string) => {
  const { data, error } = await supabase.from('booking_status_history').select('*').eq('booking_id', bookingId).order('changed_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getCooperativeComplaints = async (coopId: string) => {
  const { data, error } = await supabase.from('complaints').select('*, workers!inner(cooperative_id, name), customers(name)').eq('workers.cooperative_id', coopId);
  if (error) throw error;
  return data;
};

export const getComplaintDetails = async (complaintId: string) => {
  const { data, error } = await supabase.from('complaints').select('*, workers(name, cooperatives(name)), customers(name)').eq('id', complaintId).single();
  if (error) throw error;
  return data;
};

export const updateComplaintStatus = async (complaintId: string, status: string) => {
  const { error } = await supabase.from('complaints').update({ status }).eq('id', complaintId);
  if (error) throw error;
};

export const getSupabaseComplaints = async () => {
  const { data, error } = await supabase
    .from('complaints')
    .select('*, workers(name, cooperative_id, cooperatives(name)), customers(name)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
  return (data || []).map((c: any) => ({
    id: c.id,
    bookingId: c.booking_id,
    customerId: c.customer_id,
    customerName: c.customers?.name || 'Unknown',
    workerId: c.worker_id,
    workerName: c.workers?.name || 'Unknown',
    workerCooperativeId: c.workers?.cooperative_id,
    workerCooperative: c.workers?.cooperatives?.name || 'Unknown',
    category: c.category,
    description: c.description,
    amount: Number(c.amount || 0),
    details: c.details,
    status: c.status,
    createdAt: c.created_at,
    resolvedAt: c.resolved_at,
  }));
};

export const getCooperativeDemandAnalytics = async (coopId: string) => {
  // Aggregate from bookings
  const { data, error } = await supabase.from('bookings').select('service_category, is_emergency, status, workers!inner(cooperative_id)').eq('workers.cooperative_id', coopId);
  if (error) throw error;
  return data;
};
