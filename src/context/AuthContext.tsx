// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { db } from '../lib/mockDb';
// import { supabase } from '@/lib/supabase';

// interface AuthUser {
//   email: string;
//   name: string;
//   role: string;
//   loginTime: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   login: (email: string, password: string) => boolean;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);

//   useEffect(() => {
//     const session = db.auth.getSession();
//     if (session) setUser(session);
//   }, []);

//   const login = (email: string, password: string): boolean => {
//     const success = db.auth.login(email, password);
//     if (success) {
//       const session = db.auth.getSession();
//       setUser(session);
//     }
//     return success;
//   };

//   const logout = () => {
//     db.auth.logout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };


import React, {createContext,useContext,useState,useEffect,useCallback,} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// ============================================================
// TYPES
// ============================================================

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// HELPER: Fetch admin profile from admin_users table
// ============================================================

const fetchAdminProfile = async (
  user: User
): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Admin profile not found:', error?.message);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      loginTime: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Unexpected error fetching admin profile:', err);
    return null;
  }
};

// ============================================================
// PROVIDER
// ============================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ----------------------------------------------------------
  // Initialize: Restore session on mount
  // ----------------------------------------------------------
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);

        // Get the current active session
        const {
          data: { session: activeSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (activeSession?.user) {
          setSession(activeSession);
          const profile = await fetchAdminProfile(activeSession.user);
          setUser(profile);
        }
      } catch (err) {
        console.error('Unexpected error during session init:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // ----------------------------------------------------------
    // Listen for auth state changes (login, logout, token refresh)
    // ----------------------------------------------------------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth event:', event);

      if (currentSession?.user) {
        setSession(currentSession);
        const profile = await fetchAdminProfile(currentSession.user);
        setUser(profile);
      } else {
        // Handles: SIGNED_OUT, TOKEN_EXPIRED, USER_DELETED
        setSession(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => subscription.unsubscribe();
  }, []);

  // ----------------------------------------------------------
  // LOGIN
  // ----------------------------------------------------------
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error: string | null }> => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error.message);
          return { success: false, error: error.message };
        }

        if (!data.user || !data.session) {
          return {
            success: false,
            error: 'Login failed. No user or session returned.',
          };
        }

        // Check if user exists in admin_users table
        const profile = await fetchAdminProfile(data.user);

        if (!profile) {
          // Sign out immediately if not an admin
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Access denied. You are not an authorized admin.',
          };
        }

        // Update last_login timestamp
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        setSession(data.session);
        setUser(profile);

        return { success: true, error: null };
      } catch (err) {
        console.error('Unexpected login error:', err);
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ----------------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------------
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
      }
    } catch (err) {
      console.error('Unexpected logout error:', err);
    } finally {
      setSession(null);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // ----------------------------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------------------------
  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user && !!session,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================
// HOOK
// ============================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};