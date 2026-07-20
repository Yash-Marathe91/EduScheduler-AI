import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api-client';

export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  faculty_details: {
    department_id: string | null;
    designation: string | null;
    employee_id: string | null;
    is_verified: boolean | null;
  } | null;
  student_details: {
    enrollment_number: string | null;
    batch_id: string | null;
    current_semester_id: string | null;
    phone: string | null;
  } | null;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchWithAuth('/profiles/me'),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<ProfileData>) => 
      fetchWithAuth('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: query.data as ProfileData | undefined,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
