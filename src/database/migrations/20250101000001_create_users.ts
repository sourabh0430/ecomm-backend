import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string("name", 100).notNullable();
        table.string("email", 150).notNullable();
        table.string("phone", 15).notNullable();
        table.string('role', 50).notNullable();
        table.boolean('is_verified').notNullable().defaultTo(false);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique, nullable indexes
        table.unique('email', { indexName: 'uq_users_email' });
        table.unique('phone', { indexName: 'uq_users_phone' });

        // Standard index
        table.index('role', 'idx_users_role');
    }).then(() => {
        // CHECK constraint (Knex has no native builder for this, so raw SQL)
        return knex.raw(`
            ALTER TABLE users
            ADD CONSTRAINT chk_users_role
            CHECK (role IN ('buyer', 'seller', 'super_admin'))
        `);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}

