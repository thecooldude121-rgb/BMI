// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  meetings;
  currentUserId;
  currentMeetingId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.meetings = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentMeetingId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createMeeting(insertMeeting) {
    const id = this.currentMeetingId++;
    const now = /* @__PURE__ */ new Date();
    const meeting = {
      ...insertMeeting,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.meetings.set(id, meeting);
    return meeting;
  }
  async getMeeting(id) {
    return this.meetings.get(id);
  }
  async getAllMeetings() {
    return Array.from(this.meetings.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async updateMeeting(id, updateMeeting) {
    const existing = this.meetings.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...updateMeeting,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.meetings.set(id, updated);
    return updated;
  }
  async deleteMeeting(id) {
    return this.meetings.delete(id);
  }
};
var storage = new MemStorage();

// server/routes.ts
import multer from "multer";
import path from "path";
import fs2 from "fs";

// server/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
async function transcribeAudio(filePath) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }
    const audioBuffer = fs.readFileSync(filePath);
    const audioBase64 = audioBuffer.toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `Please transcribe the following audio file. Provide only the transcript text without any additional formatting or commentary.`;
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType: "audio/mp3"
        }
      }
    ]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}
async function analyzeMeeting(transcript) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
Analyze this sales meeting transcript and provide:

1. A concise summary (2-3 sentences)
2. Key outcomes achieved
3. Action items mentioned
4. Pain points discussed by the prospect
5. Objections raised by the prospect

Format your response as JSON with the following structure:
{
  "summary": "Brief meeting summary",
  "outcomes": ["outcome1", "outcome2"],
  "actionItems": ["action1", "action2"],
  "painPoints": ["pain1", "pain2"],
  "objections": ["objection1", "objection2"]
}

Transcript:
${transcript}

