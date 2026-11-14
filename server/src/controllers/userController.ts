import { Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, invalidateTokenCache } from '../middleware/auth';
import { AppError } from '../utils/AppError';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

// @desc    List all registered portal users (Admin only)
// @route   GET /api/v1/users
// @access  Private (Admin only)
export const getUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new AppError(500, error.message || 'Failed to retrieve user accounts.');
  }

  const users = (data?.users || []).map((u) => {
    const role = (u.app_metadata?.role || u.user_metadata?.role || 'user') as 'admin' | 'user';
    const name =
      u.user_metadata?.name ||
      u.user_metadata?.full_name ||
      (u.email ? u.email.split('@')[0] : 'User');

    return {
      id: u.id,
      email: u.email || '',
      name,
      role,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at || null,
    };
  });

  // Sort newest registrations first
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully.',
    meta: {
      total: users.length,
    },
    data: users,
  });
});

// @desc    Update user role (promote to admin or demote to user)
// @route   PATCH /api/v1/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || (role !== 'admin' && role !== 'user')) {
    throw new AppError(400, 'Invalid role. Role must be either "admin" or "user".');
  }

  // Prevent admin from demoting their own currently logged-in account
  if (req.user?.id === id && role !== 'admin') {
    throw new AppError(400, 'Security safeguard: You cannot demote your own account from administrator.');
  }

  // Fetch current user metadata to preserve existing properties like name
  const { data: targetData, error: fetchErr } = await supabaseAdmin.auth.admin.getUserById(id);
  if (fetchErr || !targetData.user) {
    throw new AppError(404, 'User not found.');
  }

  const currentMetadata = targetData.user.user_metadata || {};

  const { data: updated, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: { role },
    user_metadata: {
      ...currentMetadata,
      role,
    },
  });

  if (updateErr || !updated.user) {
    throw new AppError(400, updateErr?.message || 'Failed to update user role.');
  }

  // Invalidate any active cached tokens for this user
  invalidateTokenCache(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User role successfully updated to ${role}.`,
    data: {
      id: updated.user.id,
      email: updated.user.email,
      name: updated.user.user_metadata?.name || '',
      role,
    },
  });
});

// @desc    Delete a user account
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
export const deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Prevent admin from deleting their own currently logged-in account
  if (req.user?.id === id) {
    throw new AppError(400, 'Security safeguard: You cannot delete your own account.');
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    throw new AppError(400, error.message || 'Failed to delete user account.');
  }

  invalidateTokenCache(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User account removed successfully.',
    data: { id },
  });
});
