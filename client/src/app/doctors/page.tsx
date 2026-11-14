'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  UserPlus,
  Phone,
  Mail,
  CalendarPlus,
  Loader2,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { TableSkeleton, CardListSkeleton } from '@/components/ui/Skeleton';
import { CreateDoctorModal } from '@/components/ui/CreateDoctorModal';
import { AssignedPatientsModal } from '@/components/ui/AssignedPatientsModal';
import { AssignPatientModal } from '@/components/ui/AssignPatientModal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { useDoctors, useDoctorMutations } from '@/hooks/useDoctors';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { toggleSortOrder, isSortAscending } from '@/lib/sortUtils';
import { IDoctor } from '@/types';

const SPECIALIZATION_FILTERS = [
  { label: 'All Specializations', value: 'All Specializations' },
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Neurology', value: 'Neurology' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Orthopedics', value: 'Orthopedics' },
  { label: 'Oncology', value: 'Oncology' },
  { label: 'Dermatology', value: 'Dermatology' },
  { label: 'Psychiatry', value: 'Psychiatry' },
  { label: 'General Medicine', value: 'General Medicine' },
];

const SORT_OPTIONS = [
  { label: 'Date: Newest First (Desc)', value: 'newest' },
  { label: 'Date: Oldest First (Asc)', value: 'oldest' },
  { label: 'Name: A → Z (Asc)', value: 'name-asc' },
  { label: 'Name: Z → A (Desc)', value: 'name-desc' },
  { label: 'Caseload: High → Low (Desc)', value: 'patients-desc' },
  { label: 'Caseload: Low → High (Asc)', value: 'patients-asc' },
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specializations');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorToDelete, setDoctorToDelete] = useState<IDoctor | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 250);
  const isDebouncing = searchQuery.trim() !== debouncedSearch.trim();

  const { data, isLoading, isFetching, isError, error } = useDoctors({
    page: currentPage,
    limit: 8,
    q: debouncedSearch,
    specialization: selectedSpecialty,
    sort: selectedSort,
  });

  const isSearching = isDebouncing || isFetching;

  const { deleteDoctor } = useDoctorMutations();
  const { openCreateDoctor, openAssignedPatients, openAssignPatient } = useUIStore();

  const doctors = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All Specializations');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSpecialty !== 'All Specializations' ||
    selectedSort !== 'newest';

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteDoctor.mutateAsync(doctorToDelete._id);
      setDoctorToDelete(null);
    } catch {
      // Error is handled in mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-primary mb-1">
            Care Network
          </p>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
            Doctor Directory
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Manage your medical practitioners and view active patient caseloads.
          </p>
        </div>

        <Button
          onClick={openCreateDoctor}
          variant="primary"
          className="w-full sm:w-auto self-stretch sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Doctor</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-card bg-surface border border-border shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full xl:w-72 2xl:w-80 flex-shrink-0">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          ) : (
            <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
          <input
            type="text"
            placeholder="Search doctor by name, hospital, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            className="w-full h-10 pl-10 pr-3.5 text-xs rounded-control bg-surface-subtle border border-border text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Dropdowns & Filter Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
          <div className="w-full sm:w-48">
            <SelectDropdown
              options={SPECIALIZATION_FILTERS}
              value={selectedSpecialty}
              onChange={(val) => {
                setSelectedSpecialty(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-full sm:w-56 flex items-center gap-1.5">
            <div className="flex-1">
              <SelectDropdown
                options={SORT_OPTIONS}
                value={selectedSort}
                onChange={(val) => setSelectedSort(val)}
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

          {hasActiveFilters && (
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
        {isLoading && !data ? (
          <CardListSkeleton count={4} />
        ) : isError ? (
          <div className="p-8 text-center text-xs text-semantic-danger rounded-card bg-surface border border-border">
            Failed to load doctors: {(error as Error)?.message || 'Internal Error'}
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-xs text-textMuted rounded-card bg-surface border border-border">
            {isSearching ? 'Searching doctors directory...' : 'No doctors found matching your search or filters.'}
          </div>
        ) : (
          doctors.map((doctor) => {
            const activePatients = doctor.activePatientsCount || 0;

            return (
              <div
                key={doctor._id}
                className={cn(
                  'p-4 rounded-card bg-surface border border-border shadow-card space-y-3 transition-all',
                  isSearching && 'opacity-75'
                )}
              >
                {/* Header: Avatar, Name, Specialization, Action Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-primary/10">
                      {getInitials(doctor.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-ink text-sm leading-tight truncate">
                        {doctor.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft text-primary">
                          {doctor.specialization}
                        </span>
                        <span className="text-[10px] text-textMuted truncate">
                          {doctor.hospital}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ActionMenu
                    items={[
                      {
                        label: 'View Patients',
                        icon: <UserPlus className="w-3.5 h-3.5 text-primary" />,
                        onClick: () =>
                          openAssignedPatients({
                            id: doctor._id,
                            name: doctor.name,
                            specialization: doctor.specialization,
                          }),
                      },
                      {
                        label: 'Assign Patient',
                        icon: <CalendarPlus className="w-3.5 h-3.5 text-[#2c9a8b]" />,
                        onClick: () =>
                          openAssignPatient({
                            id: doctor._id,
                            name: doctor.name,
                            specialization: doctor.specialization,
                          }),
                      },
                      {
                        label: 'Edit Profile',
                        icon: <Edit3 className="w-3.5 h-3.5 text-textMuted" />,
                        onClick: () => alert(`Edit profile for ${doctor.name}`),
                      },
                      {
                        label: 'Delete Doctor',
                        icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                        variant: 'danger',
                        onClick: () => setDoctorToDelete(doctor),
                      },
                    ]}
                  />
                </div>

                {/* Contact & Active Caseload Row */}
                <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-3 text-[11px]">
                    {doctor.phone && (
                      <a
                        href={`tel:${doctor.phone}`}
                        className="text-textSecondary hover:text-primary flex items-center gap-1 font-medium"
                      >
                        <Phone className="w-3 h-3 text-textMuted" />
                        <span>{doctor.phone}</span>
                      </a>
                    )}
                    {doctor.email && (
                      <a
                        href={`mailto:${doctor.email}`}
                        className="text-textMuted hover:text-primary flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-textMuted" />
                        <span className="truncate max-w-[150px]">{doctor.email}</span>
                      </a>
                    )}
                  </div>

                  {/* Active caseload count button */}
                  <button
                    type="button"
                    onClick={() =>
                      openAssignedPatients({
                        id: doctor._id,
                        name: doctor.name,
                        specialization: doctor.specialization,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline bg-primary-soft/60 px-2.5 py-1 rounded-control ml-auto"
                  >
                    <span>{activePatients} Patients</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop / Laptop Doctors Table Container (md+) */}
      <div className="hidden md:block rounded-card bg-surface border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-[10px] font-bold uppercase tracking-wider text-textMuted">
                <th className="py-3 px-4 sm:px-6">Doctor Profile</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Hospital / Clinic</th>
                <th className="py-3 px-4">Contact Information</th>
                <th className="py-3 px-4">Assigned Patients</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && !data ? (
                <TableSkeleton rows={6} cols={6} />
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-semantic-danger">
                    Failed to load doctors: {(error as Error)?.message || 'Internal Error'}
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-textMuted">
                    {isSearching ? 'Searching doctors directory...' : 'No doctors found matching your search or filters.'}
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => {
                  const activePatients = doctor.activePatientsCount || 0;

                  return (
                    <tr
                      key={doctor._id}
                      className={cn(
                        "hover:bg-surface-subtle/70 transition-all duration-150 group text-xs text-ink",
                        isSearching && "opacity-75"
                      )}
                    >
                      {/* Doctor Profile */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-primary/10">
                            {getInitials(doctor.name)}
                          </div>
                          <div>
                            <p className="font-bold text-ink leading-tight">
                              {doctor.name}
                            </p>
                            <p className="text-[10px] text-textMuted mt-0.5">
                              Joined {formatDate(doctor.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary-soft text-primary">
                          {doctor.specialization}
                        </span>
                      </td>

                      {/* Hospital / Clinic */}
                      <td className="py-3.5 px-4 font-medium text-textSecondary">
                        {doctor.hospital}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          {doctor.phone && (
                            <p className="text-textSecondary flex items-center gap-1.5 font-medium">
                              <Phone className="w-3 h-3 text-textMuted" />
                              <span>{doctor.phone}</span>
                            </p>
                          )}
                          {doctor.email && (
                            <p className="text-textMuted flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-textMuted" />
                              <span className="truncate max-w-[180px]">{doctor.email}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Assigned Patients (Opens Centered Modal) */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() =>
                            openAssignedPatients({
                              id: doctor._id,
                              name: doctor.name,
                              specialization: doctor.specialization,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
                        >
                          <span>{activePatients} Patients</span>
                          <span className="text-[11px]">→</span>
                        </button>
                      </td>

                      {/* Actions Menu (Fixed Portal positioning, no table overflow) */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex justify-end">
                          <ActionMenu
                            items={[
                              {
                                label: 'View Patients',
                                icon: <UserPlus className="w-3.5 h-3.5 text-primary" />,
                                onClick: () =>
                                  openAssignedPatients({
                                    id: doctor._id,
                                    name: doctor.name,
                                    specialization: doctor.specialization,
                                  }),
                              },
                              {
                                label: 'Assign Patient',
                                icon: <CalendarPlus className="w-3.5 h-3.5 text-[#2c9a8b]" />,
                                onClick: () =>
                                  openAssignPatient({
                                    id: doctor._id,
                                    name: doctor.name,
                                    specialization: doctor.specialization,
                                  }),
                              },
                              {
                                label: 'Edit Profile',
                                icon: <Edit3 className="w-3.5 h-3.5 text-textMuted" />,
                                onClick: () => alert(`Edit profile for ${doctor.name}`),
                              },
                              {
                                label: 'Delete Doctor',
                                icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                                variant: 'danger',
                                onClick: () => setDoctorToDelete(doctor),
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
      {!isLoading && doctors.length > 0 && (meta.total ?? 0) > 0 && (
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
      <CreateDoctorModal />
      <AssignedPatientsModal />
      <AssignPatientModal />

      {/* Confirmation Modal for Doctor Deletion */}
      <ConfirmDeleteModal
        isOpen={Boolean(doctorToDelete)}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDoctor.isPending}
        title="Delete Doctor Profile"
        itemType="doctor"
        itemName={doctorToDelete?.name}
        description={`Are you sure you want to delete ${doctorToDelete?.name}? This will permanently remove their profile and disassociate all active clinical encounters.`}
        confirmText="Delete Doctor"
      />
    </div>
  );
}
