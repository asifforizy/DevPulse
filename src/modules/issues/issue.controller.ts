import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
    try {

        const payload = {
            ...req.body,
            reporter_id: req.user!.id,
        };
        const result = await issueService.createIssue(payload);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully!",
            data: result,
        });

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error.message,
        });
    }
};


const getAllIssues = async (req: Request, res: Response) => {
    try {
        const result = await issueService.getAllIssues(req.query);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully!",
            data: result,
        });

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error.message,
        });
    }
}


const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issueService.getSingleIssue(id as string);


        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully!",
            data: result,
        });

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error.message,
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
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue Not found!",
                error: "Issue Not found!"
            });
        }



        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully!",
            data: result,
        })

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error.message
        })


    }




};


const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issueService.deleteIssue(id as string);


        if (result.rowCount === 0) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue Not found!",
                error: "Issue Not found!",
            });
        }


        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully!",
        });

    } catch (error: any) {

        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error.message,
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