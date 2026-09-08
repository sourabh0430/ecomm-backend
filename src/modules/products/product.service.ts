import { ProductRepository } from "./product.repository";
import { CreateProductInput, UpdateProductInput } from "./product.schema";
import { ProductRecord } from "./product.types";

export class ProductService {
    private static generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }

    static async getProducts(): Promise<ProductRecord[]> {
        return ProductRepository.findAll();
    }

    static async getProductById(id: string): Promise<ProductRecord> {
        const product = await ProductRepository.findById(id);
        if (!product) throw new Error("Product not found");
        return product;
    }

    static async createProduct(input: CreateProductInput): Promise<ProductRecord> {
        const slug = input.slug || this.generateSlug(input.name);

        const existing = await ProductRepository.findBySlug(slug);
        if (existing) throw new Error("Product with this slug already exists");

        return ProductRepository.create({
            seller_id: input.seller_id,
            name: input.name,
            slug,
            description: input.description,
            category_id: input.category_id,
            tax_category_id: input.tax_category_id,
            brand: input.brand || null,
            type: input.type,
            base_price: input.base_price,
            base_cost: input.base_cost,
            is_active: input.is_active
        });
    }

    static async updateProduct(id: string, input: UpdateProductInput): Promise<ProductRecord> {
        const product = await ProductRepository.findById(id);
        if (!product) throw new Error("Product not found");

        const updateData: Partial<Omit<ProductRecord, "id" | "created_at" | "updated_at">> = { ...input };

        if (input.name && !input.slug) {
            updateData.slug = this.generateSlug(input.name);
        }

        if (updateData.slug) {
            const existing = await ProductRepository.findBySlug(updateData.slug);
            if (existing && existing.id !== id) {
                throw new Error("Product with this slug already exists");
            }
        }

        const updated = await ProductRepository.update(id, updateData);
        if (!updated) throw new Error("Failed to update product");
        return updated;
    }

    static async deleteProduct(id: string): Promise<void> {
        const product = await ProductRepository.findById(id);
        if (!product) throw new Error("Product not found");
        await ProductRepository.delete(id);
    }
}