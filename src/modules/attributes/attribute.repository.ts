import db from "../../config/database";
import { AttributeTypeRecord, AttributeValueRecord } from "./attribute.types";

export class AttributeRepository {
    // --- Attribute Types CRUD ---
    static async findAllTypes(): Promise<AttributeTypeRecord[]> {
        return db("attribute_types").select("*").orderBy("name", "asc");
    }

    static async findTypeById(id: number): Promise<AttributeTypeRecord | undefined> {
        return db("attribute_types").where("id", id).first();
    }

    static async findTypeByName(name: string): Promise<AttributeTypeRecord | undefined> {
        return db("attribute_types").where("name", name).first();
    }

    static async createType(name: string): Promise<AttributeTypeRecord> {
        const [inserted] = await db("attribute_types")
            .insert({ name })
            .returning("*");
        return inserted;
    }

    static async updateType(id: number, name: string): Promise<AttributeTypeRecord | undefined> {
        const [updated] = await db("attribute_types")
            .where("id", id)
            .update({ name, updated_at: db.fn.now() })
            .returning("*");
        return updated;
    }

    static async deleteType(id: number): Promise<boolean> {
        const deleted = await db("attribute_types").where("id", id).del();
        return deleted > 0;
    }

    // --- Attribute Values CRUD ---
    static async findValuesByTypeId(typeId: number): Promise<AttributeValueRecord[]> {
        return db("attribute_values").where("attribute_type_id", typeId).select("*").orderBy("value", "asc");
    }

    static async findValueById(id: number): Promise<AttributeValueRecord | undefined> {
        return db("attribute_values").where("id", id).first();
    }

    static async findValueByComposite(typeId: number, value: string): Promise<AttributeValueRecord | undefined> {
        return db("attribute_values").where({ attribute_type_id: typeId, value }).first();
    }

    static async createValue(typeId: number, value: string): Promise<AttributeValueRecord> {
        const [inserted] = await db("attribute_values")
            .insert({ attribute_type_id: typeId, value })
            .returning("*");
        return inserted;
    }

    static async updateValue(id: number, value: string): Promise<AttributeValueRecord | undefined> {
        const [updated] = await db("attribute_values")
            .where("id", id)
            .update({ value, updated_at: db.fn.now() })
            .returning("*");
        return updated;
    }

    static async deleteValue(id: number): Promise<boolean> {
        const deleted = await db("attribute_values").where("id", id).del();
        return deleted > 0;
    }
}