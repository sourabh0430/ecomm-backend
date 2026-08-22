import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('variant_attribute_values', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('variant_id')
            .notNullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('CASCADE')
            .withKeyName('fk_variant_attributes_variants');

        table
            .integer('attribute_value_id')
            .notNullable()
            .references('id')
            .inTable('attribute_values')
            .onDelete('RESTRICT')
            .withKeyName('fk_variant_attributes_values');

        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Composite unique index
        table.unique(['variant_id', 'attribute_value_id'], { indexName: 'uq_variant_attributes_composite' });

        // Standard index
        table.index('attribute_value_id', 'idx_variant_attributes_value');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('variant_attribute_values');
}