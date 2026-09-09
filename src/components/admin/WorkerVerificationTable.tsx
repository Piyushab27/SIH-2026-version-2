import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, CheckCircle2, XCircle, FileText, UserCheck } from 'lucide-react';

export const WorkerVerificationTable: React.FC = () => {
  const { workers, approveWorker, rejectWorker } = useDemo();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
            Federation Governance
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Worker Identity & Skill Verification Queue
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {workers.filter(w => w.verificationStatus === 'verified').length} / {workers.length} Verified
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold border-y border-slate-200">
            <tr>
              <th className="py-3 px-4">Worker Info</th>
              <th className="py-3 px-4">Cooperative Society</th>
              <th className="py-3 px-4">Verification Documents</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {workers.map(w => (
              <tr key={w.id} className="hover:bg-slate-50 transition">
                
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <img src={w.photo} alt={w.name} className="w-10 h-10 rounded-xl object-cover border border-slate-300" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{w.name}</span>
                    <span className="text-slate-500 text-[11px]">{w.categoryLabel} • {w.experienceYears} yrs exp</span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-800 block">{w.cooperativeName}</span>
                  <span className="text-[10px] text-slate-400">ID: {w.cooperativeId}</span>
                </td>

                <td className="py-3.5 px-4">
                  <div className="space-y-0.5 text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>Aadhaar ID Uploaded</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>Trade Cert Confirmed</span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    w.verificationStatus === 'verified'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {w.verificationStatus.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  {w.verificationStatus === 'verified' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1">
                      <ShieldCheck className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => approveWorker(w.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => rejectWorker(w.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        REJECT
                      </button>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
