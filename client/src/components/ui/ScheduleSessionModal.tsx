'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { SelectDropdown } from './SelectDropdown';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { Button } from './Button';
import { useUIStore } from '@/store/useUIStore';
import { useDoctors } from '@/hooks/useDoctors';
import { usePatients, useAssignSession } from '@/hooks/usePatients';
import { cn } from '@/lib/utils';
import { Stethoscope, User, Calendar, Lock } from 'lucide-react';

const GENDER_OPTIONS = [
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' },
  { label: 'Other', value: 'Other' },
];

export const ScheduleSessionModal: React.FC = () => {
  const { isScheduleSessionOpen, scheduleSessionContext, closeScheduleSession } = useUIStore();
  const assignSession = useAssignSession();

  // Load doctors and patients
  const { data: doctorsData } = useDoctors({ limit: 100 });
  const { data: patientsData } = usePatients({ limit: 100 });

  const doctorOptions = (doctorsData?.data || []).map((d) => ({
    label: `${d.name} (${d.specialization})`,
    value: d._id,
  }));

  const patientOptions = (patientsData?.data || []).map((p) => ({
    label: `${p.name} (${p.phone})`,
    value: p._id,
  }));

  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

  // Doctor state
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  // Patient state
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAge, setNewAge] = useState('35');
  const [newGender, setNewGender] = useState('Female');

  // Clinical encounter state
  const [condition, setCondition] = useState('');
  const status = 'scheduled'; // Encounter status is always scheduled initially on creation
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [appointmentAt, setAppointmentAt] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isScheduleSessionOpen && scheduleSessionContext) {
      if (scheduleSessionContext.doctorId) {
        setSelectedDoctorId(scheduleSessionContext.doctorId);
      }
      if (scheduleSessionContext.patientId) {
        setSelectedPatientId(scheduleSessionContext.patientId);
        setActiveTab('existing');
      }
    } else if (isScheduleSessionOpen && doctorOptions.length > 0) {
      setSelectedDoctorId((prev) => prev || doctorOptions[0].value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScheduleSessionOpen, scheduleSessionContext, doctorOptions.length]);

  if (!isScheduleSessionOpen) return null;

  const handleClose = () => {
    setError(null);
    setCondition('');
    setNotes('');
    closeScheduleSession();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const docId = selectedDoctorId || scheduleSessionContext?.doctorId;
    if (!docId) {
      setError('Please select an attending doctor');
      return;
    }

    if (activeTab === 'existing') {
      const patId = selectedPatientId || scheduleSessionContext?.patientId;
      if (!patId) {
        setError('Please select an existing patient');
        return;
      }
    } else {
      if (!newName.trim() || !newPhone.trim()) {
        setError('Name and phone number are required to register a new patient');
        return;
      }
    }

    if (!condition.trim()) {
      setError('Clinical condition / diagnosis is required');
      return;
    }

    try {
      await assignSession.mutateAsync({
        doctorId: docId,
        payload: {
          mode: activeTab,
          patientId: activeTab === 'existing' ? selectedPatientId || scheduleSessionContext?.patientId : undefined,
          name: activeTab === 'new' ? newName.trim() : undefined,
          phone: activeTab === 'new' ? newPhone.trim() : undefined,
          email: activeTab === 'new' ? newEmail.trim() || undefined : undefined,
          age: activeTab === 'new' ? Number(newAge) || 35 : undefined,
          gender: activeTab === 'new' ? newGender : undefined,
          condition: condition.trim(),
          sessionDate,
          appointmentAt,
          status,
          notes: notes.trim() || undefined,
        },
      });

      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to schedule session encounter');
    }
  };

  return (
    <Modal
      isOpen={isScheduleSessionOpen}
      onClose={handleClose}
      eyebrow="Clinical Encounter"
      title="Schedule Clinical Session"
      description="Book an appointment encounter connecting a patient with an attending practitioner."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-control bg-semantic-dangerBg border border-red-200 text-xs text-semantic-danger">
            {error}
          </div>
        )}

        {/* Doctor Selection */}
        <div className="p-3 rounded-card bg-surface-subtle border border-border space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <span>Attending Physician</span>
          </p>
          {scheduleSessionContext?.doctorId && scheduleSessionContext?.doctorName ? (
            <div className="text-xs font-semibold text-ink">
              {scheduleSessionContext.doctorName}{' '}
              {scheduleSessionContext.doctorSpecialization && (
                <span className="text-textMuted font-normal">
                  ({scheduleSessionContext.doctorSpecialization})
                </span>
              )}
            </div>
          ) : (
            <SelectDropdown
              options={doctorOptions}
              value={selectedDoctorId || (doctorOptions[0]?.value ?? '')}
              onChange={(val) => setSelectedDoctorId(val)}
            />
          )}
        </div>

        {/* Patient Selection Tabs */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Patient Information</span>
          </p>

          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab('existing')}
              className={cn(
                'px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors',
                activeTab === 'existing'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textMuted hover:text-ink'
              )}
            >
              Select Existing Patient
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={cn(
                'px-4 py-2 text-xs font-bold border-b-2 -mb-px transition-colors',
                activeTab === 'new'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textMuted hover:text-ink'
              )}
            >
              Register New Patient Inline
            </button>
          </div>

          {activeTab === 'existing' ? (
            <div className="pt-2">
              <SelectDropdown
                label="Choose Patient Record"
                options={patientOptions}
                value={selectedPatientId || (patientOptions[0]?.value ?? '')}
                onChange={(val) => setSelectedPatientId(val)}
              />
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Bruce Wayne"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Phone Number"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <Input
                  label="Email (Optional)"
                  type="email"
                  placeholder="patient@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Age"
                  type="number"
                  min="1"
                  max="125"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
                <SelectDropdown
                  label="Gender"
                  options={GENDER_OPTIONS}
                  value={newGender}
                  onChange={(val) => setNewGender(val)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Clinical Encounter Parameters */}
        <div className="pt-3 border-t border-border space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Encounter Details</span>
          </p>

          <Input
            label="Condition / Clinical Diagnosis"
            required
            placeholder="e.g. Hypertension follow-up, Cardiovascular review"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePicker
              label="Session Date"
              value={sessionDate}
              onChange={(d) => d && setSessionDate(d)}
            />
            <TimePicker
              label="Appointment Time"
              value={appointmentAt}
              onChange={(t) => setAppointmentAt(t)}
            />
            <div>
              <label className="block text-xs font-semibold text-textSecondary mb-1.5 flex items-center justify-between">
                <span>Initial Status</span>
                <span className="text-[10px] text-textMuted flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Fixed
                </span>
              </label>
              <div
                className="h-9 px-3 rounded-control border border-border bg-surface-subtle flex items-center justify-between text-xs cursor-not-allowed select-none"
                title="Encounter status is always scheduled initially on creation"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-semibold text-ink">Scheduled</span>
                </div>
                <span className="text-[10px] text-textMuted font-medium uppercase tracking-wider">Initial</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-textSecondary mb-1.5">
              Clinical Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Symptoms, medication check, or clinical referral notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-control border border-border bg-surface text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={assignSession.isPending}>
            Schedule Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
