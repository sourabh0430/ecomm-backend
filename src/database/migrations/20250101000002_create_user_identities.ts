import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_identities', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_user_identities_users');

        table.string('provider', 50).notNullable();
        table.string('provider_user_id', 255).notNullable();
        table.string('password_hash', 255).nullable();

        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique composite index
        table.unique(['provider', 'provider_user_id'], { indexName: 'uq_identities_provider_uid' });

        // Standard index
        table.index('user_id', 'idx_identities_user_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('user_identities');
}