import { VariantRepository } from "./variant.repository";
import { CreateVariantInput, UpdateVariantInput } from "./variant.schema";

export class VariantService {
    static async getVariantsByProductId(productId: string): Promise<any[]> {
        return VariantRepository.findByProductId(productId);
    }

    static async getVariantById(id: string): Promise<any> {
        const variant = await VariantRepository.findById(id);
        if (!variant) throw new Error("Variant not found");
        return variant;
    }

    static async createVariant(productId: string, input: CreateVariantInput): Promise<any> {
        const existing = await VariantRepository.findBySku(input.sku);
        if (existing) throw new Error("Variant SKU already exists");

        return VariantRepository.create(
            productId,
            {
                sku: input.sku,
                price: input.price ?? null,
                discount_price: input.discount_price ?? null,
                cost: input.cost ?? null,
                stock: input.stock
            },
            input.attribute_value_ids
        );
    }

    static async updateVariant(id: string, input: UpdateVariantInput): Promise<any> {
        const variant = await VariantRepository.findById(id);
        if (!variant) throw new Error("Variant not found");

        if (input.sku) {
            const existing = await VariantRepository.findBySku(input.sku);
            if (existing && existing.id !== id) {
                throw new Error("Variant SKU already exists");
            }
        }

        const updateData = {
            sku: input.sku,
            price: input.price,
            discount_price: input.discount_price,
            cost: input.cost,
            stock: input.stock
        };

        const cleanedUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([_, val]) => val !== undefined)
        );

        return VariantRepository.update(id, cleanedUpdateData, input.attribute_value_ids);
    }

    static async deleteVariant(id: string): Promise<void> {
        const variant = await VariantRepository.findById(id);
        if (!variant) throw new Error("Variant not found");
        await VariantRepository.delete(id);
    }
}