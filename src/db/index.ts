

import { Pool } from "pg";
import dotenv from "dotenv";
import path from 'path';
import { config } from "../config";




export const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});



export const initDB = async () => {

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(30) DEFAULT 'contributor' CHECK(role IN ('contributor', 'maintainer')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
           CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description TEXT NOT NULL,
                type VARCHAR(30) NOT NULL CHECK(type IN ('bug', 'feature_request')),
                status VARCHAR(30) DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
                reporter_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("database connected successfully!!!");
    }
    catch (error) {
        console.log(error);
    }
}
