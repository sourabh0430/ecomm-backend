export interface AuthPayload {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthPayload;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
