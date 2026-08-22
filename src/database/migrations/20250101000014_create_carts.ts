import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('carts', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .nullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_carts_users');

        table.string('session_token', 255).nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('user_id', { indexName: 'uq_carts_user_id' });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('carts');
}