import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Worker, ServiceCategory } from '../../types';
import { FairWageCard } from '../common/FairWageCard';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Camera,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

interface BookingWizardProps {
  isOpen: boolean;
  preSelectedWorker?: Worker | null;
  onClose: () => void;
  onBookingConfirmed: (bookingDetails: any) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  preSelectedWorker,
  onClose,
  onBookingConfirmed,
}) => {
  const { selectedCategory, location, workers } = useDemo();

  const [step, setStep] = useState<number>(1);
  const [assignMode, setAssignMode] = useState<'specific' | 'auto'>(preSelectedWorker ? 'specific' : 'auto');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(preSelectedWorker || null);
  const [address, setAddress] = useState<string>('Flat 402, Green Valley Apartments, Road No. 12, Banjara Hills, Hyderabad');
  const [scheduledDate, setScheduledDate] = useState<string>('Today');
  const [scheduledTime, setScheduledTime] = useState<string>('05:00 PM');
  const [problemDescription, setProblemDescription] = useState<string>('Main switchboard breaker tripping when AC and ceiling fan operate simultaneously.');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | undefined>('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const targetWorker = assignMode === 'specific' && selectedWorker ? selectedWorker : workers[0];
  if (!targetWorker) return null;
  const estimatedPrice = targetWorker?.basePrice || 450;

  const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM'];
  const dateOptions = ['Today', 'Tomorrow', 'In 2 Days'];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      onBookingConfirmed({
        category: selectedCategory,
        worker: targetWorker,
        scheduledDate,
        scheduledTime,
        address,
        problem: problemDescription,
        photoUrl: photoPreviewUrl,
        estimatedPrice,
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-wizard-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              Step {step} of 4 — Cooperative Service Booking
            </span>
            <h3 id="booking-wizard-title" className="text-lg font-extrabold text-white mt-0.5">
              {step === 1 && '1. Choose Worker Assignment'}
              {step === 2 && '2. Service Address & Schedule'}
              {step === 3 && '3. Describe Problem & Upload Photo'}
              {step === 4 && '4. Booking Confirmation & Fair Wage'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close booking wizard"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          <div style={{ width: `${(step / 4) * 100}%` }} className="bg-emerald-500 transition-all duration-300" />
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-5">

          {/* STEP 1: ASSIGNMENT MODE */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-medium">
                Choose how you want your verified cooperative worker to be matched:
              </p>

              {/* Auto Match Option */}
              <div
                onClick={() => setAssignMode('auto')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 ${
                  assignMode === 'auto'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900">Auto-Assign Best Available Worker</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    System automatically assigns the closest available worker with the highest rating.
                  </p>
                </div>
              </div>

              {/* Specific Worker Option */}
              <div
                onClick={() => setAssignMode('specific')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 ${
                  assignMode === 'specific'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={targetWorker.photo}
                  alt={targetWorker.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-extrabold text-sm text-slate-900">Book {targetWorker.name} Directly</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>⭐ {targetWorker.rating}</span>
                    <span>•</span>
                    <span>{targetWorker.distanceKm} km away</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Verified Member</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADDRESS & SCHEDULE */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Service Address
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-emerald-600 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dateOptions.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setScheduledDate(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        scheduledDate === d
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setScheduledTime(t)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        scheduledTime === t
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROBLEM & PHOTO */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe the Issue
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  placeholder="Describe what needs repair or servicing..."
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload Photo/Video (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  {photoPreviewUrl ? (
                    <div className="relative inline-block">
                      <img src={photoPreviewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-300 shadow-sm" />
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full absolute -top-2 -right-2">
                        ✓ Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Camera className="w-6 h-6 text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Click to upload photo of issue</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & FAIR WAGE */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Service</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedCategory} Service</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Assigned Worker</span>
                  <span className="font-bold text-slate-900">{targetWorker.name} (Verified Co-op)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Date & Slot</span>
                  <span className="font-bold text-slate-900">{scheduledDate} at {scheduledTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Estimated Price</span>
                  <span className="font-extrabold text-emerald-700 text-sm">₹{estimatedPrice}</span>
                </div>
              </div>

              {/* Transparent Wage Card */}
              <FairWageCard amount={estimatedPrice} title="Fair Wage & Welfare Protection" />
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
          >
            <span>{step === 4 ? 'CONFIRM BOOKING NOW' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
