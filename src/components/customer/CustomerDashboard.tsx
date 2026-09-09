import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { BookingStatus } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { DisputeModal } from './DisputeModal';
import { createSupabaseComplaint } from '../../services/supabaseService';
import { supabase } from '../../lib/supabase';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Star,
  CreditCard,
  Bell,
  ShieldCheck,
  ChevronRight,
  User
} from 'lucide-react';

interface CustomerDashboardProps {
  onTrackBooking: (bookingId: string) => void;
  onViewBill: (bookingId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onTrackBooking,
  onViewBill,
}) => {
  const { bookings, location, isLoading } = useDemo();
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [newDispute, setNewDispute] = useState<any>(null);
  const [disputeSuccessMessage, setDisputeSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'bookings' | 'addresses' | 'payments' | 'invoices'>('bookings');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  
  useEffect(() => {
    if (activeTab === ('disputes' as any)) {
      setIsLoadingComplaints(true);
      const fetchComplaints = async () => {
        try {
          const { data, error } = await supabase.from('complaints').select('*').eq('customer_id', 'c-1');
          if (error) console.error("Error fetching complaints:", error);
          if (data) setComplaints(data);
        } catch (err) {
          console.error("Exception fetching complaints:", err);
        } finally {
          setIsLoadingComplaints(false);
        }
      };
      fetchComplaints();
    }
  }, [activeTab]);

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (statusFilter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {isLoading && <LoadingSpinner fullScreen message="Loading dashboard data..." />}

      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            alt="Priya Sharma"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-white">Priya Sharma</h2>
            <p className="text-xs text-slate-300 font-medium">Customer Profile • {location}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-emerald-400 font-bold">
              <span>Verified Co-op Supporter</span>
              <span>•</span>
              <span>2 Completed Bookings</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-medium">Total Spent</span>
            <span className="text-lg font-extrabold text-emerald-400">₹950</span>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-xs text-slate-400 block font-medium">Co-op Impact</span>
            <span className="text-lg font-extrabold text-amber-400">₹47 Welfare</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'addresses'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment History</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'invoices'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes' as any)}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'disputes' as any
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Support & Disputes</span>
        </button>
      </div>

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          
          {/* Sub-filter */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All ({bookings.length})
            </button>

            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                statusFilter === 'active' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Active / Ongoing
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                statusFilter === 'completed' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Completed
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Bookings Found"
              description="You don't have any bookings matching this filter. Need a service?"
              actionLabel="Find a Worker"
              onAction={() => setActiveTab('bookings')} // Or redirect to home
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <img src={b.workerPhoto} alt={b.workerName} className="w-14 h-14 rounded-2xl object-cover border border-emerald-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900">{b.serviceTitle}</h4>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {b.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Worker: <strong className="text-slate-800">{b.workerName}</strong> ({b.workerCooperative})
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 font-medium">
                        <span>📅 {b.scheduledDate}</span>
                        <span>•</span>
                        <span>⏰ {b.scheduledTime}</span>
                        <span>•</span>
                        <span>📍 Banjara Hills</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Est. Amount</span>
                      <span className="text-lg font-extrabold text-slate-900">₹{b.estimatedPrice}</span>
                    </div>

                    {b.status === 'completed' ? (
                      <button
                        onClick={() => onViewBill(b.id)}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition shadow"
                      >
                        View Invoice
                      </button>
                    ) : (
                      <button
                        onClick={() => onTrackBooking(b.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 flex items-center gap-1"
                      >
                        <span>Track Live</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* SAVED ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Saved Addresses</h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-slate-900">Home Address (Default)</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Flat 402, Green Valley Apartments, Road No. 12, Banjara Hills, Hyderabad — 500034
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === 'payments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Payment History</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">Bathroom Tap Repair (BK-2026-8812)</span>
                <span className="text-[11px] text-slate-400">Paid via UPI • PAY-2026-00124</span>
              </div>
              <span className="font-extrabold text-emerald-700 text-sm">₹450</span>
            </div>
          </div>
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === 'invoices' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Cooperative Invoices</h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">Invoice #INV-2026-089</span>
                <span className="text-slate-500">Electrician & Plumbing Service • ₹500</span>
              </div>
            </div>
            <button
              onClick={() => onViewBill('BK-2026-9041')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {(activeTab as any) === 'disputes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Support & Disputes</h3>
            <button 
              onClick={() => setIsDisputeModalOpen(true)}
              className="px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition"
            >
              Raise New Dispute
            </button>
          </div>
          
          <div className="space-y-4">
            {disputeSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {disputeSuccessMessage}
              </div>
            )}

            {isLoadingComplaints ? (
              <div className="py-8 text-center text-slate-500 font-bold text-sm">Loading disputes...</div>
            ) : complaints.length === 0 ? (
              <EmptyState title="No Disputes" description="You have no active disputes or complaints." icon={ShieldCheck} />
            ) : (
              complaints.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{c.category} ({c.booking_id})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{c.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Raised: {new Date(c.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Assigned to: Cooperative Grievance Team</span>
                    </div>
                    {c.amount > 0 && <span className="font-bold text-rose-700">₹{c.amount}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        onSubmit={async (dispute: any) => {
          setIsDisputeModalOpen(false);
          try {
            const booking = bookings.find(b => b.id === dispute.bookingId);
            const workerId = booking?.workerId || 'w-1';
            await createSupabaseComplaint(dispute.bookingId, 'c-1', workerId, dispute.category, dispute.description, dispute.amount || 0); // Note: Should ideally pass correct workerId from booking.
            setDisputeSuccessMessage("Your dispute has been registered and will be reviewed by the cooperative grievance team.");
            
            // Reload complaints
            const loadData = async () => {
              const { data, error } = await supabase.from('complaints').select('*').eq('customer_id', 'c-1');
              if (error) console.error("Error reloading complaints:", error);
              if (data) setComplaints(data);
            };
            loadData();
            
            setTimeout(() => setDisputeSuccessMessage(""), 5000);
          } catch (e) {
            console.error("Failed to submit dispute", e);
            alert("Failed to submit dispute. Please try again.");
          }
        }}
      />
    </div>
  );
};
