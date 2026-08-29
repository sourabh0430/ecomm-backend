import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction):
        Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation Failed",
                    errors: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                })
                return;
            }
            next(error);
        }
    }
}