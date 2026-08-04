'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  isLoading: boolean;
  logout: () => void;
  login: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for role on initial load
    // The actual token is in an HttpOnly cookie, so we infer auth status from the presence of a role
    const storedRole = localStorage.getItem('userRole');

    if (storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Route protection logic
    if (!isLoading) {
      const isAuthRoute = pathname.startsWith('/auth');
      const isDashboardRoute = pathname.startsWith('/dashboard');

      if (!isAuthenticated && isDashboardRoute) {
        // Not logged in, trying to access dashboard -> redirect to login
        router.push('/auth/login');
      } else if (isAuthenticated && isAuthRoute) {
        // Logged in, trying to access login page -> redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = (newRole: string) => {
    localStorage.setItem('userRole', newRole);
    setIsAuthenticated(true);
    setRole(newRole);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error('Logout failed:', e);
    }
    
    localStorage.removeItem('userRole');
    localStorage.removeItem('localRole');
    setIsAuthenticated(false);
    setRole(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, isLoading, login, logout }}>
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
