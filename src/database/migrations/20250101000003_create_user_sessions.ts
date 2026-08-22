import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user_sessions', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_user_sessions_users');

        table.string('jwt_jti', 255).notNullable();
        table.specificType('ip_address', 'inet').nullable();
        table.text('user_agent').nullable();
        table.timestamp('login_time', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('logout_time', { useTz: true }).nullable();
        table.timestamp('expires_at', { useTz: true }).notNullable();
        table.string('status', 50).notNullable().defaultTo('active');

        table.unique('jwt_jti', { indexName: 'uq_sessions_jwt_jti' });
        table.index(['user_id', 'login_time'], 'idx_sessions_user_login');
    });

    await knex.raw(`
    ALTER TABLE user_sessions
    ADD CONSTRAINT chk_sessions_status
    CHECK (status IN ('active', 'logged_out', 'expired'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('user_sessions');
}