'use client';

import { useState } from 'react';
import { 
  BookOpen, Calendar, Clock, Award, 
  CheckCircle2, Activity, MapPin, Target, ChevronDown, ChevronUp, Layers, Sparkles
} from 'lucide-react';

interface FacultyExtendedProfileProps {
  preferences: any;
  onChange: (newPrefs: any) => void;
}

export function FacultyExtendedProfile({ preferences = {}, onChange }: FacultyExtendedProfileProps) {
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
        <Sparkles className="text-primary animate-pulse" size={28} />
        <h2 className="text-3xl font-display font-bold text-on-surface tracking-tight">AI Scheduling Configuration</h2>
      </div>
      
      <p className="text-body-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
        Complete your academic profile and set your constraints. The <b>SmartSched AI</b> will use these exact settings to generate a conflict-free, highly optimized timetable that respects your preferences.
      </p>

      {/* 1. ACADEMIC & SUBJECT ALLOCATION */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="academic" 
          icon={Layers} 
          title="Academic & Subject Allocation" 
          description="Semesters, Departments, Theory, and Practical batches."
          color="primary"
        />
        {expandedSection === 'academic' && (
          <div className="p-6 md:p-8 space-y-10 animate-in slide-in-from-top-4 fade-in duration-300">
            
            {/* Semesters & Depts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Semester Assignment</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI', 'Semester VII', 'Semester VIII'].map(sem => (
                    <label key={sem} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={preferences?.academic?.semesters?.includes(sem) || false}
                        onChange={(e) => {
                          const cur = preferences?.academic?.semesters || [];
                          const next = e.target.checked ? [...cur, sem] : cur.filter((s: string) => s !== sem);
                          updatePref('academic', 'semesters', next);
                        }}
                        className="w-4 h-4 rounded text-primary focus:ring-primary" 
                      />
                      <span className="text-sm font-medium">{sem}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Department Assignment</label>
                <div className="space-y-3">
                  {['Computer Engineering', 'AI & Data Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'].map(dept => (
                    <label key={dept} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={preferences?.academic?.departments?.includes(dept) || false}
                        onChange={(e) => {
                          const cur = preferences?.academic?.departments || [];
                          const next = e.target.checked ? [...cur, dept] : cur.filter((s: string) => s !== dept);
                          updatePref('academic', 'departments', next);
                        }}
                        className="w-4 h-4 rounded text-primary focus:ring-primary" 
                      />
                      <span className="text-sm font-medium">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Theory Subjects (Comma separated)</label>
                <textarea 
                  placeholder="e.g. Data Structures, Database Management, Digital Electronics"
                  value={preferences?.academic?.theory_subjects || ''}
                  onChange={(e) => updatePref('academic', 'theory_subjects', e.target.value)}
                  className="w-full p-4 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Practical Subjects & Batches</label>
                <textarea 
                  placeholder="e.g. DBMS Lab (Batch A, B, C), Embedded Systems Lab (Batch A)"
                  value={preferences?.academic?.practical_subjects || ''}
                  onChange={(e) => updatePref('academic', 'practical_subjects', e.target.value)}
                  className="w-full p-4 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-none"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 2. AVAILABILITY & CAPACITY */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="availability" 
          icon={Clock} 
          title="Availability & Teaching Capacity" 
          description="Working days, preferred hours, and workload limits."
          color="secondary"
        />
        {expandedSection === 'availability' && (
          <div className="p-6 md:p-8 space-y-10 animate-in slide-in-from-top-4 fade-in duration-300">
            
            {/* Capacities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Max Lectures / Day</label>
                  <input type="number" value={preferences?.availability?.max_per_day || 4} onChange={(e) => updatePref('availability', 'max_per_day', e.target.value)} className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Max Lectures / Week</label>
                  <input type="number" value={preferences?.availability?.max_per_week || 15} onChange={(e) => updatePref('availability', 'max_per_week', e.target.value)} className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Max Continuous</label>
                  <input type="number" value={preferences?.availability?.max_continuous || 2} onChange={(e) => updatePref('availability', 'max_continuous', e.target.value)} className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary" />
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            {/* Working Days & Preferred Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Working Days</label>
                <div className="flex flex-wrap gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                    <label key={day} className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/30 cursor-pointer hover:border-primary/50">
                      <input 
                        type="checkbox" 
                        checked={preferences?.availability?.working_days?.includes(day) ?? (day !== 'Saturday')}
                        onChange={(e) => {
                          const cur = preferences?.availability?.working_days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                          const next = e.target.checked ? [...cur, day] : cur.filter((d: string) => d !== day);
                          updatePref('availability', 'working_days', next);
                        }}
                        className="w-4 h-4 rounded text-primary" 
                      />
                      <span className="text-sm font-medium">{day.substring(0,3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Preferred Teaching Hours</label>
                <div className="flex flex-wrap gap-3">
                  {['Morning (8-12)', 'Afternoon (1-4)', 'Evening (4-6)'].map(time => (
                    <label key={time} className="flex items-center gap-2 p-2 bg-surface rounded-lg border border-outline-variant/30 cursor-pointer hover:border-primary/50">
                      <input 
                        type="checkbox" 
                        checked={preferences?.availability?.preferred_hours?.includes(time) || false}
                        onChange={(e) => {
                          const cur = preferences?.availability?.preferred_hours || [];
                          const next = e.target.checked ? [...cur, time] : cur.filter((t: string) => t !== time);
                          updatePref('availability', 'preferred_hours', next);
                        }}
                        className="w-4 h-4 rounded text-primary" 
                      />
                      <span className="text-sm font-medium">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 3. AI SCHEDULING RULES */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="rules" 
          icon={Activity} 
          title="AI Scheduling Preferences" 
          description="Soft constraints and specific rules for the AI."
          color="tertiary"
        />
        {expandedSection === 'rules' && (
          <div className="p-6 md:p-8 space-y-8 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Avoid first lecture (8:00 AM)', 
                'Avoid last lecture (4:00 PM)', 
                'No consecutive practicals',
                'Maximum two consecutive lectures',
                'Prefer same classroom for back-to-back',
                'Avoid Friday afternoon',
                'Available for substitute lectures',
                'Auto Accept Substitute Requests'
              ].map(rule => (
                <div key={rule} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                  <span className="text-sm font-medium">{rule}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={preferences?.ai_rules?.[rule] ?? false}
                      onChange={(e) => {
                        const cur = preferences?.ai_rules || {};
                        updatePref('ai_rules', rule, e.target.checked);
                      }}
                    />
                    <div className="w-11 h-6 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>

            <hr className="border-outline-variant/30" />

            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2"><MapPin size={16}/> Classroom Preferences</label>
              <div className="flex flex-wrap gap-4">
                {['Smart Classroom Required', 'Projector Required', 'Computer Lab Required', 'Prefer Building A', 'Prefer Building B'].map(pref => (
                  <label key={pref} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={preferences?.ai_rules?.classroom_prefs?.includes(pref) || false}
                      onChange={(e) => {
                        const cur = preferences?.ai_rules?.classroom_prefs || [];
                        const next = e.target.checked ? [...cur, pref] : cur.filter((p: string) => p !== pref);
                        const rules = preferences?.ai_rules || {};
                        updatePref('ai_rules', 'classroom_prefs', next);
                      }}
                      className="w-4 h-4 rounded text-primary focus:ring-primary" 
                    />
                    <span className="text-sm font-medium">{pref}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. PROFESSIONAL & RESPONSIBILITIES */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="professional" 
          icon={Award} 
          title="Professional & Subject Expertise" 
          description="Additional duties, research profiles, and skill ratings."
          color="error"
        />
        {expandedSection === 'professional' && (
          <div className="p-6 md:p-8 space-y-10 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Additional Responsibilities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Academic Coordinator', 'Placement Coordinator', 'Project Guide', 'Research Coordinator', 'Exam Cell', 'NAAC Coordinator', 'NSS', 'Sports', 'Cultural Committee'].map(duty => (
                  <label key={duty} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={preferences?.professional?.duties?.includes(duty) || false}
                      onChange={(e) => {
                        const cur = preferences?.professional?.duties || [];
                        const next = e.target.checked ? [...cur, duty] : cur.filter((d: string) => d !== duty);
                        updatePref('professional', 'duties', next);
                      }}
                      className="w-4 h-4 rounded text-primary focus:ring-primary" 
                    />
                    <span className="text-sm font-medium">{duty}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Subject Expertise (1 to 5 Stars)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Artificial Intelligence', 'Machine Learning', 'Python', 'Java', 'Networking'].map((sub, i) => {
                  const rating = preferences?.professional?.expertise?.[sub] || 0;
                  return (
                    <div key={sub} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/30">
                      <span className="text-sm font-medium text-on-surface">{sub}</span>
                      <div className="flex gap-1 text-primary">
                        {[1,2,3,4,5].map(star => (
                          <Award 
                            key={star} 
                            size={20} 
                            className={`cursor-pointer transition-colors hover:opacity-80 ${star <= rating ? 'fill-primary' : 'fill-transparent opacity-20'}`} 
                            onClick={() => {
                               const exp = preferences?.professional?.expertise || {};
                               updatePref('professional', 'expertise', { ...exp, [sub]: star });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Google Scholar Profile Link</label>
                  <input type="url" placeholder="https://scholar.google.com/..." value={preferences?.professional?.scholar || ''} onChange={(e) => updatePref('professional', 'scholar', e.target.value)} className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ORCID ID</label>
                  <input type="text" placeholder="0000-0000-0000-0000" value={preferences?.professional?.orcid || ''} onChange={(e) => updatePref('professional', 'orcid', e.target.value)} className="w-full p-3 bg-surface rounded-xl border border-outline-variant/50 outline-none focus:border-primary" />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
