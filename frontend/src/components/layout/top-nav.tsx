'use client';

import { Bell, Search, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function TopNav() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex items-center p-4 border-b h-16 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex w-full justify-end">
        <div className="flex items-center gap-x-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-x-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
