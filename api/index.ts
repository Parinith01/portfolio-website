import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import connectDB from "../server/db";

// Routes
import authRoutes from "../server/routes/auth";
import projectRoutes from "../server/routes/projects";
import contactRoutes from "../server/routes/contact";
import resumeRoutes from "../server/routes/resume";
import analyticsRoutes, { trackVisitor } from "../server/routes/analytics";
import cmsRoutes from "../server/routes/cms";
import uploadRoutes from "../server/routes/upload";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static uploads directory
const publicUploads = path.join(process.cwd(), 'public', 'uploads');
app.use('/uploads', express.static(publicUploads));

// Initialize DB safely
connectDB().catch((err) => {
  console.warn("DB init warning:", err?.message || err);
});

// Analytics Middleware
app.use(trackVisitor);

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Vercel Serverless Function Error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;
