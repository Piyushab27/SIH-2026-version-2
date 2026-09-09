import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Search, Filter, AlertTriangle, ArrowRight } from 'lucide-react';
import { CoopBookingModal } from './CoopBookingModal';
import { Booking } from '../../types';

export const CoopBookings: React.FC = () => {
  const { bookings, workers } = useDemo();
  const coopName = workers[0]?.cooperativeName || 'Hyderabad Labour Cooperative Society';
  const coopBookings = bookings.filter(b => b.workerCooperative === coopName);

  const [filter, setFilter] = useState<'all' | 'emergency'>('all');
  const [modalBooking, setModalBooking] = useState<Booking | null>(null);
  
  const displayBookings = coopBookings.filter(b => {
    if (filter === 'emergency') return b.isEmergency;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${filter === 'all' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${filter === 'emergency' ? 'bg-rose-500 text-white shadow' : 'text-rose-500'}`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Emergency
          </button>
        </div>
        
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {displayBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">No Bookings Found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {displayBookings.map(booking => (
            <div key={booking.id} className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between ${
              booking.isEmergency ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
            }`}>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {booking.isEmergency && (
                    <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> EMERGENCY
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-500">{booking.id}</span>
                </div>
                <h4 className="font-extrabold text-slate-900">{booking.serviceTitle}</h4>
                <div className="text-xs text-slate-500 mt-1">
                  Customer: <strong className="text-slate-700">{booking.customerName}</strong>
                </div>
                <div className="text-xs text-slate-500">
                  Worker: <strong className="text-slate-700">{booking.workerName}</strong>
                </div>
                <div className="text-xs text-slate-500">
                  Date: <strong className="text-slate-700">{booking.scheduledDate} {booking.scheduledTime}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px] text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                <span className={`inline-block text-xs font-extrabold px-3 py-1 rounded-full uppercase self-end ${
                  booking.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                  booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'requested' ? 'bg-amber-100 text-amber-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {booking.status.replace('_', ' ')}
                </span>
                
                <button onClick={() => setModalBooking(booking)} className="mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1">View Details <ArrowRight className="w-3 h-3" /></button>
              </div>

            </div>
          ))}
        </div>
      )}
      {modalBooking && (
        <CoopBookingModal
          booking={modalBooking}
          isOpen={!!modalBooking}
          onClose={() => setModalBooking(null)}
        />
      )}
    </div>
  );
};
