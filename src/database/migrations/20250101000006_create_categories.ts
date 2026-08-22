import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.string('slug', 120).notNullable();

        table
            .integer('parent_id')
            .nullable()
            .references('id')
            .inTable('categories')
            .onDelete('SET NULL')
            .withKeyName('fk_categories_categories');

        table.text('description').nullable();

        // Unique index
        table.unique('slug', { indexName: 'uq_categories_slug' });

        // Standard index
        table.index('parent_id', 'idx_categories_parent');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('categories');
}