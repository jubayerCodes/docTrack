'use client';

import React, { useState } from 'react';
import {
  Search,
  CalendarPlus,
  Clock,
  Calendar,
  Activity,
  RotateCcw,
  Stethoscope,
  Trash2,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Phone,
  Mail,
  Loader2,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { TableSkeleton, CardListSkeleton } from '@/components/ui/Skeleton';
import { ScheduleSessionModal } from '@/components/ui/ScheduleSessionModal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { useSessions, useSessionMutations } from '@/hooks/useSessions';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { toggleSortOrder, isSortAscending } from '@/lib/sortUtils';
import { IPatientSession, IPatient, IDoctor } from '@/types';

const CONDITION_OPTIONS = [
  { label: 'All Conditions', value: 'All Conditions' },
  { label: 'Hypertension', value: 'Hypertension' },
  { label: 'Arrhythmia', value: 'Arrhythmia' },
  { label: 'Diabetes', value: 'Diabetes' },
  { label: 'Asthma', value: 'Asthma' },
  { label: 'Migraine', value: 'Migraine' },
  { label: 'Oncology', value: 'Oncology' },
  { label: 'Pediatric', value: 'Pediatric' },
  { label: 'Post-Op', value: 'Post-Op' },
  { label: 'Dermatology', value: 'Eczema' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'All Statuses' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const SORT_OPTIONS = [
  { label: 'Date: Newest First (Desc)', value: 'date-desc' },
  { label: 'Date: Oldest First (Asc)', value: 'date-asc' },
  { label: 'Patient: A → Z (Asc)', value: 'patient-asc' },
  { label: 'Patient: Z → A (Desc)', value: 'patient-desc' },
  { label: 'Doctor: A → Z (Asc)', value: 'doctor-asc' },
  { label: 'Doctor: Z → A (Desc)', value: 'doctor-desc' },
  { label: 'Status: A → Z (Asc)', value: 'status-asc' },
  { label: 'Status: Z → A (Desc)', value: 'status-desc' },
];

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);
  const isDebouncing = searchQuery.trim() !== debouncedSearch.trim();

  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedSort, setSelectedSort] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionToDelete, setSessionToDelete] = useState<IPatientSession | null>(null);

  const { openScheduleSession } = useUIStore();
  const { updateSession, deleteSession } = useSessionMutations();

  const { data: responseData, isLoading, isFetching, isError, error } = useSessions({
    page: currentPage,
    limit: 8,
    q: debouncedSearch,
    condition: selectedCondition,
    status: selectedStatus,
    sort: selectedSort,
  });

  const isSearching = isDebouncing || isFetching;

  const sessions = (responseData?.data as IPatientSession[]) || [];
  const meta = responseData?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCondition('All Conditions');
    setSelectedStatus('All Statuses');
    setSelectedSort('date-desc');
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSession.mutateAsync(sessionToDelete._id);
      setSessionToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  const handleStatusChange = async (sessionId: string, newStatus: IPatientSession['status']) => {
    try {
      await updateSession.mutateAsync({
        sessionId,
        data: { status: newStatus },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update encounter status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
            Clinical Encounters
          </p>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
            Sessions Directory
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Master schedule of clinical appointments, attending practitioners, and treatment encounter statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => openScheduleSession()} className="w-full sm:w-auto">
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>+ Schedule Session</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-card bg-surface border border-border shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full xl:w-72 2xl:w-80 flex-shrink-0">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          ) : (
            <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <input
            type="text"
            placeholder="Search by patient, doctor, condition, diagnosis..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-3.5 text-xs rounded-control bg-surface-subtle border border-border text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
          <div className="w-full sm:w-40">
            <SelectDropdown
              options={CONDITION_OPTIONS}
              value={selectedCondition}
              onChange={(val) => {
                setSelectedCondition(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-full sm:w-36">
            <SelectDropdown
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-56">
            <div className="flex-1">
              <SelectDropdown
                options={SORT_OPTIONS}
                value={selectedSort}
                onChange={(val) => {
                  setSelectedSort(val);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setSelectedSort((curr) => toggleSortOrder(curr))}
              title={
                isSortAscending(selectedSort)
                  ? 'Ascending order (Click to switch to Descending)'
                  : 'Descending order (Click to switch to Ascending)'
              }
              className="h-10 w-10 rounded-control border border-border bg-surface hover:bg-surface-subtle text-textSecondary hover:text-ink flex items-center justify-center transition-colors flex-shrink-0"
            >
              {isSortAscending(selectedSort) ? (
                <ArrowUpNarrowWide className="w-4 h-4 text-primary" />
              ) : (
                <ArrowDownNarrowWide className="w-4 h-4 text-primary" />
              )}
            </button>
          </div>

          {(searchQuery || selectedCondition !== 'All Conditions' || selectedStatus !== 'All Statuses' || selectedSort !== 'date-desc') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="h-10 text-textMuted hover:text-ink px-3 rounded-control self-start sm:self-auto flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="md:hidden space-y-3">
        {isLoading && !responseData ? (
          <CardListSkeleton count={4} />
        ) : isError ? (
          <div className="p-8 text-center text-xs text-semantic-danger rounded-card bg-surface border border-border">
            Failed to load sessions: {(error as Error)?.message || 'Internal Error'}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-xs text-textMuted rounded-card bg-surface border border-border">
            {isSearching ? 'Searching clinical encounters...' : 'No clinical sessions found matching your search or filters.'}
          </div>
        ) : (
          sessions.map((session) => {
            const patient = (typeof session.patientId === 'object' ? session.patientId : null) as IPatient | null;
            const doctor = (typeof session.doctorId === 'object' ? session.doctorId : null) as IDoctor | null;

            const patientName = patient?.name || 'Unknown Patient';
            const patientAge = patient?.age ? `${patient.age} yrs` : '';
            const patientGender = patient?.gender || '';

            return (
              <div
                key={session._id}
                className={cn(
                  'p-4 rounded-card bg-surface border border-border shadow-card space-y-3 transition-all',
                  isSearching && 'opacity-75'
                )}
              >
                {/* Header: Avatar, Patient Name, StatusBadge, ActionMenu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-primary/10">
                      {getInitials(patientName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-ink text-sm leading-tight truncate">
                        {patientName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-textMuted">
                        {patientAge && <span>{patientAge}</span>}
                        {patientAge && patientGender && <span>•</span>}
                        {patientGender && <span className="capitalize">{patientGender}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.status} />
                    <ActionMenu
                      items={[
                        ...(session.status !== 'active'
                          ? [
                              {
                                label: 'Set as Active',
                                icon: <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />,
                                onClick: () => handleStatusChange(session._id, 'active'),
                              },
                            ]
                          : []),
                        ...(session.status !== 'completed'
                          ? [
                              {
                                label: 'Mark as Completed',
                                icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />,
                                onClick: () => handleStatusChange(session._id, 'completed'),
                              },
                            ]
                          : []),
                        ...(session.status !== 'cancelled'
                          ? [
                              {
                                label: 'Cancel Session',
                                icon: <XCircle className="w-3.5 h-3.5 text-amber-600" />,
                                onClick: () => handleStatusChange(session._id, 'cancelled'),
                              },
                            ]
                          : []),
                        {
                          label: 'Delete Session',
                          icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                          variant: 'danger',
                          onClick: () => setSessionToDelete(session),
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Attending Doctor & Condition */}
                <div className="space-y-1.5 pt-1 text-xs">
                  {doctor?.name ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-textMuted flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-primary" />
                        <span>Doctor:</span>
                      </span>
                      <span className="font-semibold text-ink">{doctor.name}</span>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft text-primary border border-primary/15">
                        {doctor.specialization}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-textSubtle italic">Unassigned Practitioner</span>
                  )}

                  <div className="flex items-center gap-1.5 text-textSecondary font-medium">
                    <Activity className="w-3.5 h-3.5 text-[#2c9a8b] flex-shrink-0" />
                    <span className="truncate">{session.condition}</span>
                  </div>

                  {session.notes && (
                    <p className="text-[11px] text-textMuted italic bg-surface-subtle p-2 rounded-control">
                      {session.notes}
                    </p>
                  )}
                </div>

                {/* Footer: Appointment Date & Time */}
                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1 text-ink font-semibold">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{session.appointmentAt || '10:00 AM'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-textMuted">
                    <Calendar className="w-3.5 h-3.5 text-textSubtle" />
                    <span>{formatDate(session.sessionDate || session.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop / Laptop Sessions Table Container (md+) */}
      <div className="hidden md:block rounded-card bg-surface border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-[10px] font-bold uppercase tracking-wider text-textMuted">
                <th className="py-3 px-4 sm:px-6">Patient Profile</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Condition / Diagnosis</th>
                <th className="py-3 px-4">Appointment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && !responseData ? (
                <TableSkeleton rows={6} cols={6} />
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-semantic-danger">
                    Failed to load sessions: {(error as Error)?.message || 'Internal Error'}
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-textMuted">
                    {isSearching ? 'Searching clinical encounters...' : 'No clinical sessions found matching your search or filters.'}
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const patient = (typeof session.patientId === 'object' ? session.patientId : null) as IPatient | null;
                  const doctor = (typeof session.doctorId === 'object' ? session.doctorId : null) as IDoctor | null;

                  const patientName = patient?.name || 'Unknown Patient';
                  const patientAge = patient?.age ? `${patient.age} yrs` : '';
                  const patientGender = patient?.gender || '';

                  return (
                    <tr
                      key={session._id}
                      className={cn(
                        "hover:bg-surface-subtle/70 transition-all duration-150 group text-xs text-ink",
                        isSearching && "opacity-75"
                      )}
                    >
                      {/* Patient Profile */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-primary/10">
                            {getInitials(patientName)}
                          </div>
                          <div>
                            <p className="font-bold text-ink leading-tight">
                              {patientName}
                            </p>
                            <p className="text-[11px] text-textMuted mt-0.5">
                              {patientAge && `${patientAge} • `}{patientGender}
                            </p>
                            {patient?.phone && (
                              <p className="text-[10px] text-textSecondary flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5 text-textMuted" />
                                <span>{patient.phone}</span>
                              </p>
                            )}
                            {patient?.email && (
                              <p className="text-[10px] text-textMuted flex items-center gap-1 mt-0.5">
                                <Mail className="w-2.5 h-2.5 text-textMuted" />
                                <span className="truncate max-w-[140px]">{patient.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Attending Doctor */}
                      <td className="py-3.5 px-4">
                        {doctor?.name ? (
                          <div>
                            <p className="font-semibold text-ink leading-tight flex items-center gap-1">
                              <Stethoscope className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="truncate max-w-[160px]">{doctor.name}</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft text-primary border border-primary/15">
                                {doctor.specialization}
                              </span>
                            </div>
                            {doctor.hospital && (
                              <p className="text-[10px] text-textMuted mt-0.5 truncate max-w-[160px]">
                                {doctor.hospital}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-textSubtle italic">
                            Unassigned Practitioner
                          </span>
                        )}
                      </td>

                      {/* Condition / Diagnosis */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-textSecondary font-medium">
                            <Activity className="w-3.5 h-3.5 text-[#2c9a8b] flex-shrink-0" />
                            <span className="truncate max-w-[180px]" title={session.condition}>
                              {session.condition}
                            </span>
                          </div>
                          {session.notes && (
                            <p className="text-[10px] text-textMuted italic truncate max-w-[200px] mt-0.5">
                              {session.notes}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Appointment Time & Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="text-ink font-semibold flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                            <span>{session.appointmentAt || '10:00 AM'}</span>
                          </p>
                          <p className="text-textMuted flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-textSubtle flex-shrink-0" />
                            <span>{formatDate(session.sessionDate || session.createdAt)}</span>
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={session.status} />
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex justify-end">
                          <ActionMenu
                            items={[
                              ...(session.status !== 'active'
                                ? [
                                    {
                                      label: 'Set as Active',
                                      icon: <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />,
                                      onClick: () => handleStatusChange(session._id, 'active'),
                                    },
                                  ]
                                : []),
                              ...(session.status !== 'completed'
                                ? [
                                    {
                                      label: 'Mark as Completed',
                                      icon: <CheckCircle2 className="w-3.5 h-3.5 text-primary" />,
                                      onClick: () => handleStatusChange(session._id, 'completed'),
                                    },
                                  ]
                                : []),
                              ...(session.status !== 'cancelled'
                                ? [
                                    {
                                      label: 'Cancel Session',
                                      icon: <XCircle className="w-3.5 h-3.5 text-amber-600" />,
                                      onClick: () => handleStatusChange(session._id, 'cancelled'),
                                    },
                                  ]
                                : []),
                              {
                                label: 'Delete Session',
                                icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                                variant: 'danger',
                                onClick: () => setSessionToDelete(session),
                              },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls — only shown when data is loaded and there are records */}
      {!isLoading && sessions.length > 0 && (meta.total ?? 0) > 0 && (
        <div className="rounded-card bg-surface border border-border shadow-card p-3.5 sm:px-6">
          <PaginationBar
            currentPage={meta.page || 1}
            totalPages={meta.totalPages || 1}
            totalItems={meta.total || 0}
            limit={meta.limit || 8}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Modals */}
      <ScheduleSessionModal />

      {/* Confirmation Modal for Session Deletion */}
      <ConfirmDeleteModal
        isOpen={Boolean(sessionToDelete)}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteSession.isPending}
        title="Delete Clinical Session"
        itemType="clinical session for"
        itemName={
          typeof sessionToDelete?.patientId === 'object' && sessionToDelete?.patientId
            ? (sessionToDelete.patientId as IPatient).name
            : 'this encounter'
        }
        description="Are you sure you want to delete this clinical session? The patient's master record will remain intact."
        confirmText="Delete Session"
      />
    </div>
  );
}
