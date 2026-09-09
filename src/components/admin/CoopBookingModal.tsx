import React from 'react';
import { Booking } from '../../types';
import { X, MapPin, Clock, CreditCard, ShieldCheck } from 'lucide-react';

export const CoopBookingModal: React.FC<{
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}> = ({ booking, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            Booking Details
            <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">{booking.id}</span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{booking.serviceTitle}</h2>
              <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider \${
                booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                booking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
            {booking.isEmergency && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Emergency Dispatch
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Info</h4>
              <p className="font-bold text-slate-900">{booking.customerName}</p>
              <p className="text-sm text-slate-600 mt-1">{booking.customerPhone}</p>
              <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {booking.customerAddress}
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Worker Assigned</h4>
              <div className="flex items-center gap-3">
                <img src={booking.workerPhoto} alt={booking.workerName} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-slate-900">{booking.workerName}</p>
                  <p className="text-[10px] font-bold text-emerald-600">{booking.workerCooperative}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Schedule & Timing</h4>
            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-700">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {booking.scheduledDate}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {booking.scheduledTime}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Payment & Invoice</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-bold">₹{booking.wageBreakdown?.totalPaid || booking.estimatedPrice}</span>
              </div>
              <hr className="border-slate-200" />
              <div className="flex justify-between text-slate-600">
                <span>Worker Earnings (85%)</span>
                <span>₹{booking.wageBreakdown?.workerEarnings}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Co-op Contribution (10%)</span>
                <span>₹{booking.wageBreakdown?.cooperativeContribution}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Welfare Fund (5%)</span>
                <span>₹{booking.wageBreakdown?.welfareContribution}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
