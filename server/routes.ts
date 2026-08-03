import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Application routes are now registered in server/index.ts via separate route modules

  const httpServer = createServer(app);
  return httpServer;
}
