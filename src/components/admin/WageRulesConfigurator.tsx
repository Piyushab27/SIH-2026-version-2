import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { FairWageCard } from '../common/FairWageCard';
import { Sliders, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export const WageRulesConfigurator: React.FC = () => {
  const { wageConfig, setWageConfig } = useDemo();

  const handleWorkerPctChange = (val: number) => {
    const remaining = 100 - val;
    const coop = Math.round(remaining * 0.66);
    const welfare = remaining - coop;
    setWageConfig({
      workerPct: val,
      coopPct: coop,
      welfarePct: welfare,
    });
  };

  const handleReset = () => {
    setWageConfig({
      workerPct: 85,
      coopPct: 10,
      welfarePct: 5,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
            Federation Policy Configurator
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Dynamic Wage & Welfare Policy Rules
          </h3>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default (85/10/5)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sliders Control Panel */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
          
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-2">
              <span>Worker Direct Payout %</span>
              <span className="text-emerald-700 font-extrabold text-sm">{wageConfig.workerPct}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={92}
              value={wageConfig.workerPct}
              onChange={e => handleWorkerPctChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-medium block">Cooperative Fee</span>
              <span className="text-lg font-extrabold text-blue-700">{wageConfig.coopPct}%</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 font-medium block">Welfare & Insurance</span>
              <span className="text-lg font-extrabold text-amber-600">{wageConfig.welfarePct}%</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real-time calculation function `calculateFairWage()` activated</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero hidden platform commissions policy enforced</span>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div>
          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Live Platform Payout Simulation
          </h4>
          <FairWageCard
            amount={500}
            workerPct={wageConfig.workerPct}
            coopPct={wageConfig.coopPct}
            welfarePct={wageConfig.welfarePct}
            title="Simulated Payout on ₹500 Customer Booking"
          />
        </div>

      </div>

    </div>
  );
};
