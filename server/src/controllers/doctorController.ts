import { Request, Response } from 'express';
import { DoctorService } from '../services/doctorService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    Get all doctors with pagination, search, filter, and active patient counts
// @route   GET /api/v1/doctors
export const getDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getAllDoctorsFromDB({
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    q: req.query.q as string,
    specialization: req.query.specialization as string,
    sort: req.query.sort as string,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctors retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// @desc    Get single doctor by ID with encounters
// @route   GET /api/v1/doctors/:id
export const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctorByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor details retrieved successfully',
    data: result,
  });
});

// @desc    Create new doctor
// @route   POST /api/v1/doctors
export const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await DoctorService.createDoctorInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Doctor created successfully',
    data: doctor,
  });
});

// @desc    Update doctor profile
// @route   PUT /api/v1/doctors/:id
export const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const doctor = await DoctorService.updateDoctorInDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor updated successfully',
    data: doctor,
  });
});

// @desc    Delete doctor
// @route   DELETE /api/v1/doctors/:id
export const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.deleteDoctorFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doctor deleted and associated sessions updated successfully',
    data: result,
  });
});

// @desc    Get all patients assigned to a specific doctor
// @route   GET /api/v1/doctors/:id/patients
export const getDoctorPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorService.getDoctorAssignedPatientsFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Assigned patients retrieved successfully',
    meta: {
      total: result.count,
    },
    data: result,
  });
});

export const DoctorController = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorPatients,
};
