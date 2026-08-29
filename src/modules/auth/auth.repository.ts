import { Knex } from "knex";
import { CreateUserData, CreateUserIdentityData, UserRecord } from "./auth.types";
import db from "../../config/database";

export class AuthRepository {
    //find a user by their email or phone number
    static async findByEmailOrPhone(
        email: string,
        phone: string,
        trx?: Knex.Transaction
    ): Promise<UserRecord | undefined> {
        const query = (trx || db)("users")
            .where("email", email)
            .orWhere("phone", phone)
            .first()

        return query;
    }


    // Insert a new user record into the user table
    static async createUser(
        userData: CreateUserData,
        trx: Knex.Transaction
    ): Promise<UserRecord> {
        const [insertedUser] = await trx("users")
            .insert({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.roleId,
                is_verified: false,
            })
            .returning(["id", "name", "email", "phone", "role_id", "created_at"]);

        return insertedUser;
    }

    //Insert a new user record into the user activity table

    static async createUSerIndetity(
        identityData: CreateUserIdentityData,
        trx: Knex.Transaction
    ): Promise<void> {
        await trx("user_identities")
            .insert({
                user_id: identityData.userId,
                provider: identityData.provider,
                provider_user_id: identityData.providerUserId,
                password_hash: identityData.passwordHash,
            });
    }
}