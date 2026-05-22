
import express, { type Application, type Request, type Response } from "express";
import { authRoute } from "./modules/auth/auth.route";




const app : Application = express();
app.use(express.json());
app.use(express.text());

app.use("/api/auth", authRoute);



export default app;