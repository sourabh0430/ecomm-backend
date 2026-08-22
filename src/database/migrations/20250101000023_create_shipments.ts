import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('shipments', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('order_id')
            .notNullable()
            .references('id')
            .inTable('orders')
            .onDelete('CASCADE')
            .withKeyName('fk_shipments_orders');

        table.string('carrier_name', 100).notNullable();
        table.string('tracking_number', 150).notNullable();
        table.string('status', 50).notNullable().defaultTo('label_created');
        table.timestamp('estimated_delivery', { useTz: true }).notNullable();
        table.timestamp('actual_delivery', { useTz: true }).nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('tracking_number', { indexName: 'uq_shipments_tracking' });
    });

    await knex.raw(`
    ALTER TABLE shipments
    ADD CONSTRAINT chk_shipments_status
    CHECK (status IN ('label_created', 'in_transit', 'out_for_delivery', 'delivered', 'failed'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('shipments');
}