import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('seller_id')
      .notNullable()
      .references('id')
      .inTable('sellers')
      .onDelete('RESTRICT')
      .withKeyName('fk_products_sellers');

    table.string('name', 200).notNullable();
    table.string('slug', 255).notNullable();
    table.text('description').notNullable();

    table
      .integer('category_id')
      .notNullable()
      .references('id')
      .inTable('categories')
      .onDelete('RESTRICT')
      .withKeyName('fk_products_categories');

    table
      .integer('tax_category_id')
      .notNullable()
      .references('id')
      .inTable('tax_categories')
      .onDelete('RESTRICT')
      .withKeyName('fk_products_tax_categories');

    table.string('brand', 100).nullable();
    table.string('type', 50).notNullable().defaultTo('physical');
    table.decimal('base_price', 15, 4).notNullable().defaultTo(0.0);
    table.decimal('base_cost', 15, 4).notNullable().defaultTo(0.0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    // Unique index
    table.unique('slug', { indexName: 'uq_products_slug' });
  });

  await knex.raw(`
    ALTER TABLE products
    ADD CONSTRAINT chk_products_type
    CHECK (type IN ('physical', 'digital', 'service'))
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}