import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Role } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role | null; // Verified role from DB
  loading: boolean;
  
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  authView: 'login' | 'signup';
  setAuthView: (view: 'login' | 'signup') => void;
  
  pendingAction: (() => void) | null;
  requireAuth: (action: () => void) => void;
  clearPendingAction: () => void;
  
  logout: () => Promise<void>;
  setVerifiedRole: (role: Role | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showLogin, setShowLogin] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        verifyRoleOnLoad(session.user.id);
      } else {
        setRole(null);
        localStorage.removeItem('sahakaar_role');
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (!session) {
        setRole(null);
        localStorage.removeItem('sahakaar_role');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyRoleOnLoad = async (userId: string) => {
    try {
      const savedRole = localStorage.getItem('sahakaar_role') as Role | null;
      let verifiedRole: Role | null = null;

      if (savedRole) {
        const table = savedRole === 'customer' ? 'customers' : savedRole === 'worker' ? 'workers' : 'admins';
        const { data, error } = await supabase.from(table).select('id, auth_user_id').eq('auth_user_id', userId).maybeSingle();
        if (!error && data) {
          verifiedRole = savedRole;
        }
      }

      if (verifiedRole) {
        setRole(verifiedRole);
      } else {
        // Fallback: Check all 3 roles
        let res = await supabase.from('customers').select('id, auth_user_id').eq('auth_user_id', userId).maybeSingle();
        if (!res.error && res.data) verifiedRole = 'customer';
        else {
          res = await supabase.from('workers').select('id, auth_user_id').eq('auth_user_id', userId).maybeSingle();
          if (!res.error && res.data) verifiedRole = 'worker';
          else {
            res = await supabase.from('admins').select('id, auth_user_id, full_name, email').eq('auth_user_id', userId).maybeSingle();
            if (!res.error && res.data) verifiedRole = 'admin';
          }
        }
        
        if (verifiedRole) {
          setRole(verifiedRole);
          localStorage.setItem('sahakaar_role', verifiedRole);
        } else {
          // No valid role found in database
          console.warn('Authenticated user has no matching profile in database.');
          await supabase.auth.signOut();
          setRole(null);
          localStorage.removeItem('sahakaar_role');
          setShowLogin(true); // Force them back to login
        }
      }
    } catch (e) {
      console.error('Error verifying role:', e);
    } finally {
      setLoading(false);
    }
  };

  const requireAuth = (action: () => void) => {
    if (user && role) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLogin(true);
    }
  };

  const clearPendingAction = () => {
    setPendingAction(null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    localStorage.removeItem('sahakaar_role');
    setShowLogin(true); // Always return to login on logout
  };

  const setVerifiedRole = (newRole: Role | null) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem('sahakaar_role', newRole);
    } else {
      localStorage.removeItem('sahakaar_role');
    }
  };

  return (
    <AuthContext.Provider value={{
      session, user, role, loading,
      showLogin, setShowLogin,
      authView, setAuthView,
      pendingAction, requireAuth, clearPendingAction,
      logout, setVerifiedRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
