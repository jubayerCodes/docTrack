'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';
import { Skeleton } from './Skeleton';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Trash2, Clock, UserPlus } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useDoctorPatients, useDisassociateSession } from '@/hooks/useDoctors';
import { getInitials } from '@/lib/utils';
import { IPatient } from '@/types';

export const AssignedPatientsModal: React.FC = () => {
  const { selectedDoctorForPatients, closeAssignedPatients, openAssignPatient } = useUIStore();
  const { data, isLoading } = useDoctorPatients(selectedDoctorForPatients?.id);
  const disassociateSession = useDisassociateSession();
  const [sessionToDisassociate, setSessionToDisassociate] = useState<{
    id: string;
    patientName: string;
  } | null>(null);

  if (!selectedDoctorForPatients) return null;

  const handleConfirmDisassociate = async () => {
    if (!sessionToDisassociate || !selectedDoctorForPatients) return;
    try {
      await disassociateSession.mutateAsync({
        doctorId: selectedDoctorForPatients.id,
        sessionId: sessionToDisassociate.id,
      });
      setSessionToDisassociate(null);
    } catch {
      // Error handled by mutation
    }
  };

  const sessions = data?.sessions || [];

  return (
    <Modal
      isOpen={Boolean(selectedDoctorForPatients)}
      onClose={closeAssignedPatients}
      eyebrow="Caseload Inspection"
      title="Assigned Patients"
      description={`Active clinical encounters under ${selectedDoctorForPatients.name} (${selectedDoctorForPatients.specialization})`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-card bg-white border border-border shadow-sm gap-2"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-3.5 w-32 max-w-full" />
                    <Skeleton className="h-2.5 w-44 max-w-full" />
                  </div>
                </div>
                <Skeleton className="w-8 h-8 rounded-control flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-10 text-center rounded-card bg-surface-subtle border border-border p-6">
            <p className="text-sm font-semibold text-ink">No Active Patients</p>
            <p className="text-xs text-textMuted mt-1">
              There are currently no active or scheduled patient encounters assigned to this doctor.
            </p>
          </div>
        ) : (
          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
            {sessions.map((session) => {
              const patient = session.patientId as IPatient;
              const patientName = patient?.name || 'Unknown Patient';
              const patientAge = patient?.age ? `${patient.age} yrs` : '';

              return (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-3 sm:p-3.5 rounded-card bg-white border border-border hover:border-primary/30 transition-all shadow-sm gap-2"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Patient Initials Circle */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {getInitials(patientName)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <p className="text-xs font-bold text-ink truncate max-w-[140px] sm:max-w-none">{patientName}</p>
                        {patientAge && (
                          <span className="text-[10px] sm:text-[11px] text-textMuted font-medium">
                            ({patientAge})
                          </span>
                        )}
                        <StatusBadge status={session.status} />
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-textSecondary mt-0.5">
                        <span className="truncate font-medium text-ink max-w-[140px] sm:max-w-none">
                          {session.condition}
                        </span>
                        <span className="text-textSubtle hidden sm:inline">•</span>
                        <span className="flex items-center gap-1 text-textMuted flex-shrink-0">
                          <Clock className="w-3 h-3 text-primary" />
                          {session.appointmentAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Disassociate Action: Trash icon */}
                  <button
                    type="button"
                    onClick={() =>
                      setSessionToDisassociate({
                        id: session._id,
                        patientName,
                      })
                    }
                    disabled={disassociateSession.isPending}
                    title="Remove from doctor's list"
                    className="w-8 h-8 rounded-control border border-transparent hover:border-red-200 hover:bg-semantic-dangerBg text-textMuted hover:text-semantic-danger flex items-center justify-center transition-colors flex-shrink-0 ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-3">
          <p className="text-xs text-textMuted">
            Total Active Caseload:{' '}
            <span className="font-bold text-ink">{sessions.length}</span>
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => {
                if (selectedDoctorForPatients) {
                  const doc = { ...selectedDoctorForPatients };
                  closeAssignedPatients();
                  openAssignPatient(doc);
                }
              }}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1 text-primary" />
              <span>+ Assign Patient</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={closeAssignedPatients} className="flex-1 sm:flex-initial">
              Close
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(sessionToDisassociate)}
        onClose={() => setSessionToDisassociate(null)}
        onConfirm={handleConfirmDisassociate}
        isLoading={disassociateSession.isPending}
        title="Disassociate Encounter"
        itemType="caseload encounter for"
        itemName={sessionToDisassociate?.patientName}
        description={`Remove this active encounter from ${selectedDoctorForPatients.name}'s caseload. The primary patient record will remain intact.`}
        confirmText="Remove Encounter"
      />
    </Modal>
  );
};
