import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface Faculty {
  id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  designation: string;
  department_id: string;
  max_lectures_per_week: number;
  is_active: boolean;
}

export function useFaculty() {
  return useQuery<Faculty[]>({
    queryKey: ['faculty'],
    queryFn: () => fetchWithAuth('/faculty'),
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newFaculty: Omit<Faculty, 'id' | 'is_active' | 'user_id'>) =>
      fetchWithAuth('/faculty', {
        method: 'POST',
        body: JSON.stringify(newFaculty),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
    },
  });
}
