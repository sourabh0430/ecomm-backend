import { db } from '../db';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/token.utils';
import { 
  SignupData, 
  SigninData, 
  AuthPayload, 
  AuthResponse, 
  TokenResponse 
} from '../interfaces/auth.interface';

export class AuthService {

  static async signup(data: SignupData) {
    const { email, password, name } = data;

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = await db.query.roles.findFirst({
      where: eq(schema.roles.name, 'WEBSITE_USER')
    });
    
    if (!role) {
      throw new Error('Default role not found');
    }

    await db.insert(schema.users).values({
      email,
      password: hashedPassword,
      name: name || null,
    });

    const newUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (!newUser) {
      throw new Error('User creation failed');
    }

    await db.insert(schema.userRoles).values({
      user_id: newUser.id,
      role_id: role.id,
    });

    return newUser;
  }

  static async signin(data: SigninData): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
      with: {
        roles: {
          with: {
            role: {
              with: {
                permissions: {
                  with: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const rolesNames = user.roles.map((ur) => ur.role.name);
    const permissionsNames = user.roles.flatMap((ur) => 
      ur.role.permissions.map((rp) => rp.permission.name)
    );

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      roles: rolesNames,
      permissions: permissionsNames,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id });

    await db.insert(schema.refreshTokens).values({
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { user: payload, accessToken, refreshToken };
  }

  static async logout(refreshToken: string): Promise<void> {
    await db.update(schema.refreshTokens)
      .set({ revoked_at: new Date() })
      .where(eq(schema.refreshTokens.token, refreshToken));
  }

  static async refresh(token: string): Promise<TokenResponse> {
    const record = await db.query.refreshTokens.findFirst({
      where: eq(schema.refreshTokens.token, token),
      with: {
        user: {
          with: {
            roles: {
              with: {
                role: {
                  with: {
                    permissions: {
                      with: {
                        permission: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!record || record.revoked_at || record.expires_at < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = record.user;
    const rolesNames = user.roles.map((ur) => ur.role.name);
    const permissionsNames = user.roles.flatMap((ur) => 
      ur.role.permissions.map((rp) => rp.permission.name)
    );

    const payload: AuthPayload = {
      id: user.id,
      email: user.email,
      roles: rolesNames,
      permissions: permissionsNames,
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: user.id });

    await db.update(schema.refreshTokens)
      .set({ revoked_at: new Date() })
      .where(eq(schema.refreshTokens.id, record.id));

    await db.insert(schema.refreshTokens).values({
      token: newRefreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  static async forgotPassword(email: string): Promise<string> {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = Math.random().toString(36).substring(2, 15);
    await db.insert(schema.passwordResetTokens).values({
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 3600000),
    });

    return token;
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    const record = await db.query.passwordResetTokens.findFirst({
      where: eq(schema.passwordResetTokens.token, token),
    });

    if (!record || record.expires_at < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, record.user_id));

    await db.delete(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.id, record.id));
  }
}
