import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AlertTriangle, MessageSquare, ArrowRight, X, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const CoopDisputes: React.FC = () => {
  const { complaints, updateComplaintStatusAction, bookings, workers } = useDemo();
  
  const dynamicCoopName = workers && workers.length > 0 && workers[0].cooperativeName 
    ? workers[0].cooperativeName 
    : null;

  const coopComplaints = dynamicCoopName
    ? complaints.filter(c => c.workerCooperative === dynamicCoopName)
    : complaints;

  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateComplaintStatusAction(complaintId, newStatus);
      if (selectedCase?.id === complaintId) {
        setSelectedCase((prev: any) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      alert('Unable to update complaint status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRelatedBooking = (bookingId: string) => bookings.find(b => b.id === bookingId);

  const getTimeSince = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      
      {coopComplaints.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-lg font-extrabold text-slate-900">No Active Complaints</h3>
          <p className="text-sm text-slate-500 mt-1">All disputes have been resolved or no complaints have been filed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coopComplaints.map(dispute => (
            <div key={dispute.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {dispute.id}
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {dispute.bookingId}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Raised {getTimeSince(dispute.createdAt)}</span>
                </div>
                
                <h4 className="font-extrabold text-slate-900 text-lg">{dispute.category}</h4>
                <p className="text-sm text-slate-600 mt-1 max-w-lg">{dispute.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span>Customer: <strong className="text-slate-700">{dispute.customerName}</strong></span>
                  <span>Worker: <strong className="text-slate-700">{dispute.workerName}</strong></span>
                  {dispute.amount > 0 && <span>Amount: <strong className="text-slate-700">₹{dispute.amount}</strong></span>}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-400 uppercase">Status</span>
                  <span className={`uppercase ${
                    dispute.status === 'RESOLVED' ? 'text-emerald-600' :
                    dispute.status === 'REJECTED' ? 'text-rose-600' :
                    'text-orange-600'
                  }`}>{dispute.status}</span>
                </div>
                
                <button onClick={() => setSelectedCase(dispute)} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> View Case
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* View Case Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                Case Details
                <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">{selectedCase.id}</span>
              </h3>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Info */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    selectedCase.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                    selectedCase.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{selectedCase.status}</span>
                  <span className="text-[10px] font-bold text-slate-400">Booking: {selectedCase.bookingId}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{selectedCase.category}</h2>
                <p className="text-sm text-slate-600 mt-2">{selectedCase.description}</p>
                {selectedCase.amount > 0 && (
                  <p className="text-sm font-bold text-slate-900 mt-2">Disputed Amount: ₹{selectedCase.amount}</p>
                )}
              </div>

              {/* Parties */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customer</h4>
                  <p className="font-bold text-slate-900">{selectedCase.customerName}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Worker</h4>
                  <p className="font-bold text-slate-900">{selectedCase.workerName}</p>
                  <p className="text-[10px] font-bold text-emerald-600">{selectedCase.workerCooperative}</p>
                </div>
              </div>

              {/* Related Booking Info */}
              {(() => {
                const related = getRelatedBooking(selectedCase.bookingId);
                if (!related) return null;
                return (
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Related Booking</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-slate-500">Service:</span> <span className="font-bold">{related.serviceTitle}</span></div>
                      <div><span className="text-slate-500">Date:</span> <span className="font-bold">{related.scheduledDate}</span></div>
                      <div><span className="text-slate-500">Status:</span> <span className="font-bold capitalize">{related.status}</span></div>
                      <div><span className="text-slate-500">Amount:</span> <span className="font-bold">₹{related.wageBreakdown?.totalPaid || related.estimatedPrice}</span></div>
                    </div>
                  </div>
                );
              })()}

              {/* Admin Actions */}
              {selectedCase.status === 'UNDER REVIEW' && (
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Admin Actions</h4>
                  <div className="flex gap-3">
                    <button 
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedCase.id, 'RESOLVED')}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Resolve
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleStatusChange(selectedCase.id, 'REJECTED')}
                      className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedCase.status !== 'UNDER REVIEW' && (
                <div className={`p-4 rounded-2xl text-center ${
                  selectedCase.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  <p className="text-sm font-bold">This case has been {selectedCase.status.toLowerCase()}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

