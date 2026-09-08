import db from "../../config/database";
import { ProductVariantRecord } from "./variant.types";

export class VariantRepository {
    static async findByProductId(productId: string): Promise<any[]> {
        const variants = await db("product_variants")
            .where("product_id", productId)
            .orderBy("sku", "asc");

        // Attach attribute details for each variant
        return Promise.all(
            variants.map(async (v) => {
                const attrs = await this.findAttributesByVariantId(v.id);
                return { ...v, attributes: attrs };
            })
        );
    }

    static async findById(id: string): Promise<any | undefined> {
        const variant = await db("product_variants").where("id", id).first();
        if (!variant) return undefined;

        const attrs = await this.findAttributesByVariantId(id);
        return { ...variant, attributes: attrs };
    }

    static async findBySku(sku: string): Promise<ProductVariantRecord | undefined> {
        return db("product_variants").where("sku", sku).first();
    }

    private static async findAttributesByVariantId(variantId: string) {
        return db("variant_attribute_values")
            .join("attribute_values", "variant_attribute_values.attribute_value_id", "attribute_values.id")
            .join("attribute_types", "attribute_values.attribute_type_id", "attribute_types.id")
            .where("variant_attribute_values.variant_id", variantId)
            .select(
                "attribute_values.id as value_id",
                "attribute_values.value as value",
                "attribute_types.id as type_id",
                "attribute_types.name as type_name"
            );
    }

    static async create(
        productId: string,
        data: Omit<ProductVariantRecord, "id" | "product_id" | "version" | "created_at" | "updated_at">,
        attributeValueIds?: number[]
    ): Promise<any> {
        return db.transaction(async (trx) => {
            const [inserted] = await trx("product_variants")
                .insert({
                    product_id: productId,
                    sku: data.sku,
                    price: data.price,
                    discount_price: data.discount_price,
                    cost: data.cost,
                    stock: data.stock,
                    version: 1
                })
                .returning("*");

            if (attributeValueIds && attributeValueIds.length > 0) {
                const relationRows = attributeValueIds.map((valId) => ({
                    variant_id: inserted.id,
                    attribute_value_id: valId
                }));
                await trx("variant_attribute_values").insert(relationRows);
            }

            return inserted;
        });
    }

    static async update(
        id: string,
        data: Partial<Omit<ProductVariantRecord, "id" | "product_id" | "created_at" | "updated_at">>,
        attributeValueIds?: number[]
    ): Promise<any> {
        return db.transaction(async (trx) => {
            const [updated] = await trx("product_variants")
                .where("id", id)
                .update({
                    ...data,
                    version: db.raw("version + 1"),
                    updated_at: db.fn.now()
                })
                .returning("*");

            if (attributeValueIds !== undefined) {
                // Remove existing associations and apply updated associations
                await trx("variant_attribute_values").where("variant_id", id).del();

                if (attributeValueIds.length > 0) {
                    const relationRows = attributeValueIds.map((valId) => ({
                        variant_id: id,
                        attribute_value_id: valId
                    }));
                    await trx("variant_attribute_values").insert(relationRows);
                }
            }

            return updated;
        });
    }

    static async delete(id: string): Promise<boolean> {
        const deleted = await db("product_variants").where("id", id).del();
        return deleted > 0;
    }
}