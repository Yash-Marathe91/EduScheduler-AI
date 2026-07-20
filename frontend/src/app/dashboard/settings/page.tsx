'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Save, Clock, Calendar, Check, AlertCircle, Settings as SettingsIcon, Brain } from 'lucide-react';
import gsap from 'gsap';

export default function SettingsPage() {
  const { settings, isLoading: isSettingsLoading, updateSettings, isUpdating: isSettingsUpdating } = useSettings();
  
  // Settings Form State
  const [maxLectures, setMaxLectures] = useState(3);
  const [lunchStart, setLunchStart] = useState('12:30');
  const [lunchDuration, setLunchDuration] = useState(60);
  const [allowSaturday, setAllowSaturday] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load initial data
  useEffect(() => {
    if (settings) {
      setMaxLectures(settings.max_consecutive_lectures || 3);
      setLunchDuration(settings.lunch_break_duration || 60);
      setAllowSaturday(settings.allow_saturday_classes || false);
      
      if (settings.lunch_break_start) {
        const hours = Math.floor(settings.lunch_break_start / 60);
        const mins = settings.lunch_break_start % 60;
        setLunchStart(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
      }
    }
  }, [settings]);

  // Entrance animations
  useEffect(() => {
    gsap.fromTo(
      ".settings-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, [!isSettingsLoading]);

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      // Parse time string to minutes
      const [hours, minutes] = lunchStart.split(':').map(Number);
      const lunchStartMins = (hours * 60) + minutes;

      await updateSettings({
        max_consecutive_lectures: maxLectures,
        lunch_break_start: lunchStartMins,
        lunch_break_duration: lunchDuration,
        allow_saturday_classes: allowSaturday
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  if (isSettingsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 p-margin-desktop md:p-margin-desktop p-margin-mobile overflow-y-auto">
      <div className="max-w-[1000px] mx-auto h-full flex flex-col gap-lg pb-10">
        
        <div className="settings-card flex items-center justify-between mb-2">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">System Settings</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Manage your personal profile and global AI scheduler configurations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* TIMETABLE AI SETTINGS */}
          <div className="settings-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
             
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <Brain size={20} />
                </div>
                <h2 className="font-headline-sm text-headline-sm font-semibold">AI Scheduler Rules</h2>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1">Max Consecutive Lectures (per Faculty)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="1"
                  value={maxLectures}
                  onChange={(e) => setMaxLectures(Number(e.target.value))}
                  className="flex-1 accent-secondary"
                />
                <span className="font-headline-sm font-bold text-secondary w-8 text-center">{maxLectures}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                  <Clock size={14} /> Lunch Start
                </label>
                <input 
                  type="time" 
                  value={lunchStart}
                  onChange={(e) => setLunchStart(e.target.value)}
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1">Duration (mins)</label>
                <input 
                  type="number" 
                  min="30"
                  max="120"
                  step="10"
                  value={lunchDuration}
                  onChange={(e) => setLunchDuration(Number(e.target.value))}
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all duration-300 shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl mt-2">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface flex items-center gap-2">
                  <Calendar size={16} className="text-secondary" />
                  Saturday Classes
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">Allow AI to schedule on Saturdays</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={allowSaturday}
                  onChange={(e) => setAllowSaturday(e.target.checked)}
                />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
              </label>
            </div>

            <button 
              onClick={handleSaveSettings}
              disabled={isSettingsUpdating}
              className="mt-auto pt-4 group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-secondary-fixed-dim hover:to-secondary text-on-secondary px-6 py-4 rounded-xl font-label-md text-label-md shadow-[0_0_20px_rgba(var(--color-secondary),0.3)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(var(--color-secondary),0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              {isSettingsUpdating ? (
                'Optimizing...'
              ) : (
                <>
                  <SettingsIcon size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                  Save AI Rules
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Save Status Toast */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg backdrop-blur-md text-white font-label-md transition-all duration-500 ${
          saveStatus === 'saved' ? 'translate-y-0 opacity-100 bg-emerald-500/90' :
          saveStatus === 'error' ? 'translate-y-0 opacity-100 bg-red-500/90' :
          'translate-y-10 opacity-0 pointer-events-none'
        }`}>
          {saveStatus === 'saved' ? (
            <><Check size={18} /> Settings successfully saved!</>
          ) : (
            <><AlertCircle size={18} /> Failed to save settings.</>
          )}
        </div>

      </div>
    </main>
  );
}
