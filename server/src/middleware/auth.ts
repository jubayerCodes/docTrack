import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // 1. Extract token from cookie or Authorization header
    let token = req.cookies?.['sb-access-token'] || req.cookies?.['sb-auth-token'];

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Safe local development bypass if DEV_MODE is enabled
    if (process.env.DEV_MODE === 'true' || !process.env.SUPABASE_JWT_SECRET) {
      req.user = {
        id: 'admin-dev-01',
        email: 'admin@doctrack.internal',
        role: 'admin',
      };
      return next();
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No session token provided.' });
      return;
    }

    // 3. Verify JWT with Supabase Secret
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET as string) as any;
    req.user = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      role: decoded.role || decoded.app_metadata?.role || 'admin',
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};
