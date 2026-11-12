import mongoose from 'mongoose';
import { Doctor, IDoctor } from '../models/Doctor';
import { PatientSession } from '../models/PatientSession';
import { AppError } from '../utils/AppError';

export interface IDoctorQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  specialization?: string;
  sort?: string;
}

export const getAllDoctorsFromDB = async (queryParams: IDoctorQueryParams) => {
  const page = queryParams.page || 1;
  const limit = queryParams.limit || 10;
  const skip = (page - 1) * limit;

  const q = (queryParams.q || '').trim();
  const specialization = (queryParams.specialization || '').trim();
  const sortBy = (queryParams.sort || 'newest').trim();

  // Filter criteria
  const filter: any = {};

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { hospital: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }

  if (specialization && specialization !== 'All Specializations') {
    filter.specialization = specialization;
  }

  // Determine sort order
  let sortStage: any = { createdAt: -1 };
  if (sortBy === 'alpha') {
    sortStage = { name: 1 };
  }

  // Aggregation pipeline to join active patient sessions and count caseload
  const aggregationPipeline: any[] = [
    { $match: filter },
    {
      $lookup: {
        from: 'patientsessions',
        let: { docId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$doctorId', '$$docId'] },
                  { $in: ['$status', ['active', 'scheduled']] },
                ],
              },
            },
          },
        ],
        as: 'sessions',
      },
    },
    {
      $addFields: {
        activePatientsCount: { $size: '$sessions' },
      },
    },
    {
      $project: {
        sessions: 0,
      },
    },
  ];

  if (sortBy === 'patients') {
    aggregationPipeline.push({ $sort: { activePatientsCount: -1, name: 1 } });
  } else {
    aggregationPipeline.push({ $sort: sortStage });
  }

  const total = await Doctor.countDocuments(filter);

  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });

  const doctors = await Doctor.aggregate(aggregationPipeline);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: doctors,
  };
};

export const getDoctorByIdFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid doctor identifier format');
  }

  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  const sessions = await PatientSession.find({ doctorId: doctor._id })
    .populate('patientId', 'name phone email age gender')
    .sort({ sessionDate: -1 });

  return {
    doctor,
    sessions,
  };
};

export const createDoctorInDB = async (payload: Partial<IDoctor>) => {
  const { name, specialization, hospital, phone, email } = payload;
  if (!name || !specialization || !hospital) {
    throw new AppError(400, 'Doctor name, specialization, and hospital are required fields');
  }

  const doctor = await Doctor.create({
    name,
    specialization,
    hospital,
    phone: phone || '',
    email: email || '',
  });

  return doctor;
};

export const updateDoctorInDB = async (id: string, payload: Partial<IDoctor>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid doctor identifier format');
  }

  const doctor = await Doctor.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  return doctor;
};

export const deleteDoctorFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid doctor identifier format');
  }

  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  // Disassociate / cancel active clinical sessions under this doctor
  await PatientSession.updateMany(
    { doctorId: doctor._id, status: { $in: ['scheduled', 'active'] } },
    { $set: { status: 'cancelled', notes: 'Doctor removed from medical network' } }
  );

  return { doctorId: id };
};

export const getDoctorAssignedPatientsFromDB = async (doctorId: string) => {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new AppError(400, 'Invalid doctor identifier format');
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  const sessions = await PatientSession.find({
    doctorId: doctor._id,
    status: { $in: ['active', 'scheduled'] },
  })
    .populate('patientId', 'name phone email age gender')
    .sort({ sessionDate: 1, appointmentAt: 1 });

  return {
    doctor: {
      id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization,
    },
    count: sessions.length,
    sessions,
  };
};

export const DoctorService = {
  getAllDoctorsFromDB,
  getDoctorByIdFromDB,
  createDoctorInDB,
  updateDoctorInDB,
  deleteDoctorFromDB,
  getDoctorAssignedPatientsFromDB,
};
