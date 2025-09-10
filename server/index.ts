import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { accounts, contacts, deals, leads, activities } from "../shared/schema";
import { comprehensiveAccountsSeeder } from "./comprehensive-accounts-seeder";
import { comprehensiveDealsSeeder } from './comprehensive-deals-seeder';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Fix CSP and security headers to allow JavaScript events
app.use((req, res, next) => {
  // Remove restrictive CSP headers that block JavaScript events
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('X-Content-Security-Policy');
  res.removeHeader('X-WebKit-CSP');
  
  // Set permissive CSP for development
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *; " +
    "style-src 'self' 'unsafe-inline' *; " +
    "img-src 'self' data: *; " +
    "connect-src 'self' *; " +
    "font-src 'self' *; " +
    "object-src 'none'; " +
    "media-src 'self' *; " +
    "frame-src 'self' *;"
  );
  
  // Additional security headers to prevent event blocking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Seed database if empty
  try {
    await comprehensiveAccountsSeeder.run();
    
    console.log('💼 Running comprehensive deals seeder...');
    await comprehensiveDealsSeeder.run();
  } catch (error: any) {
    console.log("Comprehensive accounts seeding error:", error.message);
  }

  // Seed gamification data
  try {
    const { seedGamificationData } = await import("./gamification-seeder");
    await seedGamificationData();
  } catch (error: any) {
    console.log("Gamification seeding error:", error.message);
  }

  // Seed widget templates
  try {
    const { seedWidgetTemplates } = await import("./widget-template-seeder");
    await seedWidgetTemplates();
  } catch (error: any) {
    console.log("Widget template seeding error:", error.message);
  }

  // Skip meeting seeding temporarily
  // try {
  //   const { seedMeetingData } = await import("./meeting-seeder");
  //   await seedMeetingData();
  // } catch (error: any) {
  //   console.log("Meeting seeding error:", error.message);
  // }

  // Contacts endpoint
  app.get("/api/contacts", async (req, res) => {
    try {
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        // Return mock data when API key is not configured
        return res.json({
          totalLeads: 1250,
          qualifiedLeads: 890,
          conversionRate: 71.2,
          averageScore: 8.4,
          trends: {
            leadsGrowth: 15.3,
            qualityImprovement: 8.7,
            conversionTrend: 12.1
          },
          topSources: [
            { source: "LinkedIn", leads: 450, conversion: 78 },
            { source: "Website", leads: 320, conversion: 65 },
            { source: "Referrals", leads: 280, conversion: 85 },
            { source: "Email", leads: 200, conversion: 58 }
          ],
          industryBreakdown: [
            { industry: "Technology", count: 380, avgScore: 8.9 },
            { industry: "Healthcare", count: 290, avgScore: 8.2 },
            { industry: "Finance", count: 250, avgScore: 8.7 },
            { industry: "Manufacturing", count: 180, avgScore: 7.8 },
            { industry: "Retail", count: 150, avgScore: 7.5 }
          ]
        });
      }

      const contactsData = await db.select().from(contacts);
      res.json(contactsData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();