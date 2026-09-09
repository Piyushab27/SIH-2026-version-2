import { FairWageBreakdown } from '../types';

export function calculateFairWage(
  totalPaid: number,
  workerPct: number = 85,
  coopPct: number = 10,
  welfarePct: number = 5
): FairWageBreakdown {
  const safeTotal = Math.max(0, totalPaid);
  const workerEarnings = Math.round((safeTotal * workerPct) / 100);
  const cooperativeContribution = Math.round((safeTotal * coopPct) / 100);
  const welfareContribution = safeTotal - workerEarnings - cooperativeContribution;

  return {
    totalPaid: safeTotal,
    workerEarnings,
    cooperativeContribution,
    welfareContribution,
    workerPercentage: workerPct,
    cooperativePercentage: coopPct,
    welfarePercentage: welfarePct,
  };
}
