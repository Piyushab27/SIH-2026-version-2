import { Worker, AIScoreResult, WorkerWithScore, ServiceCategory } from '../types';

export function calculateAIMatchScore(
  worker: Worker,
  targetCategory: ServiceCategory,
  maxDistanceKm: number = 10,
  searchQuery?: string
): AIScoreResult {
  // 1. Skill Match (30%)
  let skillMatch = 0;
  if (worker.category === targetCategory) {
    skillMatch = 100;
  } else {
    skillMatch = 40;
  }
  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    const matchesSkill = worker.skills.some(s => s.toLowerCase().includes(queryLower));
    if (matchesSkill) skillMatch = Math.min(100, skillMatch + 15);
  }

  // 2. Distance Score (20%) - lower distance = higher score
  const clampedDistance = Math.min(worker.distanceKm, maxDistanceKm);
  const distanceScore = Math.max(0, Math.round(100 - (clampedDistance / maxDistanceKm) * 80));

  // 3. Availability Score (15%)
  const availabilityScore = worker.isAvailable ? 100 : 30;

  // 4. Rating Score (15%) - 5.0 scale normalized to 100
  const ratingScore = Math.round((worker.rating / 5) * 100);

  // 5. Experience Score (10%) - capped at 10 years for max score
  const experienceScore = Math.min(100, Math.round((worker.experienceYears / 10) * 100));

  // 6. Workload Score (10%) - low workload = higher score
  let workloadScore = 100;
  if (worker.currentWorkload === 'medium') workloadScore = 70;
  if (worker.currentWorkload === 'high') workloadScore = 40;

  // Weighted total: 0.30 + 0.20 + 0.15 + 0.15 + 0.10 + 0.10 = 1.00
  const totalScore = Math.round(
    skillMatch * 0.30 +
    distanceScore * 0.20 +
    availabilityScore * 0.15 +
    ratingScore * 0.15 +
    experienceScore * 0.10 +
    workloadScore * 0.10
  );

  // Human-readable reasons
  const reasons: string[] = [];
  if (skillMatch >= 90) reasons.push("Exact skill and specialty match for your request");
  if (worker.distanceKm <= 2.5) reasons.push(`Very close location (${worker.distanceKm} km away)`);
  else if (worker.distanceKm <= 5) reasons.push(`Within quick service radius (${worker.distanceKm} km)`);
  if (worker.isAvailable) reasons.push("🟢 Available right now for immediate dispatch");
  if (worker.rating >= 4.8) reasons.push(`Top-rated cooperative member (${worker.rating} ★)`);
  if (worker.experienceYears >= 5) reasons.push(`${worker.experienceYears}+ years of verified field experience`);
  if (worker.currentWorkload === 'low') reasons.push("Low current workload ensures focused service");

  return {
    totalScore: Math.min(99, Math.max(60, totalScore)),
    breakdown: {
      skillMatch,
      distance: distanceScore,
      availability: availabilityScore,
      rating: ratingScore,
      experience: experienceScore,
      workload: workloadScore,
    },
    reasons,
  };
}

export function rankWorkersByAI(
  workers: Worker[],
  targetCategory: ServiceCategory,
  searchQuery?: string
): WorkerWithScore[] {
  return workers
    .map(worker => ({
      ...worker,
      aiMatch: calculateAIMatchScore(worker, targetCategory, 10, searchQuery),
    }))
    .sort((a, b) => b.aiMatch.totalScore - a.aiMatch.totalScore);
}
