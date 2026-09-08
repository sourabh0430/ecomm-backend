import { Request, Response, NextFunction } from "express";
import { VariantService } from "./variant.service";

export const getProductVariants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const variants = await VariantService.getVariantsByProductId(req.params.productId as string);
        res.status(200).json({ success: true, data: variants });
    } catch (error) {
        next(error);
    }
};

export const getVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const variant = await VariantService.getVariantById(req.params.id as string);
        res.status(200).json({ success: true, data: variant });
    } catch (error: any) {
        if (error.message === "Variant not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const createVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const variant = await VariantService.createVariant(req.params.productId as string, req.body);
        res.status(201).json({ success: true, data: variant });
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const updateVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const variant = await VariantService.updateVariant(req.params.id as string, req.body);
        res.status(200).json({ success: true, data: variant });
    } catch (error: any) {
        if (error.message === "Variant not found") {
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

export const deleteVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await VariantService.deleteVariant(req.params.id as string);
        res.status(200).json({ success: true, message: "Variant deleted successfully" });
    } catch (error: any) {
        if (error.message === "Variant not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};