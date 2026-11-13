import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { IPatientSession } from '../types';

export interface ISessionFilters {
  page?: number;
  limit?: number;
  q?: string;
  condition?: string;
  status?: string;
  doctorId?: string;
  patientId?: string;
}

export function useSessions(filters: ISessionFilters = {}) {
  const {
    page = 1,
    limit = 8,
    q = '',
    condition = '',
    status = '',
    doctorId = '',
    patientId = '',
  } = filters;

  const queryParams = new URLSearchParams();
  if (page) queryParams.set('page', String(page));
  if (limit) queryParams.set('limit', String(limit));
  if (q.trim()) queryParams.set('q', q.trim());
  if (condition && condition !== 'All Conditions') {
    queryParams.set('condition', condition);
  }
  if (status && status !== 'All Statuses') {
    queryParams.set('status', status);
  }
  if (doctorId) queryParams.set('doctorId', doctorId);
  if (patientId) queryParams.set('patientId', patientId);

  return useQuery({
    queryKey: ['sessions', { page, limit, q, condition, status, doctorId, patientId }],
    queryFn: async () => {
      const res = await apiClient.get<IPatientSession[]>(`/sessions?${queryParams.toString()}`);
      return res;
    },
  });
}

export function useSession(id?: string | null) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get<IPatientSession>(`/sessions/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useSessionMutations() {
  const queryClient = useQueryClient();

  const updateSession = useMutation({
    mutationFn: async ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: Partial<IPatientSession>;
    }) => {
      const res = await apiClient.patch<IPatientSession>(`/sessions/${sessionId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctorPatients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiClient.delete(`/sessions/${sessionId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctorPatients'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return { updateSession, deleteSession };
}
