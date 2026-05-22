import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssue = async (payload: IIssue) => {
    const { title, description, type, reporter_id } = payload;

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

    // collect reporter ids
    const reporterIds = [...new Set(issues.map(i => i.reporter_id))];

    const reporterResult = await pool.query(
        `
    SELECT id, name, role FROM users WHERE id = ANY($1)
    `,
        [reporterIds]
    );

    const reporters = reporterResult.rows;

    // map reporters
    const reporterMap = new Map();
    reporters.forEach(r => {
        reporterMap.set(r.id, r);
    });

    // attach reporter
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

export const issueService = {
    createIssue,
    getAllIssues
};