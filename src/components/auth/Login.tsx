import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, HardHat, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

export const Login: React.FC = () => {
  const { setVerifiedRole, setShowLogin, setAuthView, pendingAction, clearPendingAction } = useAuth();
  const [role, setRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [role, email, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password.length > 128) {
      setError('Password cannot exceed 128 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          throw new Error('Please confirm your email address before logging in.');
        }
        throw new Error('Invalid email or password.');
      }

      if (authData.user) {
        // Verify role
        const table = role === 'customer' ? 'customers' : role === 'worker' ? 'workers' : 'admins';
        const { data: roleData, error: roleError } = await supabase
          .from(table)
          .select('id, auth_user_id, full_name, email')
          .eq('auth_user_id', authData.user.id)
          .maybeSingle();

        if (roleError || !roleData) {
          // Role mismatch
          await supabase.auth.signOut();
          const roleName = role.charAt(0).toUpperCase() + role.slice(1);
          throw new Error(`Your account is not registered as a ${roleName}.`);
        }

        // Success
        setVerifiedRole(role);
        setShowLogin(false);
        
        if (pendingAction) {
          pendingAction();
          clearPendingAction();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowLogin(false);
    clearPendingAction();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900 p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-emerald-200/80 text-sm font-medium">Log in to your Sahakaar account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    role === 'customer' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-bold">Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    role === 'worker' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <HardHat className="w-5 h-5" />
                  <span className="text-xs font-bold">Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    role === 'admin' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold">Admin</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-start gap-2 text-sm font-medium border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full bg-white text-slate-600 font-bold py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            
            {/* Toggle to Sign Up */}
            <div className="text-center mt-4">
              <p className="text-sm text-slate-600 font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('signup')}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors focus:outline-none"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
