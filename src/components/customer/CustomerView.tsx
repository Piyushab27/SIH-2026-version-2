import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Worker } from '../../types';
import { LandingHero } from './LandingHero';
import { ServiceCategories } from './ServiceCategories';
import { MarketplaceSearch } from './MarketplaceSearch';
import { WorkerCard } from './WorkerCard';
import { EmergencyModal } from './EmergencyModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { BookingWizard } from './BookingWizard';
import { BookingTracker } from './BookingTracker';
import { TransparentBillModal } from './TransparentBillModal';
import { PaymentModal } from './PaymentModal';
import { RatingModal } from './RatingModal';
import { CustomerDashboard } from './CustomerDashboard';

export const CustomerView: React.FC = () => {
  const {
    workers,
    selectedCategory,
    searchQuery,
    filterOptions,
    createBooking,
    activeBookingId,
    setActiveBookingId,
    location,
    isEmergencyModalOpen,
    setEmergencyModalOpen,
    isMultiSelectMode,
    selectedCategories
  } = useDemo();

  const [activeCustomerSubTab, setActiveCustomerSubTab] = useState<'browse' | 'tracker' | 'dashboard'>('browse');

  // Modals state
  const [selectedProfileWorker, setSelectedProfileWorker] = useState<Worker | null>(null);
  const [bookingWizardWorker, setBookingWizardWorker] = useState<Worker | null>(null);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState(false);
  const [isBillOpen, setIsBillOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(500);

  // Apply category and filters
  const finalWorkers = workers.filter(w => {
    if (w.distanceKm > filterOptions.maxDistance) return false;
    if (w.rating < filterOptions.minRating) return false;
    
    // Multi-select filtering
    if (isMultiSelectMode) {
      if (selectedCategories.length > 0 && !selectedCategories.includes(w.category)) {
        return false;
      }
    } else {
      // Single-select filtering
      if (w.category !== selectedCategory) return false;
    }
    // apply basic search filter if query exists
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!w.name.toLowerCase().includes(q) && !w.skills.some(s => s.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  const handleStartBooking = (worker: Worker) => {
    setBookingWizardWorker(worker);
    setIsBookingWizardOpen(true);
  };

  const handleBookingConfirmed = (details: any) => {
    setIsBookingWizardOpen(false);
    
    // Instead of AI Matching, directly confirm
    createBooking({
      category: bookingWizardWorker?.category || details.category || 'electrician',
      worker: bookingWizardWorker || details.worker,
      scheduledDate: details.scheduledDate || 'Today',
      scheduledTime: details.scheduledTime || '05:00 PM',
      address: details.address || 'Flat 402, Green Valley Apartments, Banjara Hills',
      problem: details.problem || 'Service request',
    });
    
    setActiveCustomerSubTab('tracker');
  };

  const handleConfirmEmergency = (worker: any) => {
    setEmergencyModalOpen(false);
    createBooking({
      category: worker.category,
      worker,
      scheduledDate: 'Right Now (Emergency)',
      scheduledTime: 'Immediate',
      address: 'Flat 402, Green Valley Apartments, Banjara Hills',
      problem: 'Emergency Issue',
      isEmergency: true,
    });
    setActiveCustomerSubTab('tracker');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Sub-Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12 text-xs font-bold">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
            <button
              onClick={() => setActiveCustomerSubTab('browse')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeCustomerSubTab === 'browse'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Browse Services & Workers
            </button>

            <button
              onClick={() => setActiveCustomerSubTab('tracker')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 whitespace-nowrap ${
                activeCustomerSubTab === 'tracker'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Track Live Booking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveCustomerSubTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeCustomerSubTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Customer Profile & Bookings
            </button>
          </div>
        </div>
      </div>

      {activeCustomerSubTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Landing Hero (Search) */}
          <LandingHero />

          {/* Service Categories Grid */}
          <ServiceCategories />

          {/* Worker Results Header */}
          <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {!(isMultiSelectMode ? selectedCategories.length > 0 : !!selectedCategory) ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <p className="text-slate-500 font-bold">Select a service to view available cooperative workers.</p>
              </div>
            ) : (
              <>
                <MarketplaceSearch />
                
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 uppercase">
                      AVAILABLE {isMultiSelectMode ? 'WORKERS' : selectedCategory?.replace('_', ' ') + 'S'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Verified workers near {location}
                    </p>
                  </div>
                </div>

                {/* Workers Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {finalWorkers.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-slate-500 font-medium">
                      No workers found for this category and filter combination.
                    </div>
                  ) : (
                    finalWorkers.map(w => (
                      <WorkerCard
                        key={w.id}
                        worker={w}
                        isBestMatch={false}
                        onSelectProfile={w => setSelectedProfileWorker(w)}
                        onBookNow={w => handleStartBooking(w)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {activeCustomerSubTab === 'tracker' && (
        <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BookingTracker
            bookingId={activeBookingId || 'BK-2026-9041'}
            onOpenBill={() => setIsBillOpen(true)}
          />
        </div>
      )}

      {activeCustomerSubTab === 'dashboard' && (
        <CustomerDashboard
          onTrackBooking={id => {
            setActiveBookingId(id);
            setActiveCustomerSubTab('tracker');
          }}
          onViewBill={id => {
            setActiveBookingId(id);
            setIsBillOpen(true);
          }}
        />
      )}

      {/* MODAL DIALOGS */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onConfirmEmergency={handleConfirmEmergency}
      />

      <WorkerProfileModal
        worker={selectedProfileWorker}
        onClose={() => setSelectedProfileWorker(null)}
        onBookNow={w => {
          setSelectedProfileWorker(null);
          handleStartBooking(w);
        }}
      />

      <BookingWizard
        isOpen={isBookingWizardOpen}
        preSelectedWorker={bookingWizardWorker}
        onClose={() => setIsBookingWizardOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />



      <TransparentBillModal
        bookingId={activeBookingId || 'BK-2026-9041'}
        isOpen={isBillOpen}
        onClose={() => setIsBillOpen(false)}
        onProceedToPayment={amt => {
          setPaymentAmount(amt);
          setIsBillOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <PaymentModal
        bookingId={activeBookingId || 'BK-2026-9041'}
        amount={paymentAmount}
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={() => {
          setIsPaymentOpen(false);
          setIsRatingOpen(true);
        }}
      />

      <RatingModal
        bookingId={activeBookingId || 'BK-2026-9041'}
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        onSubmitRating={() => {
          setIsRatingOpen(false);
          setActiveCustomerSubTab('dashboard');
        }}
      />

    </div>
  );
};
