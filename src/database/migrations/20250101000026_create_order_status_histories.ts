import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('order_status_histories', (table) => {
        table.bigIncrements('id').primary();

        table
            .uuid('order_id')
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')
            .withKeyName('fk_order_history_orders');

        table.string('status', 50).notNullable();

        table
            .uuid('changed_by_id')
            .nullable()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL')
            .withKeyName('fk_order_history_users');

        table.text('comment').nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Standard index
        table.index('order_id', 'idx_order_history_order');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('order_status_histories');
}