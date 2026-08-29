import bcrypt from "bcryptjs";
import db from "../../config/database";
import { AuthRepository } from "./auth.repository";
import { RegisterUserInput } from "./auth.schema";
import { UserRecord } from "./auth.types";

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
}