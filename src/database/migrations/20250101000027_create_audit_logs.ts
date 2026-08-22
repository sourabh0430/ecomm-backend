import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('audit_logs', (table) => {
        table.bigIncrements('id').primary();

        table
            .uuid('user_id')
            .nullable()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL')
            .withKeyName('fk_audit_logs_users');

        table.string('action', 100).notNullable();
        table.string('entity_name', 50).notNullable();
        table.string('entity_id', 36).nullable();
        table.jsonb('old_values').nullable();
        table.jsonb('new_values').nullable();
        table.specificType('ip_address', 'inet').nullable();
        table.text('user_agent').nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Standard indexes
        table.index('user_id', 'idx_audit_logs_user');
        table.index(['entity_name', 'entity_id'], 'idx_audit_logs_entity');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('audit_logs');
}