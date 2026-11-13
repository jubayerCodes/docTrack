import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { IPatient, IPatientSession } from '../types';

export interface IPatientFilters {
  page?: number;
  limit?: number;
  q?: string;
  gender?: string;
  sort?: string;
  condition?: string;
  status?: string;
}

export function usePatients(filters: IPatientFilters = {}) {
  const { page = 1, limit = 10, q = '', gender = '', sort = '', condition = '', status = '' } = filters;

  const queryParams = new URLSearchParams();
  if (page) queryParams.set('page', String(page));
  if (limit) queryParams.set('limit', String(limit));
  if (q.trim()) queryParams.set('q', q.trim());
  if (gender && gender !== 'All Genders') {
    queryParams.set('gender', gender);
  }
  if (sort) {
    queryParams.set('sort', sort);
  }
  if (condition && condition !== 'All Conditions') {
    queryParams.set('condition', condition);
  }
  if (status && status !== 'All Statuses') {
    queryParams.set('status', status);
  }

  return useQuery({
    queryKey: ['patients', { page, limit, q, gender, sort, condition, status }],
    queryFn: async () => {
      const res = await apiClient.get<IPatient[]>(`/patients?${queryParams.toString()}`);
      return res;
    },
    placeholderData: keepPreviousData,
  });
}

export function usePatient(id?: string | null) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get<{ patient: IPatient; sessions: IPatientSession[] }>(
        `/patients/${id}`
      );
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function usePatientMutations() {
  const queryClient = useQueryClient();

  const createPatient = useMutation({
    mutationFn: async (payload: {
      name: string;
      phone: string;
      email?: string;
      age: number;
      gender: string;
    }) => {
      const res = await apiClient.post<IPatient>('/patients', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<IPatient> }) => {
      const res = await apiClient.put<IPatient>(`/patients/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
    },
  });

  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/patients/${id}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
  });

  return { createPatient, updatePatient, deletePatient };
}

export interface IAssignSessionPayload {
  mode: 'existing' | 'new';
  patientId?: string;
  name?: string;
  phone?: string;
  email?: string;
  age?: number;
  gender?: string;
  condition: string;
  sessionDate?: string | Date;
  appointmentAt?: string;
  status?: string;
  notes?: string;
}

export function useAssignSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doctorId,
      payload,
    }: {
      doctorId: string;
      payload: IAssignSessionPayload;
    }) => {
      const res = await apiClient.post<IPatientSession>('/sessions', {
        ...payload,
        doctorId,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['doctorPatients', variables.doctorId] });
    },
  });
}
