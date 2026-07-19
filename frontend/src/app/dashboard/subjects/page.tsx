'use client';

import { BookOpen, Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSubjects, useCreateSubject } from '@/hooks/use-subjects';
import { useDepartments } from '@/hooks/use-departments';
import { SlideOver } from '@/components/ui/slide-over';

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  
  const { data: subjects, isLoading, isError } = useSubjects();
  const { data: departments } = useDepartments();
  const createSubject = useCreateSubject();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    department_id: '',
    credits: 3,
    lectures_per_week: 4,
    is_lab: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubject.mutate(formData, {
      onSuccess: () => {
        setIsSlideOverOpen(false);
        setFormData({ name: '', code: '', department_id: '', credits: 3, lectures_per_week: 4, is_lab: false });
      }
    });
  };

  const filteredSubjects = subjects?.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sub.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getDepartmentName = (id: string) => {
    return departments?.find(d => d.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-orange-600" />
            Subject Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage course catalog, credits, and academic requirements.
          </p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search subjects by name or code..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              Error loading subjects. Are you connected to the backend?
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <BookOpen className="h-12 w-12 text-slate-300 mb-2" />
              <p>No subjects found.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Course Code</th>
                  <th className="px-6 py-4 font-medium">Subject Name</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Credits/Week</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{subject.name}</td>
                    <td className="px-6 py-4 text-slate-600">{getDepartmentName(subject.department_id)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        subject.is_lab ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {subject.is_lab ? 'Lab' : 'Theory'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-slate-700">{subject.credits} Credits</span>
                        <span className="text-xs text-slate-500">{subject.lectures_per_week} hrs/week</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-700 transition p-1 rounded-md hover:bg-slate-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <SlideOver 
        isOpen={isSlideOverOpen} 
        onClose={() => setIsSlideOverOpen(false)}
        title="Add New Subject"
        description="Register a new subject/course to the academic catalog."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
            <input 
              type="text" required
              placeholder="e.g. Data Structures"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
            <input 
              type="text" required
              placeholder="e.g. CS301"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select 
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.department_id}
              onChange={(e) => setFormData({...formData, department_id: e.target.value})}
            >
              <option value="" disabled>Select Department</option>
              {departments?.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
              <input 
                type="number" min="1" max="10" required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.credits}
                onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lectures/Week</label>
              <input 
                type="number" min="1" max="10" required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.lectures_per_week}
                onChange={(e) => setFormData({...formData, lectures_per_week: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="is_lab"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              checked={formData.is_lab}
              onChange={(e) => setFormData({...formData, is_lab: e.target.checked})}
            />
            <label htmlFor="is_lab" className="text-sm font-medium text-slate-700">
              This is a practical/laboratory course
            </label>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsSlideOverOpen(false)}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createSubject.isPending}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
            >
              {createSubject.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Subject
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
