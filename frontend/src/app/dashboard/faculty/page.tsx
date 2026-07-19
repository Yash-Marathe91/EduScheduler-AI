'use client';

import { Users, Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFaculty, useCreateFaculty } from '@/hooks/use-faculty';
import { useDepartments } from '@/hooks/use-departments';
import { SlideOver } from '@/components/ui/slide-over';

export default function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  
  const { data: facultyList, isLoading, isError } = useFaculty();
  const { data: departments } = useDepartments();
  const createFaculty = useCreateFaculty();
  
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    designation: '', 
    department_id: '',
    max_lectures_per_week: 15
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFaculty.mutate(formData, {
      onSuccess: () => {
        setIsSlideOverOpen(false);
        setFormData({ first_name: '', last_name: '', email: '', designation: '', department_id: '', max_lectures_per_week: 15 });
      }
    });
  };

  const filteredFaculty = facultyList?.filter(fac => 
    `${fac.first_name} ${fac.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    fac.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getDepartmentName = (id: string) => {
    return departments?.find(d => d.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-pink-600" />
            Faculty Management
          </h2>
          <p className="text-slate-500 mt-1">
            Manage teaching staff, roles, and workload capacities.
          </p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Faculty
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search faculty by name or email..."
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
              Error loading faculty. Are you connected to the backend?
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Users className="h-12 w-12 text-slate-300 mb-2" />
              <p>No faculty found.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Faculty Details</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Designation</th>
                  <th className="px-6 py-4 font-medium">Weekly Load</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-slate-50/80 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {faculty.first_name[0]}{faculty.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{faculty.first_name} {faculty.last_name}</div>
                          <div className="text-slate-500 text-xs">{faculty.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {getDepartmentName(faculty.department_id)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {faculty.designation}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-700 font-medium text-xs">Max {faculty.max_lectures_per_week} Hrs</span>
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
        title="Add New Faculty"
        description="Register a new faculty member and assign them to a department."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
            <input 
              type="text" required
              placeholder="e.g. Professor, Assistant Professor"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.designation}
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Lectures / Week</label>
            <input 
              type="number" min="1" max="40" required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.max_lectures_per_week}
              onChange={(e) => setFormData({...formData, max_lectures_per_week: parseInt(e.target.value)})}
            />
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
              disabled={createFaculty.isPending}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
            >
              {createFaculty.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Faculty
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
