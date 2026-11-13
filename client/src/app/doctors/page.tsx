'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, UserPlus, Phone, Mail, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { CreateDoctorModal } from '@/components/ui/CreateDoctorModal';
import { AssignedPatientsModal } from '@/components/ui/AssignedPatientsModal';
import { AssignPatientModal } from '@/components/ui/AssignPatientModal';
import { useDoctors, useDoctorMutations } from '@/hooks/useDoctors';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { getInitials, formatDate } from '@/lib/utils';
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
  { label: 'Sort: Newest First', value: 'newest' },
  { label: 'Sort: Name (A-Z)', value: 'alpha' },
  { label: 'Sort: Active Caseload', value: 'patients' },
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specializations');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading, isError, error } = useDoctors({
    page: currentPage,
    limit: 8,
    q: debouncedSearch,
    specialization: selectedSpecialty,
    sort: selectedSort,
  });

  const { deleteDoctor } = useDoctorMutations();
  const { openCreateDoctor, openAssignedPatients, openAssignPatient } = useUIStore();

  const doctors = data?.data || [];
  const meta = data?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 };

  const handleDeleteDoctor = async (doctor: IDoctor) => {
    if (confirm(`Are you sure you want to delete ${doctor.name}? This will disassociate any active encounters.`)) {
      await deleteDoctor.mutateAsync(doctor._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Doctor</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3.5 rounded-card bg-surface border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-textMuted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctor by name, hospital, phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            className="w-full h-9 pl-9 pr-3 rounded-control bg-surface-subtle border border-border text-xs text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="w-full md:w-48">
            <SelectDropdown
              options={SPECIALIZATION_FILTERS}
              value={selectedSpecialty}
              onChange={(val) => {
                setSelectedSpecialty(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-full md:w-44">
            <SelectDropdown
              options={SORT_OPTIONS}
              value={selectedSort}
              onChange={(val) => setSelectedSort(val)}
            />
          </div>
        </div>
      </div>

      {/* Doctors Table Container */}
      <div className="rounded-card bg-surface border border-border shadow-card overflow-hidden">
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-textMuted">
                    Loading doctors directory from MongoDB Atlas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-semantic-danger">
                    Failed to load doctors: {(error as Error)?.message || 'Internal Error'}
                  </td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-xs text-textMuted">
                    No doctors found matching your search or filters.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => {
                  const activePatients = doctor.activePatientsCount || 0;

                  return (
                    <tr
                      key={doctor._id}
                      className="hover:bg-surface-subtle/70 transition-colors group text-xs text-ink"
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
                                onClick: () => handleDeleteDoctor(doctor),
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
      <CreateDoctorModal />
      <AssignedPatientsModal />
      <AssignPatientModal />
    </div>
  );
}
