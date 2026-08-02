'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  role: string | null;
  isLoading: boolean;
  logout: () => void;
  login: (token: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for token on initial load
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Route protection logic
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith('/auth');
      const isDashboardRoute = pathname.startsWith('/dashboard');

      if (!token && isDashboardRoute) {
        // Not logged in, trying to access dashboard -> redirect to login
        router.push('/auth/login');
      } else if (token && isAuthRoute) {
        // Logged in, trying to access login page -> redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [token, isLoading, pathname, router]);

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setRole(newRole);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('localRole');
    setToken(null);
    setRole(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
