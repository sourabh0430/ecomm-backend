import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('cart_items', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('cart_id')
            .notNullable()
            .references('id')
            .inTable('carts')
            .onDelete('CASCADE')
            .withKeyName('fk_cart_items_carts');

        table
            .uuid('variant_id')
            .notNullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('CASCADE')
            .withKeyName('fk_cart_items_variants');

        table.integer('quantity').notNullable().defaultTo(1);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('cart_items');
}