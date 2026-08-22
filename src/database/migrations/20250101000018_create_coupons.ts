import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('coupons', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('code', 50).notNullable();
        table.string('discount_type', 50).notNullable();
        table.decimal('discount_value', 15, 4).notNullable();
        table.decimal('max_discount', 15, 4).nullable();
        table.decimal('min_order_value', 15, 4).notNullable().defaultTo(0.0);
        table.timestamp('starts_at', { useTz: true }).notNullable();
        table.timestamp('ends_at', { useTz: true }).notNullable();
        table.integer('usage_limit').nullable();
        table.integer('usage_count').notNullable().defaultTo(0);
        table.boolean('is_active').notNullable().defaultTo(true);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

        // Unique index
        table.unique('code', { indexName: 'uq_coupons_code' });
    });

    await knex.raw(`
    ALTER TABLE coupons
    ADD CONSTRAINT chk_coupons_discount_type
    CHECK (discount_type IN ('percentage', 'flat'))
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('coupons');
}