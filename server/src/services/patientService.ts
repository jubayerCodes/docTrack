import mongoose from 'mongoose';
import { Patient, IPatient } from '../models/Patient';
import { PatientSession } from '../models/PatientSession';
import { AppError } from '../utils/AppError';
import { escapeRegex } from '../utils/escapeRegex';

export interface IPatientQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  condition?: string;
  status?: string;
}

export const getAllPatientsFromDB = async (queryParams: IPatientQueryParams) => {
  const page = queryParams.page || 1;
  const limit = queryParams.limit || 10;
  const skip = (page - 1) * limit;

  const q = (queryParams.q || '').trim();
  const condition = (queryParams.condition || '').trim();
  const status = (queryParams.status || '').trim();

  const pipeline: any[] = [];

  // Filter patients by name, phone, or email if search query is provided
  if (q) {
    const safeQ = escapeRegex(q);
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: safeQ, $options: 'i' } },
          { phone: { $regex: safeQ, $options: 'i' } },
          { email: { $regex: safeQ, $options: 'i' } },
        ],
      },
    });
  }

  // Lookup latest clinical session for each patient
  pipeline.push({
    $lookup: {
      from: 'patientsessions',
      let: { pId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$patientId', '$$pId'] } } },
        { $sort: { sessionDate: -1, createdAt: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor',
          },
        },
        { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      ],
      as: 'latestSession',
    },
  });

  pipeline.push({
    $unwind: { path: '$latestSession', preserveNullAndEmptyArrays: true },
  });

  // Apply condition and status filters on the joined session
  const matchSessionFilters: any = {};
  if (condition && condition !== 'All Conditions') {
    matchSessionFilters['latestSession.condition'] = { $regex: escapeRegex(condition), $options: 'i' };
  }
  if (status && status !== 'All Statuses') {
    matchSessionFilters['latestSession.status'] = status;
  }

  if (Object.keys(matchSessionFilters).length > 0) {
    pipeline.push({ $match: matchSessionFilters });
  }

  // Facet for pagination & metadata
  pipeline.push({
    $facet: {
      metadata: [{ $count: 'total' }],
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            name: 1,
            phone: 1,
            email: 1,
            age: 1,
            gender: 1,
            createdAt: 1,
            assignedDoctor: {
              id: '$latestSession.doctor._id',
              name: '$latestSession.doctor.name',
              specialization: '$latestSession.doctor.specialization',
            },
            currentCondition: '$latestSession.condition',
            appointmentAt: '$latestSession.appointmentAt',
            sessionDate: '$latestSession.sessionDate',
            status: { $ifNull: ['$latestSession.status', 'scheduled'] },
            sessionId: '$latestSession._id',
          },
        },
      ],
    },
  });

  const result = await Patient.aggregate(pipeline);
  const total = result[0]?.metadata[0]?.total || 0;
  const patients = result[0]?.data || [];

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: patients,
  };
};

export const getPatientByIdFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid patient identifier format');
  }

  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }

  const sessions = await PatientSession.find({ patientId: patient._id })
    .populate('doctorId', 'name specialization hospital phone email')
    .sort({ sessionDate: -1 });

  return {
    patient,
    sessions,
  };
};

export const createPatientInDB = async (payload: Partial<IPatient>) => {
  const { name, phone, email, age, gender } = payload;
  if (!name || !phone) {
    throw new AppError(400, 'Patient name and phone number are required fields');
  }

  const patient = await Patient.create({
    name,
    phone,
    email: email || '',
    age: age || 35,
    gender: gender || 'Other',
  });

  return patient;
};

export const updatePatientInDB = async (id: string, payload: Partial<IPatient>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid patient identifier format');
  }

  const patient = await Patient.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }

  return patient;
};

export const deletePatientFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid patient identifier format');
  }

  const patient = await Patient.findByIdAndDelete(id);
  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }

  // Cascade delete all clinical sessions associated with this patient
  await PatientSession.deleteMany({ patientId: patient._id });

  return { patientId: id };
};

export const PatientService = {
  getAllPatientsFromDB,
  getPatientByIdFromDB,
  createPatientInDB,
  updatePatientInDB,
  deletePatientFromDB,
};
