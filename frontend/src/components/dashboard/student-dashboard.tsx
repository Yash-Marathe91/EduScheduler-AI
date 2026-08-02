'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, BookOpen, MapPin, Bell, Play,
  Users, CheckCircle2, ArrowRight, GraduationCap, Building2,
  CalendarDays, Filter, Search, MonitorPlay, Projector, Beaker,
  Info, ShieldCheck, LayoutTemplate, Megaphone, FileText, Download,
  Target, Award, ListChecks, PieChart, Star, Mail, Briefcase
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

      {/* --- PHASE 2 START --- */}
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        
        {/* LEFT COLUMN: TIMETABLES */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* TODAY'S TIMETABLE */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><Calendar size={22} className="text-primary"/> Today's Timetable</h3>
                <p className="text-sm text-on-surface-variant mt-1">Your schedule for {formatDate(currentTime)}.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-outline-variant/20 transition-colors">
                  <Filter size={16}/> Filter
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
                    <th className="pb-3 px-2 font-semibold">Type</th>
                    <th className="pb-3 px-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { time: '09:00 - 10:00 AM', sub: 'Software Engineering', fac: 'Prof. Ramesh', room: 'Room 304', type: 'Theory', status: 'Completed', color: 'bg-success/10 text-success' },
                    { time: '10:00 - 11:00 AM', sub: 'Data Structures', fac: 'Dr. Sharma', room: 'Room 304', type: 'Theory', status: 'Running', color: 'bg-primary/10 text-primary' },
                    { time: '11:00 - 12:00 PM', sub: 'Database Mgmt', fac: 'Dr. Patel', room: 'Room 305', type: 'Theory', status: 'Upcoming', color: 'bg-secondary/10 text-secondary' },
                    { time: '01:00 - 03:00 PM', sub: 'DBMS Lab', fac: 'Dr. Patel', room: 'Lab 2', type: 'Practical', status: 'Upcoming', color: 'bg-secondary/10 text-secondary' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-on-surface">{row.time}</td>
                      <td className="py-4 px-2 text-on-surface font-bold">{row.sub}</td>
                      <td className="py-4 px-2 text-on-surface-variant">{row.fac}</td>
                      <td className="py-4 px-2 text-on-surface-variant">{row.room}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${row.type === 'Practical' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'}`}>
                          {row.type}
                        </span>
                      </td>
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
          </div>

          {/* WEEKLY TIMETABLE OVERVIEW */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><LayoutTemplate size={22} className="text-tertiary"/> Weekly Timetable</h3>
                <button className="text-xs bg-surface-container border border-outline-variant px-3 py-1.5 rounded-lg font-medium hover:bg-outline-variant/20 transition-colors">
                  View Full Week
                </button>
             </div>
             
             <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-on-surface-variant border border-outline-variant/50">
                 <CalendarDays size={24}/>
               </div>
               <p className="text-sm font-bold text-on-surface mb-2">Interactive Weekly View</p>
               <p className="text-xs text-on-surface-variant max-w-sm mb-4">You have read-only access to view the complete weekly matrix for Division A, Batch A1.</p>
               <button className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                 Open Weekly Timetable
               </button>
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CLASSROOM & LAB DETAILS */}
        <div className="space-y-8">
          
          {/* CLASSROOM DETAILS */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-secondary">
              <Building2 size={100} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><MapPin size={22} className="text-secondary"/> Classroom Details</h3>
              
              <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">Currently Assigned</p>
                    <p className="text-2xl font-bold text-on-surface mt-1">Room 304</p>
                  </div>
                  <span className="bg-success text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Occupied</span>
                </div>
                <p className="text-sm text-on-surface-variant">Main Building, 3rd Floor</p>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center p-3 border border-outline-variant/30 rounded-xl bg-surface-container/30">
                   <span className="text-sm text-on-surface-variant flex items-center gap-2"><Users size={16}/> Capacity</span>
                   <span className="text-sm font-bold text-on-surface">60 Students</span>
                 </div>
                 <div className="flex justify-between items-center p-3 border border-outline-variant/30 rounded-xl bg-surface-container/30">
                   <span className="text-sm text-on-surface-variant flex items-center gap-2"><MonitorPlay size={16}/> Smart Board</span>
                   <span className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 size={14}/> Available</span>
                 </div>
                 <div className="flex justify-between items-center p-3 border border-outline-variant/30 rounded-xl bg-surface-container/30">
                   <span className="text-sm text-on-surface-variant flex items-center gap-2"><Projector size={16}/> Projector</span>
                   <span className="text-sm font-bold text-success flex items-center gap-1"><CheckCircle2 size={14}/> Available</span>
                 </div>
              </div>

              <div className="p-3 bg-surface-container border border-outline-variant/50 rounded-xl flex gap-3 text-xs text-on-surface-variant">
                <Info size={16} className="text-primary flex-shrink-0"/>
                <p>Students cannot reserve or modify classrooms. Please contact your department admin for room changes.</p>
              </div>
            </div>
          </div>

          {/* LABORATORY DETAILS */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-6"><Beaker size={22} className="text-tertiary"/> Laboratory Details</h3>
            
            <div className="space-y-4">
               {[
                 { name: 'DBMS Lab (Lab 2)', floor: '2nd Floor, IT Block', equip: '60 High-Perf PCs, Oracle 19c', time: 'Today 01:00 PM' },
               ].map((lab, i) => (
                 <div key={i} className="p-4 border border-outline-variant/50 rounded-2xl bg-surface-container/30">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                       <Beaker size={20}/>
                     </div>
                     <div>
                       <p className="font-bold text-sm text-on-surface">{lab.name}</p>
                       <p className="text-xs text-on-surface-variant">{lab.floor}</p>
                     </div>
                   </div>
                   <div className="space-y-2 mt-4 pt-4 border-t border-outline-variant/30">
                     <div className="flex justify-between text-xs">
                       <span className="text-on-surface-variant">Equipment</span>
                       <span className="font-bold text-on-surface text-right max-w-[140px] truncate">{lab.equip}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                       <span className="text-on-surface-variant">Next Practical</span>
                       <span className="font-bold text-tertiary">{lab.time}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
            
          </div>

        </div>
      </div>

      {/* --- PHASE 3 START --- */}
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        
        {/* LEFT COLUMN: INFORMATION HUB (Notices & Calendar) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* NOTICE BOARD */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-2"><Megaphone size={22} className="text-error"/> Notice Board</h3>
              <button className="text-sm font-bold text-primary hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Mid-Semester Examination Schedule', src: 'Exam Department', date: 'Oct 15', prio: 'High', color: 'border-error/50 bg-error/5' },
                { title: 'Guest Lecture on AI & Robotics', src: 'CSE Department', date: 'Oct 12', prio: 'Normal', color: 'border-outline-variant/50 bg-surface-container' },
                { title: 'Campus Placement Drive: TechCorp', src: 'Placement Cell', date: 'Oct 10', prio: 'High', color: 'border-tertiary/50 bg-tertiary/5' },
              ].map((notice, i) => (
                <div key={i} className={`p-4 border rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow cursor-pointer ${notice.color}`}>
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {notice.prio === 'High' ? <Star size={20} className="text-error fill-error"/> : <FileText size={20} className="text-on-surface-variant"/>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface leading-tight">{notice.title}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-on-surface-variant">
                        <span>{notice.src}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span>{notice.date}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-xs flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-outline-variant/30 font-bold text-on-surface-variant hover:bg-surface-container transition-colors shrink-0">
                    <Download size={14}/> Attachment
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACADEMIC CALENDAR & EVENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6"><Target size={20} className="text-secondary"/> Upcoming Events</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-outline-variant/30">
                {[
                  { date: '20 Oct', title: 'CodeSprint Hackathon', type: 'Tech' },
                  { date: '25 Oct', title: 'Industrial Visit (TCS)', type: 'Visit' },
                  { date: '01 Nov', title: 'Diwali Holidays Begin', type: 'Holiday' },
                ].map((ev, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-surface border-2 border-secondary flex items-center justify-center z-10 shrink-0 mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{ev.title}</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">{ev.date} • {ev.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6"><PieChart size={20} className="text-primary"/> Attendance Summary</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-[12px] border-primary/20">
                  <div className="absolute inset-0 rounded-full border-[12px] border-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 25%)' }}></div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-on-surface">82<span className="text-lg">%</span></span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-on-surface">Overall Attendance</p>
              <p className="text-center text-xs text-on-surface-variant mt-1">104 / 126 Lectures Attended</p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACADEMICS & DIRECTORY */}
        <div className="space-y-8">
          
          {/* SUBJECT DETAILS */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6"><BookOpen size={20} className="text-tertiary"/> Subjects (Semester V)</h3>
            <div className="space-y-3">
              {[
                { code: 'CS301', name: 'Software Engineering', credits: '4' },
                { code: 'CS302', name: 'Database Mgmt Systems', credits: '4' },
                { code: 'CS303', name: 'Computer Networks', credits: '3' },
                { code: 'CS304', name: 'Theory of Computation', credits: '4' },
              ].map((sub, i) => (
                <div key={i} className="p-3 border border-outline-variant/30 rounded-xl bg-surface-container-lowest flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-tertiary">{sub.code}</p>
                    <p className="text-sm font-bold text-on-surface leading-tight mt-0.5">{sub.name}</p>
                  </div>
                  <span className="bg-tertiary/10 text-tertiary text-xs font-bold px-2.5 py-1 rounded-md">{sub.credits} Cr</span>
                </div>
              ))}
            </div>
          </div>

          {/* FACULTY DIRECTORY (Read-Only) */}
          <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-6"><Briefcase size={20} className="text-primary"/> Faculty Directory</h3>
            <div className="space-y-4">
              {[
                { name: 'Dr. Suresh Patel', sub: 'DBMS', cabin: 'Block A, 204' },
                { name: 'Prof. Ramesh Kumar', sub: 'Software Engineering', cabin: 'Block B, 105' },
              ].map((fac, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                    <Users size={18}/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">{fac.name}</p>
                    <p className="text-xs text-on-surface-variant">{fac.sub}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><MapPin size={10}/> {fac.cabin}</span>
                      <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><Mail size={10}/> Contact</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* FOOTER */}
      <div className="mt-8 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-success"/> EduScheduler Student Portal</span>
          <span className="hidden md:inline-block border-l border-outline-variant/50 h-3"></span>
          <span className="hidden md:inline-flex items-center gap-1.5">Read-Only Access</span>
        </div>
        <p>© 2025 EduScheduler AI. All rights reserved.</p>
      </div>

    </div>
  );
}
