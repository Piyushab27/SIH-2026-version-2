import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { Language, Role } from '../../types';
import {
  Handshake,
  MapPin,
  Globe,
  Bell,
  User,
  HardHat,
  CheckCircle2,
  ChevronDown,
  LogOut,
  LogIn,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    language,
    setLanguage,
    t,
    location,
    setLocation,
    notifications,
    markNotificationRead,
    triggerDemoJourney,
    setEmergencyModalOpen
  } = useDemo();
  
  const { user, logout, setShowLogin } = useAuth();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const locations = [
    'Hyderabad (Banjara Hills)',
    'Hyderabad (Gachibowli)',
    'Hyderabad (Secunderabad)',
    'Warangal Central',
    'Vijayawada City',
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="w-[92%] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full whitespace-nowrap py-2 h-16 gap-1 md:gap-2 lg:gap-3">
          
          {/* Sahakaar Brand Logo */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Handshake className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg lg:text-xl tracking-tight text-slate-900">
                  Sahakaar<span className="text-emerald-600">.</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Co-op
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Cooperative Service Marketplace
              </p>
            </div>
          </div>

          {/* Location Selector (Customer view) */}
          {role === 'customer' && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-[11px] lg:text-xs font-semibold text-slate-700 transition border border-slate-200/60"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{location}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showLocationMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Service Location
                  </div>
                  {locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-700 ${
                        location === loc ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{loc}</span>
                      {location === loc && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex-1"></div>

          {/* Right Actions: Language + Notifications + Avatar */}
          <div className="flex items-center gap-1 lg:gap-2">
            
            {/* 1-Tap Emergency Button (Customer Only) */}
            {role === 'customer' && (
              <button
                onClick={() => setEmergencyModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] lg:text-xs font-extrabold transition-all shadow-sm mr-1 lg:mr-2"
              >
                <span className="text-sm">🚨</span>
                <span className="hidden sm:inline">1-Tap Emergency</span>
              </button>
            )}

            {/* 5 Roles Selector */}
            <div className="flex items-center gap-1 mx-1 lg:mx-2">
              {(['customer', 'worker', 'cooperative_admin', 'federation_admin', 'super_admin'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => triggerDemoJourney(r)}
                  className={`px-2 py-1 lg:py-1.5 rounded-lg text-[10px] lg:text-xs font-bold transition-all border ${
                    role === r
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {r === 'customer' ? 'Customer' 
                   : r === 'worker' ? 'Worker Portal' 
                   : r === 'cooperative_admin' ? 'Co-op Admin' 
                   : r === 'federation_admin' ? 'Federation Admin' 
                   : 'Super Admin'}
                </button>
              ))}
            </div>

            {/* User Profile Avatar */}
            <div className="pl-1 lg:pl-2 border-l border-slate-200 flex items-center gap-1 lg:gap-2 relative shrink-0">
              {/* Profile Dropdown (Unconditional for Demo) */}
              <>
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="flex items-center gap-2 text-left hover:bg-slate-50 p-1.5 rounded-xl transition"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-500/40 overflow-hidden shrink-0 flex items-center justify-center">
                    {role === "customer" ? (
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                        alt="Customer Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : role === "worker" ? (
                      <img
                        src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
                        alt="Worker Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <div className="hidden xl:block mr-1">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.user_metadata?.full_name || "Demo User"}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium capitalize flex items-center gap-1">
                      {role === "customer" ? "Customer" : role === "worker" ? "Verified Worker" : "Admin"}
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-3 border-b border-slate-100">
                      <p className="text-sm font-extrabold text-slate-900">{user?.user_metadata?.full_name || "Demo User"}</p>
                      <p className="text-xs text-slate-500 font-medium">{user?.email || "demo@sahakaar.local"}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wide">
                        {role === "worker" ? <HardHat className="w-3 h-3" /> : role === "customer" ? <User className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {role} Account
                      </div>
                    </div>
                  </div>
                )}
              </>

            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
