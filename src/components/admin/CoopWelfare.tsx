import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Heart, ShieldCheck, Activity } from 'lucide-react';

export const CoopWelfare: React.FC = () => {
  const { workers, bookings } = useDemo();
  const coopWorkers = workers.filter(w => w.cooperativeName === 'Hyderabad Labour Cooperative Society' || w.cooperativeId === 'HLCS-2021-089');
  const coopBookings = bookings.filter(b => b.workerCooperative === 'Hyderabad Labour Cooperative Society');

  const totalWorkers = coopWorkers.length;
  const welfareContributions = coopBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.wageBreakdown?.welfareContribution || 0), 0);
  const totalFundBalance = coopWorkers.reduce((sum, w) => sum + (w.welfareFundBalance || 0), 0);
  const activeWelfare = coopWorkers.filter(w => w.welfareStatus === 'active').length;
  const pendingWelfare = coopWorkers.filter(w => w.welfareStatus === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Welfare Members</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalWorkers}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Contributions</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">₹{welfareContributions}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fund Balance</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">₹{totalFundBalance}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active / Pending</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{activeWelfare} / <span className="text-amber-600">{pendingWelfare}</span></span>
        </div>
      </div>

      {/* Worker Welfare & Insurance Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h3 className="font-extrabold text-lg text-slate-900 mb-4">Worker Welfare & Insurance Status</h3>
        
        {coopWorkers.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No workers found for this cooperative.</p>
        ) : (
          <div className="space-y-3">
            {coopWorkers.map(w => (
              <div key={w.id} className="flex flex-col md:flex-row justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50 gap-4 md:items-center">
                <div className="flex items-center gap-3">
                  <img src={w.photo} alt={w.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{w.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{w.categoryLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Welfare</span>
                    <span className={`font-bold capitalize ${w.welfareStatus === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>{w.welfareStatus}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Fund</span>
                    <span className="font-bold text-slate-900">₹{w.welfareFundBalance}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Insurance</span>
                    <span className={`font-bold ${w.insuranceCoverage ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {w.insuranceCoverage ? 'Active' : 'None'}
                    </span>
                  </div>
                  {w.insuranceCoverage && (
                    <div className="text-center max-w-[150px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Coverage</span>
                      <span className="font-bold text-slate-700 text-[10px] truncate block">{w.insuranceCoverage}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
