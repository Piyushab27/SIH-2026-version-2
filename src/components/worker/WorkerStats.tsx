import React from 'react';
import { useDemo } from '../../context/DemoContext';

export const WorkerStats: React.FC = () => {
  const { bookings, activeWorkerId } = useDemo();
  
  const workerBookings = bookings.filter(b => b.workerId === activeWorkerId);
  const todaysJobs = workerBookings.filter(b => b.scheduledDate === 'Today').length;
  const activeJobs = workerBookings.filter(b => ['accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;
  const completedJobs = workerBookings.filter(b => b.status === 'completed').length;
  const todaysEarnings = workerBookings
    .filter(b => b.status === 'completed' && b.scheduledDate === 'Today')
    .reduce((sum, b) => sum + (b.wageBreakdown?.workerEarnings || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">Today's Jobs</span>
        <span className="text-3xl font-extrabold text-slate-900">{todaysJobs}</span>
      </div>
      <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold uppercase text-blue-600 mb-1">Active Job</span>
        <span className="text-3xl font-extrabold text-blue-900">{activeJobs}</span>
      </div>
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">Completed</span>
        <span className="text-3xl font-extrabold text-slate-900">{completedJobs}</span>
      </div>
      <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm flex flex-col">
        <span className="text-[10px] font-bold uppercase text-emerald-700 mb-1">Today's Earnings</span>
        <span className="text-3xl font-extrabold text-emerald-900">₹{todaysEarnings}</span>
      </div>
    </div>
  );
};
