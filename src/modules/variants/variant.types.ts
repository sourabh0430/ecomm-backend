export interface ProductVariantRecord {
    id: string;
    product_id: string;
    sku: string;
    price: number | null;
    discount_price: number | null;
    cost: number | null;
    stock: number;
    version: number;
    created_at: Date;
    updated_at: Date;
}

export interface VariantAttributeAssociation {
    id: string;
    variant_id: string;
    attribute_value_id: number;
    created_at: Date;
}