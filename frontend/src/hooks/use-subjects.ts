import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  credits: number;
  lectures_per_week: number;
  is_lab: boolean;
  is_active: boolean;
}

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: () => fetchWithAuth('/subjects'),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newSubject: Omit<Subject, 'id' | 'is_active'>) =>
      fetchWithAuth('/subjects', {
        method: 'POST',
        body: JSON.stringify(newSubject),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}
