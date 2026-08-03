import dotenv from "dotenv";
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { serveStatic } from "./static";
import cors from "cors";
import connectDB from "./db";

// Routes
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import contactRoutes from "./routes/contact";
import resumeRoutes from "./routes/resume";
import analyticsRoutes, { trackVisitor } from "./routes/analytics";
import cmsRoutes from "./routes/cms";
import uploadRoutes from "./routes/upload";

function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message} `);
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static uploads directory
const publicUploads = path.join(process.cwd(), 'public', 'uploads');
app.use('/uploads', express.static(publicUploads));

// Connect to MongoDB asynchronously without blocking startup
connectDB();

app.use((req, res, next) => {
  const start = Date.now();
  const pathStr = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathStr.startsWith("/api")) {
      let logLine = `${req.method} ${pathStr} ${res.statusCode} in ${duration} ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)} `;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
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
app.get("/", (req, res, next) => {
  if (req.accepts('html')) {
    return next();
  }
  res.send("Backend is running");
});

(async () => {
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(server, app);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT) || 5001;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT} `);
  });
})();
