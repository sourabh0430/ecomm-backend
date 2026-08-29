import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserInput } from "./auth.schema";

export const register = async (
    req: Request<{}, RegisterUserInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {
        const newUser = await AuthService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: newUser
            }
        });
    }
    catch (error: any) {
        if (error.message === "User already exists") {
            res.status(409).json({
                success: false,
                message: "User already exists"
            })
            return;
        }

        //pass unexpected errors to the global express error-handler
        next(error);
    }

}
