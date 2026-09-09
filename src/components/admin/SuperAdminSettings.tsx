import React, { useState } from 'react';
import { Server, Settings as SettingsIcon, AlertCircle, Save, CheckCircle2 } from 'lucide-react';

export const SuperAdminSettings: React.FC = () => {
  const [wagePolicy, setWagePolicy] = useState({ worker: 85, coop: 10, welfare: 5 });
  const [wageError, setWageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleWageChange = (field: 'worker' | 'coop' | 'welfare', value: string) => {
    const num = parseInt(value) || 0;
    const newPolicy = { ...wagePolicy, [field]: num };
    setWagePolicy(newPolicy);
    
    const total = newPolicy.worker + newPolicy.coop + newPolicy.welfare;
    if (total !== 100) {
      setWageError(`Total must be exactly 100%. Current total: ${total}%`);
    } else {
      setWageError('');
    }
  };

  const handleSave = () => {
    const total = wagePolicy.worker + wagePolicy.coop + wagePolicy.welfare;
    if (total !== 100) return;

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" /> Platform Settings
          </h3>
          <p className="text-xs text-slate-500 font-medium">Configure global platform rules and wage distribution policies.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || wageError.length > 0}
          className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saveSuccess ? 'Saved Successfully' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wage Distribution Policy */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <div>
            <h4 className="font-extrabold text-slate-900">Wage Distribution Policy</h4>
            <p className="text-xs text-slate-500">Define how the total payment is split between workers, cooperatives, and the welfare fund.</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Worker Share (%)</label>
                <input 
                  type="number" 
                  value={wagePolicy.worker}
                  onChange={(e) => handleWageChange('worker', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-lg font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Cooperative Share (%)</label>
                <input 
                  type="number" 
                  value={wagePolicy.coop}
                  onChange={(e) => handleWageChange('coop', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-lg font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Welfare Fund Share (%)</label>
                <input 
                  type="number" 
                  value={wagePolicy.welfare}
                  onChange={(e) => handleWageChange('welfare', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-lg font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                />
              </div>
            </div>
            
            {/* Visualizer */}
            <div className="mt-6">
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${wagePolicy.worker}%` }}></div>
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${wagePolicy.coop}%` }}></div>
                <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${wagePolicy.welfare}%` }}></div>
              </div>
            </div>

            {wageError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-bold">
                <AlertCircle className="w-4 h-4" /> {wageError}
              </div>
            )}
          </div>
        </div>

        {/* Platform Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-900">Platform Information</h4>
            <p className="text-xs text-slate-500">Basic platform details.</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="Sahakaar Cooperative Platform" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
              <input type="email" defaultValue="support@sahakaar.in" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Emergency Service Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-900">Emergency Settings</h4>
            <p className="text-xs text-slate-500">Configure emergency dispatch protocols.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-bold text-slate-700">Enable 1-Tap Emergency</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Base Surcharge (₹)</label>
              <input type="number" defaultValue={150} className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>

        {/* Verification Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-900">Verification Settings</h4>
            <p className="text-xs text-slate-500">Worker onboarding and verification rules.</p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Require KYC for Workers
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Require Police Verification
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Require Skills Certification
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-extrabold text-slate-900">Notification Settings</h4>
            <p className="text-xs text-slate-500">Global alert preferences.</p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Enable SMS Alerts
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Enable WhatsApp Integration
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" /> Send Daily Digests to Super Admins
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};
