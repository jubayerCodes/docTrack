'use client';

import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Clock,
  Calendar,
  Activity,
  RotateCcw,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { PaginationBar } from '@/components/ui/PaginationBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ActionMenu } from '@/components/ui/ActionMenu';
import { CreatePatientModal } from '@/components/ui/CreatePatientModal';
import { EditPatientModal } from '@/components/ui/EditPatientModal';
import { usePatients, usePatientMutations } from '@/hooks/usePatients';
import { useDebounce } from '@/hooks/useDebounce';
import { useUIStore } from '@/store/useUIStore';
import { getInitials, formatDate } from '@/lib/utils';
import { IPatient } from '@/types';

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
  { label: 'Active', value: 'active' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const [selectedCondition, setSelectedCondition] = useState('All Conditions');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);

  const { openCreatePatient, openEditPatient } = useUIStore();
  const { deletePatient } = usePatientMutations();

  const { data: responseData, isLoading, isError, error } = usePatients({
    page: currentPage,
    limit: 8,
    q: debouncedSearch,
    condition: selectedCondition,
    status: selectedStatus,
  });

  const patients = (responseData?.data as IPatient[]) || [];
  const meta = responseData?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCondition('All Conditions');
    setSelectedStatus('All Statuses');
    setCurrentPage(1);
  };

  const handleDeletePatient = async (patient: IPatient) => {
    if (confirm(`Are you sure you want to delete patient ${patient.name}? This action cannot be undone.`)) {
      try {
        await deletePatient.mutateAsync(patient._id);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete patient');
      }
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
            Master patient roster, assigned attending physicians, and active clinical encounters.
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
          <div className="w-[170px]">
            <SelectDropdown
              options={CONDITION_OPTIONS}
              value={selectedCondition}
              onChange={(val) => {
                setSelectedCondition(val);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="w-[150px]">
            <SelectDropdown
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
            />
          </div>

          {(searchQuery || selectedCondition !== 'All Conditions' || selectedStatus !== 'All Statuses') && (
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
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Condition / Diagnosis</th>
                <th className="py-3 px-4">Appointment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-textMuted">
                    Loading patient records from MongoDB Atlas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-semantic-danger">
                    Failed to load patients: {(error as Error)?.message || 'Internal Error'}
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-xs text-textMuted">
                    No patients found matching your search or filters.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => {
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
                          {patient.phone && (
                            <p className="text-textSecondary flex items-center gap-1.5 font-medium">
                              <Phone className="w-3 h-3 text-textMuted" />
                              <span>{patient.phone}</span>
                            </p>
                          )}
                          {patient.email && (
                            <p className="text-textMuted flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-textMuted" />
                              <span className="truncate max-w-[180px]">{patient.email}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Assigned Doctor */}
                      <td className="py-3.5 px-4">
                        {patient.assignedDoctor?.name ? (
                          <div>
                            <p className="font-semibold text-ink leading-tight flex items-center gap-1">
                              <Stethoscope className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="truncate max-w-[160px]">
                                {patient.assignedDoctor.name}
                              </span>
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft text-primary border border-primary/15">
                              {patient.assignedDoctor.specialization}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-textSubtle italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Condition / Diagnosis */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-textSecondary font-medium">
                          <Activity className="w-3.5 h-3.5 text-[#2c9a8b] flex-shrink-0" />
                          <span className="truncate max-w-[170px]" title={patient.currentCondition}>
                            {patient.currentCondition || 'General Consultation'}
                          </span>
                        </div>
                      </td>

                      {/* Appointment Time & Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="text-ink font-semibold flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                            <span>{patient.appointmentAt || '10:00 AM'}</span>
                          </p>
                          <p className="text-textMuted flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-textSubtle flex-shrink-0" />
                            <span>{formatDate(patient.sessionDate || patient.createdAt)}</span>
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={patient.status || 'scheduled'} />
                      </td>

                      {/* Actions Menu */}
                      <td className="py-3.5 px-4 text-right pr-6">
                        <div className="inline-flex justify-end">
                          <ActionMenu
                            items={[
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
    </div>
  );
}
