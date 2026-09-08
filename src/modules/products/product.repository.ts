import db from "../../config/database";
import { ProductRecord } from "./product.types";

export class ProductRepository {
    static async findAll(): Promise<ProductRecord[]> {
        return db("products").select("*").orderBy("created_at", "desc");
    }

    static async findById(id: string): Promise<ProductRecord | undefined> {
        return db("products").where("id", id).first();
    }

    static async findBySlug(slug: string): Promise<ProductRecord | undefined> {
        return db("products").where("slug", slug).first();
    }

    static async create(data: Omit<ProductRecord, "id" | "created_at" | "updated_at">): Promise<ProductRecord> {
        const [inserted] = await db("products")
            .insert(data)
            .returning("*");
        return inserted;
    }

    static async update(id: string, data: Partial<Omit<ProductRecord, "id" | "created_at" | "updated_at">>): Promise<ProductRecord | undefined> {
        const [updated] = await db("products")
            .where("id", id)
            .update({ ...data, updated_at: db.fn.now() })
            .returning("*");
        return updated;
    }

    static async delete(id: string): Promise<boolean> {
        const deleted = await db("products").where("id", id).del();
        return deleted > 0;
    }
}