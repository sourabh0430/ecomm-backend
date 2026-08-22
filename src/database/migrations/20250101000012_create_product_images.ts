import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('product_images', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
            .withKeyName('fk_images_products');

        table
            .uuid('variant_id')
            .nullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('CASCADE')
            .withKeyName('fk_images_variants');

        table.string('image_url', 512).notNullable();
        table.integer('sort_order').notNullable().defaultTo(0);
        table.boolean('is_primary').notNullable().defaultTo(false);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Standard indexes
        table.index('product_id', 'idx_images_product');
        table.index('variant_id', 'idx_images_variant');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('product_images');
}