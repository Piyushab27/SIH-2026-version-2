import React, { useState } from 'react';
import { AlertCircle, X, Upload } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dispute: any) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [bookingId, setBookingId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors: any = {};
    if (!bookingId) newErrors.bookingId = 'Please select a booking.';
    if (!category) newErrors.category = 'Please select a dispute category.';
    if (!description.trim()) newErrors.description = 'Please describe the issue.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      id: `DISP-${Math.floor(Math.random() * 10000)}`,
      bookingId,
      category,
      description,
      amount,
      details,
      status: 'UNDER REVIEW',
      date: 'Just now'
    });
    
    // Reset
    setBookingId('');
    setCategory('');
    setDescription('');
    setAmount('');
    setDetails('');
    setFile(null);
    setErrors({});
  };

  const handleCancel = () => {
    setBookingId('');
    setCategory('');
    setDescription('');
    setAmount('');
    setDetails('');
    setFile(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="w-5 h-5" />
            <h2 className="font-extrabold text-lg uppercase tracking-wide">Raise a New Dispute</h2>
          </div>
          <button onClick={handleCancel} className="p-2 hover:bg-rose-100 rounded-full text-slate-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Select Booking */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Booking *</label>
            <select
              value={bookingId}
              onChange={(e) => { setBookingId(e.target.value); setErrors({...errors, bookingId: undefined}) }}
              className={`w-full p-3 rounded-xl border ${errors.bookingId ? 'border-red-300 bg-red-50' : 'border-slate-200'} text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500`}
            >
              <option value="">Select booking ▼</option>
              <option value="BK-2026-8812">Bathroom Tap Leakage Repair — BK-2026-8812</option>
              <option value="BK-2026-9041">Ceiling Fan Installation — BK-2026-9041</option>
            </select>
            {errors.bookingId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.bookingId}</p>}
          </div>

          {/* Dispute Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Dispute Category *</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setErrors({...errors, category: undefined}) }}
              className={`w-full p-3 rounded-xl border ${errors.category ? 'border-red-300 bg-red-50' : 'border-slate-200'} text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500`}
            >
              <option value="">Select category ▼</option>
              <option value="Overcharging">Overcharging</option>
              <option value="Poor Service Quality">Poor Service Quality</option>
              <option value="Service Not Completed">Service Not Completed</option>
              <option value="Worker Did Not Arrive">Worker Did Not Arrive</option>
              <option value="Worker Conduct">Worker Conduct</option>
              <option value="Incorrect Invoice">Incorrect Invoice</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Property Damage">Property Damage</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors({...errors, description: undefined}) }}
              placeholder="Describe your issue..."
              rows={3}
              className={`w-full p-3 rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-slate-200'} text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
          </div>

          {/* Amount in Dispute */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount in Dispute</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 pl-8 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Supporting Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Supporting Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional information..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Upload Evidence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Evidence</label>
            <label className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-xl bg-slate-50 hover:bg-rose-50 transition cursor-pointer text-sm text-slate-600 font-medium">
              <Upload className="w-4 h-4" />
              <span>Choose File (JPG, PNG, PDF)</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".jpg,.jpeg,.png,.pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                ✓ {file.name}
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-200 transition"
          >
            Submit Dispute
          </button>
        </div>

      </div>
    </div>
  );
};
