import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { getSupabaseInvoice } from '../../services/supabaseService';
import { useEffect } from 'react';
import { FairWageCard } from '../common/FairWageCard';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { X, FileText, CheckCircle2, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface TransparentBillModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (amount: number) => void;
}

export const TransparentBillModal: React.FC<TransparentBillModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onProceedToPayment,
}) => {
  const { bookings } = useDemo();
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (isOpen && booking) {
      getSupabaseInvoice(booking.id).then(res => setInvoice(res));
    }
  }, [isOpen, booking?.id]);

  if (!isOpen || !booking) return null;

  const baseFare = invoice?.service_fee || booking.estimatedPrice || 350;
  const materialsCost = invoice?.materials_fee || 0;
  const travelCost = invoice?.travel_fee || 0;
  const totalAmount = invoice?.total || booking.finalPrice || baseFare + materialsCost + travelCost;

  const handleDownload = () => {
    const workerEarnings = Math.round(totalAmount * 0.85);
    const coOpContribution = Math.round(totalAmount * 0.10);
    const welfareFund = Math.round(totalAmount * 0.05);

    const invoiceContent = `SAHAKAAR
Cooperative Service Marketplace

COOPERATIVE VERIFIED INVOICE
================================

Customer: Priya Sharma
Worker: ${booking.workerName}
Service: ${booking.serviceTitle}
Verification: Verified Cooperative Member

--------------------------------
ITEMIZED LINE ITEMS
--------------------------------
Cooperative Worker Service Fare: ₹${baseFare}
Materials & Spares: ₹${materialsCost}
Travel & Local Transport: ₹${travelCost}

--------------------------------
TOTAL INVOICE AMOUNT: ₹${totalAmount}
--------------------------------

PAYMENT DISTRIBUTION
--------------------------------
Worker Direct Earnings (85%): ₹${workerEarnings}
Cooperative Contribution (10%): ₹${coOpContribution}
Worker Welfare & Insurance Fund (5%): ₹${welfareFund}

--------------------------------
✓ Fair wage protected
✓ Zero corporate commission
✓ Cooperative owned
✓ Worker welfare enabled
`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sahakaar-Invoice-${booking.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Invoice downloaded successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Cooperative Verified Invoice
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Transparent Service Bill
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Worker Info Strip */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img src={booking.workerPhoto} alt={booking.workerName} className="w-12 h-12 rounded-xl object-cover border border-emerald-500" />
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">{booking.workerName}</h4>
              <p className="text-xs text-slate-500">{booking.serviceTitle}</p>
              <div className="mt-0.5">
                <VerifiedBadge cooperativeName={booking.workerCooperative} size="sm" />
              </div>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Itemized Line Items
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Cooperative Worker Service Fare</span>
                <span className="font-bold text-slate-900">₹{baseFare}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Materials & Spares (Wire, Switch)</span>
                <span className="font-bold text-slate-900">₹{materialsCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600 font-medium">Travel & Local Transport</span>
                <span className="font-bold text-slate-900">₹{travelCost}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold">
                <span className="text-slate-900">Total Invoice Amount</span>
                <span className="text-emerald-700">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Transparent Fair Wage Breakdown Card */}
          <div>
            <FairWageCard amount={totalAmount} title="Transparent Payment Distribution" />
          </div>

          {/* Social Impact Callout */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-semibold">
            <Heart className="w-5 h-5 text-emerald-600 shrink-0 fill-emerald-600" />
            <span>💚 Your payment supports a verified cooperative worker and contributes to the Worker Welfare & Healthcare Fund.</span>
          </div>

        </div>

        {/* Modal Action CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Due</span>
            <span className="text-xl font-extrabold text-slate-900">₹{totalAmount}</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {(booking.status !== 'completed' && invoice?.status !== 'paid') && (
              <button
                onClick={() => onProceedToPayment(totalAmount)}
                className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>Close</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-extrabold text-sm transition shadow-sm flex items-center justify-center gap-2"
            >
              <span>↓ Download Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

