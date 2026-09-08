import { z } from "zod";

export const createProductSchema = z.object({
    seller_id: z.string().uuid("Invalid seller ID"),
    name: z.string().min(1, "Product name is required").max(200),
    slug: z.string().max(255).optional(), // Will auto-generate if not provided
    description: z.string().min(1, "Description is required"),
    category_id: z.number().int().positive(),
    tax_category_id: z.number().int().positive(),
    brand: z.string().max(100).optional().nullable(),
    type: z.enum(["physical", "digital", "service"]).default("physical"),
    base_price: z.number().nonnegative().default(0.0),
    base_cost: z.number().nonnegative().default(0.0),
    is_active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;