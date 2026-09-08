import { Request, Response, NextFunction } from "express";
import { AttributeService } from "./attribute.service";

// Types
export const getTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const types = await AttributeService.getTypes();
        res.status(200).json({ success: true, data: types });
    } catch (error) {
        next(error);
    }
};

export const createType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const type = await AttributeService.createType(req.body.name);
        res.status(201).json({ success: true, data: type });
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const updateType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const type = await AttributeService.updateType(Number(req.params.id), req.body.name);
        res.status(200).json({ success: true, data: type });
    } catch (error: any) {
        if (error.message === "Attribute Type not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        if (error.message.includes("already in use")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const deleteType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AttributeService.deleteType(Number(req.params.id));
        res.status(200).json({ success: true, message: "Attribute Type deleted successfully" });
    } catch (error: any) {
        if (error.message === "Attribute Type not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

// Values
export const getValues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const values = await AttributeService.getValues(Number(req.params.typeId));
        res.status(200).json({ success: true, data: values });
    } catch (error) {
        next(error);
    }
};

export const createValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const value = await AttributeService.createValue(Number(req.params.typeId), req.body.value);
        res.status(201).json({ success: true, data: value });
    } catch (error: any) {
        if (error.message.includes("not found")) {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        if (error.message.includes("already exists")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const updateValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const value = await AttributeService.updateValue(Number(req.params.valueId), req.body.value);
        res.status(200).json({ success: true, data: value });
    } catch (error: any) {
        if (error.message === "Attribute Value not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        if (error.message.includes("already exists")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const deleteValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await AttributeService.deleteValue(Number(req.params.valueId));
        res.status(200).json({ success: true, message: "Attribute Value deleted successfully" });
    } catch (error: any) {
        if (error.message === "Attribute Value not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};