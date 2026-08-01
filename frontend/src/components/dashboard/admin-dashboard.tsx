'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Users, GraduationCap, BookOpen, Calendar, MapPin, 
  Sparkles, CheckCircle2, Clock, AlertTriangle, Play, CalendarPlus,
  FileText, Upload, Plus, BarChart3, TrendingUp, Cpu, Server,
  Search, Filter, Send, Bot, Check, ArrowRight
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
    </div>
  );
}
