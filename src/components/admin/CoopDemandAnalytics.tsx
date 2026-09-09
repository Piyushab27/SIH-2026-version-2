import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { BarChart3, TrendingUp, AlertTriangle, Activity, Calendar } from 'lucide-react';

export const CoopDemandAnalytics: React.FC = () => {
  const { bookings, workers } = useDemo();
  
  const dynamicCoopName = workers.find(w => w.cooperativeName)?.cooperativeName || bookings.find(b => b.workerCooperative)?.workerCooperative || '';
  const coopBookings = dynamicCoopName ? bookings.filter(b => b.workerCooperative === dynamicCoopName) : [];

  // Service category demand
  const categoryMap: Record<string, { total: number; completed: number; emergency: number }> = {};
  coopBookings.forEach(b => {
    const cat = b.serviceCategory || 'unknown';
    if (!categoryMap[cat]) categoryMap[cat] = { total: 0, completed: 0, emergency: 0 };
    categoryMap[cat].total++;
    if (b.status === 'completed') categoryMap[cat].completed++;
    if (b.isEmergency) categoryMap[cat].emergency++;
  });

  const categories = Object.entries(categoryMap).sort((a, b) => b[1].total - a[1].total);
  const maxDemand = Math.max(...categories.map(([, v]) => v.total), 1);

  // Status distribution
  const statusMap: Record<string, number> = {};
  coopBookings.forEach(b => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });

  const totalBookings = coopBookings.length;
  const completedBookings = coopBookings.filter(b => b.status === 'completed').length;
  const emergencyBookings = coopBookings.filter(b => b.isEmergency).length;
  const activeBookings = coopBookings.filter(b => ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;
  const totalRevenue = coopBookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.wageBreakdown?.totalPaid || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <BarChart3 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-800">Historical Demand Analytics</h4>
          <p className="text-xs text-blue-600 mt-0.5">These analytics are derived from actual booking data. AI-powered forecasting will be available in a future release.</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalBookings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{completedBookings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Active</span>
          <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{activeBookings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Emergency</span>
          <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{emergencyBookings}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Revenue</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">₹{totalRevenue}</span>
        </div>
      </div>

      {/* Service Category Demand Chart (Bar visualization) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h3 className="font-extrabold text-lg text-slate-900 mb-1">Service Category Demand</h3>
        <p className="text-xs text-slate-500 mb-4">Based on actual booking volume per service category</p>
        
        {categories.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No booking data available yet.</p>
        ) : (
          <div className="space-y-3">
            {categories.map(([cat, stats]) => (
              <div key={cat} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 w-28 capitalize truncate">{cat.replace('_', ' ')}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" 
                    style={{ width: `${(stats.total / maxDemand) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-[10px] font-extrabold text-slate-700">
                    {stats.total} bookings • {stats.completed} completed • {stats.emergency} emergency
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h3 className="font-extrabold text-lg text-slate-900 mb-4">Booking Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(statusMap).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
            <div key={status} className="bg-slate-50 p-4 rounded-2xl text-center">
              <span className="text-lg font-extrabold text-slate-900">{count}</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1 capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
