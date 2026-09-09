import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { AlertCircle, Loader2, Lock, Mail, Eye, EyeOff, User, HardHat, ShieldCheck, Phone, CheckCircle2, UserCheck } from 'lucide-react';
import { Role } from '../../types';

export const SignUp: React.FC = () => {
  const { setVerifiedRole, setShowLogin, setAuthView, pendingAction, clearPendingAction } = useAuth();
  const [role, setRole] = useState<Role>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [workerUserId, setWorkerUserId] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Clear error on input change
  React.useEffect(() => {
    setError(null);
  }, [role, email, password, confirmPassword, fullName, phone, workerUserId]);

  const verifyProfilePersistence = async (authId: string, roleTable: string, expectedData: any, maxAttempts = 5) => {
    for (let i = 0; i < maxAttempts; i++) {
      const { data } = await supabase
        .from(roleTable)
        .select('*')
        .eq('auth_user_id', authId)
        .maybeSingle();
        
      if (data) {
        // Validate specific fields to ensure data integrity
        const baseMatch = data.email === expectedData.email && data.full_name === expectedData.full_name;
        if (baseMatch) {
          if (roleTable === 'workers' && data.user_id === expectedData.user_id) {
            return true;
          } else if (roleTable !== 'workers') {
            return true;
          }
        }
      }
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    
    setError(null);
    console.log('[SignUp] Attempt started for role:', role);

    // Validations
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (role === 'worker' && !workerUserId.trim()) {
      setError('Worker User ID is required for workers.');
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
      setError('Password does not meet all requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

      setLoading(true);

    try {
      console.log('[SignUp] Requesting Supabase auth.signUp...');
      // 1. Sign up the user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            role: role
          }
        }
      });
      console.log('[SignUp] Supabase auth.signUp finished.');

      if (authError) {
        console.error('[SignUp] Auth Error:', authError.status, authError.message);
        const errMsg = authError.message.toLowerCase();
        if (errMsg.includes('rate limit') || errMsg.includes('too many requests')) {
          throw new Error('Too many signup attempts were made recently. Please wait a while before trying again.');
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Sign up failed. Please try again.');
      }

      // Supabase typically returns empty identities if user already exists
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }

      // 2. Insert into the specific role table
      const table = role === 'customer' ? 'customers' : role === 'worker' ? 'workers' : 'admins';
      const profileData: any = {
        id: authData.user.id,
        auth_user_id: authData.user.id,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim()
      };
      
      if (role === 'worker') {
        profileData.user_id = workerUserId.trim();
        profileData.skills = ['General Handyman', 'Emergency Repair'];
      }

      const { error: profileError } = await supabase
        .from(table)
        .insert([profileData]);

      if (profileError) {
        console.error('Profile Insert Error:', profileError);
        await supabase.auth.signOut();
        throw new Error('Your account was created, but your Sahakaar profile could not be completed.');
      }

      // 3. Verify persistence
      const isPersisted = await verifyProfilePersistence(authData.user.id, table, profileData);
      if (!isPersisted) {
        await supabase.auth.signOut();
        throw new Error('Profile verification failed. Database insertion could not be confirmed.');
      }

      // Check if email confirmation is required (no session returned)
      if (authData.user && !authData.session) {
        setError('Account created. Please check your email to confirm your account before logging in.');
        setFullName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        return; // Don't proceed to auto-login
      }

      // 4. Success
      setVerifiedRole(role);
      setShowLogin(false);
      
      if (pendingAction) {
        pendingAction();
        clearPendingAction();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign up.');
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
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-900 p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Create Account</h2>
          <p className="text-emerald-200/80 text-sm font-medium">Join Sahakaar today</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">I am signing up as a...</label>
              <div className="grid grid-cols-2 gap-3">
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
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Worker User ID (Conditional) */}
              {role === 'worker' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Worker User ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HardHat className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={workerUserId}
                      onChange={(e) => setWorkerUserId(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter your assigned Worker ID"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              )}

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
                    placeholder="Create a strong password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicators */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className={`text-xs flex items-center gap-1 ${hasMinLength ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>At least 8 characters</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${hasUppercase ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>One uppercase letter</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${hasNumber ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>One number</span>
                    </div>
                    <div className={`text-xs flex items-center gap-1 ${hasSpecialChar ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>One special character</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                      confirmPassword && !passwordsMatch ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Confirm your password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-xs mt-1 font-medium">Passwords do not match.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading || !passwordsMatch || !hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
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
            
            {/* Toggle to Login */}
            <div className="text-center mt-4">
              <p className="text-sm text-slate-600 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors focus:outline-none"
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