Respond with valid JSON only, no additional text or formatting.
`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseContent = response.text();
    if (!responseContent) {
      throw new Error("No response from Gemini");
    }
    try {
      const cleanedResponse = responseContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const analysis = JSON.parse(cleanedResponse);
      return {
        summary: analysis.summary || "",
        outcomes: Array.isArray(analysis.outcomes) ? analysis.outcomes : [],
        actionItems: Array.isArray(analysis.actionItems) ? analysis.actionItems : [],
        painPoints: Array.isArray(analysis.painPoints) ? analysis.painPoints : [],
        objections: Array.isArray(analysis.objections) ? analysis.objections : []
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseContent);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Analysis error:", error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// server/services/calendar.ts
import { google } from "googleapis";
var CalendarService = class {
  calendar;
  auth;
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      credentials: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) : void 0,
      scopes: [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events.readonly"
      ]
    });
    this.calendar = google.calendar({ version: "v3", auth: this.auth });
  }
  async getUpcomingMeetings(maxResults = 10) {
    try {
      const now = /* @__PURE__ */ new Date();
      const endOfWeek = /* @__PURE__ */ new Date();
      endOfWeek.setDate(now.getDate() + 7);
      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: endOfWeek.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: "startTime"
      });
      const events = response.data.items || [];
      return events.map((event) => ({
        id: event.id || "",
        title: event.summary || "Untitled Meeting",
        start: event.start?.dateTime || event.start?.date || "",
        end: event.end?.dateTime || event.end?.date || "",
        attendees: event.attendees?.map((attendee) => attendee.email || "") || [],
        meetingUrl: this.extractMeetingUrl(event.description || "", event.location),
        description: event.description
      }));
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      return [];
    }
  }
  async getTodaysMeetings() {
    try {
      const today = /* @__PURE__ */ new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: "startTime"
      });
      const events = response.data.items || [];
      return events.map((event) => ({
        id: event.id || "",
        title: event.summary || "Untitled Meeting",
        start: event.start?.dateTime || event.start?.date || "",
        end: event.end?.dateTime || event.end?.date || "",
        attendees: event.attendees?.map((attendee) => attendee.email || "") || [],
        meetingUrl: this.extractMeetingUrl(event.description || "", event.location),
        description: event.description
      }));
    } catch (error) {
      console.error("Error fetching today's events:", error);
      return [];
    }
  }
  extractMeetingUrl(description, location) {
    const urlPatterns = [
      /https:\/\/meet\.google\.com\/[a-z\-]+/,
      /https:\/\/zoom\.us\/j\/\d+/,
      /https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[^?\s]+/,
      /https:\/\/.*\.zoom\.us\/j\/\d+/
    ];
    const text = `${description} ${location || ""}`;
    for (const pattern of urlPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return void 0;
  }
  async createEvent(eventData) {
    try {
      const event = {
        summary: eventData.title,
        start: {
          dateTime: eventData.start,
          timeZone: "UTC"
        },
        end: {
          dateTime: eventData.end,
          timeZone: "UTC"
        },
        description: eventData.description,
        attendees: eventData.attendees?.map((email) => ({ email }))
      };
      const response = await this.calendar.events.insert({
        calendarId: "primary",
        requestBody: event
      });
      return response.data;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  }
};
var calendarService = new CalendarService();

// server/routes.ts
var uploadDir = path.join(process.cwd(), "uploads");
if (!fs2.existsSync(uploadDir)) {
  fs2.mkdirSync(uploadDir, { recursive: true });
}
var upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024
    // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".mp3", ".wav", ".m4a", ".mp4"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files (MP3, WAV, M4A, MP4) are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/", (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    } else {
      next();
    }
  });
  app2.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getAllMeetings();
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const meeting = await storage.getMeeting(id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/meetings/upload", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }
      const { title, participants } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Meeting title is required" });
      }
      const meetingData = {
        title,
        participants: participants || "",
        audioFileName: req.file.originalname,
        audioFilePath: req.file.path,
        status: "processing",
        transcript: null,
        summary: null,
        keyOutcomes: null,
        painPoints: null,
        objections: null,
        duration: null
      };
      const meeting = await storage.createMeeting(meetingData);
      processAudioAsync(meeting.id, req.file.path);
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/dashboard/stats", async (req, res) => {
    try {
      const meetings = await storage.getAllMeetings();
      const totalMeetings = meetings.length;
      const processed = meetings.filter((m) => m.status === "completed").length;
      const processing = meetings.filter((m) => m.status === "processing").length;
      const insights = meetings.reduce((acc, m) => {
        if (m.keyOutcomes) acc += m.keyOutcomes.length;
        if (m.painPoints) acc += m.painPoints.length;
        if (m.objections) acc += m.objections.length;
        return acc;
      }, 0);
      res.json({
        totalMeetings,
        processed,
        processing,
        insights
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.delete("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const meeting = await storage.getMeeting(id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      if (fs2.existsSync(meeting.audioFilePath)) {
        fs2.unlinkSync(meeting.audioFilePath);
      }
      const deleted = await storage.deleteMeeting(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to delete meeting" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/calendar/upcoming", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const events = await calendarService.getUpcomingMeetings(limit);
      res.json(events);
    } catch (error) {
      console.error("Calendar API error:", error);
      res.status(500).json({
        error: "Failed to fetch calendar events",
        details: error.message,
        isConfigured: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
      });
    }
  });
  app2.get("/api/calendar/today", async (req, res) => {
    try {
      const events = await calendarService.getTodaysMeetings();
      res.json(events);
    } catch (error) {
      console.error("Calendar API error:", error);
      res.status(500).json({
        error: "Failed to fetch today's events",
        details: error.message,
        isConfigured: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function processAudioAsync(meetingId, audioFilePath) {
  try {
    const transcript = await transcribeAudio(audioFilePath);
    await storage.updateMeeting(meetingId, {
      transcript
    });
    const analysis = await analyzeMeeting(transcript);
    await storage.updateMeeting(meetingId, {
      status: "completed",
      summary: analysis.summary,
      keyOutcomes: analysis.outcomes,
      painPoints: analysis.painPoints,
      objections: analysis.objections
    });
  } catch (error) {
    console.error(`Error processing meeting ${meetingId}:`, error);
    await storage.updateMeeting(meetingId, {
      status: "failed"
    });
  }
}

// server/vite.ts
import express from "express";
import fs3 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
