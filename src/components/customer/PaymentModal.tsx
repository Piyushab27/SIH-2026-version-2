import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useDemo } from '../../context/DemoContext';
import { X, CheckCircle2, QrCode, Smartphone, CreditCard, ShieldCheck, Download, Sparkles } from 'lucide-react';

interface PaymentModalProps {
  bookingId: string;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bookingId,
  amount,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { bookings } = useDemo();
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  const [paymentState, setPaymentState] = useState<'method' | 'processing' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'gpay' | 'phonepe' | 'cash'>('upi');

  if (!isOpen || !booking) return null;

  const handleSimulatePayment = () => {
    setPaymentState('processing');

    setTimeout(() => {
      setPaymentState('success');
      // Fire confetti burst!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleFinish = () => {
    onPaymentSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">
              {paymentState === 'success' ? 'Payment Success!' : 'Digital UPI Payment'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentState === 'method' && (
          <div className="p-6 space-y-5">
            <div className="text-center bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Total Payable Amount</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">₹{amount}</span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Direct Co-op Settlement (PAY-2026-00124)
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Digital Payment Method
              </label>

              <button
                onClick={() => setSelectedMethod('upi')}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  selectedMethod === 'upi'
                    ? 'border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">UPI QR Code & App</span>
                </div>
                {selectedMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setSelectedMethod('gpay')}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  selectedMethod === 'gpay'
                    ? 'border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Google Pay / PhonePe / Paytm</span>
                </div>
                {selectedMethod === 'gpay' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>

              <button
                onClick={() => setSelectedMethod('cash')}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition ${
                  selectedMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-50/60 font-bold text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Cash on Service Completion</span>
                </div>
                {selectedMethod === 'cash' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {/* UPI QR Code Preview */}
            {selectedMethod === 'upi' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 shadow-inner flex items-center justify-center">
                  {/* Mock SVG QR Code */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v3h-2v-3zm3 3h3v3h-3v-3zm-3 3h2v2h-2v-2zm-3-3h2v5h-2v-5zm-3 3h2v2h-2v-2z"/>
                  </svg>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold mt-2">Scan with any UPI app (GPay, PhonePe, BHIM)</p>
              </div>
            )}

            <button
              onClick={handleSimulatePayment}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition"
            >
              SIMULATE INSTANT UPI PAYMENT (₹{amount})
            </button>
          </div>
        )}

        {paymentState === 'processing' && (
          <div className="py-12 px-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <h4 className="text-base font-bold text-slate-900">Processing Payment...</h4>
            <p className="text-xs text-slate-500">Securing cooperative payout settlement</p>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-500">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ PAYMENT SUCCESSFUL
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">₹{amount}</h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Payment ID: PAY-2026-00124</p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{booking.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Worker:</span>
                <span className="font-bold text-slate-900">{booking.workerName} (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Worker Earnings:</span>
                <span className="font-extrabold text-emerald-700">₹{Math.round(amount * 0.85)} (85%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Welfare Fund Payout:</span>
                <span className="font-bold text-amber-600">₹{Math.round(amount * 0.05)} (5%)</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition"
            >
              RATE & REVIEW WORKER
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
