import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "../utils/createError";
import { JWT_SECRET } from "../config/dotenv";
import { UserAccount } from "../models/user";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies instead of headers
    const token = req.cookies.Access_Token;

    if (!token) {
      return next(createError(401, "Access denied. No token provided"));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserAccount;

    if (decoded.isLocked) {
      next(
        createError(
          401,
          "Your account has been locked. Please contact your administrator or try again later.",
        ),
      );
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, "Invalid token"));
  }
};

export default verifyToken;
