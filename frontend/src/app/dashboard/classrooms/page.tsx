'use client';

import { School, Plus, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useClassrooms, useCreateClassroom } from '@/hooks/use-classrooms';
import { SlideOver } from '@/components/ui/slide-over';

export default function ClassroomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  
  const { data: classrooms, isLoading, isError } = useClassrooms();
  const createClassroom = useCreateClassroom();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    capacity: 60,
    is_lab: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClassroom.mutate(formData, {
      onSuccess: () => {
        setIsSlideOverOpen(false);
        setFormData({ name: '', capacity: 60, is_lab: false });
      }
    });
  };

  const filteredClassrooms = classrooms?.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <School className="h-8 w-8 text-emerald-500" />
            Classroom Allocation
          </h2>
          <p className="text-slate-500 mt-1">
            Manage physical spaces, labs, and their maximum capacities.
          </p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Space
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search rooms or labs..."
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
              Error loading classrooms. Are you connected to the backend?
            </div>
          ) : filteredClassrooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <School className="h-12 w-12 text-slate-300 mb-2" />
              <p>No classrooms found.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Room Name/Number</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Capacity</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClassrooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{room.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {room.is_lab ? 'Laboratory' : 'Lecture Hall'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="font-medium text-slate-800">{room.capacity}</span> seats
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        room.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {room.is_active ? 'Available' : 'Maintenance'}
                      </span>
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
        title="Add New Classroom"
        description="Register a new physical space for lectures or labs."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Room Name/Number</label>
            <input 
              type="text" required
              placeholder="e.g. Room 301, Physics Lab B"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (Number of Seats)</label>
            <input 
              type="number" min="1" max="500" required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="is_lab_room"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              checked={formData.is_lab}
              onChange={(e) => setFormData({...formData, is_lab: e.target.checked})}
            />
            <label htmlFor="is_lab_room" className="text-sm font-medium text-slate-700">
              This space is equipped as a Laboratory
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
              disabled={createClassroom.isPending}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
            >
              {createClassroom.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Classroom
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
