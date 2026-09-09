import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Calendar, Building2, Wrench } from 'lucide-react';

export const FederationReports: React.FC = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [society, setSociety] = useState('All Societies');
  const [service, setService] = useState('All Services');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportGenerating(true);
    setTimeout(() => {
      setReportGenerating(false);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        // Mock download
        const element = document.createElement("a");
        const file = new Blob([`Report Type: ${reportType}\nDate: ${dateRange}\nSociety: ${society}\nService: ${service}\n\n[Mock Report Data - Hackathon Demo]`], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `sahakaar_${reportType}_report.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <h3 className="font-extrabold text-xl text-slate-900 mb-2 flex items-center gap-3">
          <FileText className="w-6 h-6 text-emerald-600" /> Federation Reports
        </h3>
        <p className="text-sm text-slate-500 mb-8">Generate and download comprehensive data reports across the cooperative network.</p>
        
        {reportSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-2xl mb-2">Report Generated!</h4>
            <p className="text-base text-slate-500">Your report download will begin shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleGenerateReport} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Report Type *</label>
                <select 
                  value={reportType} 
                  onChange={e => setReportType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-slate-50"
                >
                  <option value="performance">Society Performance Report</option>
                  <option value="workers">Worker Performance Report</option>
                  <option value="bookings">Booking & Service Report</option>
                  <option value="revenue">Revenue & Welfare Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Date Range</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={dateRange} onChange={e => setDateRange(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-slate-50"
                  >
                    <option>Today</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Quarter</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Target Society</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={society} onChange={e => setSociety(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-slate-50"
                  >
                    <option>All Societies</option>
                    <option>Hyderabad Co-op</option>
                    <option>Secunderabad United</option>
                    <option>Warangal Federation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Service Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Wrench className="w-4 h-4 text-slate-400" />
                  </div>
                  <select 
                    value={service} onChange={e => setService(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-slate-50"
                  >
                    <option>All Services</option>
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>AC Technician</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button disabled={reportGenerating} type="submit" className="w-full sm:w-auto px-8 py-3 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait">
                {reportGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Generate & Download
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
