import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssue = async (payload: IIssue) => {
  const { title, description, type, reporter_id  } = payload;

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

export const issueService = {
  createIssue,
};