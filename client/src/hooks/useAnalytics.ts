import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export interface IAnalyticsKPIs {
  totalDoctors: number;
  totalPatients: number;
  activePatients: number;
  totalEncounters: number;
  todayScheduled: number;
  avgPerDoctor: number;
}

export interface ICaseloadDistribution {
  _id: string;
  count: number;
  doctorName: string;
  specialization: string;
}

export interface ITemporalTrend {
  _id: string;
  total: number;
  consultations: number;
  scheduled: number;
}

export interface ISpecializationDistribution {
  _id: string;
  count: number;
}

export interface IStatusBreakdown {
  _id: string;
  count: number;
}

export interface IAnalyticsSummary {
  kpis: IAnalyticsKPIs;
  caseloadDistribution: ICaseloadDistribution[];
  temporalTrends: ITemporalTrend[];
  specializationDistribution: ISpecializationDistribution[];
  statusBreakdown: IStatusBreakdown[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const res = await apiClient.get<IAnalyticsSummary>('/analytics/summary');
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
}
