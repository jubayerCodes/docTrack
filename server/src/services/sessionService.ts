import mongoose from 'mongoose';
import { PatientSession, IPatientSession } from '../models/PatientSession';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import { AppError } from '../utils/AppError';

export interface IAssignSessionPayload {
  doctorId?: string;
  mode: 'existing' | 'new';
  patientId?: string;
  // Inline patient fields when mode === 'new'
  name?: string;
  phone?: string;
  email?: string;
  age?: number;
  gender?: string;
  // Clinical session fields
  condition: string;
  sessionDate?: string | Date;
  appointmentAt?: string;
  status?: 'scheduled' | 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export const createSessionInDB = async (
  doctorIdInput: string | undefined,
  payload: IAssignSessionPayload
) => {
  const doctorId = doctorIdInput || payload.doctorId;

  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new AppError(400, 'A valid doctorId is required to schedule a patient session');
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  const {
    mode,
    patientId,
    name,
    phone,
    email,
    age,
    gender,
    condition,
    sessionDate,
    appointmentAt,
    status,
    notes,
  } = payload;

  if (!condition) {
    throw new AppError(400, 'Medical condition/diagnosis is required');
  }

  let targetPatientId = patientId;

  // Workflow 4.1: Branching logic for dual assignment
  if (mode === 'new') {
    if (!name || !phone) {
      throw new AppError(400, 'Name and phone number are required to register a new patient inline');
    }

    const newPatient = await Patient.create({
      name,
      phone,
      email: email || '',
      age: age ? Number(age) : 35,
      gender: gender || 'Other',
    });
    targetPatientId = newPatient._id.toString();
  } else {
    if (!targetPatientId || !mongoose.Types.ObjectId.isValid(targetPatientId)) {
      throw new AppError(400, 'A valid existing patientId is required');
    }

    const existingPatient = await Patient.findById(targetPatientId);
    if (!existingPatient) {
      throw new AppError(404, 'Selected patient does not exist in master records');
    }
  }

  const session = await PatientSession.create({
    patientId: targetPatientId,
    doctorId: doctor._id,
    condition,
    sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
    appointmentAt: appointmentAt || '10:00 AM',
    status: status || 'scheduled',
    notes: notes || '',
  });

  const populatedSession = await PatientSession.findById(session._id)
    .populate('patientId', 'name phone email age gender')
    .populate('doctorId', 'name specialization hospital');

  return populatedSession;
};

export const deleteSessionFromDB = async (sessionId: string, doctorId?: string) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(400, 'Invalid session identifier format');
  }

  const query: any = { _id: sessionId };
  if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
    query.doctorId = doctorId;
  }

  const session = await PatientSession.findOneAndDelete(query);

  if (!session) {
    throw new AppError(
      404,
      doctorId
        ? 'Session encounter not found under this doctor'
        : 'Session encounter not found'
    );
  }

  return { sessionId, doctorId: session.doctorId };
};

export const updateSessionInDB = async (sessionId: string, payload: Partial<IPatientSession>) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(400, 'Invalid session identifier format');
  }

  const session = await PatientSession.findByIdAndUpdate(sessionId, payload, {
    new: true,
    runValidators: true,
  })
    .populate('patientId', 'name phone email age gender')
    .populate('doctorId', 'name specialization hospital');

  if (!session) {
    throw new AppError(404, 'Session encounter not found');
  }

  return session;
};

export const getSessionsFromDB = async (queryParams: Record<string, any>) => {
  const filter: any = {};
  if (queryParams.doctorId && mongoose.Types.ObjectId.isValid(queryParams.doctorId)) {
    filter.doctorId = queryParams.doctorId;
  }
  if (queryParams.patientId && mongoose.Types.ObjectId.isValid(queryParams.patientId)) {
    filter.patientId = queryParams.patientId;
  }
  if (queryParams.status) {
    filter.status = queryParams.status;
  }

  const sessions = await PatientSession.find(filter)
    .populate('patientId', 'name phone email age gender')
    .populate('doctorId', 'name specialization hospital')
    .sort({ sessionDate: -1 });

  return { count: sessions.length, sessions };
};

export const getSessionByIdFromDB = async (sessionId: string) => {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError(400, 'Invalid session identifier format');
  }

  const session = await PatientSession.findById(sessionId)
    .populate('patientId', 'name phone email age gender')
    .populate('doctorId', 'name specialization hospital');

  if (!session) {
    throw new AppError(404, 'Session encounter not found');
  }

  return session;
};

// Aliases for backwards compatibility
export const assignDoctorSessionInDB = createSessionInDB;
export const disassociateDoctorSessionFromDB = (doctorId: string, sessionId: string) =>
  deleteSessionFromDB(sessionId, doctorId);

export const SessionService = {
  createSessionInDB,
  deleteSessionFromDB,
  updateSessionInDB,
  getSessionsFromDB,
  getSessionByIdFromDB,
  assignDoctorSessionInDB,
  disassociateDoctorSessionFromDB,
};
