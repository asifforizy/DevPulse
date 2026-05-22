import { Router, type NextFunction, type Request, type Response } from "express";
import { authcontroller } from "./auth.controller";







const router =Router();

router.post("/signup", authcontroller.registerUser);



export const authRoute = router;