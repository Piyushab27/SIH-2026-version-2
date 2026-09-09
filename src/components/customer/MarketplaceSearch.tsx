import React from 'react';
import { Search, Filter, Star, MapPin } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const MarketplaceSearch: React.FC = () => {
  const { searchQuery, setSearchQuery, filterOptions, setFilterOptions, t } = useDemo();

  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row justify-end gap-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Distance Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Max {filterOptions.maxDistance} km
          </span>
          <input
            type="range"
            min="1"
            max="20"
            value={filterOptions.maxDistance}
            onChange={(e) => setFilterOptions({ ...filterOptions, maxDistance: parseInt(e.target.value) })}
            className="w-24 accent-emerald-600"
          />
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Min {filterOptions.minRating}+ 
          </span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filterOptions.minRating}
            onChange={(e) => setFilterOptions({ ...filterOptions, minRating: parseFloat(e.target.value) })}
            className="w-20 accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
