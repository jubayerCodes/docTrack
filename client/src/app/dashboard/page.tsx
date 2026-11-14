'use client';

import React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Users,
  CalendarCheck2,
  Activity,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Skeleton, ChartSkeleton, DonutSkeleton } from '@/components/ui/Skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';

const PIE_COLORS = [
  '#6559cc', // Purple primary
  '#2c9a8b', // Teal success
  '#3b82f6', // Blue info
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
];

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { data, isLoading, isError, error, refetch, isFetching } = useAnalytics();

  const kpis = data?.kpis || {
    totalDoctors: 0,
    totalPatients: 0,
    activePatients: 0,
    totalEncounters: 0,
    todayScheduled: 0,
    avgPerDoctor: 0,
  };

  const caseloadData = (data?.caseloadDistribution || []).map((item) => ({
    name: item.doctorName.replace(/^(Dr\.)\s*/i, ''),
    fullName: item.doctorName,
    patients: item.count,
    specialty: item.specialization,
  }));

  const trendData = (data?.temporalTrends || []).map((item) => {
    const parts = item._id.split('-');
    const dateLabel = parts.length === 3 ? `${parts[1]}/${parts[2]}` : item._id;
    return {
      date: dateLabel,
      fullDate: item._id,
      consultations: item.consultations,
      scheduled: item.scheduled,
      total: item.total,
    };
  });

  const specialtyData = (data?.specializationDistribution || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
            Care Network Intelligence
          </p>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
            Executive Analytics Dashboard
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Real-time practitioner caseloads, encounter volumes, and clinical specialization balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            isLoading={isFetching}
            title="Refresh analytics data"
            className="flex-1 sm:flex-initial"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Sync Live Data</span>
          </Button>

          {isAdmin && (
            <Link href="/doctors" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" className="w-full">
                <Stethoscope className="w-3.5 h-3.5 mr-1" />
                <span>Doctor Directory</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Doctors */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card hover:border-primary/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Medical Staff
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-ink">
              {isLoading ? <Skeleton className="h-8 w-16 my-0.5" /> : kpis.totalDoctors}
            </div>
            <p className="text-xs text-textSecondary mt-1 flex items-center gap-1">
              <span className="text-[#2c9a8b] font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> Active Roster
              </span>
              <span>across 8 clinics</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Patients */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card hover:border-primary/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Patient Population
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2c9a8b]/15 text-[#2c9a8b] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-ink">
              {isLoading ? <Skeleton className="h-8 w-16 my-0.5" /> : kpis.activePatients}
            </div>
            <p className="text-xs text-textSecondary mt-1">
              Out of{' '}
              <span className="font-semibold text-ink">
                {isLoading ? <Skeleton className="inline-block h-3.5 w-8 align-middle" /> : kpis.totalPatients}
              </span>{' '}
              registered records
            </p>
          </div>
        </div>

        {/* Card 3: Encounters */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card hover:border-primary/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Clinical Encounters
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-ink">
              {isLoading ? <Skeleton className="h-8 w-16 my-0.5" /> : kpis.totalEncounters}
            </div>
            <p className="text-xs text-textSecondary mt-1">
              <span className="font-semibold text-ink">
                {isLoading ? <Skeleton className="inline-block h-3.5 w-8 align-middle" /> : kpis.todayScheduled}
              </span>{' '}
              scheduled for today
            </p>
          </div>
        </div>

        {/* Card 4: Caseload Ratio */}
        <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card hover:border-primary/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-textMuted uppercase tracking-wider">
              Avg Caseload Ratio
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/15 text-[#f59e0b] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-heading font-bold text-ink">
              {isLoading ? <Skeleton className="h-8 w-24 my-0.5" /> : `${kpis.avgPerDoctor} / doc`}
            </div>
            <p className="text-xs text-textSecondary mt-1 flex items-center gap-1 text-[#2c9a8b] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Optimal capacity load</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Caseload Bar Chart & Specialty Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-w-0">
        {/* Top Doctors Caseload Bar Chart */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-heading font-bold text-ink">
                Practitioner Caseload Distribution
              </h2>
              <p className="text-xs text-textSecondary">
                Top physicians ranked by active and scheduled patient sessions.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/10">
              Live Aggregate
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2 min-w-0">
            {isLoading ? (
              <ChartSkeleton />
            ) : isError ? (
              <div className="h-full flex items-center justify-center text-xs text-semantic-danger">
                Failed to load analytics: {(error as Error)?.message}
              </div>
            ) : caseloadData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-textMuted">
                No active caseload data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseloadData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="p-2.5 rounded-lg bg-surface border border-border shadow-dropdown text-xs">
                            <p className="font-bold text-ink">{item.fullName}</p>
                            <p className="text-primary text-[11px] font-semibold">{item.specialty}</p>
                            <p className="text-textSecondary mt-1">
                              Active Caseload:{' '}
                              <span className="font-bold text-ink">{item.patients} Patients</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="patients"
                    fill="#6559cc"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Specialization Distribution Donut */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-heading font-bold text-ink">
                Specialty Breakdown
              </h2>
              <p className="text-xs text-textSecondary">
                Medical specialties distribution in the provider network.
              </p>
            </div>
            <div className="w-6 h-6 rounded-md bg-surface-subtle flex items-center justify-center text-textMuted">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center min-w-0">
            {isLoading ? (
              <DonutSkeleton />
            ) : specialtyData.length === 0 ? (
              <div className="text-xs text-textMuted">No specialty data available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specialtyData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {specialtyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const entry = payload[0];
                        return (
                          <div className="p-2 rounded-md bg-surface border border-border shadow-dropdown text-xs">
                            <p className="font-semibold text-ink">{entry.name}</p>
                            <p className="text-textSecondary font-medium">
                              {entry.value} Practitioners
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: 14-Day Encounter Timeline Area Chart */}
      <div className="p-4 sm:p-5 rounded-card bg-surface border border-border shadow-card min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-heading font-bold text-ink">
              Encounter Volume &amp; Consultation Trends
            </h2>
            <p className="text-xs text-textSecondary">
              Daily volume of completed clinical consultations vs scheduled upcoming appointments.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-ink font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>Consultations</span>
            </span>
            <span className="flex items-center gap-1.5 text-textSecondary font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2c9a8b]" />
              <span>Scheduled</span>
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2 min-w-0">
          {isLoading ? (
            <ChartSkeleton />
          ) : trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-textMuted">
              No trend data recorded in the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="consultationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6559cc" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6559cc" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="scheduledGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2c9a8b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2c9a8b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-lg bg-surface border border-border shadow-dropdown text-xs space-y-1">
                          <p className="font-bold text-ink">{item.fullDate}</p>
                          <p className="text-primary font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Consultations: {item.consultations}
                          </p>
                          <p className="text-[#2c9a8b] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#2c9a8b]" />
                            Scheduled: {item.scheduled}
                          </p>
                          <p className="text-textMuted border-t border-border pt-1">
                            Total Daily Encounters: {item.total}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="consultations"
                  stroke="#6559cc"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#consultationGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="scheduled"
                  stroke="#2c9a8b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scheduledGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
