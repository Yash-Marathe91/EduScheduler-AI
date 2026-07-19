import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface TimetableSlot {
  batch_id: string;
  subject_id: string;
  faculty_id: string;
  classroom_id: string;
  day_of_week: number;
  start_time: number;
  duration_minutes: number;
  is_lab: boolean;
}

export interface GenerateTimetableRequest {
  department_id: string;
  semester_id: string;
  days: number;
  periods_per_day: number;
}

export interface GenerateTimetableResponse {
  status: string;
  message: string;
  schedule: TimetableSlot[];
}

export function useGenerateTimetable() {
  return useMutation({
    mutationFn: (request: GenerateTimetableRequest) =>
      fetchWithAuth('/timetable/generate', {
        method: 'POST',
        body: JSON.stringify(request),
      }),
  });
}

export function useTimetableSlots() {
  return useQuery({
    queryKey: ['timetable_slots'],
    queryFn: () => fetchWithAuth('/timetable/slots'),
  });
}
