import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('outbox_events', (table) => {
        table.bigIncrements('id').primary();
        table.string('event_type', 100).notNullable();
        table.jsonb('payload').notNullable();
        table.string('status', 50).notNullable().defaultTo('pending');
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('processed_at', { useTz: true }).nullable();
    });

    await knex.raw(`
    ALTER TABLE outbox_events
    ADD CONSTRAINT chk_outbox_events_status
    CHECK (status IN ('pending', 'processed', 'failed'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('outbox_events');
}