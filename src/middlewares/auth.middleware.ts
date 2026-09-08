import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

export const authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        let token = "";

        // Check Authorization header 
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
        }
        //fallback to cookie verification
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Authentication token missing or invalid",
            });
            return;
        }

        //verify token signatures
        const decoded = jwt.verify(token, env.jwt.jwt_secret_key) as {
            userId: string;
            email: string;
            role: string;
        };

        //attach decoded payload to request object
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Authentication token expired or invalid",
        })
    }
}