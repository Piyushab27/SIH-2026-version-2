import React, { useState } from 'react';
import { Worker } from '../../types';
import { useDemo } from '../../context/DemoContext';
import { X, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const WorkerAdminModal: React.FC<{
  worker: Worker;
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'profile' | 'manage';
}> = ({ worker, isOpen, onClose, initialTab }) => {
  const { approveWorker, rejectWorker, toggleAvailability, toggleEmergencyReady } = useDemo();
  const [tab, setTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button onClick={() => setTab('profile')} className={`px-4 py-2 rounded-xl text-xs font-bold \${tab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>View Profile</button>
            <button onClick={() => setTab('manage')} className={`px-4 py-2 rounded-xl text-xs font-bold \${tab === 'manage' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Manage Worker</button>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6">
          {tab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src={worker.photo} alt={worker.name} className="w-20 h-20 rounded-2xl object-cover" />
                <div>
                  <h3 className="text-xl font-extrabold">{worker.name}</h3>
                  <p className="text-sm text-slate-500">{worker.bio || 'No bio provided'}</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">{worker.cooperativeName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Skills & Languages</h4>
                  <p className="text-sm font-bold mt-1">{worker.categoryLabel}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {worker.skills?.map(s => <span key={s} className="text-[10px] bg-slate-200 px-2 py-0.5 rounded">{s}</span>)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Performance</h4>
                  <p className="text-sm font-bold mt-1">{worker.rating} Rating</p>
                  <p className="text-sm font-bold">{worker.jobsCompleted} Jobs</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Verification</h4>
                  <p className="text-sm font-bold mt-1 capitalize">{worker.verificationStatus}</p>
                  {worker.certifications?.map(c => <p key={c} className="text-xs text-slate-600">✓ {c}</p>)}
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Welfare & Insurance</h4>
                  <p className="text-sm font-bold mt-1 capitalize">{worker.welfareStatus} (₹{worker.welfareFundBalance})</p>
                  <p className="text-xs text-slate-600">Insurance Active</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'manage' && (
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold">Administrative Controls</h3>
              
              <div className="p-4 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold">Verification Status</h4>
                    <p className="text-xs text-slate-500">Current: {worker.verificationStatus}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveWorker(worker.id)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-200">Approve</button>
                    <button onClick={() => rejectWorker(worker.id)} className="px-3 py-1.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-200">Reject</button>
                  </div>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold">Work Availability</h4>
                    <p className="text-xs text-slate-500">{worker.isAvailable ? 'Available' : 'Offline'}</p>
                  </div>
                  <button onClick={() => toggleAvailability(worker.id)} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200">Toggle</button>
                </div>

                <hr className="border-slate-100" />
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold">Emergency Readiness</h4>
                    <p className="text-xs text-slate-500">{worker.isEmergencyReady ? 'Ready' : 'Not Ready'}</p>
                  </div>
                  <button onClick={() => toggleEmergencyReady(worker.id)} className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200">Toggle</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
