import { Knex } from "knex";
import db from "../../config/database";
import { CategoryRecord } from "./category.types";

export class CategoryRepository {

    static async findAll(trx?: Knex.Transaction): Promise<CategoryRecord[]> {
        return (trx || db)("categories").select("*").orderBy("name", "asc");
    }

    static async findById(id: number, trx?: Knex.Transaction): Promise<CategoryRecord | undefined> {
        return (trx || db)("categories").where("id", id).first();
    }

    static async findBySlug(slug: string, trx?: Knex.Transaction): Promise<CategoryRecord | undefined> {
        return (trx || db)("categories").where("slug", slug).first();
    }

    static async create(
        data: Omit<CategoryRecord, 'id'>,
        trx?: Knex.Transaction): Promise<CategoryRecord> {

        const [inserted] = await (trx || db)('categories')
            .insert(data)
            .returning('*');
        return inserted;
    }

    static async update(
        id: number,
        data: Partial<Omit<CategoryRecord, 'id'>>,
        trx?: Knex.Transaction): Promise<CategoryRecord | undefined> {
        const [updated] = await (trx || db)('categories')
            .where({ id })
            .update(data)
            .returning('*');
        return updated;
    }

    static async delete(
        id: number,
        trx?: Knex.Transaction): Promise<boolean> {
        const deletedRows = await (trx || db)('categories').where({ id }).del();
        return deletedRows > 0;
    }
}