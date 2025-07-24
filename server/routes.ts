import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMeetingSchema, updateMeetingSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { transcribeAudio, analyzeMeeting } from "./services/gemini";
import { calendarService } from "./services/calendar";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp3', '.wav', '.m4a', '.mp4'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (MP3, WAV, M4A, MP4) are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all meetings
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getAllMeetings();
      res.json(meetings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single meeting
  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const meeting = await storage.getMeeting(id);
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload meeting audio
  app.post("/api/meetings/upload", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const { title, participants } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Meeting title is required" });
      }

      // Create meeting record
      const meetingData = {
        title,
        participants: participants || "",
        audioFileName: req.file.originalname,
        audioFilePath: req.file.path,
        status: "processing" as const,
        transcript: null,
        summary: null,
        keyOutcomes: null,
        painPoints: null,
        objections: null,
        duration: null
      };

      const meeting = await storage.createMeeting(meetingData);

      // Start async processing
      processAudioAsync(meeting.id, req.file.path);

      res.json(meeting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const meetings = await storage.getAllMeetings();
      const totalMeetings = meetings.length;
      const processed = meetings.filter(m => m.status === "completed").length;
      const processing = meetings.filter(m => m.status === "processing").length;
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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete meeting
  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const meeting = await storage.getMeeting(id);
      
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }

      // Delete audio file
      if (fs.existsSync(meeting.audioFilePath)) {
        fs.unlinkSync(meeting.audioFilePath);
      }

      const deleted = await storage.deleteMeeting(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to delete meeting" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get upcoming calendar events
  app.get("/api/calendar/upcoming", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const events = await calendarService.getUpcomingMeetings(limit);
      res.json(events);
    } catch (error: any) {
      console.error('Calendar API error:', error);
      res.status(500).json({ 
        error: "Failed to fetch calendar events",
        details: error.message,
        isConfigured: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
      });
    }
  });

  // Get today's calendar events
  app.get("/api/calendar/today", async (req, res) => {
    try {
      const events = await calendarService.getTodaysMeetings();
      res.json(events);
    } catch (error: any) {
      console.error('Calendar API error:', error);
      res.status(500).json({ 
        error: "Failed to fetch today's events",
        details: error.message,
        isConfigured: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS || !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Async function to process audio
async function processAudioAsync(meetingId: number, audioFilePath: string) {
  try {
    // Step 1: Transcribe audio
    const transcript = await transcribeAudio(audioFilePath);
    
    await storage.updateMeeting(meetingId, {
      transcript
    });

    // Step 2: Analyze transcript
    const analysis = await analyzeMeeting(transcript);
    
    // Step 3: Update meeting with complete analysis
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
