export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone?: string;
  email?: string;
  activePatientsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPatient {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: string;
  assignedDoctor?: {
    id: string;
    name: string;
    specialization: string;
  };
  currentCondition?: string;
  appointmentAt?: string;
  sessionDate?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPatientSession {
  _id: string;
  patientId: IPatient | string;
  doctorId: IDoctor | string;
  condition: string;
  sessionDate: string;
  appointmentAt: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  meta?: IMeta;
  data: T;
}
