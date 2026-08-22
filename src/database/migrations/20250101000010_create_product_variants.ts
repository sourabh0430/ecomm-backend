import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('product_variants', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
            .withKeyName('fk_product_variants_products');

        table.string('sku', 100).notNullable();
        table.decimal('price', 15, 4).nullable();
        table.decimal('discount_price', 15, 4).nullable();
        table.decimal('cost', 15, 4).nullable();
        table.integer('stock').notNullable().defaultTo(0);
        table.integer('version').notNullable().defaultTo(1);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('sku', { indexName: 'uq_variants_sku' });

        // Standard index
        table.index('product_id', 'idx_variants_product');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('product_variants');
}