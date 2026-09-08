export interface AttributeTypeRecord {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface AttributeValueRecord {
    id: number;
    attribute_type_id: number;
    value: string;
    created_at: Date;
    updated_at: Date;
}