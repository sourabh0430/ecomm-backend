import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name cannot be longer than 100 characters"),
    slug: z.string().max(120).optional(),
    parent_id: z.number().int().positive().nullable().optional(),
    description: z.string().optional().nullable()
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;