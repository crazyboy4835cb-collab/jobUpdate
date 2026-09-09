import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jobupdate-admin-secret-key-9872134';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id?: string;
    username: string;
    role: string;
  };
  user?: {
    username?: string;
    email?: string;
    role: string;
  };
}

/**
 * Authentication Middleware:
 * Verifies that the incoming request contains a valid, non-expired JWT Bearer token.
 * Rejects missing, invalid, or expired tokens with 401 Unauthorized.
 */
export function authenticateAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Missing Authorization header.',
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Authorization header must follow the Bearer format.',
    });
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Missing Bearer token.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id?: string;
      username?: string;
      email?: string;
      role?: string;
    };

    const username = decoded.username || decoded.email || 'admin';
    const role = decoded.role || 'admin';

    req.admin = {
      id: decoded.id,
      username,
      role,
    };
    req.user = {
      username,
      email: decoded.email,
      role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
}

/**
 * Authorization Middleware:
 * Confirms that the authenticated user possesses the 'admin' role.
 * Rejects non-administrators with 403 Forbidden.
 */
export function authorizeAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.admin || req.admin.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden. Administrator privileges required.',
    });
  }
  next();
}

/**
 * Combined Admin Authentication & Authorization Middleware
 */
export const authMiddleware = [authenticateAdmin, authorizeAdmin];

