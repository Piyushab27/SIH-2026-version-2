import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Camera, CheckCircle2, Languages, Wrench, User } from 'lucide-react';

export const WorkerProfileEditor: React.FC = () => {
  const { workers, activeWorkerId, updateWorkerProfile, toggleAvailability } = useDemo();
  
  const worker = workers.find(w => w.id === activeWorkerId);
  
  const [formData, setFormData] = useState({
    name: worker?.name || '',
    categoryLabel: worker?.categoryLabel || '',
    languages: worker?.languages?.join(', ') || '',
    basePrice: worker?.basePrice || 0,
    about: 'Experienced professional dedicated to quality service.', // Mock about since it's not in the type yet
  });

  const [isSaved, setIsSaved] = useState(false);

  if (!worker) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateWorkerProfile(activeWorkerId, {
        name: formData.name,
        categoryLabel: formData.categoryLabel,
        languages: formData.languages.split(',').map((l: string) => l.trim()),
        basePrice: Number(formData.basePrice),
        bio: formData.about,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-extrabold text-xl text-slate-900">Professional Profile</h3>
          <p className="text-slate-500 text-sm mt-1">Manage your public information and skills</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-600">Available for Work:</span>
          <button 
            onClick={() => toggleAvailability(activeWorkerId)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${worker.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${worker.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Photo and basic info */}
        <div className="col-span-1 flex flex-col items-center space-y-4">
          <div className="relative">
            <img src={worker.photo} alt={worker.name} className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50" />
            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full border border-slate-200 shadow-sm text-emerald-600 hover:bg-emerald-50">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-0.5 rounded-full mb-2">
              <CheckCircle2 className="w-3 h-3" />
              {worker.verificationStatus.toUpperCase()}
            </div>
            <p className="text-xs text-slate-500 font-medium">{worker.cooperativeName}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Professional Title</label>
              <input 
                type="text" 
                name="categoryLabel" 
                value={formData.categoryLabel} 
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Languages className="w-3.5 h-3.5" /> Spoken Languages</label>
              <input 
                type="text" 
                name="languages" 
                value={formData.languages} 
                onChange={handleChange}
                placeholder="English, Hindi, Telugu..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Price / Callout Fee (₹)</label>
              <input 
                type="number" 
                name="basePrice" 
                value={formData.basePrice} 
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">About / Experience</label>
            <textarea 
              name="about" 
              value={formData.about}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave} disabled={isUpdating}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition flex items-center gap-2"
            >
              {isSaved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
