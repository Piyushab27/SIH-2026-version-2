import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { Navbar } from './components/common/Navbar';
import { CustomerView } from './components/customer/CustomerView';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { CoopAdminDashboard } from './components/admin/CoopAdminDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Handshake, Heart, ShieldCheck, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { role: demoRole } = useDemo();
  const { role: authRole, showLogin, authView, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (showLogin) {
    return authView === 'signup' ? <SignUp /> : <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">

      {/* Main Navbar */}
      <Navbar />

      {/* Dynamic Role View */}
      <main className="flex-1">
        {/* Customer view is public/landing, restricted actions inside it trigger login */}
        {demoRole === 'customer' && <CustomerView />}
        
        {/* Dashboards strictly require authenticated role */}
        {demoRole === 'worker' && <WorkerDashboard />}
        {demoRole === 'cooperative_admin' && <CoopAdminDashboard />}
        {demoRole === 'federation_admin' && <AdminDashboard />}
        {demoRole === 'super_admin' && <SuperAdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <Handshake className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Sahakaar<span className="text-emerald-400">.</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">
                  Skilled hands. Fair work. Stronger communities.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Cooperative Network</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>100% Fair Wage Protected</span>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>© 2026 Sahakaar Labour Cooperative Federation Platform. Built for Hackathon Demo.</p>
            <p className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cooperative Ownership • Digital Payments • AI Matching</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DemoProvider>
        <MainApp />
      </DemoProvider>
    </AuthProvider>
  );
}

export default App;
