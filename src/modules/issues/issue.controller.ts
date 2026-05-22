import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {
    
        const result = await issueService.createIssue(req.body);
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result
        });
    } catch (error : any) {
        res.status(500).json({ 
            success: false,
            message: "Failed to create issue",
            error: error.message
        });
    }
};

export const issueController = {
    createIssue
};