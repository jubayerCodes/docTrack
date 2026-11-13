import mongoose from 'mongoose';
import { PatientSession, IPatientSession } from '../models/PatientSession';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import { AppError } from '../utils/AppError';
import { escapeRegex } from '../utils/escapeRegex';

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
    status: 'scheduled', // Always scheduled initially on creation
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
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const skip = (page - 1) * limit;

  const q = (queryParams.q || '').trim();
  const status = (queryParams.status || '').trim();
  const condition = (queryParams.condition || '').trim();
  const sort = (queryParams.sort || 'date-desc').trim();

  // Sorting options with explicit ASC and DESC options
  let sortCriteria: any = { sessionDate: -1, createdAt: -1 };
  if (sort === 'date-asc' || sort === 'oldest') {
    sortCriteria = { sessionDate: 1, createdAt: 1 };
  } else if (sort === 'patient-asc') {
    sortCriteria = { 'patientId.name': 1 };
  } else if (sort === 'patient-desc') {
    sortCriteria = { 'patientId.name': -1 };
  } else if (sort === 'doctor-asc') {
    sortCriteria = { 'doctorId.name': 1 };
  } else if (sort === 'doctor-desc') {
    sortCriteria = { 'doctorId.name': -1 };
  } else if (sort === 'status-asc') {
    sortCriteria = { status: 1 };
  } else if (sort === 'status-desc') {
    sortCriteria = { status: -1 };
  }

  const match: any = {};
  if (queryParams.doctorId && mongoose.Types.ObjectId.isValid(queryParams.doctorId)) {
    match.doctorId = new mongoose.Types.ObjectId(queryParams.doctorId);
  }
  if (queryParams.patientId && mongoose.Types.ObjectId.isValid(queryParams.patientId)) {
    match.patientId = new mongoose.Types.ObjectId(queryParams.patientId);
  }
  if (status && status !== 'All Statuses') {
    match.status = status;
  }
  if (condition && condition !== 'All Conditions') {
    match.condition = { $regex: escapeRegex(condition), $options: 'i' };
  }

  const pipeline: any[] = [
    { $match: match },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: '_id',
        as: 'patientId',
      },
    },
    { $unwind: { path: '$patientId', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'doctors',
        localField: 'doctorId',
        foreignField: '_id',
        as: 'doctorId',
      },
    },
    { $unwind: { path: '$doctorId', preserveNullAndEmptyArrays: true } },
  ];

  if (q) {
    const safeQ = escapeRegex(q);
    pipeline.push({
      $match: {
        $or: [
          { 'patientId.name': { $regex: safeQ, $options: 'i' } },
          { 'patientId.phone': { $regex: safeQ, $options: 'i' } },
          { 'patientId.email': { $regex: safeQ, $options: 'i' } },
          { 'doctorId.name': { $regex: safeQ, $options: 'i' } },
          { 'doctorId.specialization': { $regex: safeQ, $options: 'i' } },
          { condition: { $regex: safeQ, $options: 'i' } },
          { notes: { $regex: safeQ, $options: 'i' } },
        ],
      },
    });
  }

  pipeline.push({
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [
        { $sort: sortCriteria },
        { $skip: skip },
        { $limit: limit },
      ],
    },
  });

  const result = await PatientSession.aggregate(pipeline);
  const total = result[0]?.metadata[0]?.total || 0;
  const sessions = result[0]?.data || [];

  return {
    count: total,
    total,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    sessions,
  };
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
