import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { MapPin, Clock } from 'lucide-react';

export const WorkerUpcomingJobs: React.FC<{ onViewJob: (id: string) => void }> = ({ onViewJob }) => {
  const { bookings, activeWorkerId } = useDemo();

  const activeStatuses = ['accepted', 'on_the_way', 'arrived', 'in_progress'];
  const upcomingJobs = bookings.filter(
    (b) => activeStatuses.includes(b.status) && b.workerId === activeWorkerId
  );

  if (upcomingJobs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center mt-6">
        <h4 className="text-sm font-extrabold text-slate-900 mb-1">No Upcoming Jobs</h4>
        <p className="text-xs text-slate-500 font-medium">Your upcoming jobs will appear here.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
        Upcoming Jobs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingJobs.map(job => (
          <div key={job.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-extrabold text-slate-900">{job.serviceTitle}</h4>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {job.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">Customer: <strong className="text-slate-900">{job.customerName}</strong></p>
              
              <div className="flex flex-col gap-1.5 text-[10px] font-bold text-slate-500 mb-4">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.scheduledDate} • {job.scheduledTime}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.customerAddress}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-extrabold text-emerald-600">₹{job.wageBreakdown?.workerEarnings}</span>
              <button 
                onClick={() => onViewJob(job.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold transition"
              >
                View Job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
