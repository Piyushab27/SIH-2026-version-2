import React, { useMemo } from 'react';
import { Sparkles, TrendingUp, AlertCircle, MapPin, Zap, Snowflake, Wrench, Sparkle } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

export const AIDemandForecast: React.FC = () => {
  const { bookings } = useDemo();

  const forecasts = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    
    const categoryCounts: Record<string, number> = {};
    bookings.forEach(booking => {
      // Depending on how serviceCategory is named in the real data
      const category = booking.serviceCategory || booking.serviceCategory || 'Other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const totalBookings = bookings.length;

    const colors = [
      { colorBg: 'bg-emerald-100', colorText: 'text-emerald-800' },
      { colorBg: 'bg-sky-100', colorText: 'text-sky-800' },
      { colorBg: 'bg-blue-100', colorText: 'text-blue-800' },
      { colorBg: 'bg-purple-100', colorText: 'text-purple-800' },
      { colorBg: 'bg-slate-100', colorText: 'text-slate-700' },
    ];

    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([trade, count], index) => {
        const percentage = Math.round((count / totalBookings) * 100);
        
        let level = 'LOW';
        if (percentage >= 40) level = 'VERY HIGH';
        else if (percentage >= 20) level = 'HIGH';
        else if (percentage >= 10) level = 'MEDIUM';

        const colorSet = colors[index % colors.length];

        return {
          trade,
          level,
          percentage: `${percentage}%`,
          count,
          ...colorSet
        };
      })
      .slice(0, 5);
  }, [bookings]);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Predictive Analytics</span>
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              Tomorrow's AI Service Demand Forecast
            </h3>
          </div>
        </div>
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Insufficient data for forecast.</p>
          <p className="text-slate-400 text-sm mt-1">We need more bookings to generate predictive insights.</p>
        </div>
      </div>
    );
  }

  const insight1 = forecasts[0];
  const insight2 = forecasts[1];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Predictive Analytics</span>
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Tomorrow's AI Service Demand Forecast
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
          Based on {bookings.length} recent bookings
        </span>
      </div>

      {/* Demand Level Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {forecasts.map(f => (
          <div key={f.trade} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <span className="font-extrabold text-xs text-slate-800 block">{f.trade}</span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${f.colorBg} ${f.colorText}`}>
              {f.level}
            </span>
            <span className="text-xs font-bold text-emerald-600 block mt-1">{f.percentage} Demand</span>
          </div>
        ))}
      </div>

      {/* Key AI Insights Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {insight1 && (
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-sky-900 block">AI Demand Insight #1</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-0.5">
                  "{insight1.trade} demand makes up <strong className="text-sky-900 font-bold">{insight1.percentage}</strong> of total volume. Consider allocating more workers to this category."
                </p>
              </div>
            </div>
            <button className="w-full mt-2 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
              Send Alert to Workers
            </button>
          </div>
        )}

        {insight2 && (
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-blue-900 block">AI Distribution Insight #2</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-0.5">
                  "{insight2.trade} is the second highest requested service. Active requests currently stand at <strong className="text-blue-900 font-bold">{insight2.count}</strong>."
                </p>
              </div>
            </div>
            <button className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm">
              Optimize Coverage
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
