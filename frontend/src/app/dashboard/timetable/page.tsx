'use client';

import { Loader2, Filter, Share, Sparkles, Brain, MapPin, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDepartments } from '@/hooks/use-departments';
import { useSemesters, Semester } from '@/hooks/use-semesters';
import { useGenerateTimetable, useTimetableSlots, useUpdateTimetableSlot } from '@/hooks/use-timetable';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PERIODS = [
  { id: 0, time: '8:10 AM' },
  { id: 1, time: '9:05 AM' },
  { id: 'break', time: '10:00 AM', isBreak: true, label: 'BREAK' },
  { id: 2, time: '10:30 AM' },
  { id: 3, time: '11:25 AM' },
  { id: 'lunch', time: '12:20 PM', isBreak: true, label: 'LUNCH' },
  { id: 4, time: '1:00 PM' },
  { id: 5, time: '1:55 PM' },
];

export default function TimetablePage() {
  const { data: departments } = useDepartments();
  const { data: semesters } = useSemesters();
  const generateTimetable = useGenerateTimetable();
  const { data: slotsData, isLoading, refetch } = useTimetableSlots();
  const updateSlot = useUpdateTimetableSlot();
  
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [schedule, setSchedule] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  
  // Drag and Drop state
  const [dragError, setDragError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole") || "admin");
    }
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slotsData?.schedule) {
      setSchedule(slotsData.schedule);
      
      // Premium GSAP Stagger Entrance for Cards
      gsap.fromTo(
        ".timetable-slot",
        { y: 30, opacity: 0, scale: 0.9, rotationX: -10 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotationX: 0,
          duration: 0.7, 
          stagger: { amount: 0.4, from: "center", grid: "auto" }, 
          ease: "back.out(1.4)",
          overwrite: "auto"
        }
      );
    }
  }, [slotsData]);

  // Initial layout animations
  useEffect(() => {
    gsap.fromTo(
      ".animate-stagger-in",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  const handleGenerate = () => {
    if (!selectedDept || !selectedSemester) return;
    generateTimetable.mutate({
      department_id: selectedDept,
      semester_id: selectedSemester,
      days: 5,
      periods_per_day: 6,
    }, {
      onSuccess: () => {
        refetch(); // Refetch the slots after the AI finishes generating and saving them to the DB
      },
      onError: (err) => {
        console.error("Failed to generate timetable:", err);
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, slotId: string) => {
    e.dataTransfer.setData('text/plain', slotId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, dayOfWeek: number, startTime: number) => {
    e.preventDefault();
    const slotId = e.dataTransfer.getData('text/plain');
    if (!slotId) return;

    setDragError(null);

    // Optimistic update in UI
    const originalSchedule = [...schedule];
    const updatedSchedule = schedule.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, day_of_week: dayOfWeek, start_time: startTime };
      }
      return slot;
    });
    setSchedule(updatedSchedule);

    updateSlot.mutate(
      { slotId, dayOfWeek, startTime },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (err: any) => {
          console.error("Conflict Error:", err);
          // Revert on failure
          setSchedule(originalSchedule);
          setDragError(err.message || 'Conflict: Unable to move lecture.');
          setTimeout(() => setDragError(null), 4000);
        }
      }
    );
  };

  const getSlots = (dayIdx: number, periodIdx: number | string) => {
    if (typeof periodIdx === 'string') return [];
    const daySlots = schedule.filter(s => s.day_of_week === dayIdx && s.start_time === periodIdx);
    
    const mergedSlots: any[] = [];
    const lectureGroups = new Map();
    
    for (const slot of daySlots) {
      if (slot.is_lab) {
        mergedSlots.push(slot);
      } else {
        const key = `${slot.subject_code}-${slot.faculty_name}-${slot.classroom_name}`;
        if (!lectureGroups.has(key)) {
          lectureGroups.set(key, slot);
          mergedSlots.push(slot);
        }
      }
    }
    
    return mergedSlots;
  };

  return (
    <main ref={containerRef} className="flex-1 p-margin-desktop md:p-margin-desktop p-margin-mobile overflow-y-auto">
      <div className="max-w-[1500px] mx-auto h-full flex flex-col gap-lg pb-10">
        {/* Page Header */}
        <div className="animate-stagger-in flex flex-col md:flex-row md:items-center justify-between gap-sm">
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-on-background to-outline">
              Weekly View - TY ECE
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-2">
              <CalendarIcon size={16} />
              Fall Semester 2024
            </p>
          </div>
          <div className="flex gap-sm">
            <button className="group px-md py-sm border border-outline-variant/50 rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-all duration-300 flex items-center gap-2 bg-surface/50 backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <Filter size={18} className="group-hover:text-primary transition-colors" />
              Filter
            </button>
            <button className="group px-md py-sm border border-outline-variant/50 rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-all duration-300 flex items-center gap-2 bg-surface/50 backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-0.5">
              <Share size={18} className="group-hover:text-primary transition-colors" />
              Export
            </button>
          </div>
        </div>

        {/* Main Bento Layout */}
        <div className="flex flex-col xl:flex-row gap-lg flex-1 min-h-[800px] relative">
          
          {dragError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 animate-fade-in font-label-md">
              <span>{dragError}</span>
            </div>
          )}

          {/* Filters Sidebar */}
          <aside className="animate-stagger-in xl:w-80 flex-shrink-0 bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-md flex flex-col gap-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <h3 className="font-headline-sm text-headline-sm text-on-surface border-b border-outline-variant/30 pb-3 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              Configuration
            </h3>
            
            <div className="flex flex-col gap-2 relative z-10">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Target Department</label>
              <select 
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 hover:border-primary/50 shadow-sm"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="" disabled>Select Department</option>
                {departments?.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2 relative z-10">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1">Academic Batch</label>
              <select 
                className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 hover:border-primary/50 shadow-sm"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedDept}
              >
                <option value="" disabled>Select Semester</option>
                {semesters?.filter((s: Semester) => s.department_id === selectedDept).map((s: Semester) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            {role === 'admin' && (
              <>
                {/* Premium Generate Button */}
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading || generateTimetable.isPending}
                  className="group relative mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-fixed-dim hover:to-primary text-on-primary px-4 py-4 rounded-xl font-label-md text-label-md shadow-[0_0_20px_rgba(var(--color-primary),0.3)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(var(--color-primary),0.4)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  {(isLoading || generateTimetable.isPending) ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Brain size={18} className="group-hover:scale-110 transition-transform duration-300" />
                      <span className="tracking-wide font-semibold">Generate Timetable</span>
                    </>
                  )}
                </button>

                <div className="mt-auto pt-md border-t border-outline-variant/30 relative z-10">
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">AI Insights</p>
                  <div className="bg-gradient-to-br from-surface-container-low to-surface-container/50 p-4 rounded-xl border border-outline-variant/30 shadow-inner group hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Brain size={14} className="group-hover:animate-wiggle" />
                      </div>
                      <span className="font-label-sm text-label-sm font-semibold">Optimization Active</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-xs leading-relaxed">
                      Room utilization maximized and hard constraints satisfied. Ready for adjustments.
                    </p>
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Calendar Grid (Bento Item) */}
          <div className="animate-stagger-in flex-1 bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-2xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full relative" ref={gridRef}>
            {schedule.length === 0 && !isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm animate-fade-in">
                <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center shadow-[0_0_40px_rgba(var(--color-primary),0.2)]">
                  <CalendarIcon size={40} className="text-primary opacity-80" />
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">No Schedule Found</h3>
                <p className="text-on-surface-variant text-sm max-w-sm text-center mb-6">
                  Select your parameters and generate a new AI-optimized timetable to get started.
                </p>
                <button 
                  onClick={handleGenerate}
                  className="px-6 py-2 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Generate Now
                </button>
              </div>
            )}
            
            <div className="overflow-x-auto flex-1 flex flex-col relative custom-scrollbar">
              <table className="w-full min-w-[1100px] border-collapse flex-1 flex flex-col relative z-10">
                <thead className="flex w-full sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
                  <tr className="flex w-full">
                    <th className="py-4 px-4 text-center font-label-md text-label-md text-on-surface-variant w-[110px] border-r border-outline-variant/30 flex-shrink-0 flex items-center justify-center font-medium">
                      EST
                    </th>
                    {DAYS.map((day, i) => (
                      <th key={day} className="py-4 px-2 text-center border-r border-outline-variant/30 last:border-0 flex-1 group hover:bg-surface-container/50 transition-colors">
                        <span className="font-label-md text-label-md text-on-surface block font-semibold group-hover:text-primary transition-colors">{day}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant opacity-70 block mt-0.5">{12 + i}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="flex-1 bg-transparent flex flex-col w-full relative">
                  {PERIODS.map((period, index) => {
                    if (period.isBreak) {
                      return (
                        <tr key={period.id} className="flex w-full border-b border-outline-variant/20 bg-surface-container-lowest/40 h-[48px]">
                          <td className="py-2 px-2 text-center w-[110px] border-r border-outline-variant/30 flex-shrink-0 flex items-center justify-center bg-surface-container-lowest/80">
                            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{period.time}</span>
                          </td>
                          <td className="flex-1 py-2 text-center flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.02)_10px,rgba(0,0,0,0.02)_20px)]">
                             <span className="font-label-md text-label-md tracking-[0.3em] text-outline/60 uppercase font-bold">{period.label}</span>
                          </td>
                        </tr>
                      )
                    }

                    return (
                      <tr key={period.id} className="group/row flex w-full border-b border-outline-variant/20 last:border-0 min-h-[90px] hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="py-1.5 px-2 text-center bg-surface-container-lowest/80 border-r border-outline-variant/30 w-[110px] flex-shrink-0 flex items-center justify-center">
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{period.time}</span>
                        </td>
                        
                        {DAYS.map((day, dayIdx) => {
                          const slots = getSlots(dayIdx, period.id);
                          
                          return (
                            <td 
                              key={`${day}-${period.id}`} 
                              className="p-1 border-r border-outline-variant/20 last:border-0 flex-1 relative bg-transparent group/dropzone transition-colors hover:bg-primary/5"
                              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                              onDrop={(e) => handleDrop(e, dayIdx, period.id as number)}
                            >
                              {slots.length > 0 ? (
                                <div className="flex flex-col gap-1 w-full h-full min-h-[70px]">
                                  {slots.map((slot) => (
                                    <div 
                                      key={slot.id} 
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, slot.id)}
                                      className={`timetable-slot rounded-lg p-1.5 border transition-all duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:scale-[1.02] cursor-grab active:cursor-grabbing active:scale-95 group/card flex flex-col justify-between overflow-hidden relative flex-1 ${
                                      slot.is_lab 
                                        ? 'bg-secondary-container/90 backdrop-blur text-on-secondary-container border-secondary/20 hover:border-secondary/50' 
                                        : 'bg-primary/95 backdrop-blur text-on-primary border-primary/20 hover:border-primary/50 shadow-[0_4px_10px_rgba(var(--color-primary),0.1)]'
                                    }`}>
                                      <div className="flex justify-between items-start w-full gap-1 relative z-10">
                                        {slot.is_lab ? (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border truncate max-w-[50%] transition-colors duration-300 bg-secondary/10 border-secondary/20 group-hover/card:bg-secondary/20">
                                            {slot.batch_name}
                                          </span>
                                        ) : (
                                          <div className="max-w-[50%]"></div>
                                        )}
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate max-w-[50%] flex items-center gap-1 transition-colors duration-300 ${
                                          slot.is_lab ? 'bg-secondary/10 group-hover/card:bg-secondary/20' : 'bg-on-primary/10 group-hover/card:bg-on-primary/20'
                                        }`}>
                                          <MapPin size={9} />
                                          {slot.classroom_name}
                                        </span>
                                      </div>
                                      <div className="font-label-lg text-label-lg font-bold leading-tight truncate relative z-10" title={slot.subject_code}>
                                        {slot.subject_code}
                                      </div>
                                      <div className="font-body-xs text-[10px] opacity-90 truncate relative z-10 font-medium">
                                        {slot.faculty_name}
                                      </div>
                                      
                                      {/* Glassmorphism Hover Gradient Effect */}
                                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                      {/* Subtle pulse on hover */}
                                      <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover/card:opacity-30 rounded-full transition-opacity duration-500 -z-10" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-full w-full min-h-[70px] rounded-lg border border-dashed border-outline-variant/30 hover:border-primary/40 bg-transparent hover:bg-primary/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer group/add">
                                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-outline-variant group-hover/add:bg-primary/10 group-hover/add:text-primary transition-colors">
                                    <Plus size={14} />
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
