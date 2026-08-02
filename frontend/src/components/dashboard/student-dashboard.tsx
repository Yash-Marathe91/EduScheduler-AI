'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, MapPin, Bell, Play,
  Users, CheckCircle2, ArrowRight, GraduationCap, Building2,
  CalendarDays
} from 'lucide-react';
import gsap from 'gsap';

export function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".student-kpi-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
    );
    gsap.fromTo(
      ".student-hero-content",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-primary/10 via-surface to-secondary/10 rounded-3xl p-8 border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-secondary/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 student-hero-content">
          <h2 className="text-4xl font-display font-bold text-on-surface mb-2 tracking-tight">Good Morning, Student</h2>
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant mb-6">
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <Calendar size={16} className="text-primary"/> {formatDate(currentTime)}
            </span>
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <Clock size={16} className="text-secondary"/> {formatTime(currentTime)}
            </span>
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <GraduationCap size={16} className="text-tertiary"/> 2025-26
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-surface text-on-surface px-4 py-2 rounded-xl text-sm font-bold border border-outline-variant/30 shadow-sm flex items-center gap-2">
              <Building2 size={16} className="text-on-surface-variant"/> Computer Science
            </span>
            <span className="bg-surface text-on-surface px-4 py-2 rounded-xl text-sm font-bold border border-outline-variant/30 shadow-sm">
              Semester V
            </span>
            <span className="bg-surface text-on-surface px-4 py-2 rounded-xl text-sm font-bold border border-outline-variant/30 shadow-sm">
              Division A
            </span>
            <span className="bg-surface text-on-surface px-4 py-2 rounded-xl text-sm font-bold border border-outline-variant/30 shadow-sm">
              Batch A1
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* QUICK SUMMARY CARDS */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><BookOpen size={20} className="text-primary"/> Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Today's Lectures", value: '4', icon: CalendarDays, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Next Lecture', value: '11:00 AM', icon: Play, color: 'text-success', bg: 'bg-success/10' },
              { label: 'Current Room', value: 'Rm 304', icon: MapPin, color: 'text-secondary', bg: 'bg-secondary/10' },
              { label: 'Total Subjects', value: '6', icon: BookOpen, color: 'text-on-surface', bg: 'bg-surface-container' },
              { label: 'Practicals Today', value: '1', icon: Users, color: 'text-tertiary', bg: 'bg-tertiary/10' },
              { label: 'Active Notices', value: '2', icon: Bell, color: 'text-error', bg: 'bg-error/10' },
            ].map((stat, i) => (
              <div key={i} className="student-kpi-card bg-surface border border-outline-variant/30 p-4 rounded-2xl flex flex-col hover:border-primary/40 transition-colors cursor-pointer group">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={18} />
                </div>
                <p className="text-2xl font-bold text-on-surface leading-none">{stat.value}</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEXT LECTURE CARD */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Play size={20} className="text-secondary"/> Next Lecture</h3>
          <div className="bg-gradient-to-br from-secondary/10 to-surface border border-secondary/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(var(--color-secondary),0.05)] relative overflow-hidden h-[calc(100%-2rem)] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock size={80} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">Starts in 15 mins</span>
                <span className="bg-surface-container text-on-surface-variant text-xs font-bold px-3 py-1 rounded-full border border-outline-variant/30">1 Hr</span>
              </div>

              <h4 className="text-2xl font-bold text-on-surface mb-1">Database Mgmt</h4>
              <p className="text-sm font-medium text-secondary mb-6">Dr. Suresh Patel</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface"><MapPin size={16}/></div>
                  Room 305
                </div>
                <div className="flex items-center gap-3 text-sm text-on-surface-variant font-medium">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface"><Building2 size={16}/></div>
                  Main Building, 3rd Floor
                </div>
              </div>
            </div>

            <button className="w-full relative group bg-surface border border-secondary/30 p-3 rounded-xl hover:border-secondary/50 transition-all flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-secondary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-bold text-sm text-secondary flex items-center gap-2">View Classroom <ArrowRight size={16}/></span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
