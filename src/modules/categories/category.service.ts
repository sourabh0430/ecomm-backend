import { CategoryRepository } from "./category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import { CategoryRecord } from "./category.types";

export class CategoryService {
    private static generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }

    static async getCategories(): Promise<CategoryRecord[]> {
        return CategoryRepository.findAll();
    }

    static async getCategoryById(id: number): Promise<CategoryRecord> {
        const category = await CategoryRepository.findById(id);
        if (!category) throw new Error("Category not found");
        return category;
    }

    static async createCategory(input: CreateCategoryInput): Promise<CategoryRecord> {
        const slug = input.slug || this.generateSlug(input.name);

        const existing = await CategoryRepository.findBySlug(slug);
        if (existing) throw new Error("Category with this slug already exists");

        return CategoryRepository.create({
            name: input.name,
            slug,
            parent_id: input.parent_id || null,
            description: input.description || null,
        });
    }

    static async updateCategory(id: number, input: UpdateCategoryInput): Promise<CategoryRecord> {
        const category = await CategoryRepository.findById(id);
        if (!category) throw new Error("Category not found");

        const updateData: Partial<Omit<CategoryRecord, "id">> = { ...input };

        if (input.name && !input.slug) {
            updateData.slug = this.generateSlug(input.name);
        }

        if (updateData.slug) {
            const existing = await CategoryRepository.findBySlug(updateData.slug);
            if (existing && existing.id !== id) {
                throw new Error("Category with this slug already exists");
            }
        }

        const updated = await CategoryRepository.update(id, updateData);
        if (!updated) throw new Error("Failed to update category");
        return updated;
    }

    static async deleteCategory(id: number): Promise<void> {
        const category = await CategoryRepository.findById(id);
        if (!category) throw new Error("Category not found");

        const success = await CategoryRepository.delete(id);
        if (!success) throw new Error("Failed to delete category");
    }
}