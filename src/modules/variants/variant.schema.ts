import { z } from "zod";

export const createVariantSchema = z.object({
    sku: z.string().min(1, "SKU is required").max(100),
    price: z.number().nonnegative().nullable().optional(),
    discount_price: z.number().nonnegative().nullable().optional(),
    cost: z.number().nonnegative().nullable().optional(),
    stock: z.number().int().nonnegative().default(0),
    attribute_value_ids: z.array(z.number().int().positive()).optional(),
});

export const updateVariantSchema = createVariantSchema.partial();

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;