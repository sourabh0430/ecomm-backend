import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { RegisterUserInput, LoginUserInput } from "./auth.schema";

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

export const login = async (
    req: Request<{}, any, LoginUserInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user, token } = await AuthService.loginUser(req.body);

        //Set HTTP-only secure cookie for authentication
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            success: true,
            message: "Login successfull",
            data: {
                user,
                token
            }
        })

    } catch (error: any) {
        if (error.message === "Invalid Credentials") {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
            return;
        }
        next(error);
    }
}