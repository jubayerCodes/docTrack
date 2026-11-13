'use client';

import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Calendar,
  RotateCcw,
  CalendarPlus,
  Layers,
  Loader2,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { CreatePatientModal } from '@/components/ui/CreatePatientModal';
import { EditPatientModal } from '@/components/ui/EditPatientModal';
import { ScheduleSessionModal } from '@/components/ui/ScheduleSessionModal';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { usePatients, usePatientMutations } from '@/hooks/usePatients';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { getInitials, formatDate, cn } from '@/lib/utils';
import { toggleSortOrder, isSortAscending } from '@/lib/sortUtils';
import { IPatient } from '@/types';

const GENDER_OPTIONS = [
  { label: 'All Genders', value: 'All Genders' },
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' },
  { label: 'Other', value: 'Other' },
];

const SORT_OPTIONS = [
  { label: 'Registered: Newest First (Desc)', value: 'newest' },
  { label: 'Registered: Oldest First (Asc)', value: 'oldest' },
  { label: 'Name: A → Z (Asc)', value: 'name-asc' },
  { label: 'Name: Z → A (Desc)', value: 'name-desc' },
  { label: 'Age: Youngest First (Asc)', value: 'age-asc' },
  { label: 'Age: Oldest First (Desc)', value: 'age-desc' },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 250);
  const isDebouncing = searchQuery.trim() !== debouncedSearch.trim();

  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientToDelete, setPatientToDelete] = useState<IPatient | null>(null);

  const { openCreatePatient, openEditPatient, openScheduleSession } = useUIStore();
  const { deletePatient } = usePatientMutations();

  const { data: responseData, isLoading, isFetching, isError, error } = usePatients({
    page: currentPage,
    limit: 8,
    q: debouncedSearch,
    gender: selectedGender,
    sort: selectedSort,
  });

  const isSearching = isDebouncing || isFetching;

  const patients = (responseData?.data as IPatient[]) || [];
  const meta = responseData?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('All Genders');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await deletePatient.mutateAsync(patientToDelete._id);
      setPatientToDelete(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete patient');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-1">
            Clinical Records
          </p>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-ink">
            Patient Directory
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Master patient roster, demographic profiles, and independent medical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={openCreatePatient}>
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Register Patient</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-card bg-surface border border-border shadow-card space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patient by name, phone, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-control border border-border bg-surface text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[150px]">
            <SelectDropdown
              options={GENDER_OPTIONS}
              value={selectedGender}
              onChange={(val) => {
                setSelectedGender(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-[170px]">
            <SelectDropdown
              options={SORT_OPTIONS}
              value={selectedSort}
              onChange={(val) => {
                setSelectedSort(val);
                setCurrentPage(1);
              }}
            />
          </div>

          {(searchQuery || selectedGender !== 'All Genders' || selectedSort !== 'newest') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="text-textMuted hover:text-ink px-2.5"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Patients Table Container */}
      <div className="rounded-card bg-surface border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-[10px] font-bold uppercase tracking-wider text-textMuted">
                <th className="py-3 px-4 sm:px-6">Patient Profile</th>
                <th className="py-3 px-4">Contact Information</th>
                <th className="py-3 px-4">Clinical Sessions</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-xs text-textMuted">
                    Loading patient records from MongoDB Atlas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-xs text-semantic-danger">
                    Failed to load patients: {(error as Error)?.message || 'Internal Error'}
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-xs text-textMuted">
                    No patients found matching your search or filters.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => {
                  const sessionsCount = patient.totalSessions ?? 0;

                  return (
                    <tr
                      key={patient._id}
                      className="hover:bg-surface-subtle/70 transition-colors group text-xs text-ink"
                    >
                      {/* Patient Profile */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 border border-primary/10">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <p className="font-bold text-ink leading-tight">
                              {patient.name}
                            </p>
                            <p className="text-[11px] text-textMuted mt-0.5">
                              {patient.age} yrs • {patient.gender}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          {patient.phone ? (
                            <p className="text-textSecondary flex items-center gap-1.5 font-medium">
                              <Phone className="w-3 h-3 text-textMuted" />
                              <span>{patient.phone}</span>
                            </p>
                          ) : (
                            <span className="text-textSubtle italic">No phone provided</span>
                          )}
                          {patient.email ? (
                            <p className="text-textMuted flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-textMuted" />
                              <span className="truncate max-w-[180px]">{patient.email}</span>
                            </p>
                          ) : (
                            <span className="text-textSubtle italic">No email on file</span>
                          )}
                        </div>
                      </td>

                      {/* Clinical Sessions Enrolled */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-soft text-primary border border-primary/15">
                          <Layers className="w-3 h-3 text-primary" />
                          <span>{sessionsCount} {sessionsCount === 1 ? 'Session' : 'Sessions'}</span>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-textMuted text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-textSubtle flex-shrink-0" />
                          <span>{formatDate(patient.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex justify-end">
                          <ActionMenu
                            items={[
                              {
                                label: 'Schedule Session',
                                icon: <CalendarPlus className="w-3.5 h-3.5 text-primary" />,
                                onClick: () =>
                                  openScheduleSession({
                                    patientId: patient._id,
                                    patientName: patient.name,
                                  }),
                              },
                              {
                                label: 'Edit Profile',
                                icon: <Edit3 className="w-3.5 h-3.5 text-textMuted" />,
                                onClick: () => openEditPatient(patient),
                              },
                              {
                                label: 'Delete Patient',
                                icon: <Trash2 className="w-3.5 h-3.5 text-semantic-danger" />,
                                variant: 'danger',
                                onClick: () => handleDeletePatient(patient),
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

        {/* Pagination Controls */}
        <div className="px-4 sm:px-6 pb-4">
          <PaginationBar
            currentPage={meta.page || 1}
            totalPages={meta.totalPages || 1}
            totalItems={meta.total || 0}
            limit={meta.limit || 8}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Modals */}
      <CreatePatientModal />
      <EditPatientModal />
      <ScheduleSessionModal />
    </div>
  );
}
