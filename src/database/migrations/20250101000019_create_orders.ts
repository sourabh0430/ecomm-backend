import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('orders', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('buyer_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .withKeyName('fk_orders_users');

        table
            .uuid('shipping_address_id')
            .notNullable()
            .references('id')
            .inTable('user_addresses')
            .onDelete('RESTRICT')
            .withKeyName('fk_orders_addresses');

        table.decimal('total_amount', 15, 4).notNullable();
        table.decimal('discount_amount', 15, 4).notNullable().defaultTo(0.0);
        table.decimal('tax_amount', 15, 4).notNullable().defaultTo(0.0);
        table.decimal('shipping_charge', 15, 4).notNullable().defaultTo(0.0);
        table.decimal('payable_amount', 15, 4).notNullable();
        table.string('order_status', 50).notNullable().defaultTo('pending');
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Standard indexes
        table.index('buyer_id', 'idx_orders_buyer');
        table.index('order_status', 'idx_orders_status');
    });

    await knex.raw(`
    ALTER TABLE orders
    ADD CONSTRAINT chk_orders_status
    CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('orders');
}