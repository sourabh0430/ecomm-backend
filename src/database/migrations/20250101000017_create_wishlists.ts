import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('wishlists', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_wishlists_users');

        table
            .uuid('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
            .withKeyName('fk_wishlists_products');

        table
            .uuid('variant_id')
            .nullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('CASCADE')
            .withKeyName('fk_wishlists_variants');

        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Composite unique index
        table.unique(['user_id', 'product_id', 'variant_id'], { indexName: 'uq_wishlist_user_product' });
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('wishlists');
}