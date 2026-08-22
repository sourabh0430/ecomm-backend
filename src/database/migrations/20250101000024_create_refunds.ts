import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('refunds', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('transaction_id')
            .notNullable()
            .references('id')
            .inTable('transactions')
            .onDelete('RESTRICT')
            .withKeyName('fk_refunds_transactions');

        table
            .uuid('order_item_id')
            .nullable()
            .references('id')
            .inTable('order_items')
            .onDelete('RESTRICT')
            .withKeyName('fk_refunds_order_items');

        table.text('reason').notNullable();
        table.decimal('amount', 15, 4).notNullable();
        table.string('status', 50).notNullable().defaultTo('initiated');
        table.string('gateway_refund_id', 255).nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('gateway_refund_id', { indexName: 'uq_refunds_gateway_id' });
    });

    await knex.raw(`
    ALTER TABLE refunds
    ADD CONSTRAINT chk_refunds_status
    CHECK (status IN ('initiated', 'processed', 'completed', 'failed'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('refunds');
}