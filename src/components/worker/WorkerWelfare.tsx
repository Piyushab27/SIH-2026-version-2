import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Heart, ShieldCheck, Award, AlertCircle, BookOpen, Users, CheckCircle2 } from 'lucide-react';

export const WorkerWelfare: React.FC = () => {
  const { workers, activeWorkerId } = useDemo();
  const worker = workers.find(w => w.id === activeWorkerId) || workers[0];
  if (!worker) return null;



  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>WELFARE STATUS: ACTIVE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Cooperative Worker Welfare & Insurance Hub
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Managed by Hyderabad Labour Cooperative Federation
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center">
          <span className="text-xs text-slate-400 block font-medium">Accumulated Welfare Fund</span>
          <span className="text-2xl font-extrabold text-amber-400">₹{worker.welfareFundBalance}</span>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">5% Auto-Deposited Every Job</span>
        </div>
      </div>

      {/* Welfare Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Insurance Cover */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase">
              Active Policy
            </span>
            <h4 className="font-extrabold text-base text-slate-900 mt-1">Group Health & Accident Insurance</h4>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Coverage up to <strong className="text-slate-900 font-bold">{worker.insuranceCoverage}</strong> for worker and immediate family members.
            </p>
          </div>
        </div>

        {/* Emergency Aid */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md uppercase">
              Emergency Fund
            </span>
            <h4 className="font-extrabold text-base text-slate-900 mt-1">Zero-Interest Medical & Emergency Assistance</h4>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Instant 24/7 liquidity loan assistance up to ₹50,000 for medical or family emergencies.
            </p>
          </div>
        </div>



      </div>

    </div>
  );
};
