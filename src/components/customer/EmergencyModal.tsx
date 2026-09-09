import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Worker } from '../../types';
import { InteractiveMap } from '../common/InteractiveMap';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { AlertTriangle, X, Zap, Wrench, Snowflake, Lock, Settings, Navigation, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { createEmergencyRequest } from '../../services/supabaseService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEmergency: (worker: Worker) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onConfirmEmergency,
}) => {
  const { workers } = useDemo();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [foundWorkers, setFoundWorkers] = useState<Worker[]>([]);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedTypes([]);
      setIsSearching(false);
      setFoundWorkers([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emergencyTypes = [
    { id: 'electrical', label: '⚡ Electrical Emergency', category: 'electrician', icon: Zap },
    { id: 'plumbing', label: '🔧 Plumbing Leak Emergency', category: 'plumber', icon: Wrench },
    { id: 'ac', label: '❄ AC Cooling Failure', category: 'ac_technician', icon: Snowflake },
    { id: 'appliance', label: '🔩 Appliance Breakdown', category: 'appliance_repair', icon: Settings },
    { id: 'other', label: '🔒 Other Urgent Issue', category: 'carpenter', icon: Lock },
  ];

  const handleToggle = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleStartSearch = () => {
    if (selectedTypes.length === 0) return;
    setIsSearching(true);
    setFoundWorkers([]);

    // Ask for location permission before dispatching
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Success (handled implicitly in tracking)
        },
        () => {
          // Denied (fallback used)
        }
      );
    }

    setTimeout(() => {
      const matchCategories = selectedTypes.map(typeId => emergencyTypes.find(t => t.id === typeId)?.category).filter(Boolean);
      
      const matched = workers.filter(w => w.isAvailable && w.isEmergencyReady && matchCategories.includes(w.category));
      let selectedWorkers = matched.slice(0, 2);
      
      if (selectedWorkers.length < 2) {
        // Fallback to random available workers if not enough exact matches
        const others = workers.filter(w => w.isAvailable && !selectedWorkers.includes(w));
        selectedWorkers = [...selectedWorkers, ...others].slice(0, 2);
      }
      
      setFoundWorkers(selectedWorkers);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="bg-slate-900 border border-red-500/40 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close emergency modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 font-bold shrink-0 shadow-lg shadow-red-950">
            <AlertTriangle className="w-7 h-7 animate-bounce" aria-hidden="true" />
          </div>
          <div>
            <span className="text-red-400 font-extrabold text-xs uppercase tracking-widest bg-red-950/80 border border-red-500/30 px-2.5 py-0.5 rounded-full">
              🚨 Priority Dispatch
            </span>
            <h3 id="emergency-modal-title" className="text-xl font-extrabold text-white mt-1">
              Emergency Service Needed
            </h3>
          </div>
        </div>

        {!foundWorkers.length && !isSearching && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select one or multiple emergency issues. We will dispatch the nearest verified cooperative worker within 8–10 minutes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {emergencyTypes.map(t => {
                const Icon = t.icon;
                const isSel = selectedTypes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => handleToggle(t.id)}
                    className={`p-3.5 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                      isSel
                        ? 'bg-red-950/60 border-red-500 text-white font-bold ring-2 ring-red-500/30 shadow-lg'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSel ? 'border-red-500 bg-red-500 text-white' : 'border-slate-500'}`}>
                      {isSel && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <Icon className={`w-5 h-5 ${isSel ? 'text-red-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400 font-medium mb-3">
                {selectedTypes.length > 0 ? (
                  <span className="text-white">
                    Selected: <span className="font-bold text-red-400">{selectedTypes.length} emergencies</span>
                    <br />
                    • {selectedTypes.map(id => emergencyTypes.find(t => t.id === id)?.label.replace(/.* /, '')).join(', ')}
                  </span>
                ) : (
                  'Select at least one emergency type.'
                )}
              </p>
              <button
                onClick={handleStartSearch}
                disabled={selectedTypes.length === 0}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition flex items-center justify-center gap-2 ${
                  selectedTypes.length > 0 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-900/50 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span>DISPATCH NOW</span>
              </button>
            </div>
          </div>
        )}

        {/* Searching Animated State */}
        {isSearching && (
          <div className="py-8 text-center space-y-6">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-red-500/60 animate-ping delay-200" />
              <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-xl shadow-red-600/50">
                <AlertTriangle className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Searching nearby radar...</h4>
              <p className="text-xs text-slate-400 mt-1">Connecting to Hyderabad Labour Cooperative Network</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 max-w-sm mx-auto space-y-2 text-xs text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> <span>Skill match verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> <span>Worker available right now</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> <span>Identity & Cooperative membership verified</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> <span>Within 2.5 km service radius</span>
              </div>
            </div>
          </div>
        )}

        {/* Worker Results */}
        {foundWorkers.length > 0 && (
          <div className="space-y-4 animate-in fade-in max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  ✓ Emergency Dispatch
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">{foundWorkers.length} nearby verified cooperative workers found</h4>
              </div>
            </div>

            <div className="space-y-3">
              {foundWorkers.map((worker, idx) => (
                <div key={worker.id} className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-600 shrink-0"
                  />
                  <div className="flex-1">
                    <h5 className="font-extrabold text-base text-white">{worker.name}</h5>
                    <p className="text-xs text-slate-400 font-medium">{worker.categoryLabel}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-medium">
                      <span>⭐ {worker.rating}</span>
                      <span>•</span>
                      <span>📍 {worker.distanceKm} km away</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ETA: {Math.floor(worker.distanceKm * 4)} min
                      </span>
                    </div>
                    <div className="mt-2">
                      <VerifiedBadge cooperativeName={worker.cooperativeName} size="sm" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-700 hover:bg-slate-600 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onConfirmEmergency(worker)}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md flex items-center justify-center gap-1"
                    >
                      <span>Select Worker</span>
                      <ShieldCheck className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
