import React from 'react';
import { Worker } from '../../types';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { FairWageCard } from '../common/FairWageCard';
import {
  X,
  Star,
  MapPin,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  FileCheck,
  Calendar,
  ThumbsUp,
  ArrowRight
} from 'lucide-react';

interface WorkerProfileModalProps {
  worker: Worker | null;
  onClose: () => void;
  onBookNow: (worker: Worker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  onClose,
  onBookNow,
}) => {
  if (!worker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header Cover */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 pt-8 rounded-t-3xl relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={worker.photo}
              alt={worker.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-white">{worker.name}</h2>
                <span className="bg-emerald-500/30 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  {worker.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">{worker.bio}</p>
              
              <div className="mt-2">
                <VerifiedBadge cooperativeName={worker.cooperativeName} size="md" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">


          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl text-center border border-slate-200">
            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{worker.rating}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{worker.jobsCompleted} Jobs Done</div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-blue-600" />
                <span>{worker.experienceYears} Yrs</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">Experience</div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{worker.distanceKm} km</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">Distance</div>
            </div>

            <div>
              <div className="text-sm font-extrabold text-emerald-600">🟢 Ready</div>
              <div className="text-[10px] text-slate-500 font-semibold">Availability</div>
            </div>
          </div>

          {/* Cooperative Affiliation Card */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">
                  Cooperative Federation Governance
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ID: {worker.cooperativeId}
              </span>
            </div>

            <div className="text-sm font-bold text-emerald-400 mb-2">
              {worker.cooperativeName}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Membership Verified</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Govt ID Verified</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skills Audited</span>
              </div>
            </div>
          </div>

          {/* Skills Checklist */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2.5">
              Verified Technical Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2">
              Certifications & Qualifications
            </h4>
            <div className="space-y-1.5">
              {worker.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fair Wage Preview */}
          <div>
            <FairWageCard amount={worker.basePrice} title="Worker Fair Wage Protection" showBadges={false} />
          </div>

          {/* Reviews */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center justify-between">
              <span>Customer Reviews ({worker.reviews.length})</span>
              <span className="text-xs font-semibold text-emerald-600">100% Verified Bookings</span>
            </h4>
            
            {worker.reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews written yet.</p>
            ) : (
              <div className="space-y-3">
                {worker.reviews.map(rev => (
                  <div key={rev.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                      <div className="flex items-center text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                    {rev.tags && (
                      <div className="flex gap-1.5 mt-2">
                        {rev.tags.map((t, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between gap-4 sticky bottom-0 z-20">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Base Price</span>
            <span className="text-xl font-extrabold text-slate-900">₹{worker.basePrice}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(worker);
            }}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition shadow-xl shadow-emerald-600/30 flex items-center gap-2"
          >
            <span>BOOK THIS WORKER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
