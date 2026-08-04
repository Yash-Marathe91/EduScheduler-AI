'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import gsap from 'gsap';
import { fetchWithAuth } from '@/lib/api-client';
import { useProfile } from '@/hooks/use-profile';

export default function AttendancePage() {
  const { profile } = useProfile();
  const [file, setFile] = useState<File | null>(null);
  const [slotId, setSlotId] = useState('');
  const [date, setDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  
  // Just dummy slots for this demo. In reality, we'd fetch the teacher's schedule.
  const mySlots = [
    { id: '11111111-1111-1111-1111-111111111111', label: 'CS101 - Room 301 (Mon 9:00 AM)' },
    { id: '22222222-2222-2222-2222-222222222222', label: 'CS102 - Room 302 (Tue 10:00 AM)' }
  ];

  useEffect(() => {
    gsap.fromTo(
      ".anim-card",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  const handleUpload = async () => {
    if (!file || !slotId || !date) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setExtractedData(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slot_id', slotId);
      formData.append('date', date);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/attendance/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setExtractedData(data.data);
      setUploadStatus('success');
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    if (!slotId || !date) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/attendance/export/${slotId}?date=${date}`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${date}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to export:", err);
    }
  };

  if (profile?.role === 'student') {
    return (
      <main className="flex-1 p-margin-desktop overflow-y-auto">
        <div className="max-w-[800px] mx-auto h-full flex flex-col gap-lg pb-10 anim-card">
          <div className="bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-sm text-center">
            <h1 className="text-headline-md font-bold mb-4">Access Denied</h1>
            <p className="text-on-surface-variant">Students cannot upload attendance sheets.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-margin-desktop md:p-margin-desktop p-margin-mobile overflow-y-auto">
      <div className="max-w-[1000px] mx-auto h-full flex flex-col gap-lg pb-10">
        
        <div className="anim-card flex items-center justify-between mb-2">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Attendance OCR</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Upload handwritten or printed attendance sheets to automatically extract data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          
          {/* Upload Section */}
          <div className="anim-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
            <h2 className="font-headline-sm text-headline-sm font-semibold">Upload Sheet</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant">Class Slot</label>
                <select 
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 outline-none"
                >
                  <option value="" disabled>Select Class Slot...</option>
                  {mySlots.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-lowest/80 border border-outline-variant/50 rounded-xl p-3 outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-label-md text-on-surface-variant">Image File</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest/30'}`}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    {file ? (
                      <>
                        <FileText size={40} className="text-primary mb-3" />
                        <span className="font-medium text-primary text-center">{file.name}</span>
                        <span className="text-xs text-on-surface-variant mt-1">Click to change</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={40} className="text-on-surface-variant mb-3 opacity-70" />
                        <span className="font-medium">Click to select an image</span>
                        <span className="text-xs text-on-surface-variant mt-1">Supports JPG, PNG</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              
              <button 
                onClick={handleUpload}
                disabled={!file || !slotId || !date || isUploading}
                className="mt-4 w-full bg-primary hover:bg-primary-fixed disabled:bg-surface-container-highest disabled:text-on-surface-variant text-on-primary py-4 rounded-xl font-medium transition-all shadow-md disabled:shadow-none"
              >
                {isUploading ? 'Extracting with Gemini Vision...' : 'Process Attendance Sheet'}
              </button>
            </div>
            
            {uploadStatus === 'success' && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex items-center gap-3">
                <CheckCircle2 size={20} />
                <span>Successfully extracted and saved attendance!</span>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} />
                <span>Failed to process image. Please try again.</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="anim-card bg-surface/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-md relative overflow-hidden">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm font-semibold">Extracted Data</h2>
              <button 
                onClick={handleExport}
                disabled={!extractedData}
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest disabled:opacity-50 border border-outline-variant/50 rounded-xl font-label-sm text-label-sm transition-colors flex items-center gap-2"
              >
                <FileText size={16} />
                Export CSV
              </button>
            </div>
            
            <div className="flex-1 bg-surface-container-lowest/50 rounded-2xl border border-outline-variant/30 p-4 overflow-y-auto max-h-[500px]">
              {!extractedData && !isUploading && (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-70">
                  <FileText size={48} className="mb-4 opacity-50" />
                  <p>Upload a sheet to see extracted attendance data here.</p>
                </div>
              )}
              
              {isUploading && (
                <div className="h-full flex flex-col items-center justify-center text-primary">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="animate-pulse">Analyzing image...</p>
                </div>
              )}
              
              {extractedData && (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-4 pb-2 border-b border-outline-variant/30 font-medium text-sm text-on-surface-variant">
                    <div>Enrollment No.</div>
                    <div>Status</div>
                  </div>
                  {extractedData.map((record, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4 py-2 border-b border-outline-variant/10 text-sm">
                      <div className="font-mono">{record.student_enrollment}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          record.status === 'present' ? 'bg-emerald-500/10 text-emerald-600' :
                          record.status === 'absent' ? 'bg-red-500/10 text-red-600' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
