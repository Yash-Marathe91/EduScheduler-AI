'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'faculty' | 'student'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', role);
      }
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-body-md">
      {/* Left Side - Branding / Premium Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-low items-center justify-center overflow-hidden border-r border-outline-variant/30">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-fixed-dim/30 blur-[140px]"></div>
        <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-secondary-fixed-dim/20 blur-[120px]"></div>
        
        <div className="relative z-10 p-8 xl:p-16 w-full max-w-2xl text-left mx-auto">
          <img src="/android-chrome-192x192.png" alt="EduScheduler AI Logo" className="w-24 h-24 rounded-3xl shadow-lg mb-10 shadow-[0_0_20px_rgba(var(--color-primary),0.3)] object-cover bg-white" />
          <h1 className="font-display text-5xl xl:text-6xl font-bold text-on-surface mb-6 leading-[1.15] tracking-tight">
            Next-Generation <br />
            <span className="text-primary">Academic Scheduling</span>
          </h1>
          <p className="font-body-lg text-lg xl:text-xl text-on-surface-variant/90 leading-relaxed">
            Experience the Stitch-inspired intelligent logistics engine. Automatically resolve constraints, optimize room capacity, and generate flawless timetables in seconds.
          </p>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-24 relative bg-surface-container-lowest min-h-[100dvh] lg:min-h-screen overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8 relative z-10 py-10 lg:py-0 my-auto">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <Link href="/" className="lg:hidden inline-flex items-center gap-xs mb-8 hover:opacity-80 transition-opacity">
              <img src="/apple-touch-icon.png" alt="EduScheduler AI Logo" className="w-16 h-16 rounded-2xl shadow-sm object-cover bg-white" />
            </Link>
            <h2 className="font-headline-lg text-3xl sm:text-headline-lg text-on-surface tracking-tight font-bold">
              Welcome Back
            </h2>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
              Sign in to access the SmartSched AI portal
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex p-1 space-x-1 bg-surface-container-low rounded-xl border border-outline-variant/50 w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 min-w-[80px] py-3 sm:py-2.5 text-xs sm:text-sm font-label-md text-label-md rounded-lg transition-all duration-300 ${
                role === 'admin'
                  ? 'bg-surface shadow-sm text-primary border border-outline-variant/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`flex-1 min-w-[80px] py-3 sm:py-2.5 text-xs sm:text-sm font-label-md text-label-md rounded-lg transition-all duration-300 ${
                role === 'faculty'
                  ? 'bg-surface shadow-sm text-primary border border-outline-variant/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 min-w-[80px] py-3 sm:py-2.5 text-xs sm:text-sm font-label-md text-label-md rounded-lg transition-all duration-300 ${
                role === 'student'
                  ? 'bg-surface shadow-sm text-primary border border-outline-variant/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              Student
            </button>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-error-container/50 text-on-error-container p-4 rounded-xl font-body-sm text-body-sm border border-error/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-error" />
                <span className="leading-relaxed text-left">{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface mb-2 font-medium text-left">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 sm:py-4 bg-surface-container-lowest border border-outline-variant placeholder-on-surface-variant/40 text-on-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body-sm transition-all shadow-sm"
                    placeholder={role === 'student' ? 'student@institution.edu' : role === 'faculty' ? 'faculty@institution.edu' : 'admin@institution.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-label-sm text-label-sm text-on-surface font-medium">
                    Password
                  </label>
                  <a href="#" className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full pl-11 pr-4 py-3.5 sm:py-4 bg-surface-container-lowest border border-outline-variant placeholder-on-surface-variant/40 text-on-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-body-sm transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex justify-center items-center gap-2 py-4 sm:py-4.5 px-4 border border-transparent rounded-xl text-on-primary bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-label-md text-label-md sm:text-base transition-all shadow-[0_4px_14px_rgba(var(--color-primary),0.3)] hover:shadow-[0_6px_20px_rgba(var(--color-primary),0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                )}
              </button>
            </div>
            
            <p className="text-center font-body-sm text-xs text-on-surface-variant mt-8 px-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
