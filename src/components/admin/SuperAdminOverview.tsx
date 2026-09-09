import React, { useMemo } from 'react';
import { Network, Building2, Users, UserCheck, Banknote, TrendingUp, CalendarCheck, AlertTriangle } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const SuperAdminOverview: React.FC = () => {
  const { workers, bookings } = useDemo();

  const uniqueCooperatives = useMemo(() => {
    return new Set(workers.map((w: any) => w.cooperativeId)).size;
  }, [workers]);

  const uniqueFederations = useMemo(() => {
    const feds = new Set(workers.map((w: any) => {
      const parts = w.cooperativeName?.split('-') || [];
      return parts.length > 1 ? parts[0].trim() : w.cooperativeName;
    }));
    return feds.size;
  }, [workers]);

  const verifiedWorkersCount = workers.filter((w: any) => w.verificationStatus === 'verified').length;
  // Fallback to customerPhone or just string format if customerId doesn't exist
  const totalCustomers = new Set(bookings.map((b: any) => b.customerPhone || b.customerName)).size; 

  const platformRevenue = bookings
    .filter((b: any) => b.status === 'completed' && b.wageBreakdown)
    .reduce((sum, b) => sum + (b.wageBreakdown?.totalPaid || 0), 0);
  
  const workerEarnings = bookings
    .filter((b: any) => b.status === 'completed' && b.wageBreakdown)
    .reduce((sum, b) => sum + (b.wageBreakdown?.workerEarnings || 0), 0);

  const activeBookingsCount = bookings.filter((b: any) => ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length;
  const emergencyBookingsCount = bookings.filter((b: any) => b.isEmergency).length;

  const kpis = [
    { title: 'Total Federations', value: uniqueFederations.toString(), sub: 'Active', icon: Network, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Cooperatives', value: uniqueCooperatives.toString(), sub: 'Active Societies', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Verified Workers', value: verifiedWorkersCount.toString(), sub: 'Approved', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Active Customers', value: totalCustomers.toString(), sub: 'From Bookings', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Platform Revenue', value: `₹${platformRevenue.toLocaleString()}`, sub: 'Total Value', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Worker Earnings', value: `₹${workerEarnings.toLocaleString()}`, sub: 'Direct Payout', icon: TrendingUp, color: 'text-emerald-700', bg: 'bg-emerald-100' },
    { title: 'Active Bookings', value: activeBookingsCount.toString(), sub: 'In Progress', icon: CalendarCheck, color: 'text-slate-600', bg: 'bg-slate-100' },
    { title: 'Emergency Bookings', value: emergencyBookingsCount.toString(), sub: 'High Priority', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const bookingsTrend = useMemo(() => {
    const trend: Record<string, number> = {};
    bookings.forEach((b: any) => {
      const date = b.scheduledDate || b.createdAt || new Date().toISOString();
      const day = date.substring(0, 10);
      trend[day] = (trend[day] || 0) + 1;
    });
    return Object.entries(trend).sort((a, b) => a[0].localeCompare(b[0])).slice(-12);
  }, [bookings]);
  const maxTrend = bookingsTrend.length ? Math.max(...bookingsTrend.map(t => t[1])) : 1;

  const revenueTrend = useMemo(() => {
    const quarters: Record<string, number> = { 'Q1': 0, 'Q2': 0, 'Q3': 0, 'Q4': 0 };
    bookings.forEach((b: any) => {
      if (b.status === 'completed' && b.wageBreakdown) {
        const dateStr = b.completedAt || b.createdAt || new Date().toISOString();
        const month = new Date(dateStr).getMonth() + 1;
        const q = month <= 3 ? 'Q1' : month <= 6 ? 'Q2' : month <= 9 ? 'Q3' : 'Q4';
        quarters[q] += b.wageBreakdown.totalPaid;
      }
    });
    return [
      { q: 'Q1', val: quarters['Q1'] },
      { q: 'Q2', val: quarters['Q2'] },
      { q: 'Q3', val: quarters['Q3'] },
      { q: 'Q4', val: quarters['Q4'] }
    ];
  }, [bookings]);
  const maxRev = Math.max(...revenueTrend.map(d => d.val)) || 1;

  const fedDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    workers.forEach((w: any) => {
      const f = w.cooperativeName?.split('-').length > 1 ? w.cooperativeName.split('-')[0].trim() : (w.cooperativeName || 'Unknown');
      dist[f] = (dist[f] || 0) + 1;
    });
    const total = workers.length || 1;
    return Object.entries(dist).map(([name, count]) => ({
      name,
      val: Math.round((count / total) * 100),
      count
    })).sort((a,b) => b.count - a.count).slice(0, 4);
  }, [workers]);
  const fedColors = ['bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-sky-500'];

  const serviceDemand = useMemo(() => {
    const dist: Record<string, number> = {};
    bookings.forEach((b: any) => {
      dist[b.serviceTitle || b.serviceCategory] = (dist[b.serviceTitle || b.serviceCategory] || 0) + 1;
    });
    const total = bookings.length || 1;
    return Object.entries(dist).map(([name, count]) => ({
      name,
      val: Math.round((count / total) * 100),
      count
    })).sort((a,b) => b.count - a.count).slice(0, 4);
  }, [bookings]);
  const serviceColors = ['bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">System-Wide KPI Dashboard</h3>
          <p className="text-xs text-slate-500 font-medium">Aggregated metrics across the entire Sahakaar network.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{kpi.title}</span>
              <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <span className="text-2xl font-extrabold text-slate-900 block">{kpi.value}</span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-1">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Bookings Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Platform Bookings</h4>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Trend</span>
          </div>
          {bookingsTrend.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400 font-medium">No bookings data</div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
              {bookingsTrend.map(([day, val], i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition" title={day}>{val}</span>
                  <div style={{ height: `${(val/maxTrend)*100}%`, minHeight: '4px' }} className="w-full bg-blue-500 hover:bg-blue-400 rounded-t-lg transition-all shadow" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Revenue Trend</h4>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Quarterly</span>
          </div>
          {revenueTrend.every(d => d.val === 0) ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-400 font-medium">No revenue data</div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-6 pt-6 px-2">
              {revenueTrend.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group w-full">
                  <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition">₹{d.val.toLocaleString()}</span>
                  <div style={{ height: `${(d.val/maxRev)*100}%`, minHeight: '4px' }} className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-xl transition-all shadow" />
                  <span className="text-[10px] font-bold text-slate-500">{d.q}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Federation Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Federation Worker Distribution</h4>
          </div>
          {fedDistribution.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400 font-medium">No workers data</div>
          ) : (
            <div className="space-y-4 pt-2">
              {fedDistribution.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>{f.name}</span>
                    <span>{f.val}% ({f.count})</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${fedColors[i % fedColors.length]}`} style={{ width: `${f.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Demand */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Service Demand Analytics</h4>
          </div>
          {serviceDemand.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400 font-medium">No bookings data</div>
          ) : (
            <div className="space-y-4 pt-2">
              {serviceDemand.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="capitalize">{s.name}</span>
                    <span>{s.val}% ({s.count})</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${serviceColors[i % serviceColors.length]}`} style={{ width: `${s.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
