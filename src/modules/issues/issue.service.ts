import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssue = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;


    const userCheck = await pool.query(
        `SELECT id FROM users WHERE id = $1`,
        [reporter_id]
    );

    if (userCheck.rows.length === 0) {
        throw new Error("Reporter not found");
    }

    const result = await pool.query(
        `
    INSERT INTO issues
    (title, description, type, status, reporter_id, created_at, updated_at)
    VALUES ($1, $2, $3, 'open', $4, NOW(), NOW())
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
        [title, description, type, reporter_id]
    );

    return result.rows[0];
};




const getAllIssues = async (query: any) => {
    const { sort = "newest", type, status } = query;

    let baseQuery = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: any[] = [];

    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        baseQuery += ` WHERE ` + conditions.join(" AND ");
    }

    if (sort === "oldest") {
        baseQuery += ` ORDER BY created_at ASC`;
    } else {
        baseQuery += ` ORDER BY created_at DESC`;
    }

    const issuesResult = await pool.query(baseQuery, values);
    const issues = issuesResult.rows;

    if (issues.length === 0) return [];

    const reporterIds = [...new Set(issues.map(i => i.reporter_id))];

    const reporterResult = await pool.query(
        `
    SELECT id, name, role FROM users WHERE id = ANY($1)
    `,
        [reporterIds]
    );

    const reporters = reporterResult.rows;

    const reporterMap = new Map();
    reporters.forEach(r => {
        reporterMap.set(r.id, r);
    });

    const formatted = issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterMap.get(issue.reporter_id) || null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));

    return formatted;
};


const getSingleIssue = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM issues WHERE id = $1`,
        [id]
    );


    const issue = result.rows[0];

    if (!issue) {
        throw new Error("Issue not found");
    }

    const reporterResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [issue.reporter_id]
    );
    const reporter = reporterResult.rows[0];

    return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };

};

const updateIssue = async (
    payload: IIssue,
    id: string,
    user: JwtPayload
) => {
    try {
        const issueResult = await pool.query(
            `SELECT * FROM issues WHERE id = $1`,
            [id]
        );

        if (issueResult.rows.length === 0) {
            throw new Error("Issue not found");
        }

        const issue = issueResult.rows[0];

        if (user.role === "contributor") {
            if (issue.reporter_id !== user.id) {
                throw new Error(
                    "You are not allowed to update this issue"
                );
            }

            if (issue.status !== "open") {
                throw new Error(
                    "You can only update open issues"
                );
            }
        }

        const title = payload.title ?? issue.title;
        const description =payload.description ?? issue.description;
        const type = payload.type ?? issue.type;

        const result = await pool.query(
            `
            UPDATE issues
            SET
                title = $1,
                description = $2,
                type = $3,
                updated_at = NOW()
            WHERE id = $4
            RETURNING *
            `,
            [title, description, type, id]
        );

        if (result.rows.length === 0) {
            throw new Error("Update failed");
        }

        return result.rows[0];

    } catch (error: any) {
        throw new Error(error.message);
    }
};


const deleteIssue = async (id: string) => {
    const result = await pool.query(
        `
        DELETE FROM issues
        WHERE id = $1
        `,
        [id]
    );

    return result;
};


export const issueService = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
};

