import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_roles", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("name", 50).notNullable().unique();
        table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });

    await knex("user_roles").insert([
        { name: "buyer" },
        { name: "seller" },
        { name: "super_admin" }
    ]);



    await knex.schema.alterTable("users", (table) => {
        table.uuid("role_id")
            .nullable()
            .references("id")
            .inTable("user_roles")
            .onDelete("RESTRICT")
            .withKeyName("fk_users_role_id");
    })

    //migrate existing user roles to role id
    const roles = await knex("user_roles").select("id", "name");
    for (const role of roles) {
        await knex("users").where("role", role.name).update({
            role_id: role.id
        });
    }

    // drop old check constraint, make role_id NOT NULL, and drop old role string column
    await knex.raw(`ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_role`)
    await knex.schema.alterTable("users", (table) => {
        table.uuid("role_id").notNullable().alter();
        table.dropColumn("role");
        table.index("role_id", "idx_users_role_id");
    })
}

export async function down(knex: Knex): Promise<void> {
    //re-add role column as nullable
    await knex.schema.alterTable("users", (table) => {
        table.string("role", 50).nullable()
    })

    //Re-populate role column from user_role name
    const usersWithRoles = await knex("users")
        .join("user_roles", "users.role_id", "user_roles.id")
        .select("users.id", "user_roles.name as role_name");

    for (const user of usersWithRoles) {
        await knex("users").where("id", user.id).update({
            role: user.role_name
        });
    }

    //make role column NOT NULL
    await knex.schema.alterTable("users", (table) => {
        table.string("role", 50).notNullable().alter();
        table.index("role", "idx_users_role");
    })

    // Add back constraint check
    await knex.raw(`
        ALTER TABLE users ADD CONSTRAINT check_users_role
        CHECK (role IN ('buyer','seller','super_admin'))
    `)

    //Drop role_id column and foreign key constraint
    await knex.schema.alterTable("users", (table) => {
        table.dropColumn("role_id");
    })

    await knex.schema.dropTableIfExists("user_roles");

}