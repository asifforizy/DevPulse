import type { Request, Response } from "express";
import { authService } from "./auth.service";


const registerUser = async (req: Request, res: Response) => {

    try {
        const result = await authService.registerUserInDB(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message,
        });
    }
}








export const authcontroller = {
    registerUser,
}