import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('sellers', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .withKeyName('fk_sellers_users');

        table.string('company_name', 150).notNullable();
        table.string('gstin', 15).notNullable();
        table.string('status', 50).notNullable().defaultTo('pending');
        table.jsonb('bank_details').nullable();
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique indexes
        table.unique('user_id', { indexName: 'uq_sellers_user_id' });
        table.unique('gstin', { indexName: 'uq_sellers_gstin' });
    });

    await knex.raw(`
    ALTER TABLE sellers
    ADD CONSTRAINT chk_sellers_status
    CHECK (status IN ('pending', 'approved', 'suspended'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('sellers');
}