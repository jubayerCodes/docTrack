import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    Get dashboard analytics KPIs, caseload distribution & temporal encounter trends
// @route   GET /api/v1/analytics/summary
export const getAnalyticsSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getAnalyticsSummaryFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Analytics summary retrieved successfully',
    data: result,
  });
});

export const AnalyticsController = {
  getAnalyticsSummary,
};
