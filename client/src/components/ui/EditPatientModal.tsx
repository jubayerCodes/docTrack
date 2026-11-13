'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { SelectDropdown } from './SelectDropdown';
import { Button } from './Button';
import { useUIStore } from '@/store/useUIStore';
import { usePatientMutations } from '@/hooks/usePatients';

const GENDER_OPTIONS = [
  { label: 'Female', value: 'Female' },
  { label: 'Male', value: 'Male' },
  { label: 'Other', value: 'Other' },
];

export const EditPatientModal: React.FC = () => {
  const { selectedPatientForEdit, closeEditPatient } = useUIStore();
  const { updatePatient } = usePatientMutations();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('35');
  const [gender, setGender] = useState('Female');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPatientForEdit) {
      setName(selectedPatientForEdit.name || '');
      setPhone(selectedPatientForEdit.phone || '');
      setEmail(selectedPatientForEdit.email || '');
      setAge(String(selectedPatientForEdit.age || 35));
      setGender(selectedPatientForEdit.gender || 'Female');
      setError(null);
    }
  }, [selectedPatientForEdit]);

  if (!selectedPatientForEdit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Patient name and phone number are required');
      return;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      setError('Please provide a valid age between 1 and 125');
      return;
    }

    try {
      await updatePatient.mutateAsync({
        id: selectedPatientForEdit._id,
        data: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          age: ageNum,
          gender,
        },
      });

      closeEditPatient();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update patient profile');
    }
  };

  return (
    <Modal
      isOpen={Boolean(selectedPatientForEdit)}
      onClose={closeEditPatient}
      eyebrow="Profile Maintenance"
      title="Edit Patient Information"
      description={`Update demographic details for ${selectedPatientForEdit.name}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-control bg-semantic-dangerBg border border-red-200 text-xs text-semantic-danger">
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          <Input
            label="Full Name"
            required
            placeholder="e.g. Johnathan Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Phone Number"
              required
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="patient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Age"
              type="number"
              min="1"
              max="125"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <SelectDropdown
              label="Gender"
              options={GENDER_OPTIONS}
              value={gender}
              onChange={(val) => setGender(val)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={closeEditPatient}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={updatePatient.isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
