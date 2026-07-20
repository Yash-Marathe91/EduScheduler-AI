'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useDepartments } from '@/hooks/use-departments';
import { User, Check, AlertCircle, Building2, Briefcase, GraduationCap, Phone, Hash } from 'lucide-react';
import gsap from 'gsap';

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { data: departments } = useDepartments();
  
  // Base Profile
  const [fullName, setFullName] = useState('');
  
  // Faculty Details
  const [designation, setDesignation] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Student Details
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [phone, setPhone] = useState('');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      
      if (profile.role === 'faculty' && profile.faculty_details) {
        setDesignation(profile.faculty_details.designation || '');
        setDepartmentId(profile.faculty_details.department_id || '');
        setEmployeeId(profile.faculty_details.employee_id || '');
      } else if (profile.role === 'student' && profile.student_details) {
        setEnrollmentNumber(profile.student_details.enrollment_number || '');
        setPhone(profile.student_details.phone || '');
        // Student's department might come from their batch, but let's assume they can select it for now or it's read-only
      } else if (profile.role === 'admin' && profile.faculty_details) {
          // admins might also be faculty
          setDesignation(profile.faculty_details.designation || '');
          setDepartmentId(profile.faculty_details.department_id || '');
          setEmployeeId(profile.faculty_details.employee_id || '');
      }
    }
  }, [profile]);

  useEffect(() => {
    gsap.fromTo(
      ".profile-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, [!isLoading]);

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    try {
      const payload: any = { full_name: fullName };
      
      if (profile?.role === 'faculty' || profile?.role === 'admin') {
        payload.faculty_details = {
          designation,
          department_id: departmentId || null,
          employee_id: employeeId
        };
      } else if (profile?.role === 'student') {
        payload.student_details = {
          enrollment_number: enrollmentNumber,
          phone
        };
      }

      await updateProfile(payload);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 p-margin-desktop md:p-margin-desktop p-margin-mobile overflow-y-auto">
      <div className="max-w-[800px] mx-auto h-full flex flex-col gap-lg pb-10">
        
        <div className="profile-card flex items-center justify-between mb-2">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Your Profile</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Manage your personal and academic information.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          
          {/* GENERAL PROFILE */}
          <div className="profile-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex items-center gap-4 mb-4">
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-fixed flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
                  <User size={36} />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                      <span className="text-xs font-medium">Edit</span>
                  </div>
               </div>
               <div>
                  <h2 className="font-headline-md text-headline-md font-semibold">{fullName || 'Unknown User'}</h2>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm inline-flex capitalize border border-primary/20 shadow-sm mt-2 font-semibold tracking-wide">
                    {profile?.role || 'User'} Role
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant ml-1">Email Address (Read-only)</label>
                    <input 
                        type="text" 
                        value={profile?.email || ''} 
                        disabled
                        className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl p-3 font-body-md text-on-surface-variant opacity-70 cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant ml-1">Full Name</label>
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                    />
                </div>
            </div>
          </div>

          {/* FACULTY / ADMIN SPECIFIC DETAILS */}
          {(profile?.role === 'faculty' || profile?.role === 'admin') && (
            <div className="profile-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <Briefcase size={20} />
                    </div>
                    <h2 className="font-headline-sm text-headline-sm font-semibold">Faculty Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                            <Building2 size={14} /> Department
                        </label>
                        <select 
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Department...</option>
                            {departments?.map((d: any) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                            <Briefcase size={14} /> Designation
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. Assistant Professor"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                            <Hash size={14} /> Employee ID
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. FAC-2024-001"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                        />
                    </div>
                </div>
            </div>
          )}

          {/* STUDENT SPECIFIC DETAILS */}
          {profile?.role === 'student' && (
            <div className="profile-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <GraduationCap size={20} />
                    </div>
                    <h2 className="font-headline-sm text-headline-sm font-semibold">Academic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                            <Hash size={14} /> Enrollment Number
                        </label>
                        <input 
                            type="text" 
                            placeholder="e.g. PRN20210012"
                            value={enrollmentNumber}
                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                            className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-label-md text-on-surface-variant ml-1 flex items-center gap-2">
                            <Phone size={14} /> Phone Number
                        </label>
                        <input 
                            type="tel" 
                            placeholder="+1 234 567 8900"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 shadow-sm"
                        />
                    </div>
                </div>
            </div>
          )}
          
          <div className="profile-card flex justify-end mt-4">
             <button 
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="group relative w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-fixed-dim hover:to-primary text-on-primary px-10 py-4 rounded-xl font-label-lg text-label-lg shadow-[0_0_20px_rgba(var(--color-primary),0.3)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(var(--color-primary),0.4)]"
             >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                {isUpdating ? (
                    'Saving changes...'
                ) : (
                    'Save Profile Details'
                )}
             </button>
          </div>

        </div>

        {/* Global Save Status Toast */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg backdrop-blur-md text-white font-label-md transition-all duration-500 z-50 ${
          saveStatus === 'saved' ? 'translate-y-0 opacity-100 bg-emerald-500/90' :
          saveStatus === 'error' ? 'translate-y-0 opacity-100 bg-red-500/90' :
          'translate-y-10 opacity-0 pointer-events-none'
        }`}>
          {saveStatus === 'saved' ? (
            <><Check size={18} /> Profile updated successfully!</>
          ) : (
            <><AlertCircle size={18} /> Failed to update profile.</>
          )}
        </div>

      </div>
    </main>
  );
}
