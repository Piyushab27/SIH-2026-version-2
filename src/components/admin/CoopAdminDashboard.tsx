import React, { useState } from 'react';
import { Building2, Users, FileCheck, Calendar, Activity, ShieldAlert, Heart, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { CoopAdminOverview } from './CoopAdminOverview';
import { CoopWorkerManagement } from './CoopWorkerManagement';
import { CoopBookings } from './CoopBookings';
import { CoopDisputes } from './CoopDisputes';
import { CoopWelfare } from './CoopWelfare';
import { CoopDemandAnalytics } from './CoopDemandAnalytics';

export const CoopAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workers' | 'verification' | 'bookings' | 'disputes' | 'forecast' | 'welfare'>('dashboard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Identity Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mb-0.5">
              SAHAKAAR COOPERATIVE ADMIN
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Hyderabad Labour Cooperative Society
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1">
              <span>Banjara Hills, Hyderabad</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                Active Cooperative
              </span>
              <span>•</span>
              <span>Administrator: Demo Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'workers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Workers</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'verification'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Verification Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings & Emergency</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'disputes'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Complaints & Disputes</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'forecast'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Demand Forecast</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && <CoopAdminOverview onNavigate={setActiveTab} />}
      {activeTab === 'workers' && <CoopWorkerManagement view="list" />}
      {activeTab === 'verification' && <CoopWorkerManagement view="verification" />}
      {activeTab === 'bookings' && <CoopBookings />}
      {activeTab === 'disputes' && <CoopDisputes />}
      {activeTab === 'welfare' && <CoopWelfare />}
      {activeTab === 'forecast' && <CoopDemandAnalytics />}

    </div>
  );
};
