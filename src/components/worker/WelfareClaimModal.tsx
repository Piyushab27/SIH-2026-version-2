import React, { useState } from 'react';
import { X, Heart, ShieldCheck, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';

interface WelfareClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claimType: 'insurance' | 'emergency';
}

export const WelfareClaimModal: React.FC<WelfareClaimModalProps> = ({
  isOpen,
  onClose,
  claimType,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const title = claimType === 'insurance' ? 'Health Insurance Claim' : 'Emergency Fund Request';
  const icon = claimType === 'insurance' ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />;
  const badgeClass = claimType === 'insurance' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800';

  const handleNext = () => setStep(prev => (prev + 1) as 1 | 2 | 3);
  const handleClose = () => {
    setStep(1);
    setAmount('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${claimType === 'insurance' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">{title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${badgeClass}`}>
                Cooperative Welfare Fund
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 font-medium">
                {claimType === 'insurance' 
                  ? 'Submit a claim against your active Group Health & Accident Insurance policy. Enter the details below.'
                  : 'Request zero-interest emergency assistance from the Cooperative Welfare Fund.'}
              </p>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requested Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 text-sm font-bold transition outline-none"
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Request</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-0 text-sm font-medium transition outline-none resize-none h-24"
                  placeholder="Briefly describe your situation..."
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!amount || !reason}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-md shadow-emerald-900/20 transition flex items-center justify-center"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2 border-2 border-blue-100 border-dashed">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900">Upload Supporting Documents</h4>
              <p className="text-xs text-slate-500 font-medium pb-2">
                Please attach medical bills, prescriptions, or other relevant proof.
              </p>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition cursor-pointer">
                <span className="text-sm font-bold text-emerald-600">Click to upload</span>
                <span className="text-xs text-slate-400 block mt-1">PDF, JPG, PNG (Max 5MB)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-md transition text-sm"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-xl text-slate-900">Claim Submitted!</h4>
              <p className="text-sm text-slate-600 font-medium">
                Your request for ₹{amount} has been successfully submitted to the Federation for review.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left mt-4 mb-6">
                <span className="text-xs text-slate-500 block font-bold">Claim Reference</span>
                <span className="font-extrabold text-slate-900">CLM-2026-892</span>
                <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">
                  Status: Pending Federation Approval
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold transition text-sm"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
