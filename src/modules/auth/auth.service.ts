
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
// import bcrypt from 'bcryptjs';


const registerUserInDB = async (payload: IUser) => {
    const { name, email, password_hash, role } = payload;

    // const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, password_hash, role]
    );
    return result.rows[0];
}



export const authService = {
    registerUserInDB,
}