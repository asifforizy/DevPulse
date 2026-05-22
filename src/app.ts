
import express, { type Application, type Request, type Response } from "express";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issues/issue.route";




const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);




export default app;