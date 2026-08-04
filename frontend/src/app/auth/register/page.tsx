'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import gsap from 'gsap';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    gsap.fromTo(
      ".register-fade-in",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          full_name: fullName, 
          email, 
          password, 
          role 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed. Please check your details.');
      }

      // Automatically log the newly registered user in
      login(data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans selection:bg-primary/20">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="md:w-1/2 bg-surface-container border-b md:border-b-0 md:border-r border-outline-variant/30 p-8 md:p-16 lg:p-24 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(var(--color-primary),0.15),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(var(--color-secondary),0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 register-fade-in">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-on-primary" size={28} />
            </div>
            <h1 className="text-2xl font-bold font-display text-on-surface tracking-tight">EduScheduler <span className="text-primary">AI</span></h1>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-on-surface leading-tight mb-6">
            Get started with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">smart scheduling</span><br />
            in minutes.
          </h2>
          
          <p className="text-on-surface-variant text-lg max-w-[448px] mb-12">
            Create an account to join your institution's AI workspace, automate class timetables, and manage operations.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
              <CheckCircle2 size={20} className="text-success" /> Instant Role-Based Access Control
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
              <CheckCircle2 size={20} className="text-success" /> Automated timetable clash prevention
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-on-surface">
              <CheckCircle2 size={20} className="text-success" /> Seamless faculty & student portals
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      <div className="md:w-1/2 bg-surface p-8 md:p-16 lg:p-24 flex items-center justify-center relative">
        <div className="w-full max-w-[448px] register-fade-in">
          
          <div className="mb-8 text-center md:text-left">
            <h3 className="text-3xl font-display font-bold text-on-surface mb-2 tracking-tight">Create your account</h3>
            <p className="text-on-surface-variant">Fill in the details below to register.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Account Role</label>
              <div className="grid grid-cols-3 gap-3">
                {['admin', 'faculty', 'student'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 rounded-xl text-sm font-bold capitalize transition-all border-2 ${
                      role === r 
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_4px_12px_rgba(var(--color-primary),0.15)]' 
                        : 'bg-surface-container/30 border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container/80'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container/50 border-2 border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:bg-surface transition-all font-medium"
                  placeholder="Dr. Alex Morgan"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container/50 border-2 border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:bg-surface transition-all font-medium"
                  placeholder="name@institution.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container/50 border-2 border-outline-variant/30 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:bg-surface transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative group bg-primary p-4 rounded-xl transition-all flex items-center justify-center overflow-hidden hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              <span className="relative z-10 font-bold text-on-primary flex items-center gap-2">
                {isLoading ? (
                  <><Loader2 size={20} className="animate-spin" /> Creating Account...</>
                ) : (
                  <>Create Account <ArrowRight size={20}/></>
                )}
              </span>
            </button>
            
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant font-medium">
              Already have an account?{' '}
              <a href="/auth/login" className="font-bold text-primary hover:underline">
                Sign In
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
