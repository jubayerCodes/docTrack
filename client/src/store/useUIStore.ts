import { create } from 'zustand';
import { IPatient } from '../types';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Doctor modal states
  isCreateDoctorOpen: boolean;
  openCreateDoctor: () => void;
  closeCreateDoctor: () => void;

  // Assigned patients modal state
  selectedDoctorForPatients: { id: string; name: string; specialization: string } | null;
  openAssignedPatients: (doctor: { id: string; name: string; specialization: string }) => void;
  closeAssignedPatients: () => void;

  // Workflow 4.1: Assign patient modal state
  selectedDoctorForAssign: { id: string; name: string; specialization: string } | null;
  openAssignPatient: (doctor: { id: string; name: string; specialization: string }) => void;
  closeAssignPatient: () => void;

  // Patient modal states
  isCreatePatientOpen: boolean;
  openCreatePatient: () => void;
  closeCreatePatient: () => void;

  selectedPatientForEdit: IPatient | null;
  openEditPatient: (patient: IPatient) => void;
  closeEditPatient: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  isCreateDoctorOpen: false,
  openCreateDoctor: () => set({ isCreateDoctorOpen: true }),
  closeCreateDoctor: () => set({ isCreateDoctorOpen: false }),

  selectedDoctorForPatients: null,
  openAssignedPatients: (doctor) => set({ selectedDoctorForPatients: doctor }),
  closeAssignedPatients: () => set({ selectedDoctorForPatients: null }),

  selectedDoctorForAssign: null,
  openAssignPatient: (doctor) => set({ selectedDoctorForAssign: doctor }),
  closeAssignPatient: () => set({ selectedDoctorForAssign: null }),

  isCreatePatientOpen: false,
  openCreatePatient: () => set({ isCreatePatientOpen: true }),
  closeCreatePatient: () => set({ isCreatePatientOpen: false }),

  selectedPatientForEdit: null,
  openEditPatient: (patient) => set({ selectedPatientForEdit: patient }),
  closeEditPatient: () => set({ selectedPatientForEdit: null }),
}));
