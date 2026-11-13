import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

/**
 * Extracts the Supabase access token from incoming cookies.
 * Supports standard cookies ('sb-access-token', 'sb-auth-token')
 * as well as @supabase/ssr generated cookies ('sb-<ref>-auth-token').
 */
const extractTokenFromCookies = (cookies: Record<string, any> | undefined): string | null => {
  if (!cookies || typeof cookies !== 'object') {
    return null;
  }

  // 1. Direct standard token cookie
  if (cookies['sb-access-token']) {
    return String(cookies['sb-access-token']);
  }

  // 2. Standard auth-token cookie
  if (cookies['sb-auth-token']) {
    return parseCookieValue(cookies['sb-auth-token']);
  }

  // 3. Search for @supabase/ssr pattern: 'sb-<project-ref>-auth-token'
  for (const cookieName of Object.keys(cookies)) {
    if (cookieName.startsWith('sb-') && cookieName.endsWith('-auth-token')) {
      const parsed = parseCookieValue(cookies[cookieName]);
      if (parsed) return parsed;
    }
  }

  return null;
};

/**
 * Safely parses cookie value if serialized as JSON or base64 JSON by @supabase/ssr
 */
const parseCookieValue = (raw: any): string | null => {
  if (!raw) return null;
  if (typeof raw === 'string') {
    // If it's already a JWT string (starts with eyJ)
    if (raw.startsWith('eyJ')) {
      return raw;
    }

    try {
      // Decode if base64 or JSON encoded
      let text = raw;
      if (text.startsWith('base64-')) {
        text = Buffer.from(text.replace('base64-', ''), 'base64').toString('utf-8');
      }
      const data = JSON.parse(text);
      if (Array.isArray(data) && data[0]) {
        return String(data[0]); // [access_token, refresh_token]
      }
      if (data && typeof data === 'object' && data.access_token) {
        return String(data.access_token);
      }
    } catch {
      return raw;
    }
  }
  return null;
};

/**
 * STRICT Cookie Authentication Middleware
 * Enforces HttpOnly cookie transport only. Rejects raw Bearer tokens in headers.
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Reject any request attempting to use Bearer Authorization header directly
    if (req.headers.authorization) {
      res.status(401).json({
        success: false,
        message:
          'Security policy violation: Raw Authorization header is forbidden. Strict HttpOnly cookie authentication is required.',
      });
      return;
    }

    // 2. Extract access token strictly from secure cookies
    const token = extractTokenFromCookies(req.cookies);

    // 3. Safe local development bypass if DEV_MODE is enabled and no cookie is present
    if (process.env.DEV_MODE === 'true' && !token) {
      req.user = {
        id: 'admin-dev-01',
        email: 'admin@doctrack.internal',
        role: 'admin',
      };
      return next();
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No valid session cookie found.',
      });
      return;
    }

    // 4. Verify the session token using privileged backend client (SUPABASE_SECRET_KEY)
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid, expired, or revoked session cookie.',
      });
      return;
    }

    // 5. Populate verified user payload
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.app_metadata?.role || user.user_metadata?.role || 'admin',
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed due to internal error.',
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access to specified roles (e.g. 'admin')
 */
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role || '')) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have the required permissions to perform this action.',
      });
      return;
    }
    next();
  };
};
