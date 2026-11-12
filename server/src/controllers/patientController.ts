import { Request, Response } from 'express';
import { PatientService } from '../services/patientService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    Get all patients with pagination, search, filters & latest session
// @route   GET /api/v1/patients
export const getPatients = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getAllPatientsFromDB({
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    q: req.query.q as string,
    condition: req.query.condition as string,
    status: req.query.status as string,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patients retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// @desc    Get single patient by ID with full session history
// @route   GET /api/v1/patients/:id
export const getPatientById = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.getPatientByIdFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient details retrieved successfully',
    data: result,
  });
});

// @desc    Create standalone patient
// @route   POST /api/v1/patients
export const createPatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientService.createPatientInDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Patient registered successfully',
    data: patient,
  });
});

// @desc    Update patient information
// @route   PUT /api/v1/patients/:id
export const updatePatient = catchAsync(async (req: Request, res: Response) => {
  const patient = await PatientService.updatePatientInDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient record updated successfully',
    data: patient,
  });
});

// @desc    Delete patient and cascade clean up sessions
// @route   DELETE /api/v1/patients/:id
export const deletePatient = catchAsync(async (req: Request, res: Response) => {
  const result = await PatientService.deletePatientFromDB(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient and all clinical encounters deleted successfully',
    data: result,
  });
});

export const PatientController = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
