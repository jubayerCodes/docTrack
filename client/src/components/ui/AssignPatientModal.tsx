'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { SelectDropdown } from './SelectDropdown';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { Button } from './Button';
import { useUIStore } from '@/store/useUIStore';
import { usePatients, useAssignSession } from '@/hooks/usePatients';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

const GENDER_OPTIONS = [
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' },
  { label: 'Other', value: 'Other' },
];

export const AssignPatientModal: React.FC = () => {
  const { selectedDoctorForAssign, closeAssignPatient } = useUIStore();
  const assignSession = useAssignSession();

  // Load patient list for Tab 1
  const { data: patientListData } = usePatients({ limit: 100 });
  const patientOptions = (patientListData?.data || []).map((p) => ({
    label: `${p.name} (${p.phone})`,
    value: p._id,
  }));

  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

  // Form State
  const [existingPatientId, setExistingPatientId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAge, setNewAge] = useState('35');
  const [newGender, setNewGender] = useState('Female');

  // Shared Encounter State
  const [condition, setCondition] = useState('');
  const status = 'scheduled'; // Encounter status is always scheduled initially on creation
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [appointmentAt, setAppointmentAt] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!selectedDoctorForAssign) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'existing') {
      if (!existingPatientId) {
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
      setError('Condition / diagnosis is required');
      return;
    }

    try {
      await assignSession.mutateAsync({
        doctorId: selectedDoctorForAssign.id,
        payload: {
          mode: activeTab,
          patientId: activeTab === 'existing' ? existingPatientId : undefined,
          name: activeTab === 'new' ? newName.trim() : undefined,
          phone: activeTab === 'new' ? newPhone.trim() : undefined,
          email: activeTab === 'new' ? newEmail.trim() : undefined,
          age: activeTab === 'new' ? parseInt(newAge, 10) : undefined,
          gender: activeTab === 'new' ? newGender : undefined,
          condition: condition.trim(),
          sessionDate,
          appointmentAt,
          status,
          notes: notes.trim(),
        },
      });

      // Reset
      setExistingPatientId('');
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setCondition('');
      setNotes('');
      closeAssignPatient();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to assign patient session');
    }
  };

  return (
    <Modal
      isOpen={Boolean(selectedDoctorForAssign)}
      onClose={closeAssignPatient}
      eyebrow="Encounter Management"
      title="Assign Patient Session"
      description={`Schedule an appointment or active consultation under ${selectedDoctorForAssign.name} (${selectedDoctorForAssign.specialization})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex p-1 bg-surface-subtle border border-border rounded-control">
          <button
            type="button"
            onClick={() => {
              setActiveTab('existing');
              setError(null);
            }}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all',
              activeTab === 'existing'
                ? 'bg-white text-ink shadow-sm'
                : 'text-textMuted hover:text-ink'
            )}
          >
            Link Existing Patient
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('new');
              setError(null);
            }}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all',
              activeTab === 'new'
                ? 'bg-white text-ink shadow-sm'
                : 'text-textMuted hover:text-ink'
            )}
          >
            Register New Inline
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-control bg-semantic-dangerBg border border-red-200 text-xs text-semantic-danger">
            {error}
          </div>
        )}

        {/* Tab 1: Existing Patient Selection */}
        {activeTab === 'existing' ? (
          <div>
            <SelectDropdown
              label="Select Patient from Master Directory"
              required
              options={patientOptions}
              value={existingPatientId}
              onChange={(val) => setExistingPatientId(val)}
              placeholder="Search or select patient by name..."
            />
          </div>
        ) : (
          /* Tab 2: New Patient Inline Registration */
          <div className="space-y-3.5 p-3.5 rounded-card bg-surface-subtle/60 border border-border">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              New Patient Demographics
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Johnathan Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                label="Phone Number"
                required
                placeholder="+1 (555) 000-0000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Email (Optional)"
                type="email"
                placeholder="patient@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Input
                label="Age"
                type="number"
                min="1"
                max="120"
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

        {/* Encounter Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Condition / Diagnosis"
            required
            placeholder="e.g. Hypertension Checkup"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
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

        {/* Date & Time Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <DatePicker
            label="Session Date"
            required
            value={sessionDate}
            onChange={(d) => setSessionDate(d)}
          />

          <TimePicker
            label="Appointment Time Slot"
            required
            value={appointmentAt}
            onChange={(t) => setAppointmentAt(t)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            Clinical Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Routine follow-up notes, patient symptoms, or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-control border border-border bg-surface p-2.5 text-xs text-ink placeholder:text-textSubtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button type="button" variant="secondary" onClick={closeAssignPatient}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={assignSession.isPending}>
            Assign Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
