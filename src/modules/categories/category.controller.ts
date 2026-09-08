import { Request, Response, NextFunction } from "express";
import { CategoryService } from "./category.service";

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories = await CategoryService.getCategories();
        res.status(200).json({
            success: true,
            data: categories
        })
    } catch (error) {
        next(error);
    }
}

export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const category = await CategoryService.getCategoryById(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: category
        })
    } catch (error: any) {
        if (error.message === "Category not found") {
            res.status(404).json({
                success: false,
                message: error.message
            })
        }
        next(error)
    }
}

export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const newCategory = await CategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        });
    } catch (error: any) {
        if (error.message.includes("Already exists")) {
            res.status(409).json({
                success: false,
                message: error.message
            })
        }
        next(error);
    }
}

export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const updateCategory = await CategoryService.updateCategory(Number(req.params.id), req.body);
        res.status(200).json({
            success: true,
            message: "Category updated",
            data: updateCategory
        })
    } catch (error: any) {
        if (error.message === "Category not found") {
            res.status(404).json({
                success: false,
                message: error.message
            })
        }
        if (error.message === "Already exists") {
            res.status(409).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await CategoryService.deleteCategory(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Category Deleted"
        })
    } catch (error: any) {
        if (error.message === "Category not found") {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
}