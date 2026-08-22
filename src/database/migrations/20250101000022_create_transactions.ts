import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('order_id')
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('RESTRICT')
            .withKeyName('fk_transactions_orders');

        table.string('payment_gateway', 100).notNullable();
        table.string('gateway_transaction_id', 255).notNullable();
        table.decimal('amount', 15, 4).notNullable();
        table.string('currency', 3).notNullable().defaultTo('INR');
        table.string('status', 50).notNullable().defaultTo('pending');
        table.string('payment_mode', 50).notNullable();
        table.jsonb('gateway_response').nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('gateway_transaction_id', { indexName: 'uq_transactions_gateway_id' });
    });

    await knex.raw(`
    ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_gateway
    CHECK (payment_gateway IN ('stripe', 'razorpay', 'paypal', 'cod'))
  `);

    await knex.raw(`
    ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_status
    CHECK (status IN ('pending', 'success', 'failed', 'refunded'))
  `);

    await knex.raw(`
    ALTER TABLE transactions
    ADD CONSTRAINT chk_transactions_payment_mode
    CHECK (payment_mode IN ('card', 'upi', 'netbanking', 'cod'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}