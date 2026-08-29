import type { Knex } from "knex";
import bcrypt from "bcryptjs";

const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || "Super Admin";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || "+1234567890";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "Admin@123";

export async function up(knex: Knex): Promise<void> {
    // Check if user already exists to avoid duplicate entries
    const existing = await knex("users")
        .where("email", SUPER_ADMIN_EMAIL)
        .orWhere("phone", SUPER_ADMIN_PHONE)
        .first();

    if (existing) {
        return;
    }

    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);

    // Insert user and identity atomically within a transaction
    await knex.transaction(async (trx) => {
        const [insertedUser] = await trx("users")
            .insert({
                name: SUPER_ADMIN_NAME,
                email: SUPER_ADMIN_EMAIL,
                phone: SUPER_ADMIN_PHONE,
                role: "super_admin",
                is_verified: true,
            })
            .returning(["id"]);

        await trx("user_identities").insert({
            user_id: insertedUser.id,
            provider: "password",
            provider_user_id: SUPER_ADMIN_EMAIL,
            password_hash: hash,
        });
    });
}

export async function down(knex: Knex): Promise<void> {
    const user = await knex("users").where("email", SUPER_ADMIN_EMAIL).first();
    if (user) {
        // Cascade delete on fk_user_identities_users will automatically clean up the identity table
        await knex("users").where("id", user.id).del();
    }
}
