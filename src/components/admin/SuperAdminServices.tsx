import React, { useState, useEffect } from 'react';
import { Settings, Plus, Zap, Wrench, ShieldCheck, AlertCircle, Image, Sparkles, Heart } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { supabase } from '../../lib/supabase';

export const SuperAdminServices: React.FC = () => {
  const { bookings } = useDemo();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('services').select('*');
        if (!error && data && data.length > 0) {
          setServices(data.map((d: any) => ({
            id: d.id,
            name: d.name || d.title || d.category || 'Unknown',
            description: d.description || '',
            basePrice: d.base_price || d.basePrice || 0,
            emergencyEnabled: d.emergency_enabled || d.emergencyEnabled || false,
            status: d.status || 'active',
            icon: d.icon || 'Settings'
          })));
        } else {
          // Fallback to deriving from bookings
          const uniqueCats = Array.from(new Set(bookings.map((b: any) => b.serviceCategory).filter(Boolean)));
          const derived = uniqueCats.map((cat: any) => ({
            id: cat,
            name: cat,
            description: `${cat} services derived from bookings`,
            basePrice: 0,
            emergencyEnabled: false,
            status: 'active',
            icon: 'Settings'
          }));
          setServices(derived);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [bookings]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', description: '', basePrice: '', emergencyEnabled: false, status: 'active'
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setServices([...services, { 
        id: formData.name.toLowerCase().replace(/\s+/g, '-'), 
        name: formData.name, 
        description: formData.description,
        basePrice: parseInt(formData.basePrice) || 0, 
        emergencyEnabled: formData.emergencyEnabled, 
        status: formData.status,
        icon: 'Settings' 
      }]);
      setIsSubmitting(false);
      setShowAddModal(false);
      setFormData({ name: '', description: '', basePrice: '', emergencyEnabled: false, status: 'active' });
    }, 800);
  };

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const getIcon = (iconStr: string) => {
    switch (iconStr) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500" />;
      default: return <Settings className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Global Service Categories</h3>
          <p className="text-xs text-slate-500 font-medium">Manage platform-wide services and baseline pricing.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="p-4 pl-6">Service Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Emergency</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Loading services...</td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No services found.</td>
                </tr>
              ) : services.map((svc) => (
                <tr key={svc.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getIcon(svc.icon)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{svc.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium line-clamp-1">{svc.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-700 font-bold">₹{svc.basePrice}</td>
                  <td className="p-4">
                    {svc.emergencyEnabled ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                        <Zap className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">
                        No
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase ${svc.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {svc.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition">
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(svc.id)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition ${svc.status === 'active' ? 'border-rose-200 text-rose-700 hover:bg-rose-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                        {svc.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900 mb-4">Add New Service Category</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Electrician" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} type="text" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Brief description of service" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Minimum Price (₹) *</label>
                <input required value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} type="number" min="0" className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 450" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Icon Upload</label>
                <div className="w-full px-4 py-4 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <Image className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Click to upload SVG or PNG (Mock)</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 mt-2">
                <div>
                  <span className="block text-sm font-bold text-slate-900">Emergency Enabled</span>
                  <span className="text-[10px] text-slate-500">Allow 1-Tap Emergency dispatch</span>
                </div>
                <div 
                  onClick={() => setFormData({...formData, emergencyEnabled: !formData.emergencyEnabled})}
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition ${formData.emergencyEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${formData.emergencyEnabled ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition disabled:opacity-70 shadow-sm">
                  {isSubmitting ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
