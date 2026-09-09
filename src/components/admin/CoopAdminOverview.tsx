import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, AlertTriangle, TrendingUp, ArrowRight, ShieldCheck, DollarSign, Activity } from 'lucide-react';

export const CoopAdminOverview: React.FC<{ onNavigate: (tab: any) => void }> = ({ onNavigate }) => {
  const { workers, bookings, complaints } = useDemo();
  
  const dynamicCoopName = workers[0]?.cooperativeName || 'Your Cooperative';
  const dynamicCoopId = workers[0]?.cooperativeId || '';

  const coopWorkers = workers.filter(w => 
    (w.cooperativeName && w.cooperativeName === dynamicCoopName) || 
    (dynamicCoopId && w.cooperativeId === dynamicCoopId)
  );
  const coopBookings = bookings.filter(b => b.workerCooperative === dynamicCoopName);
  const coopComplaints = complaints.filter(c => c.workerCooperative === dynamicCoopName);
  const openDisputes = coopComplaints.filter(c => c.status === 'UNDER REVIEW').length;

  // Basic stats
  const totalWorkers = coopWorkers.length;
  const verifiedWorkers = coopWorkers.filter(w => w.verificationStatus === 'verified').length;
  const pendingVerification = coopWorkers.filter(w => w.verificationStatus === 'pending').length;

  const activeBookings = coopBookings.filter(b => ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status));
  const emergencyBookings = activeBookings.filter(b => b.isEmergency);
  const completedToday = coopBookings.filter(b => b.status === 'completed' && b.scheduledDate === 'Today').length;

  const revenue = coopBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.wageBreakdown?.totalPaid || 0), 0);
  const workerEarnings = coopBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.wageBreakdown?.workerEarnings || 0), 0);
  const welfare = coopBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.wageBreakdown?.welfareContribution || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total / Verified Workers</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalWorkers} / <span className="text-emerald-600">{verifiedWorkers}</span></span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-amber-300 transition" onClick={() => onNavigate('verification')}>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Pending Verification</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingVerification}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition" onClick={() => onNavigate('bookings')}>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Active Bookings</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{activeBookings.length}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-rose-300 transition" onClick={() => onNavigate('bookings')}>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Emergency Bookings</span>
          <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{emergencyBookings.length}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cooperative Revenue</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">₹{revenue}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Worker Earnings</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">₹{workerEarnings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-300 transition">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Welfare Contribution</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">₹{welfare}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Today</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{completedToday}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Alerts / Attention Required */}
        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200">
          <h3 className="font-extrabold text-sm text-rose-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            ATTENTION REQUIRED
          </h3>
          <div className="space-y-3">
            {pendingVerification > 0 && (
              <button onClick={() => onNavigate('verification')} className="w-full bg-white p-3 rounded-2xl border border-rose-100 flex items-center justify-between hover:border-rose-300 transition">
                <span className="text-xs font-bold text-rose-700">🔴 {pendingVerification} workers awaiting verification</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            )}
            {emergencyBookings.length > 0 && (
              <button onClick={() => onNavigate('bookings')} className="w-full bg-white p-3 rounded-2xl border border-rose-100 flex items-center justify-between hover:border-rose-300 transition">
                <span className="text-xs font-bold text-rose-700">🔴 {emergencyBookings.length} active emergency bookings</span>
                <ArrowRight className="w-4 h-4 text-rose-400" />
              </button>
            )}
            {openDisputes > 0 && (
            <button onClick={() => onNavigate('disputes')} className="w-full bg-white p-3 rounded-2xl border border-orange-200 flex items-center justify-between hover:border-orange-400 transition">
              <span className="text-xs font-bold text-orange-700">🟠 {openDisputes} unresolved customer complaint{openDisputes !== 1 ? 's' : ''}</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4">QUICK ACTIONS</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('verification')} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700 uppercase">Verify Workers</span>
            </button>
            <button onClick={() => onNavigate('bookings')} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <Activity className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700 uppercase">Manage Bookings</span>
            </button>
            <button onClick={() => onNavigate('disputes')} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <AlertTriangle className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700 uppercase">Complaints</span>
            </button>
            <button onClick={() => onNavigate('forecast')} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition group">
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
              <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700 uppercase">Demand Forecast</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
