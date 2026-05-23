import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const data = signupSchema.parse(req.body);
      const user = await AuthService.signup(data);
      if (!user) {
        throw new Error('Failed to create user');
      }
      res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email } });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }

  }

  static async signin(req: Request, res: Response) {
    try {
      const data = signinSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await AuthService.signin(data);

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ user, accessToken });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid credentials';
      res.status(401).json({ message });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out successfully' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message });
    }

  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
      }

      const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid or expired refresh token';
      res.status(401).json({ message });
    }

  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (error: unknown) {
      // Don't leak user existence
      res.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      res.json({ message: 'Password reset successfully' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }

  }
}

