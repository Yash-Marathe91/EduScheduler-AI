import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface SettingsData {
  id: string;
  department_id: string | null;
  max_consecutive_lectures: number;
  lunch_break_start: number; // in minutes (e.g., 750 = 12:30 PM)
  lunch_break_duration: number; // in minutes
  allow_saturday_classes: boolean;
}

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchWithAuth('/settings'),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<SettingsData>) => 
      fetchWithAuth('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    settings: query.data as SettingsData | undefined,
    isLoading: query.isLoading,
    error: query.error,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
