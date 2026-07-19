import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  is_lab: boolean;
  is_active: boolean;
}

export function useClassrooms() {
  return useQuery<Classroom[]>({
    queryKey: ['classrooms'],
    queryFn: () => fetchWithAuth('/classrooms/'),
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newClassroom: Omit<Classroom, 'id' | 'is_active'>) =>
      fetchWithAuth('/classrooms/', {
        method: 'POST',
        body: JSON.stringify(newClassroom),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
  });
}
