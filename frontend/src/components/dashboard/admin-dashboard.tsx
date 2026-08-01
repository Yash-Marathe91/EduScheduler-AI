'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Users, GraduationCap, BookOpen, Calendar, MapPin, 
  Sparkles, CheckCircle2, Clock, AlertTriangle, Play, CalendarPlus,
  FileText, Upload, Plus, BarChart3, TrendingUp, Cpu, Server
} from 'lucide-react';
import gsap from 'gsap';

export function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".admin-kpi-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
    );
    gsap.fromTo(
      ".admin-hero-content",
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
      <div className="relative bg-gradient-to-br from-primary/10 via-surface to-tertiary/10 rounded-3xl p-8 border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-tertiary/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 admin-hero-content">
          <h2 className="text-4xl font-display font-bold text-on-surface mb-2 tracking-tight">Good Morning, Administrator</h2>
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant mb-8">
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <Calendar size={16} className="text-primary"/> {formatDate(currentTime)}
            </span>
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <Clock size={16} className="text-tertiary"/> {formatTime(currentTime)}
            </span>
            <span className="flex items-center gap-2 bg-surface/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/30 text-sm font-medium">
              <BookOpen size={16} className="text-secondary"/> Semester V (2025-26)
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="group relative flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <Sparkles size={18} /> Generate Timetable
            </button>
            <button className="flex items-center gap-2 bg-surface text-on-surface border border-outline-variant/50 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container hover:border-outline-variant transition-all">
              <Upload size={18} className="text-on-surface-variant"/> Upload Documents
            </button>
            <button className="flex items-center gap-2 bg-surface text-on-surface border border-outline-variant/50 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container hover:border-outline-variant transition-all">
              <FileText size={18} className="text-on-surface-variant"/> Publish Notice
            </button>
            <button className="flex items-center gap-2 bg-surface text-on-surface border border-outline-variant/50 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container hover:border-outline-variant transition-all">
              <Plus size={18} className="text-on-surface-variant"/> Add Faculty/Student
            </button>
            <button className="flex items-center gap-2 bg-surface text-on-surface border border-outline-variant/50 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container hover:border-outline-variant transition-all">
              <BarChart3 size={18} className="text-on-surface-variant"/> View Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ACADEMIC OVERVIEW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Building2 size={20} className="text-primary"/> Academic Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Departments', value: '8', icon: Building2 },
              { label: 'Faculty', value: '142', icon: Users },
              { label: 'Students', value: '3,450', icon: GraduationCap },
              { label: 'Subjects', value: '64', icon: BookOpen },
              { label: 'Timetables', value: '12', icon: Calendar },
              { label: 'Classrooms', value: '45', icon: MapPin },
              { label: 'Laboratories', value: '22', icon: Cpu },
              { label: 'Sessions', value: '2', icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="admin-kpi-card bg-surface border border-outline-variant/30 p-4 rounded-2xl hover:border-primary/40 transition-colors cursor-pointer group">
                <stat.icon size={20} className="text-on-surface-variant mb-2 group-hover:text-primary transition-colors" />
                <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S STATUS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Play size={20} className="text-tertiary"/> Today's Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Scheduled', value: '184', color: 'text-on-surface' },
              { label: 'Completed', value: '92', color: 'text-success' },
              { label: 'Running', value: '24', color: 'text-primary' },
              { label: 'Upcoming', value: '68', color: 'text-secondary' },
              { label: 'Cancelled', value: '2', color: 'text-error' },
              { label: 'Rescheduled', value: '4', color: 'text-tertiary' },
            ].map((stat, i) => (
              <div key={i} className="admin-kpi-card bg-surface border border-outline-variant/30 p-4 rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FACULTY OVERVIEW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Users size={20} className="text-secondary"/> Faculty Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Present Today', value: '138', sub: '97% Attendance', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
              { label: 'Absent / On Leave', value: '4', sub: '3 Pending Requests', icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10' },
              { label: 'Substitute Requests', value: '12', sub: '8 Assigned', icon: CalendarPlus, color: 'text-tertiary', bg: 'bg-tertiary/10' },
              { label: 'Avg Workload', value: '78%', sub: 'Healthy Distribution', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
            ].map((stat, i) => (
              <div key={i} className="admin-kpi-card bg-surface border border-outline-variant/30 p-5 rounded-2xl flex items-center gap-4 hover:border-outline-variant transition-colors cursor-pointer">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI OVERVIEW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Sparkles size={20} className="text-primary"/> AI Orchestrator</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Timetables Generated', value: '12', icon: Server },
              { label: 'Active AI Tasks', value: '3', icon: Activity },
              { label: 'Conflicts Resolved', value: '48', icon: CheckCircle2 },
              { label: 'Suggestions Pending', value: '5', icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="admin-kpi-card bg-surface border border-outline-variant/30 p-5 rounded-2xl flex flex-col justify-between hover:border-primary/40 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <stat.icon size={24} className="text-primary/70 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
