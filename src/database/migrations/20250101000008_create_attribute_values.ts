import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('attribute_values', (table) => {
        table.increments('id').primary();

        table
            .integer('attribute_type_id')
            .notNullable()
            .references('id')
            .inTable('attribute_types')
            .onDelete('CASCADE')
            .withKeyName('fk_attribute_values_attribute_types');

        table.string('value', 100).notNullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Composite unique index
        table.unique(['attribute_type_id', 'value'], { indexName: 'uq_attribute_values_composite' });

        // Standard index
        table.index('attribute_type_id', 'idx_attribute_values_type');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('attribute_values');
}