import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('attribute_types', (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('name', { indexName: 'uq_attribute_types_name' });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('attribute_types');
}