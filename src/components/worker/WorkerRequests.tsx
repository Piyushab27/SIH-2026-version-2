import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Booking } from '../../types';
import { MapPin, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const WorkerRequests: React.FC<{ onAccept: (id: string) => void }> = ({ onAccept }) => {
  const { bookings, activeWorkerId, updateBookingStatus } = useDemo();
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const pendingBookings = bookings.filter(
    (b) => b.status === 'requested' && b.workerId === activeWorkerId
  );

  const emergencyRequests = pendingBookings.filter(b => b.isEmergency);
  const normalRequests = pendingBookings.filter(b => !b.isEmergency);

  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReject = async (id: string) => {
    try {
      setIsUpdating(true);
      await updateBookingStatus(id, 'cancelled');
    } catch (error) {
      alert("Unable to reject booking. Please try again.");
    } finally {
      setIsUpdating(false);
      setRejectingId(null);
    }
  };

  if (pendingBookings.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
        <h4 className="text-sm font-extrabold text-slate-900 mb-1">No New Bookings</h4>
        <p className="text-xs text-slate-500 font-medium">You currently have no new service requests.</p>
      </div>
    );
  }

  const renderCard = (booking: Booking, isEmergency: boolean) => (
    <div key={booking.id} className={`p-5 rounded-3xl border ${isEmergency ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'} shadow-sm relative`}>
      {isEmergency && (
        <div className="absolute -top-3 left-4 bg-rose-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-md">
          <AlertTriangle className="w-3 h-3" />
          Priority Emergency Request
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h4 className={`text-lg font-extrabold ${isEmergency ? 'text-rose-900' : 'text-slate-900'}`}>
            {booking.problemDescription || booking.serviceTitle}
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Customer: <strong className="text-slate-900">{booking.customerName}</strong>
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {booking.customerAddress} (2.4 km away)</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {booking.scheduledDate} • {booking.scheduledTime}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Estimated Earnings</span>
          <span className="text-2xl font-extrabold text-emerald-600">₹{booking.wageBreakdown?.workerEarnings}</span>
        </div>
      </div>

      {rejectingId === booking.id ? (
        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in">
          <h5 className="text-xs font-bold text-slate-900 mb-2">Reject Booking Reason:</h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {['Too far', 'Not available', 'Wrong service', 'Other'].map(r => (
              <button key={r} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition">
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setRejectingId(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
              Cancel
            </button>
            <button onClick={() => handleReject(booking.id)} disabled={isUpdating} className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-50">
              Confirm Reject
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setRejectingId(booking.id)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-sm hover:bg-slate-50 hover:border-slate-300 transition"
          >
            Reject
          </button>
          <button 
            onClick={() => onAccept(booking.id)}
            className={`flex-[2] px-4 py-2.5 rounded-xl font-extrabold text-sm text-white shadow-lg transition ${
              isEmergency ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {isEmergency ? 'ACCEPT EMERGENCY' : 'Accept Booking'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {emergencyRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-rose-700 flex items-center gap-2 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            Emergency Requests
          </h3>
          <div className="space-y-4">
            {emergencyRequests.map(b => renderCard(b, true))}
          </div>
        </div>
      )}

      {normalRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            New Booking Requests
          </h3>
          <div className="space-y-4">
            {normalRequests.map(b => renderCard(b, false))}
          </div>
        </div>
      )}
    </div>
  );
};
