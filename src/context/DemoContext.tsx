import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  Role,
  Language,
  ServiceCategory,
  Worker,
  Booking,
  BookingStatus,
  ChatMessage,
  NotificationItem
} from '../types';
import { MOCK_WORKERS } from '../data/mockWorkers';
import { INITIAL_BOOKINGS } from '../data/mockBookings';
import { TRANSLATIONS } from '../data/translations';
import { calculateFairWage } from '../utils/fairWage';
import { getSupabaseWorkers, getSupabaseBookings, getSupabaseComplaints, createSupabaseComplaint, updateSupabaseBookingStatus, createEmergencyRequest, updateComplaintStatus as updateComplaintStatusApi } from '../services/supabaseService';

interface WageConfig {
  workerPct: number;
  coopPct: number;
  welfarePct: number;
}

interface FilterOptions {
  maxDistance: number;
  minRating: number;
}

interface DemoContextType {
  role: Role;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  location: string;
  setLocation: (loc: string) => void;
  workers: Worker[];
  bookings: Booking[];
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;
  activeWorkerId: string;
  setActiveWorkerId: (id: string) => void;
  selectedCategory: ServiceCategory | null;
  setSelectedCategory: (cat: ServiceCategory | null) => void;
  selectedCategories: ServiceCategory[];
  setSelectedCategories: (cats: ServiceCategory[]) => void;
  isMultiSelectMode: boolean;
  setIsMultiSelectMode: (mode: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isEmergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  messages: Record<string, ChatMessage[]>;
  sendMessage: (bookingId: string, text: string, sender: 'customer' | 'worker') => void;
  markMessagesRead: (bookingId: string, userId: string) => void;
  wageConfig: WageConfig;
  setWageConfig: (config: WageConfig) => void;
  // Booking mutations
  createBooking: (details: {
    category: ServiceCategory;
    worker: Worker;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    problem: string;
    photoUrl?: string;
    isEmergency?: boolean;
    estimatedPrice?: number;
  }) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  submitRating: (bookingId: string, rating: number, comment: string, tags: string[]) => void;
  updateWorkerProfile: (workerId: string, updates: Partial<Worker>) => Promise<void>;
  toggleAvailability: (workerId: string) => Promise<void>;
  toggleEmergencyReady: (workerId: string) => Promise<void>;
  approveWorker: (workerId: string) => Promise<void>;
  rejectWorker: (workerId: string) => Promise<void>;
  complaints: any[];
  updateComplaintStatusAction: (complaintId: string, status: string) => Promise<void>;
  // Demo Launcher
  triggerDemoJourney: (role: Role) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'BK-2026-9041': [
    {
      id: 'm-1',
      bookingId: 'BK-2026-9041',
      sender: 'worker',
      senderName: 'Ravi Kumar',
      text: 'Namaste Priya ji! I have accepted your electrical repair booking.',
      timestamp: '04:35 PM',
    },
    {
      id: 'm-2',
      bookingId: 'BK-2026-9041',
      sender: 'customer',
      senderName: 'Priya Sharma',
      text: 'Hello Ravi! Please call me when you reach the main entrance gate of Green Valley Apartments.',
      timestamp: '04:37 PM',
    },
    {
      id: 'm-3',
      bookingId: 'BK-2026-9041',
      sender: 'worker',
      senderName: 'Ravi Kumar',
      text: 'Sure! I am on the way on my electric scooter. ETA around 8 minutes.',
      timestamp: '04:38 PM',
    }
  ]
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Booking Accepted',
    message: 'Ravi Kumar (Verified Member, HLCS) has accepted your Electrician booking.',
    timestamp: '5 min ago',
    type: 'booking',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Worker On The Way',
    message: 'Ravi Kumar is navigating to Flat 402, Banjara Hills. ETA 8 mins.',
    timestamp: '12 min ago',
    type: 'booking',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Fair Wage Deposit',
    message: '₹425 direct wage + ₹25 Welfare Fund updated for Ravi Kumar.',
    timestamp: '1 hour ago',
    type: 'payment',
    read: true,
  }
];

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabaseWorkers = await getSupabaseWorkers();
        const supabaseBookings = await getSupabaseBookings();
        const supabaseComplaints = await getSupabaseComplaints();
        
        if (supabaseWorkers) {
          setWorkers(supabaseWorkers);
        }
        if (supabaseBookings) {
          setBookings(supabaseBookings);
        }
        if (supabaseComplaints) {
          setComplaints(supabaseComplaints);
        }
      } catch (err) {
        console.error("Failed to load Supabase data:", err);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadData();
  }, []);

  const { role: authRole, requireAuth } = useAuth();
  const [demoOverrideRole, setDemoOverrideRole] = useState<Role | null>(null);
  const role: Role = demoOverrideRole || authRole || 'customer';
  
  const [language, setLanguage] = useState<Language>('en');
  const [location, setLocation] = useState<string>('Hyderabad (Banjara Hills)');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>('BK-2026-9041');
  const [activeWorkerId, setActiveWorkerId] = useState<string>('w-1');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    maxDistance: 10,
    minRating: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [wageConfig, setWageConfig] = useState<WageConfig>({
    workerPct: 85,
    coopPct: 10,
    welfarePct: 5,
  });

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const sendMessage = (bookingId: string, text: string, sender: 'customer' | 'worker') => {
    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      bookingId,
      sender,
      senderName: sender === 'customer' ? 'Priya Sharma' : 'Ravi Kumar',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), newMsg],
    }));
  };

  const createBooking = async (details: any): Promise<Booking> => {
    const price = details.estimatedPrice || details.worker?.basePrice || 450;
    const breakdown = calculateFairWage(price, wageConfig.workerPct, wageConfig.coopPct, wageConfig.welfarePct);

    const newBooking = {
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceCategory: details.category,
      serviceTitle: `${details.worker?.categoryLabel || details.category} Service`,
      workerId: details.worker?.id || 'w-1',
      workerName: details.worker?.name || 'Worker',
      workerPhoto: details.worker?.photo,
      workerCooperative: details.worker?.cooperativeName || 'Cooperative',
      workerRating: details.worker?.rating || 0,
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      customerAddress: details.address || 'Flat 402, Green Valley Apartments, Banjara Hills, Hyderabad',
      customerLat: 17.3850,
      customerLng: 78.4867,
      scheduledDate: details.scheduledDate,
      scheduledTime: details.scheduledTime,
      problemDescription: details.problem,
      photoUrl: details.photoUrl,
      isEmergency: details.isEmergency || false,
      status: 'requested' as BookingStatus,
      estimatedPrice: price,
      wageBreakdown: breakdown,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI
    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);

    try {
      const { createSupabaseBooking } = await import('../services/supabaseService');
      await createSupabaseBooking(newBooking);
    } catch (err) {
      console.error("Failed to create booking in Supabase", err);
      // Revert optimistic if necessary
    }

    return newBooking;
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    // Optimistic UI
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const finalPrice = b.finalPrice || b.estimatedPrice;
        const updatedWage = calculateFairWage(finalPrice, wageConfig.workerPct, wageConfig.coopPct, wageConfig.welfarePct);
        return {
          ...b,
          status,
          finalPrice,
          wageBreakdown: updatedWage,
          completedAt: status === 'completed' ? new Date().toISOString() : b.completedAt,
        };
      }
      return b;
    }));

    try {
      const { updateBookingStatus: updateSupabaseStatus } = await import('../services/supabaseService');
      await updateSupabaseStatus(bookingId, status);
    } catch (err) {
      console.error("Failed to update status in Supabase", err);
      throw err; // So UI can catch it
    }
  };

  const submitRating = (bookingId: string, rating: number, comment: string, tags: string[]) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          rating,
          reviewComment: comment,
        };
      }
      return b;
    }));

    // Also push review to worker
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setWorkers(prev => prev.map(w => {
        if (w.id === targetBooking.workerId) {
          const newReview = {
            id: 'r-' + Date.now(),
            customerName: 'Priya Sharma',
            rating,
            date: 'Just now',
            comment,
            tags,
          };
          const totalRatingSum = w.rating * w.reviews.length + rating;
          const newCount = w.reviews.length + 1;
          const newAvg = Number((totalRatingSum / newCount).toFixed(1));
          return {
            ...w,
            rating: newAvg,
            jobsCompleted: w.jobsCompleted + 1,
            reviews: [newReview, ...w.reviews],
          };
        }
        return w;
      }));
    }
  };

  
  const approveWorker = async (workerId: string) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, verificationStatus: 'verified' } : w));
    try {
      const { updateWorkerVerification } = await import('../services/supabaseService');
      await updateWorkerVerification(workerId, 'verified');
    } catch (err) {
      console.error(err);
    }
  };

  
  const rejectWorker = async (workerId: string) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, verificationStatus: 'rejected' } : w));
    try {
      const { updateWorkerVerification } = await import('../services/supabaseService');
      await updateWorkerVerification(workerId, 'rejected');
    } catch (err) {
      console.error(err);
    }
  };

  
  const updateWorkerProfile = async (workerId: string, updates: Partial<Worker>) => {
    // Optimistic UI
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, ...updates } : w));
    
    try {
      const { supabase } = await import('../lib/supabase');
      
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.categoryLabel) payload.category_label = updates.categoryLabel;
      if (updates.basePrice) payload.base_price = updates.basePrice;
      if (updates.bio) payload.bio = updates.bio;

      if (Object.keys(payload).length > 0) {
        const { error } = await supabase.from('workers').update(payload).eq('id', workerId);
        if (error) throw error;
      }
      
      // Handle languages
      if (updates.languages) {
        await supabase.from('worker_languages').delete().eq('worker_id', workerId);
        if (updates.languages.length > 0) {
          await supabase.from('worker_languages').insert(
            updates.languages.map(l => ({ worker_id: workerId, language: l }))
          );
        }
      }
      
    } catch (err) {
      console.error("Failed to update profile", err);
      // Let UI handle failure if needed
    }
  };

  const toggleAvailability = async (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    const newStatus = !worker.isAvailable;
    
    // Optimistic
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, isAvailable: newStatus } : w));
    
    try {
      const { updateWorkerAvailability } = await import('../services/supabaseService');
      await updateWorkerAvailability(workerId, newStatus);
    } catch (err) {
      console.error("Failed to update availability", err);
      // revert
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, isAvailable: !newStatus } : w));
      throw err;
    }
  };

  const toggleEmergencyReady = async (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    const newStatus = !worker.isEmergencyReady;
    
    // Optimistic
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, isEmergencyReady: newStatus } : w));
    
    try {
      const { updateWorkerEmergencyReady } = await import('../services/supabaseService');
      await updateWorkerEmergencyReady(workerId, newStatus);
    } catch (err) {
      console.error("Failed to update emergency readiness", err);
      // revert
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, isEmergencyReady: !newStatus } : w));
      throw err;
    }
  };

  const updateComplaintStatusAction = async (complaintId: string, status: string) => {
    // Optimistic
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status } : c));
    try {
      await updateComplaintStatusApi(complaintId, status);
    } catch (err) {
      console.error("Failed to update complaint status:", err);
      // revert
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'UNDER REVIEW' } : c));
      throw err;
    }
  };

  const markMessagesRead = (bookingId: string, userId: string) => {
    // Mock implementation
  };

  const triggerDemoJourney = (targetRole: Role) => {
    setDemoOverrideRole(targetRole);
    window.scrollTo(0, 0);
  };
  // const oldTriggerDemoJourney = (targetRole: Role) => {
    // console.log(`Demo Journey triggered for ${targetRole} - Action disabled due to Real Auth.`);
  // };

  return (
    <DemoContext.Provider
      value={{
        role,
        language,
        setLanguage,
        t,
        location,
        setLocation,
        workers,
        bookings,
        activeBookingId,
        setActiveBookingId,
        activeWorkerId,
        setActiveWorkerId,
        selectedCategory,
        setSelectedCategory,
        selectedCategories,
        setSelectedCategories,
        isMultiSelectMode,
        setIsMultiSelectMode,
        searchQuery,
        setSearchQuery,
        filterOptions,
        setFilterOptions,
        isLoading,
        setIsLoading,
        isEmergencyModalOpen,
        setEmergencyModalOpen,
        notifications,
        markNotificationRead,
        messages,
        sendMessage,
        markMessagesRead,
        wageConfig,
        setWageConfig,
        createBooking,
        updateBookingStatus,
        submitRating,
        updateWorkerProfile,
        toggleAvailability,
        toggleEmergencyReady,
        approveWorker,
        rejectWorker,
        complaints,
        updateComplaintStatusAction,
        triggerDemoJourney,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
