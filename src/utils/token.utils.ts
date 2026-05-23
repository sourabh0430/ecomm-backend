import jwt from 'jsonwebtoken';
import { AuthPayload } from '../interfaces/auth.interface';

export const generateAccessToken = (payload: AuthPayload) => {
  return jwt.sign(payload, (process.env.ACCESS_TOKEN_SECRET as string) || 'secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '15m',
  });
};

export const generateRefreshToken = (payload: { id: string }) => {
  return jwt.sign(payload, (process.env.REFRESH_TOKEN_SECRET as string) || 'refresh_secret', {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as any) || '7d',
  });
};



export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, (process.env.ACCESS_TOKEN_SECRET as string) || 'secret');
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, (process.env.REFRESH_TOKEN_SECRET as string) || 'refresh_secret');
  } catch (error) {
    return null;
  }
};

