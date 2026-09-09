import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { BookingStatus, Booking } from '../../types';
import { Calendar, MapPin, Clock, DollarSign, ChevronRight, AlertTriangle } from 'lucide-react';

export const WorkerJobs: React.FC = () => {
  const { bookings, activeWorkerId, updateBookingStatus, setActiveBookingId } = useDemo();
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'completed' | 'cancelled'>('active');

  const workerBookings = bookings.filter(b => b.workerId === activeWorkerId);
  const requests = workerBookings.filter(b => b.status === 'requested');
  const activeJobs = workerBookings.filter(b => ['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status));
  const completedJobs = workerBookings.filter(b => b.status === 'completed');
  const cancelledJobs = workerBookings.filter(b => b.status === 'cancelled');

  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (bookingId: string, nextStatus: BookingStatus, notes?: string) => {
    try {
      setIsUpdating(true);
      await updateBookingStatus(bookingId, nextStatus, notes);
      if (['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(nextStatus)) {
        setActiveBookingId(bookingId);
      }
    } catch (error) {
      alert("Unable to update booking status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatusText = (status: BookingStatus) => {
    if (status === 'accepted') return 'START NAVIGATION';
    if (status === 'on_the_way') return 'MARK ARRIVED';
    if (status === 'arrived') return 'START SERVICE';
    if (status === 'in_progress') return 'MARK COMPLETED';
    return '';
  };

  const getNextStatus = (status: BookingStatus): BookingStatus | null => {
    if (status === 'accepted') return 'on_the_way';
    if (status === 'on_the_way') return 'arrived';
    if (status === 'arrived') return 'in_progress';
    if (status === 'in_progress') return 'completed';
    return null;
  };

  const renderJobCard = (job: Booking, isRequest: boolean = false) => {
    return (
      <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 animate-in fade-in">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                job.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                job.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {job.status.replace('_', ' ')}
              </span>
              {job.isEmergency && (
                <span className="bg-red-100 text-red-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  EMERGENCY
                </span>
              )}
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">{job.serviceTitle}</h4>
            <p className="text-sm font-semibold text-slate-700 mt-1">{job.customerName}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Estimated Earnings</div>
            <div className="text-lg font-black text-slate-900">
              ₹{job.wageBreakdown?.workerEarnings || (job.estimatedPrice * 0.85).toFixed(0)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate" title={job.customerAddress}>{job.customerAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{job.scheduledDate} {job.scheduledTime}</span>
          </div>
        </div>
        
        {job.problemDescription && (
          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <strong>Problem: </strong>{job.problemDescription}
          </div>
        )}

        {isRequest ? (
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleStatusUpdate(job.id, 'accepted')}
              disabled={isUpdating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => {
                const reason = window.prompt("Reason for rejecting this booking:");
                if (reason !== null) {
                  handleStatusUpdate(job.id, 'cancelled', reason);
                }
              }}
              disabled={isUpdating}
              className="flex-1 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
            >
              Reject
            </button>
          </div>
        ) : (
          ['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(job.status) && (
            <div className="mt-2">
              <button
                onClick={() => {
                  const next = getNextStatus(job.status);
                  if (next) handleStatusUpdate(job.id, next);
                }}
                disabled={isUpdating}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                {getNextStatusText(job.status)}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )
        )}
      </div>
    );
  };

  const getActiveList = () => {
    switch(activeTab) {
      case 'requests': return requests;
      case 'active': return activeJobs;
      case 'completed': return completedJobs;
      case 'cancelled': return cancelledJobs;
      default: return [];
    }
  };

  const currentList = getActiveList();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'requests', label: 'New Requests', count: requests.length },
          { id: 'active', label: 'Active Jobs', count: activeJobs.length },
          { id: 'completed', label: 'Completed', count: completedJobs.length },
          { id: 'cancelled', label: 'Cancelled/Rejected', count: cancelledJobs.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {currentList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Jobs Found</h3>
          <p className="text-sm text-slate-500">You don't have any jobs in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentList.map(job => renderJobCard(job, activeTab === 'requests'))}
        </div>
      )}
    </div>
  );
};
