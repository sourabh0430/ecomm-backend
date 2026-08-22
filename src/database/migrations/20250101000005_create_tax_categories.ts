import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tax_categories', (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable();
        table.decimal('rate', 5, 2).notNullable().defaultTo(0.0);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('tax_categories');
}