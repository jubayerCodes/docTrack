import mongoose from 'mongoose';
import { Doctor, IDoctor } from '../models/Doctor';
import { PatientSession } from '../models/PatientSession';
import { AppError } from '../utils/AppError';
import { escapeRegex } from '../utils/escapeRegex';

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
    const safeQ = escapeRegex(q);
    filter.$or = [
      { name: { $regex: safeQ, $options: 'i' } },
      { hospital: { $regex: safeQ, $options: 'i' } },
      { phone: { $regex: safeQ, $options: 'i' } },
      { email: { $regex: safeQ, $options: 'i' } },
    ];
  }

  if (specialization && specialization !== 'All Specializations') {
    filter.specialization = specialization;
  }

  // Determine sort order
  let sortStage: any = { createdAt: -1 };
  if (sortBy === 'oldest' || sortBy === 'date-asc') {
    sortStage = { createdAt: 1 };
  } else if (sortBy === 'alpha' || sortBy === 'name-asc') {
    sortStage = { name: 1 };
  } else if (sortBy === 'alpha-desc' || sortBy === 'name-desc') {
    sortStage = { name: -1 };
  }

  // Lookup sub-pipeline to attach active patient sessions count
  const sessionLookupStages: any[] = [
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

  // Build single-roundtrip aggregation pipeline with $facet
  const isCaseloadSort = sortBy === 'patients-asc' || sortBy === 'patients' || sortBy === 'patients-desc';
  const caseloadSortDir = sortBy === 'patients-asc' ? 1 : -1;

  let aggregationPipeline: any[];

  if (isCaseloadSort) {
    // When sorting by caseload, calculate activePatientsCount first, then sort and paginate
    aggregationPipeline = [
      { $match: filter },
      ...sessionLookupStages,
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { activePatientsCount: caseloadSortDir, name: 1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ];
  } else {
    // Standard sort: Sort & paginate first, then lookup sessions ONLY for the requested page of doctors
    aggregationPipeline = [
      { $match: filter },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
            ...sessionLookupStages,
          ],
        },
      },
    ];
  }

  const [result] = await Doctor.aggregate(aggregationPipeline);
  const total = result?.metadata?.[0]?.total || 0;
  const doctors = result?.data || [];

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

  // Execute doctor lookup and session population in parallel to eliminate sequential roundtrips
  const [doctor, sessions] = await Promise.all([
    Doctor.findById(id).lean(),
    PatientSession.find({ doctorId: id })
      .populate('patientId', 'name phone email age gender')
      .sort({ sessionDate: -1 })
      .lean(),
  ]);

  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

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

  // Fetch doctor and assigned sessions concurrently
  const [doctor, sessions] = await Promise.all([
    Doctor.findById(doctorId).lean(),
    PatientSession.find({
      doctorId,
      status: { $in: ['active', 'scheduled'] },
    })
      .populate('patientId', 'name phone email age gender')
      .sort({ sessionDate: 1, appointmentAt: 1 })
      .lean(),
  ]);

  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

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
