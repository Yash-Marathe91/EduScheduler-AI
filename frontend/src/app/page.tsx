'use client';

import Link from "next/link";
import { Sparkles, ArrowRight, Brain, LayoutDashboard, Zap, Code, Info } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LandingPage() {
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dynamic Organic Wandering Function for Arrays
      const animateOrganic = (elements: (HTMLDivElement | null)[], isFast: boolean) => {
        elements.forEach(el => {
          if (!el) return;
          const runTween = () => {
            gsap.to(el, {
              x: gsap.utils.random(-300, 300),
              y: gsap.utils.random(-200, 200),
              scale: gsap.utils.random(0.6, 1.4),
              rotation: gsap.utils.random(-90, 90),
              duration: isFast ? gsap.utils.random(6, 12) : gsap.utils.random(15, 25),
              ease: "sine.inOut",
              onComplete: runTween,
            });
          };
          runTween();
        });
      };

      // Start animations
      animateOrganic(blobsRef.current, false);
      animateOrganic(particlesRef.current, true);

      // Hero Entry Animation
      const heroElements = heroRef.current?.querySelectorAll(".animate-hero");
      if (heroElements) {
        gsap.fromTo(
          heroElements,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power4.out", delay: 0.1 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container flex flex-col relative overflow-hidden">
      
      {/* Live Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-background">
        {/* Dynamic Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        {/* Intense Glowing Blobs (Logo Colors) */}
        {[
          { color: '#0056D2', size: '500px', blur: '100px', start: 'top-[5%] left-[10%]' }, // Royal Blue
          { color: '#0B2447', size: '600px', blur: '120px', start: 'top-[40%] right-[-5%]' }, // Deep Navy
          { color: '#38BDF8', size: '450px', blur: '90px', start: 'bottom-[-10%] left-[20%]' }, // Light Cyan
          { color: '#F59E0B', size: '400px', blur: '110px', start: 'top-[15%] right-[25%]' }, // Crest Gold
          { color: '#1E3A8A', size: '550px', blur: '100px', start: 'bottom-[5%] right-[10%]' }, // Muted Blue
        ].map((blob, i) => (
          <div 
            key={`blob-${i}`} 
            ref={el => { blobsRef.current[i] = el; }}
            className={`absolute ${blob.start} rounded-[45%] mix-blend-normal opacity-30`}
            style={{ 
              width: blob.size, 
              height: blob.size, 
              backgroundColor: blob.color,
              filter: `blur(${blob.blur})`
            }}
          ></div>
        ))}
        
        {/* Floating Particles/Nodes */}
        {[
          { color: '#0056D2', size: '1rem', blur: '2px', start: 'top-[20%] left-[15%]' },
          { color: '#F59E0B', size: '1.5rem', blur: '3px', start: 'top-[60%] right-[20%]' },
          { color: '#38BDF8', size: '0.75rem', blur: '1px', start: 'top-[80%] left-[40%]' },
          { color: '#0B2447', size: '2rem', blur: '4px', start: 'top-[30%] right-[40%]' },
          { color: '#0056D2', size: '1.25rem', blur: '2px', start: 'bottom-[20%] right-[30%]' },
          { color: '#F59E0B', size: '0.875rem', blur: '1px', start: 'top-[10%] left-[50%]' },
          { color: '#38BDF8', size: '1.5rem', blur: '3px', start: 'bottom-[30%] left-[10%]' },
        ].map((particle, i) => (
          <div 
            key={`particle-${i}`} 
            ref={el => { particlesRef.current[i] = el; }}
            className={`absolute ${particle.start} rounded-full`}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              filter: `blur(${particle.blur})`,
              boxShadow: `0 0 20px ${particle.color}`,
              opacity: 0.8
            }}
          ></div>
        ))}
      </div>

      {/* Top Navigation */}
      <header className="flex justify-between items-center w-full px-margin-desktop md:px-margin-desktop px-margin-mobile h-20 sticky top-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/50">
        <div className="flex items-center gap-sm">
          <img src="/apple-touch-icon.png" alt="SmartSched AI Logo" className="w-10 h-10 rounded-lg shadow-[0_0_15px_rgba(var(--color-primary),0.3)] object-cover bg-white" />
          <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            SmartSched AI
          </span>
        </div>
        <div className="flex items-center gap-md">
          <a
            href="#about"
            className="hidden md:flex font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            About Project
          </a>
          <Link
            href="/auth/login"
            className="hidden md:flex font-label-md text-label-md text-on-surface hover:text-primary transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/login"
            className="px-md py-xs bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-all shadow-[0_4px_14px_rgba(var(--color-primary),0.3)] hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main ref={heroRef} className="flex-1 flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop text-center py-24 md:py-32 relative z-10">
        <div className="animate-hero inline-flex items-center gap-xs px-sm py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur border border-outline-variant/60 mb-lg shadow-sm">
          <Sparkles className="text-primary w-4 h-4" />
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Intelligent Scheduling Engine v2.0</span>
        </div>
        
        <h1 className="animate-hero font-display text-[44px] md:text-[72px] max-w-5xl leading-[1.1] tracking-tight mb-md font-bold text-on-surface">
          Orchestrate Campus Logistics with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Precision AI</span>
        </h1>
        
        <p className="animate-hero font-body-lg text-body-lg md:text-xl text-on-surface-variant max-w-2xl mb-xl leading-relaxed">
          A premium enterprise SaaS experience for academic scheduling. 
          Resolve constraints, optimize room capacity, and generate flawless timetables in seconds.
        </p>
        
        <div className="animate-hero flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:bg-primary/90 transition-all shadow-[0_8px_25px_rgba(var(--color-primary),0.4)] flex items-center justify-center gap-2 text-lg hover:-translate-y-1"
          >
            Access Portal
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant/80 text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-container-high transition-all shadow-sm flex items-center justify-center text-lg hover:-translate-y-1"
          >
            View Features
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="px-margin-mobile md:px-margin-desktop py-24 bg-surface-container-lowest/50 backdrop-blur-sm border-t border-outline-variant/30 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-[36px] font-bold mb-4 text-on-surface tracking-tight">Designed for Scale and Clarity</h2>
            <p className="font-body-md text-lg text-on-surface-variant max-w-2xl mx-auto">
              Our architecture ensures complex scheduling data remains legible and manageable, radically reducing cognitive load.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant/50 rounded-2xl hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-3">AI Optimization</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Automatically resolves faculty availability, room capacity, and subject credits to produce flawless schedules.
              </p>
            </div>
            
            <div className="p-8 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant/50 rounded-2xl hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-3">Role-Based Views</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Tailored interfaces for Admins, Faculty, and Students. Everyone sees exactly what they need, nothing they don't.
              </p>
            </div>
            
            <div className="p-8 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant/50 rounded-2xl hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
              <div className="w-14 h-14 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-3">Real-Time Sync</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Changes made by administrators are instantly propagated across the entire institutional network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Project Section */}
      <section id="about" className="px-margin-mobile md:px-margin-desktop py-24 bg-surface/60 backdrop-blur-md border-t border-outline-variant/30 relative z-10">
        <div className="max-w-[1000px] mx-auto bg-surface-container-lowest/80 border border-outline-variant/50 rounded-3xl p-8 md:p-16 shadow-lg">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 font-semibold text-sm">
                <Info className="w-4 h-4" /> About the Project
              </div>
              <h2 className="font-display text-[32px] font-bold mb-6 text-on-surface leading-tight">
                EduScheduler AI: The Future of Resource Planning
              </h2>
              <p className="font-body-md text-lg text-on-surface-variant mb-6 leading-relaxed">
                EduScheduler AI was built to solve the NP-hard problem of institutional timetabling. By combining advanced heuristic algorithms with a premium, Stitch-inspired user interface, it provides administrators with unparalleled control over complex academic logistics.
              </p>
              <a 
                href="https://github.com/Yash-Marathe91/EduScheduler-AI" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl font-semibold text-on-surface transition-all hover:shadow-md group"
              >
                <Code className="w-5 h-5 group-hover:text-primary transition-colors" />
                View Repository on GitHub
              </a>
            </div>
            <div className="w-full md:w-[400px] relative aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xl flex items-center justify-center bg-gradient-to-br from-primary/20 via-surface to-secondary/20">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
               <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-outline-variant/50 relative z-10 overflow-hidden">
                 <img src="/android-chrome-512x512.png" alt="Logo" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-md text-center relative z-10">
        <p className="font-body-sm text-sm text-on-surface-variant">
          &copy; {new Date().getFullYear()} SmartSched AI by Yash Marathe. Built for modern institutions.
        </p>
      </footer>
    </div>
  );
}
