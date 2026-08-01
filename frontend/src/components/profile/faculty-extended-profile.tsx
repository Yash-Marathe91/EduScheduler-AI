'use client';

import { useState } from 'react';
import { 
  User, Briefcase, BookOpen, Calendar, Clock, Award, 
  FileText, CheckCircle2, AlertCircle, Building2, 
  GraduationCap, Bell, Activity, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FacultyExtendedProfileProps {
  preferences: any;
  onChange: (newPrefs: any) => void;
}

export function FacultyExtendedProfile({ preferences = {}, onChange }: FacultyExtendedProfileProps) {
  const [activeTab, setActiveTab] = useState('academic');

  // Helper to safely update nested JSON preferences
  const updatePref = (category: string, key: string, value: any) => {
    const updated = { ...preferences };
    if (!updated[category]) updated[category] = {};
    updated[category][key] = value;
    onChange(updated);
  };

  const tabs = [
    { id: 'academic', label: 'Academic Details', icon: BookOpen },
    { id: 'availability', label: 'Availability & Capacity', icon: Clock },
    { id: 'responsibilities', label: 'Duties & Performance', icon: Award },
    { id: 'preferences', label: 'AI Preferences', icon: Activity },
  ];

  return (
    <div className="mt-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
        <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2 px-4">Faculty Configuration</h3>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary text-on-primary shadow-md shadow-primary/20 scale-105' 
                  : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
        
        {/* Profile Completion Card */}
        <div className="mt-8 p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-on-surface-variant">Profile Score</span>
            <span className="text-xs font-bold text-primary">87%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[87%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-2 leading-tight">
            Reach 100% completion before AI timetable generation begins.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-surface-container-lowest/50 backdrop-blur-md border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden relative">
        
        {/* TAB 1: ACADEMIC DETAILS */}
        {activeTab === 'academic' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4 flex items-center gap-2">
                <BookOpen className="text-primary" size={24} /> Subject & Batch Allocation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-on-surface-variant">Theory Subjects (Semester V)</label>
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant/50 space-y-2">
                    {['Data Structures & Algorithms', 'Database Management Systems', 'Digital Electronics'].map(sub => (
                       <label key={sub} className="flex items-center gap-3 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={preferences?.academic?.theory?.includes(sub) || false}
                           onChange={(e) => {
                              const current = preferences?.academic?.theory || [];
                              const next = e.target.checked ? [...current, sub] : current.filter((s: string) => s !== sub);
                              updatePref('academic', 'theory', next);
                           }}
                           className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" 
                         />
                         <span className="text-sm text-on-surface">{sub}</span>
                       </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-on-surface-variant">Practical Subjects / Labs</label>
                  <div className="p-4 bg-surface rounded-xl border border-outline-variant/50 space-y-2">
                    {['DBMS Lab (Batch A, B)', 'Embedded Systems Lab'].map(sub => (
                       <label key={sub} className="flex items-center gap-3 cursor-pointer">
                         <input 
                           type="checkbox" 
                           checked={preferences?.academic?.practical?.includes(sub) || false}
                           onChange={(e) => {
                              const current = preferences?.academic?.practical || [];
                              const next = e.target.checked ? [...current, sub] : current.filter((s: string) => s !== sub);
                              updatePref('academic', 'practical', next);
                           }}
                           className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" 
                         />
                         <span className="text-sm text-on-surface">{sub}</span>
                       </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/20" />

            <div>
              <h3 className="text-lg font-bold text-on-surface mb-4">Subject Expertise</h3>
              <div className="space-y-4">
                {['Artificial Intelligence', 'Machine Learning', 'Python Programming', 'Java', 'Networking'].map((sub, i) => {
                  const rating = preferences?.academic?.expertise?.[sub] || (5 - (i > 2 ? 1 : 0));
                  return (
                    <div key={sub} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant/30">
                      <span className="text-sm font-medium text-on-surface">{sub}</span>
                      <div className="flex gap-1 text-primary">
                        {[1,2,3,4,5].map(star => (
                          <Award 
                            key={star} 
                            size={16} 
                            className={`cursor-pointer transition-colors ${star <= rating ? 'fill-primary' : 'fill-transparent opacity-30 hover:opacity-50'}`} 
                            onClick={() => {
                               const exp = preferences?.academic?.expertise || {};
                               updatePref('academic', 'expertise', { ...exp, [sub]: star });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AVAILABILITY */}
        {activeTab === 'availability' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4 flex items-center gap-2">
                <Clock className="text-primary" size={24} /> Schedule Constraints
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Max Lectures Per Day</label>
                    <input 
                      type="number" 
                      value={preferences?.availability?.maxLecturesPerDay || 4} 
                      onChange={(e) => updatePref('availability', 'maxLecturesPerDay', parseInt(e.target.value))}
                      className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Max Continuous Lectures</label>
                    <input 
                      type="number" 
                      value={preferences?.availability?.maxContinuous || 2} 
                      onChange={(e) => updatePref('availability', 'maxContinuous', parseInt(e.target.value))}
                      className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                </div>
              </div>

              <label className="text-sm font-medium text-on-surface-variant mb-3 block">Weekly Availability Calendar</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-surface text-on-surface-variant">
                    <tr>
                      <th className="p-3 border border-outline-variant/30 rounded-tl-xl">Time</th>
                      <th className="p-3 border border-outline-variant/30">Mon</th>
                      <th className="p-3 border border-outline-variant/30">Tue</th>
                      <th className="p-3 border border-outline-variant/30">Wed</th>
                      <th className="p-3 border border-outline-variant/30">Thu</th>
                      <th className="p-3 border border-outline-variant/30 rounded-tr-xl">Fri</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00'].map(time => (
                      <tr key={time}>
                        <td className="p-3 border border-outline-variant/30 font-medium bg-surface/30">{time}</td>
                        {[1,2,3,4,5].map(day => {
                           const key = `${day}-${time}`;
                           const isBusy = preferences?.availability?.calendar?.[key] || (day === 2 && time.startsWith('08'));
                           return (
                             <td key={day} className="p-3 border border-outline-variant/30 text-center">
                               <button 
                                 onClick={() => {
                                    const cal = preferences?.availability?.calendar || {};
                                    updatePref('availability', 'calendar', { ...cal, [key]: !isBusy });
                                 }}
                                 className={`w-full py-1.5 rounded-md text-xs font-semibold transition-colors ${isBusy ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-success/10 text-success hover:bg-success/20'}`}
                               >
                                 {isBusy ? 'Busy' : 'Available'}
                               </button>
                             </td>
                           );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DUTIES */}
        {activeTab === 'responsibilities' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4 flex items-center gap-2">
                <Briefcase className="text-primary" size={24} /> Additional Responsibilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Academic Coordinator', 'Placement Coordinator', 'Project Guide', 'Research Coordinator', 'Exam Cell', 'NAAC Coordinator'].map(duty => (
                  <label key={duty} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={preferences?.duties?.list?.includes(duty) || duty === 'Project Guide'}
                      onChange={(e) => {
                         const current = preferences?.duties?.list || ['Project Guide'];
                         const next = e.target.checked ? [...current, duty] : current.filter((d: string) => d !== duty);
                         updatePref('duties', 'list', next);
                      }}
                      className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" 
                    />
                    <span className="text-sm font-medium">{duty}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="border-outline-variant/20" />

            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4">AI Performance Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Lecture Completion Rate</p>
                    <p className="text-2xl font-bold text-on-surface">94.2%</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><CheckCircle2 size={24}/></div>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Student Feedback</p>
                    <p className="text-2xl font-bold text-on-surface">4.8/5.0</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"><Award size={24}/></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-4 flex items-center gap-2">
                <Activity className="text-primary" size={24} /> AI Scheduling Rules
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">These rules act as soft constraints for the SmartSched AI algorithm during generation.</p>
              
              <div className="space-y-3">
                {[
                  'Avoid first lecture (8:00 AM)', 
                  'Avoid last lecture (4:00 PM)', 
                  'No consecutive practicals',
                  'Prefer morning theory sessions',
                  'Prefer same classroom for back-to-back',
                  'Auto Accept Substitute Requests'
                ].map(pref => {
                   const isChecked = preferences?.ai_rules?.[pref] ?? (pref.includes('morning') || pref.includes('classroom'));
                   return (
                     <div key={pref} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30">
                       <span className="text-sm font-medium">{pref}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input 
                           type="checkbox" 
                           className="sr-only peer" 
                           checked={isChecked}
                           onChange={(e) => {
                              const rules = preferences?.ai_rules || {};
                              updatePref('ai_rules', pref, e.target.checked);
                           }}
                         />
                         <div className="w-11 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                       </label>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
