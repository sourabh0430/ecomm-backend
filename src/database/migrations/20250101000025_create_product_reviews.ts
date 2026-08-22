import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('product_reviews', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

        table
            .uuid('product_id')
            .notNullable()
            .references('id')
            .inTable('products')
            .onDelete('CASCADE')
            .withKeyName('fk_reviews_products');

        table
            .uuid('buyer_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .withKeyName('fk_reviews_users');

        table.smallint('rating').notNullable();
        table.string('title', 150).nullable();
        table.text('comment').nullable();
        table.boolean('is_verified').notNullable().defaultTo(false);
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    });

    await knex.raw(`
    ALTER TABLE product_reviews
    ADD CONSTRAINT chk_reviews_rating
    CHECK (rating >= 1 AND rating <= 5)
  `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('product_reviews');
}