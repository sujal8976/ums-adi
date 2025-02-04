import express from "express";
import AuthController from "../controllers/auth";

const router = express.Router();

// Login user
router.post("/login", AuthController.login);

// Logout user
router.post("/logout", AuthController.logout);

// Get current user
router.post("/current-user", AuthController.getCurrentUser);

export default router;
