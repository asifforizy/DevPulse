import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
    try {

        const payload = {
            ...req.body,
            reporter_id: req.user!.id,
        };
        const result = await issueService.createIssue(payload);
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create issue",
            error: error.message
        });
    }
};



const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await issueService.getAllIssues(req.query);
        res.status(200).json({
            success: true,
            message: "Issues retrieved successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve issues",
            error: error.message
        });
    }
}


const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issueService.getSingleIssue(id as string);


        res.status(200).json({
            success: true,
            message: "Issue retrieved successfully",
            data: result
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve issue",
            error: error.message
        });

    }

}

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue
};