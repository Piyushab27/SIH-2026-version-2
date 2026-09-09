import React, { useState, useMemo } from 'react';
import { Building2, Plus, Edit2, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const SocietyManagement: React.FC = () => {
  const { workers, bookings } = useDemo();

  const [addedSocieties, setAddedSocieties] = useState<any[]>([]);
  const [toggledStatus, setToggledStatus] = useState<Record<string, string>>({});

  const baseSocieties = useMemo(() => {
    const societiesMap = new Map();

    workers.forEach((w: any) => {
      const cName = w.cooperativeName || 'Independent Workers';
      const cId = w.cooperativeId || 'IND-001';
      
      if (!societiesMap.has(cId)) {
        societiesMap.set(cId, {
          id: cId,
          name: cName,
          regId: cId.startsWith('REG-') ? cId : `REG-${cId}`,
          location: 'Not Specified',
          city: 'Not Specified',
          state: 'Not Specified',
          workers: 0,
          activeBookings: 0,
          totalRating: 0,
          performance: 'N/A',
          status: 'active',
        });
      }
      
      const soc = societiesMap.get(cId);
      soc.workers += 1;
      soc.totalRating += (w.rating || 0);
    });

    bookings.forEach((b: any) => {
      const activeStatuses = ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress'];
      if (activeStatuses.includes(b.status)) {
        const worker = workers.find((w: any) => w.id === b.workerId);
        if (worker) {
          const cId = worker.cooperativeId || 'IND-001';
          const soc = societiesMap.get(cId);
          if (soc) {
            soc.activeBookings += 1;
          }
        }
      }
    });

    return Array.from(societiesMap.values()).map(soc => {
      const avgRating = soc.workers > 0 ? soc.totalRating / soc.workers : 0;
      soc.performance = avgRating === 0 ? 'N/A' : avgRating >= 4.5 ? 'Excellent' : avgRating >= 4.0 ? 'Good' : avgRating >= 3.0 ? 'Average' : 'Poor';
      return soc;
    });
  }, [workers, bookings]);

  const allSocieties = useMemo(() => {
    const combined = [...addedSocieties, ...baseSocieties];
    return combined.map(soc => ({
      ...soc,
      status: toggledStatus[soc.id] || soc.status
    }));
  }, [baseSocieties, addedSocieties, toggledStatus]);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Society Form State
  const [formData, setFormData] = useState({
    name: '', regId: '', location: '', city: '', state: '', contactPerson: '', contactNumber: '', email: '', capacity: '', status: 'active'
  });

  const toggleStatus = (id: string) => {
    setToggledStatus(prev => {
      const current = allSocieties.find(s => s.id === id)?.status || 'active';
      return {
        ...prev,
        [id]: current === 'active' ? 'inactive' : 'active'
      };
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAddModal(false);
      setAddedSocieties([{ 
        id: `S-NEW-${Date.now()}`, 
        name: formData.name, 
        regId: formData.regId,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        workers: parseInt(formData.capacity) || 0, 
        activeBookings: 0,
        performance: 'N/A',
        status: formData.status 
      }, ...addedSocieties]);
      setFormData({ name: '', regId: '', location: '', city: '', state: '', contactPerson: '', contactNumber: '', email: '', capacity: '', status: 'active' });
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Manage Societies</h3>
          <p className="text-xs text-slate-500 font-medium">Manage and monitor all cooperative societies under the federation.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Society</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-sm">Loading Societies...</p>
          </div>
        ) : allSocieties.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500">
            <Building2 className="w-10 h-10 mb-4 opacity-50" />
            <p className="font-bold">No societies found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  <th className="p-4 pl-6">Society</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Workers</th>
                  <th className="p-4 text-center">Active Bookings</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {allSocieties.map((society) => (
                  <tr key={society.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{society.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">ID: {society.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium text-xs">{society.location}, {society.city}</td>
                    <td className="p-4 text-slate-900 font-bold text-center">{society.workers.toLocaleString()}</td>
                    <td className="p-4 text-emerald-700 font-bold text-center">{society.activeBookings}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold ${society.performance === 'Excellent' ? 'text-emerald-600' : society.performance === 'Good' ? 'text-blue-600' : society.performance === 'Average' ? 'text-amber-600' : 'text-slate-600'}`}>
                        {society.performance}
                      </span>
                    </td>
                    <td className="p-4">
                      {society.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                          <AlertCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => toggleStatus(society.id)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition ${society.status === 'active' ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                        >
                          {society.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-xl border border-slate-200 my-8">
            <h3 className="font-extrabold text-lg text-slate-900 mb-6">Add New Cooperative Society</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Society Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Hyderabad Co-op" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration ID *</label>
                  <input required value={formData.regId} onChange={e => setFormData({...formData, regId: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. REG-12345" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Address *</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Central District" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Hyderabad" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                  <input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Telangana" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
                  <input required value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number *</label>
                  <input required value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} type="tel" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Worker Capacity *</label>
                  <input required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} type="number" min="0" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow-sm disabled:opacity-70">
                  {isLoading ? 'Adding...' : 'Add Society'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
