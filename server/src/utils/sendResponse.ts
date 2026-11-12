import { Response } from 'express';

export interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IMeta;
  data?: T;
}

/**
 * Standardized API response sender to ensure consistent payload structure across all endpoints.
 */
export const sendResponse = <T>(res: Response, responseData: IApiResponse<T>): void => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    message: responseData.message,
    meta: responseData.meta,
    data: responseData.data,
  });
};
