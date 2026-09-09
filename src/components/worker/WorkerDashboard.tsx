import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { WorkerHeader } from './WorkerHeader';
import { WorkerStats } from './WorkerStats';
import { WorkerRequests } from './WorkerRequests';
import { WorkerUpcomingJobs } from './WorkerUpcomingJobs';
import { InteractiveMap } from '../common/InteractiveMap';
import { ChevronRight, Briefcase, DollarSign, Heart, UserCheck, LayoutDashboard } from 'lucide-react';
import { WorkerEarnings } from './WorkerEarnings';
import { WorkerWelfare } from './WorkerWelfare';
import { WorkerProfileEditor } from './WorkerProfileEditor';

export const WorkerDashboard: React.FC = () => {
  const { bookings, updateBookingStatus, activeBookingId, setActiveBookingId } = useDemo();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'earnings' | 'welfare' | 'profile'>('dashboard');

  const activeJob = bookings.find(b => b.id === activeBookingId && b.status !== 'completed' && b.status !== 'cancelled');

  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAcceptJob = async (bookingId: string) => {
    try {
      setIsUpdating(true);
      await updateBookingStatus(bookingId, 'accepted');
      setActiveBookingId(bookingId);
    } catch (error) {
      alert("Unable to accept booking. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  
  const handleAdvanceJobStatus = async () => {
    if (!activeJob) return;
    const flow: Record<string, any> = {
      accepted: 'on_the_way',
      on_the_way: 'arrived',
      arrived: 'in_progress',
      in_progress: 'completed',
    };
    const next = flow[activeJob.status];
    if (next) {
      try {
        setIsUpdating(true);
        await updateBookingStatus(activeJob.id, next);
      } catch (error) {
        alert("Unable to update booking status. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      
      {/* Top Header Banner */}
      <WorkerHeader />

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Earnings</span>
        </button>

        <button
          onClick={() => setActiveTab('welfare')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'welfare'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Welfare & Insurance</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>My Profile</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <WorkerStats />

          {/* Active Job View inside Dashboard */}
          {activeJob && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 rounded-3xl shadow-xl border border-emerald-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Active Job ({activeJob.id})
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      Status: {activeJob.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-white">{activeJob.serviceTitle}</h4>
                  <p className="text-xs text-slate-200 mt-1">
                    Customer: <strong className="text-white">{activeJob.customerName}</strong> ({activeJob.customerAddress})
                  </p>
                  <p className="text-[10px] text-emerald-200 mt-1">Estimated Earnings: <strong className="text-white text-xs">₹{activeJob.wageBreakdown?.workerEarnings}</strong></p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleAdvanceJobStatus}
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-950 flex items-center justify-between min-w-[200px] transition disabled:opacity-50 disabled:cursor-wait"
                  >
                    <span>{activeJob.status === 'accepted' ? 'START NAVIGATION' : activeJob.status === 'on_the_way' ? 'MARK ARRIVED' : activeJob.status === 'arrived' ? 'START SERVICE' : 'MARK COMPLETED'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <InteractiveMap
                customerLocationName="Banjara Hills, Hyderabad"
                workerName="You"
                workerPhoto="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"
                workerCategory="Worker"
                distanceKm={2.1}
                etaMinutes={activeJob.status === 'on_the_way' ? 8 : activeJob.status === 'arrived' ? 0 : 5}
                statusText={`Status: ${activeJob.status.replace('_', ' ').toUpperCase()}`}
                heightClass="h-48"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WorkerRequests onAccept={handleAcceptJob} />
            </div>
            <div className="lg:col-span-1">
              <WorkerUpcomingJobs onViewJob={setActiveBookingId} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
          <p className="text-sm font-bold text-slate-500 py-10">Job History View (Coming Soon)</p>
        </div>
      )}
      {activeTab === 'profile' && <WorkerProfileEditor />}
      {activeTab === 'earnings' && <WorkerEarnings />}
      {activeTab === 'welfare' && <WorkerWelfare />}

    </div>
  );
};
