import React, { useMemo } from 'react';
import { Users, Activity, TrendingUp, Heart, Building2 } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const FederationDashboard: React.FC = () => {
  const { workers, bookings } = useDemo();

  const metrics = useMemo(() => {
    const uniqueSocieties = new Set(workers.map(w => w.cooperativeName).filter(Boolean));
    const totalSocieties = uniqueSocieties.size;
    const activeSocieties = totalSocieties; 

    const totalWorkers = workers.length;
    const verifiedWorkers = workers.filter(w => w.verificationStatus === 'verified').length;

    const activeBookings = bookings.filter(b => ['pending', 'accepted', 'in_progress'].includes(b.status));
    const totalActiveBookings = activeBookings.length;
    const emergencyBookings = bookings.filter(b => b.isEmergency).length;

    let totalEarnings = 0;
    let totalWelfare = 0;

    bookings.forEach(b => {
       if (b.status === 'completed' && b.finalPrice) {
          totalEarnings += b.finalPrice;
          totalWelfare += b.finalPrice * 0.05; 
       }
    });

    const formatCurrency = (val: number) => {
        if (val === 0) return '₹0';
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
        return `₹${val.toFixed(0)}`;
    };

    return {
      totalSocieties,
      activeSocieties,
      totalWorkers,
      verifiedWorkers,
      totalActiveBookings,
      emergencyBookings,
      formattedEarnings: formatCurrency(totalEarnings),
      formattedWelfare: formatCurrency(totalWelfare)
    };
  }, [workers, bookings]);

  const bookingsBySociety = useMemo(() => {
      const counts: Record<string, number> = {};
      bookings.forEach(b => {
          const worker = workers.find(w => w.id === b.workerId);
          if (worker && worker.cooperativeName) {
             counts[worker.cooperativeName] = (counts[worker.cooperativeName] || 0) + 1;
          } else if (b.workerCooperative) {
             counts[b.workerCooperative] = (counts[b.workerCooperative] || 0) + 1;
          } else {
             counts['Unassigned'] = (counts['Unassigned'] || 0) + 1;
          }
      });

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (sorted.length === 0) return [];

      const maxCount = sorted[0][1];
      return sorted.map(([id, count]) => ({
          name: id.slice(0, 4).toUpperCase(),
          count,
          height: maxCount > 0 ? `${Math.max(10, (count / maxCount) * 100)}%` : '0%'
      }));
  }, [bookings, workers]);

  const serviceDemand = useMemo(() => {
      const counts: Record<string, { total: number, active: number }> = {};
      
      bookings.forEach(b => {
         const cat = b.serviceCategory || 'Unknown';
         if (!counts[cat]) counts[cat] = { total: 0, active: 0 };
         counts[cat].total += 1;
         if (['pending', 'accepted', 'in_progress'].includes(b.status)) {
             counts[cat].active += 1;
         }
      });
      
      const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-blue-500', 'bg-purple-500'];
      const sorted = Object.entries(counts).sort((a, b) => b[1].total - a[1].total).slice(0, 4);

      if (sorted.length === 0) return [];
      
      return sorted.map(([name, data], i) => {
          const workerCount = workers.filter(w => w.skills.includes(name as any)).length;
          
          return {
              name,
              count: workerCount,
              val: data.total > 0 ? `${Math.round((data.active / data.total) * 100)}%` : '0%',
              color: colors[i % colors.length]
          };
      });
  }, [bookings, workers]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Societies</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{metrics.totalSocieties}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">{metrics.activeSocieties} Active</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Workers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{metrics.totalWorkers}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">{metrics.verifiedWorkers} Verified Members</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{metrics.totalActiveBookings}</span>
          <span className="text-[10px] text-rose-500 font-semibold block mt-1">{metrics.emergencyBookings} Emergency Bookings</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Worker Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-700">{metrics.formattedEarnings}</span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-1">{metrics.formattedWelfare} Welfare Contribution</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Bookings by Society</h4>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Top Performers</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {bookingsBySociety.length > 0 ? (
                bookingsBySociety.map(d => (
                  <div key={d.name} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">{d.count}</span>
                    <div style={{ height: d.height }} className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-xl transition-all shadow" />
                    <span className="text-[11px] font-bold text-slate-600">{d.name}</span>
                  </div>
                ))
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                    No data available
                </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Service Demand Distribution</h4>
            <span className="text-xs font-bold text-slate-500">Real-time</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {serviceDemand.length > 0 ? (
                serviceDemand.map(s => (
                  <div key={s.name}>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span className="capitalize">{s.name} ({s.count} workers)</span>
                      <span className="text-emerald-700">{s.val} Active</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: s.val }} />
                    </div>
                  </div>
                ))
            ) : (
                <div className="w-full h-32 flex items-center justify-center text-slate-400 text-sm font-medium">
                    No data available
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
