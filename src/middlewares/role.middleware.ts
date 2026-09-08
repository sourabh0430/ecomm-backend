import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import db from "../config/database";

export const authorize = (allowedRoles: string[]) => {
    return async (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user || !req.user.role) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden: Access denied. No role assigned."
                });
                return;
            }

            const userRole = await db("user_roles").where("id", req.user.role).first();
            if (!userRole || !allowedRoles.includes(userRole.name)) {
                res.status(403).json({
                    success: false,
                    message: `Forbidden: Access denied. Requires one of these roles: ${allowedRoles.join(", ")}`,
                });
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}