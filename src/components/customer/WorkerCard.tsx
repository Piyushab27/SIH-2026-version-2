import React from 'react';
import { Worker } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { Star, MapPin, Award, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  onSelectProfile: (worker: Worker) => void;
  onBookNow: (worker: Worker) => void;
  isBestMatch?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onSelectProfile,
  onBookNow,
  isBestMatch = false,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl p-5 transition-all duration-300 border relative flex flex-col justify-between group ${
        isBestMatch
          ? 'border-emerald-500 shadow-2xl ring-2 ring-emerald-500/30'
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-xl'
      }`}
    >
      <div>
        {/* Worker Header: Photo + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={worker.photo}
                alt={worker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                {worker.name}
              </h3>
              <p className="text-xs font-bold text-slate-500">
                {worker.categoryLabel}
              </p>
              <div className="mt-1">
                <VerifiedBadge cooperativeName={worker.cooperativeName} size="sm" status={worker.verificationStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Worker Metrics Strip */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2.5 rounded-2xl text-center my-3 border border-slate-100 text-xs">
          <div>
            <div className="flex items-center justify-center gap-1 font-extrabold text-slate-900">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{worker.rating}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">{worker.jobsCompleted} jobs</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 font-extrabold text-slate-900">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{worker.distanceKm} km</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Distance</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 font-extrabold text-slate-900">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>{worker.experienceYears} yrs</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Experience</div>
          </div>
        </div>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {worker.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg"
            >
              ⚡ {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-lg">
              +{worker.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price & CTAs */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Est. Base Fare</span>
          <span className="text-base font-extrabold text-slate-900">₹{worker.basePrice} <span className="text-xs font-normal text-slate-500">onwards</span></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectProfile(worker)}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            Profile
          </button>

          <button
            onClick={() => onBookNow(worker)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md shadow-emerald-600/20 flex items-center gap-1"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
