import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { ServiceCategory } from '../../types';
import {
  Zap,
  Wrench,
  Hammer,
  Palette,
  Sparkles,
  Heart,
  Car,
  Snowflake,
  Trees,
  Settings
} from 'lucide-react';

interface CategoryDef {
  id: ServiceCategory;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
  badge?: string;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'electrician', label: 'Electrician', sublabel: 'Wiring, Fans, Breakers', icon: Zap, colorBg: 'bg-amber-100', colorText: 'text-amber-700', badge: 'High Demand' },
  { id: 'plumber', label: 'Plumber', sublabel: 'Leaks, Taps, Tanks', icon: Wrench, colorBg: 'bg-blue-100', colorText: 'text-blue-700' },
  { id: 'ac_technician', label: 'AC Technician', sublabel: 'Servicing & Gas Refill', icon: Snowflake, colorBg: 'bg-sky-100', colorText: 'text-sky-700', badge: 'Popular' },
  { id: 'cleaner', label: 'Cleaner & Helper', sublabel: 'Deep Sanitation & Care', icon: Sparkles, colorBg: 'bg-emerald-100', colorText: 'text-emerald-700' },
  { id: 'carpenter', label: 'Carpenter', sublabel: 'Doors, Furniture, Fitting', icon: Hammer, colorBg: 'bg-orange-100', colorText: 'text-orange-700' },
  { id: 'painter', label: 'Painter', sublabel: 'Wall Paint & Damp Proof', icon: Palette, colorBg: 'bg-purple-100', colorText: 'text-purple-700' },
  { id: 'caregiver', label: 'Caregiver', sublabel: 'Elderly & Patient Assistance', icon: Heart, colorBg: 'bg-rose-100', colorText: 'text-rose-700' },
  { id: 'driver', label: 'Driver', sublabel: 'City & Outstation Chauffeur', icon: Car, colorBg: 'bg-indigo-100', colorText: 'text-indigo-700' },
  { id: 'appliance_repair', label: 'Appliance Repair', sublabel: 'Fridge, Washing Machine', icon: Settings, colorBg: 'bg-teal-100', colorText: 'text-teal-700' },
  { id: 'gardener', label: 'Gardener', sublabel: 'Terrace & Lawn Care', icon: Trees, colorBg: 'bg-green-100', colorText: 'text-green-700' },
];

import { useEffect, useState } from 'react';
import { getSupabaseServices } from '../../services/supabaseService';

export const ServiceCategories: React.FC = () => {
  const [activeServices, setActiveServices] = useState<any[]>([]);

  useEffect(() => {
    getSupabaseServices().then(res => {
      setActiveServices(res);
    });
  }, []);
  const { 
    selectedCategory, setSelectedCategory,
    selectedCategories, setSelectedCategories,
    isMultiSelectMode, setIsMultiSelectMode
  } = useDemo();

  const handleToggleMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    // Reset selection when switching modes
    setSelectedCategory(null);
    setSelectedCategories([]);
  };

  const handleCategoryClick = (catId: ServiceCategory) => {
    if (isMultiSelectMode) {
      if (selectedCategories.includes(catId)) {
        setSelectedCategories(selectedCategories.filter(id => id !== catId));
      } else {
        setSelectedCategories([...selectedCategories, catId]);
      }
    } else {
      setSelectedCategory(selectedCategory === catId ? null : catId);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  return (
    <section className="pb-6">
      <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
              Explore Services
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-4">
              Cooperative Skilled Trades
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select a service category to view available workers
            </p>
          </div>
          
          {/* Multiselect controls */}
          <div className="flex flex-col items-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isMultiSelectMode} 
                onChange={handleToggleMode}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-sm font-bold text-slate-700">Multi-select services</span>
            </label>
            
            {isMultiSelectMode && selectedCategories.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                  {selectedCategories.length} selected
                </span>
                <button 
                  onClick={handleClearAll}
                  className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {CATEGORIES.map(cat => {
            const IconComponent = cat.icon;
            const isSelected = isMultiSelectMode 
              ? selectedCategories.includes(cat.id)
              : selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 relative group flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/30 transform -translate-y-1'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {cat.badge && !isSelected && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    {cat.badge}
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl ${cat.colorBg} ${cat.colorText} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div>
                  <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                    {cat.sublabel}
                  </p>
                  {isSelected && (
                    <p className="text-[10px] text-emerald-700 font-bold mt-1">
                      Selected ✓
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
