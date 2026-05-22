
import { config } from "../../config";
import { pool } from "../../db";
import type { IUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerUserInDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *",
    [name, email, hashPassword, role]
  );
  const user = result.rows[0];
  delete user.password_hash;
  return result.rows[0];
}




const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(
    jwtpayload,
    config.secret as string,
    {
      expiresIn: "1d",
    }
  );

  return  {token, user: jwtpayload}; ;
};


export const authService = {
  registerUserInDB,
  loginUser
}