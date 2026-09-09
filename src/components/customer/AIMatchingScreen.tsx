import React, { useEffect, useState } from 'react';
import { WorkerWithScore } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { Sparkles, CheckCircle2, ShieldCheck, Navigation, ArrowRight } from 'lucide-react';

interface AIMatchingScreenProps {
  matchedWorker: WorkerWithScore;
  onConfirmMatch: () => void;
}

export const AIMatchingScreen: React.FC<AIMatchingScreenProps> = ({
  matchedWorker,
  onConfirmMatch,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const checkSteps = [
    'Matching technical skill requirements...',
    'Calculating geo-distance & travel route...',
    'Checking real-time worker availability...',
    'Evaluating current workload & rating...',
    'Verifying cooperative membership status...',
  ];

  useEffect(() => {
    if (stepIndex < checkSteps.length) {
      const timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setIsDone(true);
    }
  }, [stepIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 text-white animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 text-center shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient decoration */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl" />

        {!isDone ? (
          <div className="py-8 space-y-6">
            {/* Animated Radar Pulse */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-emerald-400/60 animate-ping delay-200" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-xl shadow-emerald-950">
                <Sparkles className="w-10 h-10 text-amber-300 animate-spin" />
              </div>
            </div>

            <div>
              <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                AI Smart Match Engine
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">
                Finding the Best Cooperative Worker...
              </h3>
            </div>

            {/* Step Checkpoints */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 max-w-sm mx-auto space-y-2.5 text-xs text-left">
              {checkSteps.map((stepText, idx) => {
                const isChecked = idx < stepIndex;
                const isCurrent = idx === stepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-all ${
                      isChecked
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-amber-300 font-bold animate-pulse'
                        : 'text-slate-500'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Navigation className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5 animate-in zoom-in-95">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Perfect Match Found!</span>
            </div>

            {/* Matched Worker Hero Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500 p-5 rounded-3xl text-left shadow-2xl relative">
              
              <div className="absolute top-4 right-4 bg-emerald-500 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow">
                AI Match: {matchedWorker.aiMatch.totalScore}%
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={matchedWorker.photo}
                  alt={matchedWorker.name}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <div>
                  <h4 className="text-xl font-extrabold text-white">{matchedWorker.name}</h4>
                  <p className="text-xs text-emerald-400 font-bold">{matchedWorker.categoryLabel}</p>
                  <div className="mt-1">
                    <VerifiedBadge cooperativeName={matchedWorker.cooperativeName} size="sm" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="font-extrabold text-amber-400">⭐ {matchedWorker.rating}</div>
                  <div className="text-[10px] text-slate-400">Rating</div>
                </div>
                <div>
                  <div className="font-extrabold text-white">📍 {matchedWorker.distanceKm} km</div>
                  <div className="text-[10px] text-slate-400">Distance</div>
                </div>
                <div>
                  <div className="font-extrabold text-emerald-400">🟢 Available</div>
                  <div className="text-[10px] text-slate-400">Status</div>
                </div>
              </div>

              <div className="mt-3 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800 text-[11px] text-slate-200">
                <span className="font-bold text-emerald-400">AI Match Rationale: </span>
                "{matchedWorker.aiMatch.reasons[0] || 'Top skill match & available now'}."
              </div>
            </div>

            <button
              onClick={onConfirmMatch}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-xl shadow-emerald-900/50 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>CONFIRM & PROCEED TO TRACKING</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
