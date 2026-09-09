import React, { useMemo } from 'react';
import { GitCompare } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const SocietyComparison: React.FC = () => {
  const { workers, bookings } = useDemo();

  const societiesData = useMemo(() => {
    const data: Record<string, {
      name: string;
      workers: number;
      verified: number;
      bookings: number;
      completed: number;
      emergency: number;
      revenue: number;
      workerEarnings: number;
      welfare: number;
      totalRating: number;
      ratingCount: number;
    }> = {};

    workers.forEach(w => {
      const name = w.cooperativeName;
      if (!name) return;
      if (!data[name]) {
        data[name] = { name, workers: 0, verified: 0, bookings: 0, completed: 0, emergency: 0, revenue: 0, workerEarnings: 0, welfare: 0, totalRating: 0, ratingCount: 0 };
      }
      data[name].workers += 1;
      if (w.verificationStatus === 'verified') {
        data[name].verified += 1;
      }
      if (w.rating) {
        data[name].totalRating += w.rating;
        data[name].ratingCount += 1;
      }
    });

    bookings.forEach(b => {
      const name = b.workerCooperative;
      if (!name) return;
      if (!data[name]) {
        data[name] = { name, workers: 0, verified: 0, bookings: 0, completed: 0, emergency: 0, revenue: 0, workerEarnings: 0, welfare: 0, totalRating: 0, ratingCount: 0 };
      }
      data[name].bookings += 1;
      if (b.isEmergency) {
        data[name].emergency += 1;
      }
      if (b.status === 'completed') {
        data[name].completed += 1;
        const totalPaid = b.wageBreakdown?.totalPaid || b.finalPrice || b.estimatedPrice || 0;
        data[name].revenue += totalPaid;
        data[name].workerEarnings += b.wageBreakdown?.workerEarnings || (totalPaid * 0.85);
        data[name].welfare += b.wageBreakdown?.welfareContribution || (totalPaid * 0.05);
      }
    });

    return Object.values(data).map(d => ({
      ...d,
      rating: d.ratingCount > 0 ? (d.totalRating / d.ratingCount).toFixed(1) : 'N/A'
    }));
  }, [workers, bookings]);

  if (!societiesData.length) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <GitCompare className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium text-sm">No data available for comparison.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Society Performance Comparison</h4>
            <p className="text-xs text-slate-500">Side-by-side comparison of top cooperative societies.</p>
          </div>
        </div>

        <div className="overflow-x-auto pt-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="p-4 border-r border-slate-200">Metrics</th>
                {societiesData.map(s => (
                  <th key={s.name} className="p-4 border-r border-slate-200 text-slate-900">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Total Workers</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center">{s.workers}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Verified Workers</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center text-emerald-600">{s.verified}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Total Bookings</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center">{s.bookings}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Completed Bookings</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center">{s.completed}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Emergency Bookings</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center text-rose-600">{s.emergency}</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Total Revenue</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center font-bold text-slate-900">₹{(s.revenue / 100000).toFixed(2)}L</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Worker Earnings (85%)</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center text-emerald-700 font-bold">₹{(s.workerEarnings / 100000).toFixed(2)}L</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Welfare Fund (5%)</td>
                {societiesData.map(s => <td key={s.name} className="p-4 border-r border-slate-200 text-center text-amber-600 font-bold">₹{(s.welfare / 1000).toFixed(1)}k</td>)}
              </tr>
              <tr>
                <td className="p-4 border-r border-slate-200 bg-slate-50/50 text-slate-600 font-bold">Avg. Customer Rating</td>
                {societiesData.map(s => (
                  <td key={s.name} className="p-4 border-r border-slate-200 text-center">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                      {s.rating !== 'N/A' ? `★ ${s.rating}` : 'N/A'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
