'use client';

import { useState } from 'react';
import { 
  Shield, Bell, Lock, Activity, Users, BookOpen, Clock, Settings,
  ChevronDown, ChevronUp, CheckCircle2
} from 'lucide-react';

interface AdminExtendedProfileProps {
  preferences: any;
  onChange: (newPrefs: any) => void;
  profile: any;
}

export function AdminExtendedProfile({ preferences = {}, onChange, profile }: AdminExtendedProfileProps) {
  const [expandedSection, setExpandedSection] = useState<string>('account');

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
        <Shield className="text-error animate-pulse" size={28} />
        <h2 className="text-3xl font-display font-bold text-on-surface tracking-tight">Admin Control Center</h2>
      </div>
      
      <p className="text-body-lg text-on-surface-variant max-w-3xl mb-8 leading-relaxed">
        Manage your administrative account, security settings, and global notification preferences. Operational data is handled automatically via your dashboard.
      </p>

      {/* 1. ACCOUNT INFORMATION (READ-ONLY) */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="account" 
          icon={Settings} 
          title="Account Information" 
          description="Your administrative role, status, and system identifiers."
          color="error"
        />
        {expandedSection === 'account' && (
          <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Administrative Role</p>
                  <p className="text-lg font-bold text-on-surface capitalize">{profile?.role || 'Admin'} Level Access</p>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">System Username</p>
                  <p className="text-lg font-bold text-on-surface">{profile?.email?.split('@')[0] || 'admin_user'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Account Status</p>
                    <p className="text-lg font-bold text-success flex items-center gap-2"><CheckCircle2 size={18}/> Active</p>
                  </div>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Account Created On</p>
                  <p className="text-lg font-bold text-on-surface">Auto-Provisioned System Account</p>
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
          title="Global Notifications" 
          description="Configure alerts for faculty leaves, AI conflicts, and system updates."
          color="secondary"
        />
        {expandedSection === 'communication' && (
          <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Delivery Channels</label>
              <div className="flex flex-wrap gap-4">
                {['In-App Notifications', 'Email', 'Push Notifications (Mobile)'].map(method => (
                  <label key={method} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-outline-variant/30 cursor-pointer hover:border-error/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={preferences?.communication?.methods?.includes(method) ?? true}
                      onChange={(e) => {
                        const cur = preferences?.communication?.methods || ['In-App Notifications', 'Email', 'Push Notifications (Mobile)'];
                        const next = e.target.checked ? [...cur, method] : cur.filter((m: string) => m !== method);
                        updatePref('communication', 'methods', next);
                      }}
                      className="w-4 h-4 rounded text-error focus:ring-error" 
                    />
                    <span className="text-sm font-medium">{method}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-surface uppercase tracking-wider">Critical Alerts & System Notices</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {['Faculty Leave Requests', 'Timetable Generation Status', 'AI Conflict Alerts', 'New Notices', 'System Updates'].map(category => {
                   const isChecked = preferences?.communication?.categories?.[category] ?? true;
                   return (
                     <div key={category} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/30 hover:border-error/30 transition-colors">
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
                         <div className="w-9 h-5 bg-outline-variant/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-error"></div>
                       </label>
                     </div>
                   );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 3. SECURITY & AUTHENTICATION */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md opacity-80 cursor-not-allowed">
        <SectionHeader 
          id="security" 
          icon={Lock} 
          title="Security Settings" 
          description="Manage 2FA, password, and active sessions. (Managed centrally)"
          color="on-surface-variant"
        />
        {/* Intentionally locked visual representation as requested to keep it simple and dashboard-driven */}
      </div>

      {/* 4. SYSTEM DASHBOARD SUMMARY (READ ONLY) */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader 
          id="system" 
          icon={Activity} 
          title="Administrative Dashboard Summary" 
          description="A quick glance at system statistics."
          color="tertiary"
        />
        {expandedSection === 'system' && (
          <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-center">
                <Users size={24} className="mx-auto mb-2 text-primary opacity-80" />
                <p className="text-2xl font-bold text-on-surface">142</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Active Faculty</p>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-center">
                <Users size={24} className="mx-auto mb-2 text-tertiary opacity-80" />
                <p className="text-2xl font-bold text-on-surface">3,450</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Students</p>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-center">
                <BookOpen size={24} className="mx-auto mb-2 text-secondary opacity-80" />
                <p className="text-2xl font-bold text-on-surface">6</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Departments</p>
              </div>
              <div className="p-4 bg-surface rounded-xl border border-outline-variant/30 text-center">
                <Clock size={24} className="mx-auto mb-2 text-error opacity-80" />
                <p className="text-2xl font-bold text-on-surface">12</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">Pending Leaves</p>
              </div>
            </div>

            <div className="p-4 bg-error/5 rounded-xl border border-error/20 text-sm text-on-surface-variant">
              <span className="font-bold text-error">System Note:</span> Full administrative controls, user management, and AI timetable generation are accessed directly via the primary Admin Dashboard tabs.
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
