import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, TrendingUp, Heart, Landmark, CheckCircle2, ArrowUpRight, DollarSign } from 'lucide-react';

export const WorkerEarnings: React.FC = () => {
  
  const { wageConfig, bookings, activeWorkerId } = useDemo();

  const workerBookings = bookings.filter(b => b.workerId === activeWorkerId);
  const completedBookings = workerBookings.filter(b => b.status === 'completed');
  const pendingBookings = workerBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');

  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.wageBreakdown?.workerEarnings || 0), 0);
  const pendingEarnings = pendingBookings.reduce((sum, b) => sum + (b.wageBreakdown?.workerEarnings || 0), 0);
  const coopContrib = completedBookings.reduce((sum, b) => sum + (b.wageBreakdown?.cooperativeContribution || 0), 0);
  const welfareContrib = completedBookings.reduce((sum, b) => sum + (b.wageBreakdown?.welfareContribution || 0), 0);


  return (
    <div className="space-y-6">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Payout</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">₹{totalEarnings.toFixed(0)}</span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> {completedBookings.length} Jobs Completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Earnings</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">₹{pendingEarnings.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">{pendingBookings.length} Pending Jobs</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Co-op Contribution</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">₹{coopContrib.toFixed(0)}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">For cooperative growth</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Welfare Contribution</span>
          <span className="text-2xl font-extrabold text-amber-600 mt-1 block">₹{welfareContrib.toFixed(0)}</span>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">Active Pension & Health</span>
        </div>
      </div>

      {/* Hero Fair Wage Protection Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-500/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cooperative Fair Wage Guarantee</span>
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            100% Transparent Worker Earnings Policy
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Unlike private aggregator apps that take 25%–35% hidden commissions, your cooperative guarantees that 
            <strong className="text-emerald-400 font-bold"> {wageConfig.workerPct}% of every customer payment</strong> goes directly to your bank account, with 
            <strong className="text-amber-400 font-bold"> {wageConfig.welfarePct}% added to your personal welfare & health fund</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Corporate Deductions
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Same-Day Payout
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Federation Backed
            </span>
          </div>
        </div>
      </div>

      {/* Recent Job Settlements */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900">
          Recent Job Settlements
        </h4>
        
        <div className="divide-y divide-slate-100 text-xs">
          {completedBookings.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-medium">
              No recent earnings.
            </div>
          ) : (
            completedBookings.map((booking) => (
              <div key={booking.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">
                    {booking.serviceTitle} ({booking.id.split('-').pop()?.toUpperCase() || booking.id.slice(0, 8)})
                  </span>
                  <span className="text-slate-500">
                    Customer Paid ₹{booking.finalPrice || booking.estimatedPrice || 0} • {new Date(booking.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm block">
                    +₹{(booking.wageBreakdown?.workerEarnings || 0).toFixed(0)} Direct
                  </span>
                  <span className="text-[10px] text-amber-600 font-bold">
                    +₹{(booking.wageBreakdown?.welfareContribution || 0).toFixed(0)} Welfare
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
