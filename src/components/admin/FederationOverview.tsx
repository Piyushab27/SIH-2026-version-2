import React, { useState, useMemo } from 'react';
import { Filter, Calendar, Building2, Wrench, Activity, CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Heart } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const FederationOverview: React.FC = () => {
  const { workers, bookings } = useDemo();
  
  const [filters, setFilters] = useState({
    dateRange: 'Last 30 Days',
    society: 'All Societies',
    service: 'All Services',
    status: 'All Status',
    emergency: 'All Bookings'
  });

  const societies = useMemo(() => {
    const unique = new Set(workers.map(w => w.cooperativeName).filter(Boolean));
    return ['All Societies', ...Array.from(unique)];
  }, [workers]);

  const services = useMemo(() => {
    const unique = new Set(workers.map(w => w.categoryLabel).filter(Boolean));
    return ['All Services', ...Array.from(unique)];
  }, [workers]);

  const getFilteredData = () => {
    const filteredBookings = bookings.filter(b => {
      // Filter by society
      if (filters.society !== 'All Societies') {
        if (b.workerCooperative !== filters.society) return false;
      }
      
      // Filter by service
      if (filters.service !== 'All Services') {
        const worker = workers.find(w => w.id === b.workerId);
        // Fallback to booking's serviceTitle if worker isn't found
        const serviceName = worker?.categoryLabel || b.serviceTitle;
        if (serviceName !== filters.service) return false;
      }
      
      // Filter by status
      if (filters.status !== 'All Status') {
        if (filters.status === 'Completed' && b.status !== 'completed') return false;
        if (filters.status === 'Cancelled' && b.status !== 'cancelled') return false;
        if (filters.status === 'Active' && !['accepted', 'in_progress', 'pending', 'on_the_way', 'arrived', 'requested'].includes(b.status)) return false;
      }
      
      // Filter by emergency
      if (filters.emergency !== 'All Bookings') {
        if (filters.emergency === 'Emergency Only' && !b.isEmergency) return false;
        if (filters.emergency === 'Normal Only' && b.isEmergency) return false;
      }
      
      // Date filtering
      if (filters.dateRange !== 'This Year' && b.createdAt) {
        const bookingDate = new Date(b.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (filters.dateRange === 'Today' && diffDays > 1) return false;
        if (filters.dateRange === 'Last 7 Days' && diffDays > 7) return false;
        if (filters.dateRange === 'Last 30 Days' && diffDays > 30) return false;
      }

      return true;
    });

    const totalBookings = filteredBookings.length;
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const activeBookings = filteredBookings.filter(b => ['accepted', 'in_progress', 'pending', 'on_the_way', 'arrived', 'requested'].includes(b.status)).length;
    const emergencyBookings = filteredBookings.filter(b => b.isEmergency).length;

    let revenue = 0;
    let workerEarnings = 0;
    let coopContribution = 0;
    let welfareContribution = 0;

    filteredBookings.forEach(b => {
      const price = b.finalPrice || b.estimatedPrice || 0;
      revenue += price;
      if (b.wageBreakdown) {
        workerEarnings += b.wageBreakdown.workerEarnings || 0;
        coopContribution += b.wageBreakdown.cooperativeContribution || 0;
        welfareContribution += b.wageBreakdown.welfareContribution || 0;
      } else {
        workerEarnings += price * 0.85;
        coopContribution += price * 0.10;
        welfareContribution += price * 0.05;
      }
    });

    return {
      totalBookings,
      completedBookings,
      activeBookings,
      emergencyBookings,
      revenue,
      workerEarnings,
      coopContribution,
      welfareContribution,
    };
  };

  const data = getFilteredData();

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '0';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount.toFixed(0)}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Advanced Analytics Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Filter className="w-5 h-5 text-emerald-600" />
          <span className="font-extrabold">Federation Overview Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date Range</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <select value={filters.dateRange} onChange={e => setFilters({...filters, dateRange: e.target.value})} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Society</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <select value={filters.society} onChange={e => setFilters({...filters, society: e.target.value})} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                {societies.map(soc => (
                  <option key={soc} value={soc}>{soc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Service Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wrench className="w-4 h-4 text-slate-400" />
              </div>
              <select value={filters.service} onChange={e => setFilters({...filters, service: e.target.value})} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                {services.map(srv => (
                  <option key={srv} value={srv}>{srv}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Booking Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                <option>All Status</option>
                <option>Completed</option>
                <option>Active</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Emergency Filter</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
              </div>
              <select value={filters.emergency} onChange={e => setFilters({...filters, emergency: e.target.value})} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                <option>All Bookings</option>
                <option>Emergency Only</option>
                <option>Normal Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Row 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{data.totalBookings.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{data.completedBookings.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{data.activeBookings.toLocaleString()}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm bg-rose-50/50">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Emergency Bookings</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-2xl font-extrabold text-rose-700">{data.emergencyBookings.toLocaleString()}</span>
        </div>

        {/* Row 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-slate-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(data.revenue)}</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Worker Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-700">{formatCurrency(data.workerEarnings)}</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">85% Share</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Co-op Contribution</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-blue-700">{formatCurrency(data.coopContribution)}</span>
          <span className="text-[10px] text-blue-600 font-bold block mt-1">10% Share</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Welfare Contribution</span>
            <Heart className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-amber-600">{formatCurrency(data.welfareContribution)}</span>
          <span className="text-[10px] text-amber-600 font-bold block mt-1">5% Share</span>
        </div>
      </div>
    </div>
  );
};
