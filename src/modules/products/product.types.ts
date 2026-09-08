export interface ProductRecord {
    id: string;
    seller_id: string;
    name: string;
    slug: string;
    description: string;
    category_id: number;
    tax_category_id: number;
    brand: string | null;
    type: "physical" | "digital" | "service";
    base_price: number;
    base_cost: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}