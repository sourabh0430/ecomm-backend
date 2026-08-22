import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('inventory_logs', (table) => {
        table.bigIncrements('id').primary();

        table
            .uuid('variant_id')
            .notNullable()
            .references('id')
            .inTable('product_variants')
            .onDelete('RESTRICT')
            .withKeyName('fk_inventory_logs_variants');

        table.integer('change_amount').notNullable();
        table.string('event_type', 50).notNullable();
        table.uuid('reference_id').nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Standard indexes
        table.index('variant_id', 'idx_inventory_logs_variant');
        table.index('reference_id', 'idx_inventory_logs_reference');
    });

    await knex.raw(`
    ALTER TABLE inventory_logs
    ADD CONSTRAINT chk_inventory_logs_event_type
    CHECK (event_type IN ('restock', 'order_placed', 'order_cancelled', 'refund_return', 'adjustment'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('inventory_logs');
}