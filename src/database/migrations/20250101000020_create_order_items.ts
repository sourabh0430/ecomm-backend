import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('order_items', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('order_id')
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')
            .withKeyName('fk_order_items_orders');

        table
            .uuid('seller_id')
            .notNullable()
            .references('id')
            .inTable('sellers')
            .onDelete('RESTRICT')
            .withKeyName('fk_order_items_sellers');

        table
            .uuid('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('RESTRICT')
            .withKeyName('fk_order_items_products');

        table
            .uuid('variant_id')
            .notNullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('RESTRICT')
            .withKeyName('fk_order_items_variants');

        table.string('product_name_snapshot', 200).notNullable();
        table.jsonb('variant_attributes_snapshot').notNullable();
        table.integer('quantity').notNullable();
        table.decimal('price_per_unit', 15, 4).notNullable();
        table.decimal('discount_per_unit', 15, 4).notNullable().defaultTo(0.0);
        table.decimal('tax_amount', 15, 4).notNullable();
        table.string('status', 50).notNullable().defaultTo('pending');
    });

    await knex.raw(`
    ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_status
    CHECK (status IN ('pending', 'allocated', 'shipped', 'delivered', 'cancelled', 'returned'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('order_items');
}