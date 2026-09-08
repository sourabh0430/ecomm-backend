import { Request, Response, NextFunction } from "express";
import { ProductService } from "./product.service";

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await ProductService.getProducts();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await ProductService.getProductById(req.params.id as string);
        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        if (error.message === "Product not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            res.status(409).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await ProductService.updateProduct(req.params.id as string, req.body);
        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        if (error.message === "Product not found") {
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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await ProductService.deleteProduct(req.params.id as string);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error: any) {
        if (error.message === "Product not found") {
            res.status(404).json({ success: false, message: error.message });
            return;
        }
        next(error);
    }
};