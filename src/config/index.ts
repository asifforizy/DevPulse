import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    node_env : process.env.NODE_ENV,
    secret : process.env.SECRET_KEY,
    refresh_secret: process.env.REFRESH_SECRET_KEY,
    corsOrigin: process.env.CORS_ORIGIN
};