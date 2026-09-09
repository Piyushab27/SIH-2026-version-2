import React from 'react';
import { Heart, Shield, Landmark, CheckCircle2, Info } from 'lucide-react';
import { calculateFairWage } from '../../utils/fairWage';

interface FairWageCardProps {
  amount: number;
  workerPct?: number;
  coopPct?: number;
  welfarePct?: number;
  title?: string;
  showBadges?: boolean;
}

export const FairWageCard: React.FC<FairWageCardProps> = ({
  amount,
  workerPct = 85,
  coopPct = 10,
  welfarePct = 5,
  title = "Transparent Fair Wage Distribution",
  showBadges = true,
}) => {
  const breakdown = calculateFairWage(amount, workerPct, coopPct, welfarePct);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg border border-slate-700/60 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">{title}</h4>
            <p className="text-xs text-slate-400">Worker-owned platform — 100% fair pay transparency</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          Total: ₹{amount}
        </span>
      </div>

      {/* Visual Percentage Bar */}
      <div className="mb-4">
        <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${breakdown.workerPercentage}%` }}
            className="bg-emerald-500 transition-all duration-500"
            title={`Worker Payout (${breakdown.workerPercentage}%)`}
          />
          <div
            style={{ width: `${breakdown.cooperativePercentage}%` }}
            className="bg-blue-500 transition-all duration-500"
            title={`Cooperative Overhead (${breakdown.cooperativePercentage}%)`}
          />
          <div
            style={{ width: `${breakdown.welfarePercentage}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Welfare & Insurance (${breakdown.welfarePercentage}%)`}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 font-medium px-0.5">
          <span className="text-emerald-400 font-semibold">{breakdown.workerPercentage}% Worker</span>
          <span className="text-blue-400 font-semibold">{breakdown.cooperativePercentage}% Cooperative</span>
          <span className="text-amber-400 font-semibold">{breakdown.welfarePercentage}% Welfare</span>
        </div>
      </div>

      {/* Detailed Breakdown List */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Worker Direct Earnings</span>
              <span className="text-[10px] text-slate-400">Guaranteed base income ({breakdown.workerPercentage}%)</span>
            </div>
          </div>
          <span className="font-bold text-sm text-emerald-400">₹{breakdown.workerEarnings}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Cooperative Contribution</span>
              <span className="text-[10px] text-slate-400">Federation operations & support ({breakdown.cooperativePercentage}%)</span>
            </div>
          </div>
          <span className="font-bold text-sm text-blue-400">₹{breakdown.cooperativeContribution}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-slate-200 block">Worker Welfare & Insurance Fund</span>
              <span className="text-[10px] text-slate-400">Health cover, safety & pensions ({breakdown.welfarePercentage}%)</span>
            </div>
          </div>
          <span className="font-bold text-sm text-amber-400">₹{breakdown.welfareContribution}</span>
        </div>
      </div>

      {showBadges && (
        <div className="mt-4 pt-3 border-t border-slate-700/70 grid grid-cols-2 gap-2 text-[11px] text-emerald-300/90 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fair wage protected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero corporate commission</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cooperative owned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Worker welfare enabled</span>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-400 bg-slate-800/40 py-1.5 rounded-lg">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Your service directly empowers cooperative workers & their families</span>
      </div>
    </div>
  );
};
