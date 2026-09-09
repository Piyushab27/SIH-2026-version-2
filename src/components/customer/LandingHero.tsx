import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Search, MapPin } from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { searchQuery, setSearchQuery, location } = useDemo();

  return (
    <div className="pt-6 pb-2">
      <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar + Location Box */}
        <div className="mb-6">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
            
            {/* Location Pill */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-slate-700 font-bold text-xs shrink-0 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>📍 {location}</span>
            </div>

            {/* Input Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search services or workers"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

