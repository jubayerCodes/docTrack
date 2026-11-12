import { Request, Response } from 'express';
import { SessionService } from '../services/sessionService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    Assign a patient session under a doctor (Workflow 4.1: link existing OR register new inline)
// @route   POST /api/v1/doctors/:id/sessions
export const createDoctorSession = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionService.assignDoctorSessionInDB(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Patient session assigned successfully under doctor',
    data: result,
  });
});

// @desc    Disassociate / remove session from doctor's list (keeps master patient record)
// @route   DELETE /api/v1/doctors/:id/sessions/:sessionId
export const deleteDoctorSession = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionService.disassociateDoctorSessionFromDB(
    req.params.id,
    req.params.sessionId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Patient session disassociated from doctor. Master patient record preserved.',
    data: result,
  });
});

// @desc    Update session status or clinical details
// @route   PATCH /api/v1/sessions/:sessionId
export const updateSession = catchAsync(async (req: Request, res: Response) => {
  const result = await SessionService.updateSessionInDB(req.params.sessionId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Session updated successfully',
    data: result,
  });
});

export const SessionController = {
  createDoctorSession,
  deleteDoctorSession,
  updateSession,
};
