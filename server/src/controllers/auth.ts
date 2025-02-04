import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import createError from "../utils/createError";
import { JWT_SECRET } from "../config/dotenv";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { loginId, password } = req.body;

      if (!loginId || !password) {
        return next(createError(400, "Email and password are required"));
      }

      const user = await User.findOne({
        $or: [{ email: loginId }, { username: loginId }],
      });

      if (!user) {
        return next(createError(404, "Invalid user or password"));
      }

      // Compare hashed passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return next(createError(401, "Invalid password"));
      }

      if (user.isLocked) {
        return next(
          createError(
            401,
            "Your account has been locked. Please contact your administrator or try again later.",
          ),
        );
      }

      const { password: _, ...userWithoutPassword } = user.toObject();

      const token = jwt.sign(userWithoutPassword, JWT_SECRET, {
        expiresIn: "24h",
        algorithm: "HS256",
      });

      res.cookie("Access_Token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie("Access_Token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.Access_Token;
      if (!token) {
        return next(createError(401, "Access denied. No token provided"));
      }

      const decoded = jwt.verify(token, JWT_SECRET) as object;

      res.status(200).json({
        success: true,
        data: decoded,
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(createError(401, "Invalid token"));
      }
      return next(createError(500, "Internal server error"));
    }
  }
}

export default new AuthController();
