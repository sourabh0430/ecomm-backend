import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user_addresses', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_user_addresses_users');

        table.string('address_line_1', 255).notNullable();
        table.string('address_line_2', 255).nullable();
        table.string('city', 100).notNullable();
        table.string('state', 100).notNullable();
        table.string('postal_code', 15).notNullable();
        table.string('country', 100).notNullable().defaultTo('India');
        table.boolean('is_default').notNullable().defaultTo(false);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('user_addresses');
}