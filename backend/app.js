// app.js
import "dotenv/config"; // Load environment variables first
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import calendarRoutes from "./routes/calendarRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import defaultRoutes from "./routes/routeDefaults.js";

const app = express();

// Configure CORS properly (Allow multiple origins)
const corsOptions = {
  origin: process.env.FRONTEND_URL?.split(",") || "*", // Allow multiple origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version, // Correctly access package version
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/defaults", defaultRoutes);

// Handle 404 errors (Route not found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development
  };

  // Log the error in development for debugging purposes
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl, // Include request path
      method: req.method, // Include request method
      ...(err.errors && { validationErrors: err.errors }), // Include validation errors if available
    });
  }

  res.status(statusCode).json(response);
});

export default app;
