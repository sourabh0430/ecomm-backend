import { AttributeRepository } from "./attribute.repository";
import { AttributeTypeRecord, AttributeValueRecord } from "./attribute.types";

export class AttributeService {
    // Types
    static async getTypes(): Promise<AttributeTypeRecord[]> {
        return AttributeRepository.findAllTypes();
    }

    static async getTypeById(id: number): Promise<AttributeTypeRecord> {
        const type = await AttributeRepository.findTypeById(id);
        if (!type) throw new Error("Attribute Type not found");
        return type;
    }

    static async createType(name: string): Promise<AttributeTypeRecord> {
        const existing = await AttributeRepository.findTypeByName(name);
        if (existing) throw new Error("Attribute Type already exists");
        return AttributeRepository.createType(name);
    }

    static async updateType(id: number, name: string): Promise<AttributeTypeRecord> {
        const type = await AttributeRepository.findTypeById(id);
        if (!type) throw new Error("Attribute Type not found");

        const existing = await AttributeRepository.findTypeByName(name);
        if (existing && existing.id !== id) throw new Error("Attribute Type name already in use");

        const updated = await AttributeRepository.updateType(id, name);
        if (!updated) throw new Error("Failed to update Attribute Type");
        return updated;
    }

    static async deleteType(id: number): Promise<void> {
        const type = await AttributeRepository.findTypeById(id);
        if (!type) throw new Error("Attribute Type not found");
        await AttributeRepository.deleteType(id);
    }

    // Values
    static async getValues(typeId: number): Promise<AttributeValueRecord[]> {
        return AttributeRepository.findValuesByTypeId(typeId);
    }

    static async createValue(typeId: number, value: string): Promise<AttributeValueRecord> {
        const type = await AttributeRepository.findTypeById(typeId);
        if (!type) throw new Error("Attribute Type not found");

        const existing = await AttributeRepository.findValueByComposite(typeId, value);
        if (existing) throw new Error("Attribute Value already exists under this type");

        return AttributeRepository.createValue(typeId, value);
    }

    static async updateValue(valueId: number, value: string): Promise<AttributeValueRecord> {
        const original = await AttributeRepository.findValueById(valueId);
        if (!original) throw new Error("Attribute Value not found");

        const existing = await AttributeRepository.findValueByComposite(original.attribute_type_id, value);
        if (existing && existing.id !== valueId) throw new Error("Attribute Value already exists under this type");

        const updated = await AttributeRepository.updateValue(valueId, value);
        if (!updated) throw new Error("Failed to update Attribute Value");
        return updated;
    }

    static async deleteValue(valueId: number): Promise<void> {
        const value = await AttributeRepository.findValueById(valueId);
        if (!value) throw new Error("Attribute Value not found");
        await AttributeRepository.deleteValue(valueId);
    }
}