import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { IDoctor, IPatientSession } from '../types';

export interface IDoctorFilters {
  page?: number;
  limit?: number;
  q?: string;
  specialization?: string;
  sort?: string;
}

export function useDoctors(filters: IDoctorFilters = {}) {
  const { page = 1, limit = 10, q = '', specialization = '', sort = 'newest' } = filters;

  const queryParams = new URLSearchParams();
  if (page) queryParams.set('page', String(page));
  if (limit) queryParams.set('limit', String(limit));
  if (q.trim()) queryParams.set('q', q.trim());
  if (specialization && specialization !== 'All Specializations') {
    queryParams.set('specialization', specialization);
  }
  if (sort) queryParams.set('sort', sort);

  return useQuery({
    queryKey: ['doctors', { page, limit, q, specialization, sort }],
    queryFn: async () => {
      const res = await apiClient.get<IDoctor[]>(`/doctors?${queryParams.toString()}`);
      return res;
    },
  });
}

export function useDoctorPatients(doctorId?: string | null) {
  return useQuery({
    queryKey: ['doctorPatients', doctorId],
    queryFn: async () => {
      if (!doctorId) return null;
      const res = await apiClient.get<{
        doctor: { id: string; name: string; specialization: string };
        count: number;
        sessions: IPatientSession[];
      }>(`/doctors/${doctorId}/patients`);
      return res.data;
    },
    enabled: Boolean(doctorId),
  });
}

export function useDoctorMutations() {
  const queryClient = useQueryClient();

  const createDoctor = useMutation({
    mutationFn: async (payload: {
      name: string;
      specialization: string;
      hospital: string;
      phone?: string;
      email?: string;
    }) => {
      const res = await apiClient.post<IDoctor>('/doctors', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  const updateDoctor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IDoctor> }) => {
      const res = await apiClient.put<IDoctor>(`/doctors/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/doctors/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  return { createDoctor, updateDoctor, deleteDoctor };
}

export function useDisassociateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctorId, sessionId }: { doctorId: string; sessionId: string }) => {
      const res = await apiClient.delete(`/sessions/${sessionId}?doctorId=${doctorId}`);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctorPatients', variables.doctorId] });
    },
  });
}
