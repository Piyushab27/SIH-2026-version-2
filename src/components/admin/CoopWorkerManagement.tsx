import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Search, Filter, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { WorkerAdminModal } from './WorkerAdminModal';
import { Worker } from '../../types';

export const CoopWorkerManagement: React.FC<{ view: 'list' | 'verification' }> = ({ view }) => {
  const { workers, approveWorker, rejectWorker } = useDemo();
  const coopName = workers[0]?.cooperativeName || 'Hyderabad Labour Cooperative Society';
  const coopWorkers = workers.filter(w => w.cooperativeName === coopName || w.cooperativeId === 'HLCS-2021-089');

  const [searchTerm, setSearchTerm] = useState('');
  const [modalWorker, setModalWorker] = useState<{worker: Worker, tab: 'profile' | 'manage'} | null>(null);

  const displayWorkers = coopWorkers.filter(w => {
    if (view === 'verification') {
      return w.verificationStatus === 'pending';
    }
    return true;
  }).filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search workers by name or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {view === 'verification' && displayWorkers.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <ShieldCheck className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-lg font-extrabold text-slate-900">All Caught Up!</h3>
          <p className="text-sm text-slate-500 mt-1">There are no workers pending verification.</p>
        </div>
      )}

      {view === 'list' && displayWorkers.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">No Workers Found</h3>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {displayWorkers.map(worker => (
          <div key={worker.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={worker.photo} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  worker.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
                }`} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900">{worker.name}</h4>
                  {worker.verificationStatus === 'verified' && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  )}
                  {worker.verificationStatus === 'pending' && (
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="text-xs font-bold text-emerald-600 mb-1">{worker.categoryLabel}</div>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">⭐ {worker.rating}</span>
                  <span>{worker.jobsCompleted} Jobs</span>
                  <span>{worker.experienceYears} Exp</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              {view === 'verification' ? (
                <div className="flex gap-2">
                  <button onClick={() => approveWorker(worker.id)} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 flex items-center justify-center gap-1 transition">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button onClick={() => rejectWorker(worker.id)} className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 transition">
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setModalWorker({ worker, tab: 'profile' })} className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition">View Profile</button>
                  <button onClick={() => setModalWorker({ worker, tab: 'manage' })} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition">Manage</button>
                </div>
              )}
              {worker.isEmergencyReady && (
                <div className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-center uppercase tracking-wider">
                  Emergency Ready
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>

      {modalWorker && (
        <WorkerAdminModal
          worker={modalWorker.worker}
          isOpen={!!modalWorker}
          onClose={() => setModalWorker(null)}
          initialTab={modalWorker.tab}
        />
      )}
    </div>
  );
};
