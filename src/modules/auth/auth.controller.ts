import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";


const registerUser = async (req: Request, res: Response) => {

    try {
        const result = await authService.registerUserInDB(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully!",
            data: result,
        });

    } catch (error: unknown) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: (error as Error).message,
        });
    }
}


const loginUser = async (req: Request, res: Response) => {

    try {
        const result = await authService.loginUser(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "User logged in successfully!",
            data: result,
        });

    } catch (error: unknown) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: (error as Error).message,
        });
    }
}








export const authcontroller = {
    registerUser,
    loginUser
}