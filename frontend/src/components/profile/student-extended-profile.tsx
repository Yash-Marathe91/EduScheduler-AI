'use client';

import { useState } from 'react';
import { 
  GraduationCap, Bell, FileText, CheckCircle2,
  Calendar, Layers, Sparkles, ChevronDown, ChevronUp, Clock
} from 'lucide-react';

interface StudentExtendedProfileProps {
  preferences: any;
  onChange: (newPrefs: any) => void;
}

export function StudentExtendedProfile({ preferences = {}, onChange }: StudentExtendedProfileProps) {
  const [expandedSection, setExpandedSection] = useState<string>('academic');

  const updatePref = (category: string, key: string, value: any) => {
    const updated = { ...preferences };
    if (!updated[category]) updated[category] = {};
    updated[category][key] = value;
    onChange(updated);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? '' : section);
  };

  const SectionHeader = ({ id, icon: Icon, title, description, color }: any) => (
    <div 
      className={`flex items-center justify-between p-6 cursor-pointer transition-all ${expandedSection === id ? 'bg-surface border-b border-outline-variant/30' : 'hover:bg-surface-container'}`}
      onClick={() => toggleSection(id)}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{description}</p>
        </div>
      </div>
      <div className="text-on-surface-variant">
        {expandedSection === id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
    </div>
  );

  return (
    <div className="mt-12 space-y-6">
      
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="text-tertiary animate-pulse" size={28} />
        <h2 className="text-3xl font-display font-bold text-on-surface tracking-tight">Student Academic Profile</h2>
      </div>
      
      <p className="text-body-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
        Update your academic details and notification preferences. The system will automatically use this information to assign your timetable, laboratory batches, and relevant notices.
      </p>

      {/* 1. ACADEMIC INFORMATION */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="academic" 
          icon={Layers} 
          title="Academic Information" 
          description="Your current program, semester, division, and batch."
          color="tertiary"
        />
        {expandedSection === 'academic' && (
          <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Program & Department</label>
                <div className="space-y-3">
                  <select 
                    value={preferences?.academic?.program || ''}
                    onChange={(e) => updatePref('academic', 'program', e.target.value)}
                    className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-tertiary"
                  >
                    <option value="" disabled>Select Program...</option>
                    <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                    <option value="M.Tech">Master of Technology (M.Tech)</option>
                    <option value="BCA">Bachelor of Computer Applications (BCA)</option>
                    <option value="MCA">Master of Computer Applications (MCA)</option>
                  </select>
                  
                  <select 
                    value={preferences?.academic?.department || ''}
                    onChange={(e) => updatePref('academic', 'department', e.target.value)}
                    className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-tertiary"
                  >
                    <option value="" disabled>Select Department...</option>
                    <option value="CSE">Computer Engineering</option>
                    <option value="AI">AI & Data Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="MECH">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Current Status</label>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <label className="text-xs text-on-surface-variant">Semester</label>
                     <select 
                        value={preferences?.academic?.semester || ''}
                        onChange={(e) => updatePref('academic', 'semester', e.target.value)}
                        className="w-full p-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-tertiary"
                      >
                        <option value="" disabled>Sem...</option>
                        {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs text-on-surface-variant">Division</label>
                     <input 
                        type="text" 
                        placeholder="e.g. A"
                        value={preferences?.academic?.division || ''}
                        onChange={(e) => updatePref('academic', 'division', e.target.value.toUpperCase())}
                        className="w-full p-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-tertiary"
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs text-on-surface-variant">Practical Batch</label>
                     <input 
                        type="text" 
                        placeholder="e.g. A1"
                        value={preferences?.academic?.batch || ''}
                        onChange={(e) => updatePref('academic', 'batch', e.target.value.toUpperCase())}
                        className="w-full p-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-tertiary"
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs text-on-surface-variant">Admission Year</label>
                     <input 
                        type="number" 
                        placeholder="e.g. 2024"
                        value={preferences?.academic?.admission_year || ''}
                        onChange={(e) => updatePref('academic', 'admission_year', e.target.value)}
                        className="w-full p-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-tertiary"
                     />
                   </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 2. COMMUNICATION PREFERENCES */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="communication" 
          icon={Bell} 
          title="Communication & Notifications" 
          description="How and when you want to receive academic updates."
          color="secondary"
        />
        {expandedSection === 'communication' && (
          <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Delivery Methods</label>
              <div className="flex flex-wrap gap-4">
                {['In-App Notifications', 'Email', 'Push Notifications (Mobile)'].map(method => (
                  <label key={method} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-tertiary/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={preferences?.communication?.methods?.includes(method) ?? true}
                      onChange={(e) => {
                        const cur = preferences?.communication?.methods || ['In-App Notifications', 'Email', 'Push Notifications (Mobile)'];
                        const next = e.target.checked ? [...cur, method] : cur.filter((m: string) => m !== method);
                        updatePref('communication', 'methods', next);
                      }}
                      className="w-4 h-4 rounded text-tertiary focus:ring-tertiary" 
                    />
                    <span className="text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Notification Categories</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {['Department Notices', 'Class Notices', 'Timetable Changes', 'Classroom Changes', 'Examination Notices', 'Events & Workshops'].map(category => {
                   const isChecked = preferences?.communication?.categories?.[category] ?? true;
                   return (
                     <div key={category} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/30 hover:border-tertiary/30 transition-colors">
                       <span className="text-sm font-medium">{category}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input 
                           type="checkbox" 
                           className="sr-only peer" 
                           checked={isChecked}
                           onChange={(e) => {
                              const cats = preferences?.communication?.categories || {};
                              updatePref('communication', 'categories', { ...cats, [category]: e.target.checked });
                           }}
                         />
                         <div className="w-9 h-5 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-tertiary"></div>
                       </label>
                     </div>
                   );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 3. SYSTEM ASSIGNMENTS (READ ONLY) */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="system" 
          icon={CheckCircle2} 
          title="System Assignments (Auto Generated)" 
          description="Your current timetable, attendance, and analytics."
          color="success"
        />
        {expandedSection === 'system' && (
          <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <div className="p-3 bg-tertiary/10 text-tertiary rounded-lg"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">Timetable Status</p>
                  <p className="text-lg font-bold text-on-surface">Assigned</p>
                </div>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <div className="p-3 bg-success/10 text-success rounded-lg"><CheckCircle2 size={20} /></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">Overall Attendance</p>
                  <p className="text-lg font-bold text-on-surface">88.5%</p>
                </div>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg"><Clock size={20} /></div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">Next Lecture</p>
                  <p className="text-lg font-bold text-on-surface">DBMS (Room 304)</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-sm text-on-surface-variant">
              <span className="font-bold text-primary">Note:</span> Full timetable view, subject-wise attendance breakdowns, and official notices are accessible directly from your main Dashboard.
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
