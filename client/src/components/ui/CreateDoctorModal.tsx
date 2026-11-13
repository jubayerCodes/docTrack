'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { SelectDropdown } from './SelectDropdown';
import { Button } from './Button';
import { useUIStore } from '@/store/useUIStore';
import { useDoctorMutations } from '@/hooks/useDoctors';

const SPECIALIZATIONS = [
  { label: 'Cardiology', value: 'Cardiology' },
  { label: 'Neurology', value: 'Neurology' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Orthopedics', value: 'Orthopedics' },
  { label: 'Oncology', value: 'Oncology' },
  { label: 'Dermatology', value: 'Dermatology' },
  { label: 'Psychiatry', value: 'Psychiatry' },
  { label: 'General Medicine', value: 'General Medicine' },
  { label: 'Immunology', value: 'Immunology' },
];

export const CreateDoctorModal: React.FC = () => {
  const { isCreateDoctorOpen, closeCreateDoctor } = useUIStore();
  const { createDoctor } = useDoctorMutations();

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Cardiology',
    hospital: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Doctor name is required';
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required';
    if (!formData.hospital.trim()) errs.hospital = 'Hospital or clinic is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createDoctor.mutateAsync(formData);
      setFormData({
        name: '',
        specialization: 'Cardiology',
        hospital: '',
        phone: '',
        email: '',
      });
      setErrors({});
      closeCreateDoctor();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create doctor';
      setErrors({ form: errorMsg });
    }
  };

  return (
    <Modal
      isOpen={isCreateDoctorOpen}
      onClose={closeCreateDoctor}
      eyebrow="Care Network"
      title="Create New Doctor Record"
      description="Add a certified physician to your medical practitioner directory."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-control bg-semantic-dangerBg border border-red-200 text-xs text-semantic-danger">
            {errors.form}
          </div>
        )}

        <Input
          label="Doctor Name"
          required
          placeholder="e.g. Dr. Arthur Pendelton"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <SelectDropdown
            label="Specialization"
            required
            options={SPECIALIZATIONS}
            value={formData.specialization}
            onChange={(val) => setFormData({ ...formData, specialization: val })}
          />

          <Input
            label="Hospital / Clinic"
            required
            placeholder="e.g. Memorial General"
            value={formData.hospital}
            onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
            error={errors.hospital}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Contact Phone"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@hospital.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-3 border-t border-border">
          <Button type="button" variant="secondary" onClick={closeCreateDoctor} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={createDoctor.isPending} className="w-full sm:w-auto">
            Save Doctor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
