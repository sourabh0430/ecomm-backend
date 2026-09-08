import bcrypt from "bcryptjs";
import db from "../../config/database";
import { AuthRepository } from "./auth.repository";
import { RegisterUserInput, LoginUserInput } from "./auth.schema";
import { UserRecord } from "./auth.types";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export class AuthService {
    // Handle user registration
    static async registerUser(
        input: RegisterUserInput
    ): Promise<UserRecord> {
        const { name, email, phone, roleId, password } = input;

        const existingUser = await AuthRepository.findByEmailOrPhone(email, phone);
        if (existingUser) {
            throw new Error("User already exists");
        }

        //hash password using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //execute database operation within an atomic transaction
        const newUser = await db.transaction(async (trx) => {
            const createdUser = await AuthRepository.createUser(
                { name, email, phone, roleId },
                trx
            );

            await AuthRepository.createUSerIndetity(
                {
                    userId: createdUser.id,
                    provider: "password",
                    providerUserId: email,
                    passwordHash
                },
                trx
            )
            return createdUser;
        });

        return newUser;
    }

    //Handle user login and JWT generation
    static async loginUser(
        input: LoginUserInput
    ): Promise<{ user: UserRecord; token: string }> {
        const { email, password } = input;

        //verfiy user exists
        const user = await AuthRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        //fetch the strored credentials (password)
        const identity = await AuthRepository.findIdentityByUserId(user.id, "password");
        if (!identity || !identity.password_hash) {
            throw new Error("Invalid credentials");
        }

        //compare submitted password with hash
        const isPasswordValid = await bcrypt.compare(password, identity.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials");
        }

        //Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role_id,
            },
            env.jwt.jwt_secret_key,
            {
                expiresIn: env.jwt.jwt_expires_time as any
            }
        );
        return { user, token };
    }
}