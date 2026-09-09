import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Sparkles, User, HardHat, ShieldCheck, PlayCircle } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { role, triggerDemoJourney } = useDemo();

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white text-xs py-2 px-4 border-b border-emerald-700/50 shadow-sm z-50">
      <div className="w-[92%] max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Hackathon Demo Mode
          </span>
          <span className="hidden md:inline text-slate-300">
            Quickly test the complete prototype workflow across all 3 user roles:
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <button
            onClick={() => triggerDemoJourney('customer')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              role === 'customer'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50 ring-1 ring-white/30'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Customer Demo</span>
            <span className="lg:hidden">Customer</span>
          </button>

          <button
            onClick={() => triggerDemoJourney('worker')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              role === 'worker'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50 ring-1 ring-white/30'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Worker Demo</span>
            <span className="lg:hidden">Worker</span>
          </button>

          <button
            onClick={() => triggerDemoJourney('cooperative_admin')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              role === 'cooperative_admin'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50 ring-1 ring-white/30'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Co-op Admin</span>
            <span className="lg:hidden">Co-op</span>
          </button>

          <button
            onClick={() => triggerDemoJourney('federation_admin')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              role === 'federation_admin'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50 ring-1 ring-white/30'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Fed Admin</span>
            <span className="lg:hidden">Fed</span>
          </button>

          <button
            onClick={() => triggerDemoJourney('super_admin')}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              role === 'super_admin'
                ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/50 ring-1 ring-white/30'
                : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Super Admin</span>
            <span className="lg:hidden">Super</span>
          </button>
        </div>
      </div>
    </div>
  );
};
