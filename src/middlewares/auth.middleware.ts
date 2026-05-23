import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthPayload } from '../interfaces/auth.interface';

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret') as AuthPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasRole = user.roles.some((role: string) => roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

export const checkPermission = (permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasPermission = user.permissions.some((p: string) => permissions.includes(p));
    if (!hasPermission) {
      return res.status(403).json({ message: 'Access denied. Missing required permission.' });
    }

    next();
  };
};
