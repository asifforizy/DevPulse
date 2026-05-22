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


const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await issueService.updateIssue(
            req.body,
            id as string,
            req.user!
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Issue Not found!",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue updated successfully!",
            data: result,
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error.message,
        });
    }
};


const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issueService.deleteIssue(id as string);


        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue Not found!",
            });
        }


        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }

}


export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
};