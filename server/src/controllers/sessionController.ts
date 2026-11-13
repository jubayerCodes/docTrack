import { Request, Response } from 'express';
import { SessionService } from '../services/sessionService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    Get all clinical sessions (optional filtering by doctorId, patientId, status)
// @route   GET /api/v1/sessions
export const getSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionService.getSessionsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sessions retrieved successfully',
    meta: {
      total: result.count,
    },
    data: result.sessions,
  });
});

// @desc    Get a single clinical session by ID
// @route   GET /api/v1/sessions/:sessionId
export const getSessionById = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId || req.params.id;
  const result = await SessionService.getSessionByIdFromDB(sessionId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Session details retrieved successfully',
    data: result,
  });
});

// @desc    Create / schedule a patient session (links existing OR registers new inline)
// @route   POST /api/v1/sessions
export const createSession = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.body.doctorId || req.params.id || req.params.doctorId;
  const result = await SessionService.createSessionInDB(doctorId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Patient session assigned successfully',
    data: result,
  });
});

// @desc    Update session status or clinical details
// @route   PATCH /api/v1/sessions/:sessionId
export const updateSession = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId || req.params.id;
  const result = await SessionService.updateSessionInDB(sessionId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Session updated successfully',
    data: result,
  });
});

// @desc    Delete / disassociate session (preserves master patient record)
// @route   DELETE /api/v1/sessions/:sessionId
export const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId || req.params.id;
  const doctorId = (req.query.doctorId as string) || (req.body?.doctorId as string) || req.params.doctorId;
  const result = await SessionService.deleteSessionFromDB(sessionId, doctorId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient session disassociated / deleted successfully. Master patient record preserved.',
    data: result,
  });
});

// Backwards-compatibility aliases
export const createDoctorSession = createSession;
export const deleteDoctorSession = deleteSession;

export const SessionController = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  createDoctorSession,
  deleteDoctorSession,
};
