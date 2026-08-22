import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('order_coupons', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('order_id')
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')
            .withKeyName('fk_order_coupons_orders');

        table
            .uuid('coupon_id')
            .notNullable()
            .references('id')
            .inTable('coupons')
            .onDelete('RESTRICT')
            .withKeyName('fk_order_coupons_coupons');

        table.decimal('discount_applied', 15, 4).notNullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('order_coupons');
}