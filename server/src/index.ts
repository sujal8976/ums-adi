import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DB_URI, FRONTEND_URL, PORT } from "./config/dotenv";
import { authRoute, userRoute, roleRoute } from "./routes";

// Initialize express app
const app = express();

// MongoDB connection setup
mongoose.set("strictQuery", true);
const connectToDatabase = async () => {
  if (!DB_URI) {
    console.error("DB_URI is undefined. Please check your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
  "http://localhost:5173", // Frontend origin 1
  "http://localhost:5174", // Frontend origin 2
  FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express server!");
});
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/role", roleRoute);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error for server-side tracking
  console.error("An error occurred:", err);

  const statusCode = err.status || 500;

  const errorResponse = {
    error:
      statusCode === 500
        ? "An internal server error occurred"
        : err.message || "An unexpected error occurred",
    ...(process.env.NODE_ENV === "development" && {
      details: err.stack,
    }),
  };

  res.status(statusCode).json(errorResponse);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed...");
  process.exit(0);
});

// Start server
const startServer = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Start the application
startServer();
