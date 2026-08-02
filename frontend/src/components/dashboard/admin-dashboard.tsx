'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Users, GraduationCap, BookOpen, Calendar, MapPin, 
  Sparkles, CheckCircle2, Clock, AlertTriangle, Play, CalendarPlus,
  FileText, Upload, Plus, BarChart3, TrendingUp, Cpu, Server,
  Search, Filter, Send, Bot, Check, ArrowRight, AlertOctagon, 
  MessageSquare, CalendarDays, Activity, FileBarChart, BellRing, X,
  Database, Wifi, HardDrive, History, PieChart, Download, ShieldCheck, BarChart2
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

      {/* --- PHASE 2 START --- */}
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        
        {/* LEFT COLUMN: TIMETABLE & FACULTY ACTIVITY */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* TODAY'S TIMETABLE OVERVIEW */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><Calendar size={22} className="text-primary"/> Today's Timetable Overview</h3>
                <p className="text-sm text-on-surface-variant mt-1">Real-time monitoring of all active lectures.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-outline-variant/20 transition-colors">
                  <Filter size={16}/> Filter
                </button>
                <button className="flex items-center gap-2 bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-outline-variant/20 transition-colors">
                  <Search size={16}/> Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                    <th className="pb-3 px-2 font-semibold">Time</th>
                    <th className="pb-3 px-2 font-semibold">Subject</th>
                    <th className="pb-3 px-2 font-semibold">Faculty</th>
                    <th className="pb-3 px-2 font-semibold">Room</th>
                    <th className="pb-3 px-2 font-semibold">Dept/Sem</th>
                    <th className="pb-3 px-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { time: '10:00 - 11:00 AM', sub: 'Data Structures', fac: 'Dr. Sharma', room: 'Room 304', dept: 'CSE / Sem III', status: 'Running', color: 'bg-primary/10 text-primary' },
                    { time: '10:00 - 11:00 AM', sub: 'Microprocessors', fac: 'Prof. Verma', room: 'Lab 2', dept: 'ECE / Sem V', status: 'Running', color: 'bg-primary/10 text-primary' },
                    { time: '11:00 - 12:00 PM', sub: 'Database Mgmt', fac: 'Dr. Patel', room: 'Room 305', dept: 'CSE / Sem V', status: 'Next', color: 'bg-tertiary/10 text-tertiary' },
                    { time: '11:00 - 12:00 PM', sub: 'Machine Learning', fac: 'Dr. Gupta', room: 'Smart Class 1', dept: 'AI / Sem VII', status: 'Next', color: 'bg-tertiary/10 text-tertiary' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-on-surface">{row.time}</td>
                      <td className="py-4 px-2 text-on-surface-variant font-medium">{row.sub}</td>
                      <td className="py-4 px-2 flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">{row.fac.charAt(4)}</div> {row.fac}</td>
                      <td className="py-4 px-2 text-on-surface-variant">{row.room}</td>
                      <td className="py-4 px-2 text-on-surface-variant">{row.dept}</td>
                      <td className="py-4 px-2 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors flex items-center justify-center gap-1">
              View Full Timetable <ArrowRight size={16}/>
            </button>
          </div>

          {/* FACULTY ACTIVITY PANEL */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><Users size={22} className="text-secondary"/> Faculty Activity Panel</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                <p className="text-xs text-on-surface-variant uppercase mb-1">Teaching Now</p>
                <p className="text-2xl font-bold text-primary">24</p>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                <p className="text-xs text-on-surface-variant uppercase mb-1">Available Now</p>
                <p className="text-2xl font-bold text-success">114</p>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                <p className="text-xs text-on-surface-variant uppercase mb-1">On Leave</p>
                <p className="text-2xl font-bold text-error">4</p>
              </div>
              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                <p className="text-xs text-on-surface-variant uppercase mb-1">Substitutes Active</p>
                <p className="text-2xl font-bold text-tertiary">3</p>
              </div>
            </div>

            <div className="space-y-3">
               {[
                 { name: 'Dr. Anita Sharma', state: 'Teaching in Room 304', load: '85%', tag: 'High Workload' },
                 { name: 'Prof. Raj Verma', state: 'Teaching in Lab 2', load: '60%', tag: 'Optimal' },
                 { name: 'Dr. Suresh Patel', state: 'Available (Dept Lounge)', load: '40%', tag: 'Low Workload' },
               ].map((fac, i) => (
                 <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">{fac.name.charAt(4)}</div>
                     <div>
                       <p className="font-bold text-sm text-on-surface">{fac.name}</p>
                       <p className="text-xs text-on-surface-variant">{fac.state}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="text-right hidden sm:block">
                       <p className="text-xs text-on-surface-variant uppercase">Workload</p>
                       <p className="font-bold text-sm text-on-surface">{fac.load}</p>
                     </div>
                     <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors">
                       Action
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI COMMAND CENTER & ATTENDANCE */}
        <div className="space-y-8">
          
          {/* AI COMMAND CENTER */}
          <div className="bg-gradient-to-b from-primary/10 to-surface border border-primary/20 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(var(--color-primary),0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-1"><Sparkles size={22} className="text-primary"/> AI Command Center</h3>
              <p className="text-xs text-on-surface-variant mb-6">Orchestrator Status: <span className="text-success font-bold">Online & Active</span></p>

              <div className="bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant/30 p-4 rounded-2xl mb-6">
                <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Latest AI Recommendation</p>
                <div className="flex gap-3">
                  <div className="mt-0.5 text-primary"><Bot size={18}/></div>
                  <div>
                    <p className="text-sm font-medium text-on-surface leading-snug">"I detected a classroom utilization imbalance in the ECE department. Moving 2 lectures to Smart Class 1 can optimize room usage by 14%."</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs bg-primary text-on-primary px-3 py-1 rounded-md font-bold">Accept</button>
                      <button className="text-xs bg-surface text-on-surface-variant border border-outline-variant px-3 py-1 rounded-md">Dismiss</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <button className="w-full flex justify-between items-center bg-surface border border-outline-variant/50 p-3 rounded-xl hover:border-primary/50 hover:shadow-sm transition-all group">
                  <span className="font-medium text-sm text-on-surface">Generate Sem VI Timetable</span>
                  <Play size={16} className="text-primary group-hover:scale-110 transition-transform"/>
                </button>
                <button className="w-full flex justify-between items-center bg-surface border border-outline-variant/50 p-3 rounded-xl hover:border-tertiary/50 hover:shadow-sm transition-all group">
                  <span className="font-medium text-sm text-on-surface">Detect Live Conflicts</span>
                  <AlertTriangle size={16} className="text-tertiary group-hover:scale-110 transition-transform"/>
                </button>
                <button className="w-full flex justify-between items-center bg-surface border border-outline-variant/50 p-3 rounded-xl hover:border-secondary/50 hover:shadow-sm transition-all group">
                  <span className="font-medium text-sm text-on-surface">Find Free Faculty Substitute</span>
                  <Users size={16} className="text-secondary group-hover:scale-110 transition-transform"/>
                </button>
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Optimize ECE Department schedule..." 
                  className="w-full bg-surface border border-primary/30 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity">
                  <Send size={14}/>
                </button>
              </div>
            </div>
          </div>

          {/* ATTENDANCE MONITOR */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><CheckCircle2 size={22} className="text-success"/> Attendance Monitor</h3>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1 p-4 rounded-xl bg-success/10 border border-success/20 text-center">
                <p className="text-3xl font-bold text-success">94%</p>
                <p className="text-xs font-medium text-on-surface uppercase mt-1">Students</p>
              </div>
              <div className="flex-1 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-3xl font-bold text-primary">97%</p>
                <p className="text-xs font-medium text-on-surface uppercase mt-1">Faculty</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase mb-1 text-on-surface-variant">
                   <span>Computer Engg</span>
                   <span className="text-success">96%</span>
                 </div>
                 <div className="w-full bg-surface-container rounded-full h-2">
                   <div className="bg-success h-2 rounded-full" style={{ width: '96%' }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase mb-1 text-on-surface-variant">
                   <span>Mechanical</span>
                   <span className="text-tertiary">89%</span>
                 </div>
                 <div className="w-full bg-surface-container rounded-full h-2">
                   <div className="bg-tertiary h-2 rounded-full" style={{ width: '89%' }}></div>
                 </div>
               </div>
               <div>
                 <div className="flex justify-between text-xs font-bold uppercase mb-1 text-on-surface-variant">
                   <span>Civil Engg</span>
                   <span className="text-error">78%</span>
                 </div>
                 <div className="w-full bg-surface-container rounded-full h-2">
                   <div className="bg-error h-2 rounded-full" style={{ width: '78%' }}></div>
                 </div>
               </div>
            </div>

            <button className="w-full py-2.5 border-2 border-outline-variant/50 rounded-xl text-sm font-bold hover:bg-surface-container transition-colors">
              Mark Manual Attendance
            </button>
          </div>

        </div>
      </div>

      {/* --- PHASE 3 START --- */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pt-4">
        
        {/* CONFLICT CENTER & CLASSROOM MONITOR */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* CONFLICT CENTER */}
          <div className="bg-error/5 border border-error/20 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-error">
              <AlertOctagon size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><AlertOctagon size={22} className="text-error"/> Conflict Center</h3>
                <span className="bg-error text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">3 Live Issues</span>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Faculty Overlap', desc: 'Dr. Patel scheduled in Room 304 and Lab 2 simultaneously at 11:00 AM.', type: 'Critical', color: 'border-error/50 bg-error/10 text-error' },
                  { title: 'Room Double-Booking', desc: 'Smart Class 1 is assigned to CSE-V and ECE-VII at 02:00 PM.', type: 'Critical', color: 'border-error/50 bg-error/10 text-error' },
                  { title: 'Credit Mismatch', desc: 'Semester III Physics is short by 1 practical session this week.', type: 'Warning', color: 'border-tertiary/50 bg-tertiary/10 text-tertiary' },
                ].map((conflict, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-outline-variant/50 bg-surface/80 backdrop-blur-sm hover:shadow-sm transition-all gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${conflict.color}`}>{conflict.type}</span>
                        <h4 className="font-bold text-sm text-on-surface">{conflict.title}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-snug">{conflict.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <Sparkles size={14}/> AI Resolve
                      </button>
                      <button className="text-xs bg-surface-container text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded-lg hover:bg-outline-variant/20 transition-colors">
                        Manual Fix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CLASSROOM MONITOR */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><MapPin size={22} className="text-secondary"/> Classroom & Lab Monitor</h3>
                <button className="text-xs bg-surface-container border border-outline-variant px-3 py-1.5 rounded-lg font-medium hover:bg-outline-variant/20 transition-colors">
                  Assign Room
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                  <p className="text-xs text-on-surface-variant uppercase mb-1">Available</p>
                  <p className="text-2xl font-bold text-success">14</p>
                </div>
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                  <p className="text-xs text-on-surface-variant uppercase mb-1">Occupied</p>
                  <p className="text-2xl font-bold text-primary">28</p>
                </div>
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                  <p className="text-xs text-on-surface-variant uppercase mb-1">Labs in Use</p>
                  <p className="text-2xl font-bold text-secondary">8</p>
                </div>
                <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container">
                  <p className="text-xs text-on-surface-variant uppercase mb-1">Maintenance</p>
                  <p className="text-2xl font-bold text-error">2</p>
                </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
               {[
                 { name: 'Room 301', status: 'Occupied', color: 'bg-primary/10 border-primary/30 text-primary' },
                 { name: 'Room 302', status: 'Available', color: 'bg-success/10 border-success/30 text-success' },
                 { name: 'Room 303', status: 'Occupied', color: 'bg-primary/10 border-primary/30 text-primary' },
                 { name: 'Room 304', status: 'Available', color: 'bg-success/10 border-success/30 text-success' },
                 { name: 'Lab 1', status: 'Occupied', color: 'bg-secondary/10 border-secondary/30 text-secondary' },
                 { name: 'Lab 2', status: 'Maintenance', color: 'bg-error/10 border-error/30 text-error' },
                 { name: 'Smart Class', status: 'Occupied', color: 'bg-primary/10 border-primary/30 text-primary' },
                 { name: 'Auditorium', status: 'Available', color: 'bg-success/10 border-success/30 text-success' },
               ].map((room, i) => (
                 <div key={i} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${room.color}`}>
                   <p className="font-bold text-sm">{room.name}</p>
                   <p className="text-[10px] uppercase font-bold opacity-80 mt-1">{room.status}</p>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LEAVE & NOTICES */}
        <div className="space-y-8">
          
          {/* LEAVE MANAGEMENT */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><CalendarDays size={22} className="text-tertiary"/> Leave Management</h3>
            
            <div className="flex justify-between items-center bg-tertiary/10 border border-tertiary/20 p-4 rounded-xl mb-4">
              <div>
                <p className="text-xs font-bold text-tertiary uppercase">Pending Requests</p>
                <p className="text-2xl font-bold text-on-surface">3</p>
              </div>
              <button className="text-xs bg-tertiary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-tertiary/90 transition-colors">
                Review All
              </button>
            </div>

            <div className="space-y-3">
               {[
                 { name: 'Prof. Raj Verma', type: 'Sick Leave', date: 'Oct 15 - Oct 16' },
                 { name: 'Dr. Anita Sharma', type: 'Casual Leave', date: 'Oct 18' },
               ].map((req, i) => (
                 <div key={i} className="p-3 border border-outline-variant/50 rounded-xl hover:bg-surface-container/50 transition-colors">
                   <p className="text-sm font-bold text-on-surface">{req.name}</p>
                   <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                     <span>{req.type}</span>
                     <span>{req.date}</span>
                   </div>
                   <div className="flex gap-2 mt-3">
                     <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-success/10 text-success border border-success/20 py-1.5 rounded-md font-bold hover:bg-success/20 transition-colors">
                       <Check size={14}/> Approve
                     </button>
                     <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-error/10 text-error border border-error/20 py-1.5 rounded-md font-bold hover:bg-error/20 transition-colors">
                       <X size={14}/> Reject
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* NOTICES & COMMUNICATION */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><BellRing size={22} className="text-primary"/> Notices</h3>
               <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                 <Plus size={16}/>
               </button>
            </div>
            
            <div className="space-y-4">
               {[
                 { title: 'Mid-Semester Exam Schedule', target: 'All Students', time: '2 hours ago' },
                 { title: 'Faculty Meeting (Department)', target: 'CSE Faculty', time: '5 hours ago' },
                 { title: 'Holiday Announcement', target: 'Everyone', time: '1 day ago' },
               ].map((notice, i) => (
                 <div key={i} className="flex gap-3 relative before:absolute before:left-[11px] before:top-8 before:bottom-[-16px] before:w-[2px] before:bg-outline-variant/30 last:before:hidden">
                   <div className="w-6 h-6 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary z-10 ring-4 ring-surface">
                     <MessageSquare size={12}/>
                   </div>
                   <div className="pb-4">
                     <p className="text-sm font-bold text-on-surface">{notice.title}</p>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-bold uppercase bg-surface-container px-2 py-0.5 rounded-md text-on-surface-variant">{notice.target}</span>
                       <span className="text-[10px] text-on-surface-variant">{notice.time}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
            
            <button className="w-full mt-2 py-2 border-2 border-dashed border-outline-variant/50 rounded-xl text-sm font-bold text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors">
              Broadcast New Notice
            </button>
          </div>

        </div>
      </div>

      {/* --- PHASE 4 START --- */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        
        {/* LEFT COLUMN: ANALYTICS & SYSTEM HEALTH */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* ANALYTICS & REPORTS */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><BarChart2 size={22} className="text-primary"/> Analytics & Reports</h3>
              <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors">
                <Download size={16}/> Export All Reports
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-[160px]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-on-surface">Faculty Workload Distribution</p>
                    <p className="text-xs text-on-surface-variant mt-1">Optimization level: <span className="text-success font-bold">92%</span></p>
                  </div>
                  <PieChart size={20} className="text-tertiary"/>
                </div>
                <div className="flex gap-1 h-12 items-end">
                  {/* Fake Bar Chart */}
                  <div className="w-1/6 bg-tertiary/20 rounded-t-sm h-[40%]"></div>
                  <div className="w-1/6 bg-tertiary/40 rounded-t-sm h-[60%]"></div>
                  <div className="w-1/6 bg-tertiary/60 rounded-t-sm h-[80%]"></div>
                  <div className="w-1/6 bg-tertiary/80 rounded-t-sm h-[100%]"></div>
                  <div className="w-1/6 bg-tertiary/60 rounded-t-sm h-[75%]"></div>
                  <div className="w-1/6 bg-tertiary/40 rounded-t-sm h-[50%]"></div>
                </div>
              </div>

              <div className="bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-[160px]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold text-on-surface">AI Optimization History</p>
                    <p className="text-xs text-on-surface-variant mt-1">Conflicts resolved over 7 days</p>
                  </div>
                  <TrendingUp size={20} className="text-primary"/>
                </div>
                <div className="flex gap-2 h-12 items-end">
                  {/* Fake Line/Bar Chart */}
                  <div className="w-1/7 bg-primary/30 rounded-t-sm h-[30%]"></div>
                  <div className="w-1/7 bg-primary/40 rounded-t-sm h-[50%]"></div>
                  <div className="w-1/7 bg-primary/60 rounded-t-sm h-[40%]"></div>
                  <div className="w-1/7 bg-primary/80 rounded-t-sm h-[70%]"></div>
                  <div className="w-1/7 bg-primary/90 rounded-t-sm h-[90%]"></div>
                  <div className="w-1/7 bg-primary rounded-t-sm h-[60%]"></div>
                  <div className="w-1/7 bg-primary/50 rounded-t-sm h-[20%]"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <button className="py-2 border border-outline-variant/50 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container transition-colors flex flex-col items-center justify-center gap-1">
                <FileBarChart size={16} className="text-primary"/> Attendance PDF
              </button>
              <button className="py-2 border border-outline-variant/50 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container transition-colors flex flex-col items-center justify-center gap-1">
                <FileBarChart size={16} className="text-secondary"/> Room Usage CSV
              </button>
              <button className="py-2 border border-outline-variant/50 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container transition-colors flex flex-col items-center justify-center gap-1">
                <FileBarChart size={16} className="text-tertiary"/> Workload Excel
              </button>
              <button className="py-2 border border-outline-variant/50 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-container transition-colors flex flex-col items-center justify-center gap-1">
                <FileBarChart size={16} className="text-error"/> Leave Report
              </button>
            </div>
          </div>

          {/* SYSTEM HEALTH */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><ShieldCheck size={22} className="text-success"/> System Health</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30">
                <div className="p-3 bg-success/20 text-success rounded-xl"><Database size={20}/></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Database</p>
                  <p className="text-lg font-bold text-on-surface">Connected</p>
                  <p className="text-[10px] text-success font-medium">9ms latency</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30">
                <div className="p-3 bg-primary/20 text-primary rounded-xl"><Wifi size={20}/></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">API Services</p>
                  <p className="text-lg font-bold text-on-surface">Operational</p>
                  <p className="text-[10px] text-primary font-medium">99.9% Uptime</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/30">
                <div className="p-3 bg-secondary/20 text-secondary rounded-xl"><Cpu size={20}/></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">AI Engine</p>
                  <p className="text-lg font-bold text-on-surface">Idle</p>
                  <p className="text-[10px] text-secondary font-medium">0 active jobs</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">CPU Usage</span>
                  <span className="text-on-surface">12%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant">Memory Usage (2.4/8 GB)</span>
                  <span className="text-on-surface">30%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5">
                  <div className="bg-secondary h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITIES */}
        <div className="space-y-8">
          
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><History size={22} className="text-on-surface-variant"/> Recent Activities</h3>
            
            <div className="flex-1 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
              
              {[
                { time: '10:42 AM', action: 'Timetable Published', desc: 'Semester V CSE timetable was successfully generated and published by AI.', icon: Calendar, color: 'text-primary bg-primary/10 ring-primary/20' },
                { time: '09:15 AM', action: 'Faculty Added', desc: 'Dr. Ramesh Kumar was added to Mechanical Department.', icon: Users, color: 'text-success bg-success/10 ring-success/20' },
                { time: 'Yesterday', action: 'Leave Approved', desc: 'Prof. Verma\'s sick leave was approved by Super Admin.', icon: CheckCircle2, color: 'text-tertiary bg-tertiary/10 ring-tertiary/20' },
                { time: 'Yesterday', action: 'Reports Downloaded', desc: 'Monthly attendance report exported as PDF.', icon: Download, color: 'text-on-surface-variant bg-surface-container ring-outline-variant/20' },
              ].map((act, i) => (
                <div key={i} className="relative flex items-start justify-between mb-8 group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 shadow-sm z-10 ${act.color}`}>
                      <act.icon size={16}/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{act.action}</p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-snug">{act.desc}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant mt-2 uppercase">{act.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              
            </div>
            
            <button className="w-full mt-4 py-2 border-2 border-outline-variant/50 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-colors">
              View All Logs
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-success"/> EduScheduler AI v2.4.0</span>
          <span className="hidden md:inline-block border-l border-outline-variant/50 h-3"></span>
          <span className="hidden md:inline-flex items-center gap-1.5"><Database size={14}/> Last Sync: 2 mins ago</span>
        </div>
        <p>© 2025 EduScheduler AI. All rights reserved.</p>
      </div>

    </div>
  );
}
