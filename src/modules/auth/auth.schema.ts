import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name cannot be longer than 100 characters"),

    email: z.string()
        .email("Invalid email address")
        .max(150, "Email cannot be longer than 150 characters"),

    phone: z.string()
        .min(5, "Phone number must be at least 5 characters long")
        .max(15, "Phone number must not be longer than 15 characters"),

    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password cannot be longer than 100 characters"),

    confirmPassword: z.string()
        .min(6, "Confirm Password is required")
        .max(100, "Confirm Password cannot be longer than 100 characters"),

    roleId: z.uuid("Invalid role ID")

});

export type RegisterUserInput = z.infer<typeof registerUserSchema>