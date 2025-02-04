// src/config/dotenv.ts
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI = process.env.MONGO || "mongodb://localhost:27017/UMS";
export const SUPER_ADMIN_USERNAME =
  process.env.SUPER_ADMIN_USERNAME || "superadmin";
export const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const BACKEND_URL = `http://localhost:${PORT}`;
