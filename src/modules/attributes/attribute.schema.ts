import { z } from "zod";

export const createAttributeTypeSchema = z.object({
    name: z.string().min(1, "Name is required").max(50),
});

export const createAttributeValueSchema = z.object({
    value: z.string().min(1, "Value is required").max(100),
});

export const updateAttributeTypeSchema = createAttributeTypeSchema.partial();
export const updateAttributeValueSchema = createAttributeValueSchema.partial();

export type CreateAttributeTypeInput = z.infer<typeof createAttributeTypeSchema>;
export type CreateAttributeValueInput = z.infer<typeof createAttributeValueSchema>;