import { RegisterUserInput } from "./auth.schema";

export type CreateUserData = Omit<RegisterUserInput, "password" | "confirmPassword">;

export interface CreateUserIdentityData {
    userId: string;
    provider: string;
    providerUserId: string;
    passwordHash?: string
}

export interface UserRecord {
    id: string;
    email: string;
    name: string;
    phone: string;
    role_id: string;
    created_at: Date;
}