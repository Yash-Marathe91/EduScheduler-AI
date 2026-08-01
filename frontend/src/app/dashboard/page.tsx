'use client';

import { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/dashboard/admin-dashboard';

export default function DashboardPage() {
  const [localRole, setLocalRole] = useState<string>('student');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setLocalRole(localStorage.getItem('userRole') || 'student');
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="w-full">
      {localRole === 'admin' && <AdminDashboard />}
      
      {/* Placeholders for Faculty and Student dashboards */}
      {localRole === 'faculty' && (
        <div className="p-8">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Faculty Dashboard</h2>
          <p className="text-on-surface-variant mt-2">Welcome to the faculty portal. Check your schedule below.</p>
        </div>
      )}
      
      {localRole === 'student' && (
        <div className="p-8">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Student Dashboard</h2>
          <p className="text-on-surface-variant mt-2">Welcome to the student portal. Your timetable is loading...</p>
        </div>
      )}
    </div>
  );
}
