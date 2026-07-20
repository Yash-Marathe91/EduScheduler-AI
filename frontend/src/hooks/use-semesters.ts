import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface Semester {
  id: string;
  name: string;
  department_id: string;
}

export function useSemesters() {
  return useQuery({
    queryKey: ['semesters'],
    queryFn: () => fetchWithAuth('/semesters/'),
  });
}
