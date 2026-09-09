import React, { useState } from 'react';
import { FederationDashboard } from './FederationDashboard';
import { SocietyManagement } from './SocietyManagement';
import { FederationOverview } from './FederationOverview';
import { SocietyComparison } from './SocietyComparison';
import { FederationReports } from './FederationReports';
import {
  LayoutDashboard,
  Building2,
  Globe,
  GitCompare,
  FileText,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'societies' | 'overview' | 'comparison' | 'reports'>('dashboard');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">
                Telangana Labour Cooperative Federation
              </h2>
              <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Federation Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Manage and monitor multiple cooperative societies under the federation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Federation</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('societies')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'societies'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Manage Societies</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Federation Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'comparison'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Society Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <FederationDashboard />}
      {activeTab === 'societies' && <SocietyManagement />}
      {activeTab === 'overview' && <FederationOverview />}
      {activeTab === 'comparison' && <SocietyComparison />}
      {activeTab === 'reports' && <FederationReports />}

    </div>
  );
};
