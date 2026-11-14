'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  role: 'admin' | 'user';
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(() => createClient(), []);

  // Compute actual role and admin status from Supabase user metadata
  const role: 'admin' | 'user' = useMemo(() => {
    const rawRole = user?.app_metadata?.role || user?.user_metadata?.role;
    return rawRole === 'admin' ? 'admin' : 'user';
  }, [user]);

  const isAdmin = role === 'admin';

  // Helper to sync sb-access-token cookie for Express backend compatibility
  const syncAccessCookie = useCallback((accessToken?: string, expiresIn?: number) => {
    if (typeof document === 'undefined') return;
    if (accessToken) {
      const maxAge = expiresIn || 3600;
      document.cookie = `sb-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } else {
      document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax';
    }
  }, []);

  const clearAllAuthCookies = useCallback(() => {
    if (typeof document === 'undefined') return;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('sb-')) {
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
      }
    }
    syncAccessCookie();
  }, [syncAccessCookie]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching auth session:', error);
        }
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.access_token) {
            syncAccessCookie(initialSession.access_token, initialSession.expires_in);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession?.access_token) {
            syncAccessCookie(newSession.access_token, newSession.expires_in);
          }
        } else if (event === 'SIGNED_OUT') {
          clearAllAuthCookies();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, syncAccessCookie, clearAllAuthCookies]);

  // Client-side route protection guard
  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/register';
    const isAdminOnlyPage =
      pathname.startsWith('/doctors') ||
      pathname.startsWith('/patients') ||
      pathname.startsWith('/sessions') ||
      pathname.startsWith('/users');

    if (!user && !isAuthPage) {
      router.replace('/login');
    } else if (user && isAuthPage) {
      router.replace('/dashboard');
    } else if (user && !isAdmin && isAdminOnlyPage) {
      // Normal users are restricted to dashboard only
      router.replace('/dashboard');
    }
  }, [user, isAdmin, isLoading, pathname, router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        syncAccessCookie(data.session.access_token, data.session.expires_in);
      }

      router.replace('/dashboard');
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Login failed unexpectedly. Please try again.';
      return { success: false, error: message };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setIsLoading(false);
        return { success: false, error: data.message || 'Registration failed. Please check your details.' };
      }

      // Automatically sign in the user upon successful registration
      return await login(email, password);
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Registration failed unexpectedly. Please try again.';
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    } finally {
      setUser(null);
      setSession(null);
      clearAllAuthCookies();
      setIsLoading(false);
      router.replace('/login');
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    role,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
