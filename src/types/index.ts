export type Role = 'customer' | 'worker' | 'admin' | 'cooperative_admin' | 'federation_admin' | 'super_admin';

export type Language = 'en' | 'te' | 'hi';

export type ServiceCategory = 
  | 'electrician'
  | 'plumber'
  | 'carpenter'
  | 'painter'
  | 'cleaner'
  | 'caregiver'
  | 'driver'
  | 'ac_technician'
  | 'gardener'
  | 'appliance_repair';

export interface Worker {
  id: string;
  name: string;
  photo: string;
  category: ServiceCategory;
  categoryLabel: string;
  rating: number;
  jobsCompleted: number;
  experienceYears: number;
  distanceKm: number;
  isAvailable: boolean;
  isEmergencyReady: boolean;
  basePrice: number;
  cooperativeName: string;
  cooperativeId: string;
  verificationStatus: 'verified' | 'under_review' | 'pending' | 'rejected';
  verificationBadge: string;
  skills: string[];
  languages: string[];
  certifications: string[];
  bio: string;
  lat: number;
  lng: number;
  currentWorkload: 'low' | 'medium' | 'high';
  reviews: Review[];
  welfareStatus: 'active' | 'pending';
  welfareFundBalance: number;
  insuranceCoverage: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  tags?: string[];
}

export interface AIScoreResult {
  totalScore: number; // 0 - 100
  breakdown: {
    skillMatch: number;
    distance: number;
    availability: number;
    rating: number;
    experience: number;
    workload: number;
  };
  reasons: string[];
}

export interface WorkerWithScore extends Worker {
  aiMatch: AIScoreResult;
}

export type BookingStatus = 
  | 'requested'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface FairWageBreakdown {
  totalPaid: number;
  workerEarnings: number; // 85%
  cooperativeContribution: number; // 10%
  welfareContribution: number; // 5%
  workerPercentage: number;
  cooperativePercentage: number;
  welfarePercentage: number;
}

export interface Booking {
  id: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  workerCooperative: string;
  workerRating: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLat: number;
  customerLng: number;
  scheduledDate: string;
  scheduledTime: string;
  problemDescription: string;
  photoUrl?: string;
  isEmergency: boolean;
  status: BookingStatus;
  estimatedPrice: number;
  finalPrice?: number;
  wageBreakdown?: FairWageBreakdown;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  reviewComment?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  sender: 'customer' | 'worker';
  senderName: string;
  text: string;
  timestamp: string;
  isLocation?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'booking' | 'payment' | 'system' | 'verification';
  read: boolean;
}
