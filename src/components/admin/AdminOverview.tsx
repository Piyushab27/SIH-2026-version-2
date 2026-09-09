import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, Activity, TrendingUp, Heart, Filter, Calendar, Building2, Wrench, Download, FileText, CheckCircle2 } from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { workers, bookings } = useDemo();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('performance');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportModal(false);
      }, 2000);
    }, 1500);
  };

  const totalWorkers = workers.length;
  const verifiedWorkers = workers.filter(w => w.verificationStatus === 'verified').length;

  const today = new Date().toDateString();
  const jobsToday = bookings.filter(b => new Date(b.createdAt).toDateString() === today).length;
  const lifetimeJobs = bookings.length;

  const totalEarnings = bookings.reduce((sum, b) => {
    return sum + (b.wageBreakdown?.workerEarnings || (b.finalPrice ? b.finalPrice * 0.85 : (b.estimatedPrice ? b.estimatedPrice * 0.85 : 0)));
  }, 0);

  const welfareFund = bookings.reduce((sum, b) => {
    return sum + (b.wageBreakdown?.welfareContribution || (b.finalPrice ? b.finalPrice * 0.05 : (b.estimatedPrice ? b.estimatedPrice * 0.05 : 0)));
  }, 0);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '₹0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toFixed(0)}`;
  };

  const uniqueSocieties = Array.from(new Set(workers.map(w => w.cooperativeName).filter(Boolean)));
  const uniqueServices = Array.from(new Set(workers.map(w => w.categoryLabel || w.category).filter(Boolean)));

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dailyJobs = last7Days.map(date => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const count = bookings.filter(b => new Date(b.createdAt).toDateString() === date.toDateString()).length;
    return { day: dayName, count };
  });
  const maxJobs = Math.max(...dailyJobs.map(d => d.count), 1);
  const chartData = dailyJobs.map(d => ({
    day: d.day,
    count: d.count,
    height: maxJobs > 1 || d.count > 0 ? `${(d.count / maxJobs) * 100}%` : '0%'
  }));

  const workersByCategory = workers.reduce((acc, w) => {
    const cat = w.categoryLabel || w.category;
    if (!acc[cat]) {
      acc[cat] = { total: 0, active: 0 };
    }
    acc[cat].total += 1;
    if (w.isAvailable) acc[cat].active += 1;
    return acc;
  }, {} as Record<string, { total: number, active: number }>);

  const categoryStats = Object.entries(workersByCategory).map(([category, stats]) => ({
    category,
    total: stats.total,
    activePct: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
  }));

  const colors = ['bg-emerald-500', 'bg-sky-500', 'bg-blue-500', 'bg-purple-500'];

  const societyStatsMap = bookings.reduce((acc, b) => {
    const soc = b.workerCooperative;
    if (!soc) return acc;
    if (!acc[soc]) {
      acc[soc] = { rev: 0, jobs: 0 };
    }
    acc[soc].jobs += 1;
    acc[soc].rev += (b.finalPrice || b.estimatedPrice || 0);
    return acc;
  }, {} as Record<string, { rev: number, jobs: number }>);

  uniqueSocieties.forEach(soc => {
    if (!societyStatsMap[soc]) {
      societyStatsMap[soc] = { rev: 0, jobs: 0 };
    }
  });

  const societyStats = Object.entries(societyStatsMap)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 4);

  const maxSocRev = Math.max(...societyStats.map(s => s.rev), 1);

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Federation Performance</h3>
          <p className="text-xs text-slate-500 font-medium">Real-time metrics across all cooperative societies.</p>
        </div>
        <button 
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Reports</span>
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Workers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{totalWorkers.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">{verifiedWorkers.toLocaleString()} Verified Members</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Jobs Today</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{jobsToday.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">{lifetimeJobs.toLocaleString()} Lifetime Jobs</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Worker Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-700">{formatCurrency(totalEarnings)}</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Direct 85% Fair Wage</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Welfare Fund</span>
            <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-amber-600">{formatCurrency(welfareFund)}</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-1">Healthcare & Pensions</span>
        </div>
      </div>

      {/* Advanced Analytics Filters */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Filters:</span>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <select className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <select className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none shadow-sm">
            <option>All Societies</option>
            {uniqueSocieties.map(soc => (
              <option key={soc} value={soc}>{soc}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Wrench className="w-4 h-4 text-slate-400" />
          </div>
          <select className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none shadow-sm">
            <option>All Services</option>
            {uniqueServices.map(srv => (
              <option key={srv} value={srv}>{srv}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Chart Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Weekly Job Volume Growth</h4>
            {lifetimeJobs > 0 && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Active</span>}
          </div>

          {/* Bar Chart Visualization */}
          {lifetimeJobs === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm font-medium text-slate-500">
              No data available
            </div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition">{d.count}</span>
                  <div style={{ height: d.height }} className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-xl transition-all shadow" />
                  <span className="text-[11px] font-bold text-slate-600">{d.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900">Worker Trade Utilization</h4>
          </div>

          {categoryStats.length === 0 ? (
             <div className="h-48 flex items-center justify-center text-sm font-medium text-slate-500">
              No data available
            </div>
          ) : (
            <div className="space-y-3 pt-2 text-xs h-48 overflow-y-auto pr-2">
              {categoryStats.map((stat, i) => (
                <div key={stat.category}>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>{stat.category} ({stat.total} workers)</span>
                    <span className="text-emerald-700">{stat.activePct}% Active</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors[i % colors.length]}`}
                      style={{ width: `${stat.activePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Society Comparison Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Society Comparison</h4>
            <p className="text-xs text-slate-500">Revenue & Job Volume across Top 4 Cooperatives</p>
          </div>
        </div>

        {societyStats.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-sm font-medium text-slate-500">
            No data available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {societyStats.map((soc, i) => {
              const progress = maxSocRev > 0 ? (soc.rev / maxSocRev) * 100 : 0;
              return (
                <div key={soc.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <h5 className="font-bold text-xs text-slate-800">{soc.name}</h5>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
                      <span className="text-lg font-extrabold text-emerald-700">{formatCurrency(soc.rev)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Jobs</span>
                      <span className="text-sm font-bold text-slate-700">{soc.jobs}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full ${colors[i % colors.length]}`} 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Generate Report
            </h3>
            
            {reportSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Report Generated!</h4>
                <p className="text-sm text-slate-500">Your PDF download will begin shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Select Report Type</label>
                  <select 
                    value={reportType} 
                    onChange={e => setReportType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-slate-50"
                  >
                    <option value="performance">Cooperative Performance</option>
                    <option value="statistics">Worker Statistics</option>
                    <option value="welfare">Welfare Report</option>
                    <option value="revenue">Revenue Report</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowReportModal(false)} className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                    Cancel
                  </button>
                  <button disabled={reportGenerating} type="submit" className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait">
                    {reportGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download PDF
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
