import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: () => fetchWithAuth('/departments/'),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newDepartment: Omit<Department, 'id' | 'is_active'>) =>
      fetchWithAuth('/departments/', {
        method: 'POST',
        body: JSON.stringify(newDepartment),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
