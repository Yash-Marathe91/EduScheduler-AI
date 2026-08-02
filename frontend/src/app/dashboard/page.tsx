'use client';

import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {role === 'admin' && <AdminDashboard />}
      
      {role === 'faculty' && (
        <div className="p-8">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Faculty Dashboard</h2>
          <p className="text-on-surface-variant mt-2">Welcome to the faculty portal. Check your schedule below.</p>
        </div>
      )}
      
      {(role === 'student' || role === null) && <StudentDashboard />}
    </div>
  );
}
