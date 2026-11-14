import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Register a new user account with email, name, and password
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !EMAIL_REGEX.test(email.trim())) {
    throw new AppError(400, 'Please provide a valid email address.');
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new AppError(400, 'Please provide a valid full name (at least 2 characters).');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new AppError(400, 'Password must be at least 6 characters long.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // Create user using privileged Supabase Admin client with confirmed email and 'user' role
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: {
      name: cleanName,
      role: 'user',
    },
    app_metadata: {
      role: 'user',
    },
  });

  if (error || !data.user) {
    throw new AppError(400, error?.message || 'Failed to create user account.');
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User account registered successfully.',
    data: {
      id: data.user.id,
      email: data.user.email,
      name: cleanName,
      role: 'user',
    },
  });
});

// @desc    Get current authenticated user profile
// @route   GET /api/v1/auth/me
// @access  Private (Authenticated user)
export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError(401, 'Unauthorized');
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Current user profile retrieved successfully.',
    data: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role || 'user',
    },
  });
});
