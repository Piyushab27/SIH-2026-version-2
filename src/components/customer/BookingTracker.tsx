import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { BookingStatus } from '../../types';
import { InteractiveMap } from '../common/InteractiveMap';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { ChatDrawer } from './ChatDrawer';
import {
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  FileText,
  AlertCircle
} from 'lucide-react';

interface BookingTrackerProps {
  bookingId: string;
  onOpenBill: () => void;
}

export const BookingTracker: React.FC<BookingTrackerProps> = ({
  bookingId,
  onOpenBill,
}) => {
  const { bookings, updateBookingStatus } = useDemo();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  if (!booking) return null;

  const statuses: { id: BookingStatus; label: string }[] = [
    { id: 'requested', label: 'Requested' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'on_the_way', label: 'On The Way' },
    { id: 'arrived', label: 'Arrived' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  const currentStatusIdx = statuses.findIndex(s => s.id === booking.status);

  // Status step advancer simulation for demo
  const handleAdvanceStatus = () => {
    if (currentStatusIdx < statuses.length - 1) {
      const nextStatus = statuses[currentStatusIdx + 1].id;
      updateBookingStatus(booking.id, nextStatus);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
              LIVE BOOKING TRACKER
            </span>
            <span className="text-xs font-bold text-slate-400">ID: {booking.id}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            {booking.serviceTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'completed' ? (
            <button
              onClick={onOpenBill}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>VIEW BILL & PAY</span>
            </button>
          ) : (
            <button
              onClick={handleAdvanceStatus}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
              >
              <span>Next Step</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Status Timeline Progress */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {statuses.map((st, idx) => {
            const isCompletedStep = idx <= currentStatusIdx;
            const isCurrentStep = idx === currentStatusIdx;

            return (
              <div key={st.id} className="flex-1 flex flex-col items-center relative">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-3.5 right-1/2 left-0 -translate-y-1/2 h-1 transition-all ${
                      idx <= currentStatusIdx ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    isCompletedStep
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompletedStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <span
                  className={`text-[11px] mt-2 font-bold whitespace-nowrap ${
                    isCurrentStep
                      ? 'text-emerald-700 font-extrabold'
                      : isCompletedStep
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map View */}
      <div>
        <InteractiveMap
          customerLocationName="Banjara Hills, Hyderabad"
          workerName={booking.workerName}
          workerPhoto={booking.workerPhoto}
          workerCategory={booking.serviceCategory}
          distanceKm={booking.status === 'on_the_way' ? 1.2 : booking.status === 'arrived' || booking.status === 'in_progress' || booking.status === 'completed' ? 0 : 2.5}
          etaMinutes={booking.status === 'on_the_way' ? 8 : booking.status === 'arrived' || booking.status === 'in_progress' || booking.status === 'completed' ? 0 : 15}
          statusText={`Status: ${booking.status.replace('_', ' ').toUpperCase()}`}
          heightClass="h-72"
          customerLatLng={[17.4156, 78.4396]}
          workers={[
            {
              id: booking.workerId || 'w-1',
              name: booking.workerName,
              photo: booking.workerPhoto,
              category: booking.serviceCategory || 'Worker',
              latLng: [
                17.4156 + (booking.status === 'requested' || booking.status === 'accepted' ? 0.015 : booking.status === 'on_the_way' ? 0.005 : 0),
                78.4396 + (booking.status === 'requested' || booking.status === 'accepted' ? 0.015 : booking.status === 'on_the_way' ? 0.005 : 0)
              ],
              isMain: true
            },
            {
              id: 'w-context',
              name: 'Vikram Singh',
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
              category: 'Plumber',
              latLng: [17.4156 - 0.012, 78.4396 + 0.021],
              isMain: false
            }
          ]}
        />
      </div>

      {/* Assigned Worker Contact Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={booking.workerPhoto}
            alt={booking.workerName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-white">{booking.workerName}</h4>
              <span className="text-emerald-400 font-bold text-xs">⭐ {booking.workerRating}</span>
            </div>
            <div className="mt-1">
              <VerifiedBadge cooperativeName={booking.workerCooperative} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="tel:+919876543210"
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Worker</span>
          </a>

          <button
            onClick={() => setIsChatOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Drawer Side Panel */}
      <ChatDrawer
        bookingId={booking.id}
        workerName={booking.workerName}
        workerPhoto={booking.workerPhoto}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

    </div>
  );
};
