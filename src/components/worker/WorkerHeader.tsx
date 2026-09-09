import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { Power, Star, AlertTriangle } from 'lucide-react';

export const WorkerHeader: React.FC = () => {
  const { workers, activeWorkerId, toggleAvailability, toggleEmergencyReady } = useDemo();
  const worker = workers.find(w => w.id === activeWorkerId) || workers[0];
  if (!worker) return null;

  

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Worker Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <span
              className={`w-4 h-4 rounded-full border-2 border-slate-900 absolute -bottom-1 -right-1 ${
                worker.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
              }`}
            />
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">
              Welcome Back
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">{worker.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-emerald-400/40">
                {worker.categoryLabel}
              </span>
            </div>

            <div className="mt-1">
              <VerifiedBadge cooperativeName={worker.cooperativeName} size="sm" status={worker.verificationStatus} />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 mt-2 font-medium">
              <span className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {worker.rating} Rating
              </span>
              <span>•</span>
              <span>{worker.jobsCompleted} Jobs Completed</span>
              <span>•</span>
              <span className="font-bold">Banjara Hills, Hyderabad</span>
            </div>
          </div>
        </div>

        {/* Availability Toggles */}
        <div className="flex flex-col gap-3 self-end md:self-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-200">WORK STATUS</span>
              <span className="text-[10px] text-slate-400 font-medium">
                {worker.isAvailable ? 'Available for new bookings' : 'Not accepting new bookings'}
              </span>
            </div>
            <button
              onClick={() => toggleAvailability(worker.id)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center min-w-[80px] shadow-lg ${
                worker.isAvailable
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-950'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {worker.isAvailable ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="h-px bg-slate-700/50 w-full" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                EMERGENCY AVAILABILITY
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {worker.isEmergencyReady ? 'Available for emergency dispatch' : 'Emergency dispatch OFF'}
              </span>
            </div>
            <button
              onClick={() => toggleEmergencyReady(worker.id)}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center min-w-[80px] shadow-lg ${
                worker.isEmergencyReady
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {worker.isEmergencyReady ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
