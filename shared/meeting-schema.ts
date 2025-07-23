import { pgTable, serial, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Meeting schema for AI transcription and analysis
export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  participants: text("participants"),
  status: text("status", { enum: ["processing", "completed", "failed"] }).notNull().default("processing"),
  duration: integer("duration"), // in seconds
  transcript: text("transcript"),
  summary: text("summary"),
  insights: jsonb("insights").$type<{
    outcomes: string[];
    actionItems: string[];
    painPoints: string[];
    objections: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertMeetingSchema = createInsertSchema(meetings, {
  title: z.string().min(1, "Title is required"),
  filename: z.string().min(1, "Filename is required"),
  filePath: z.string().min(1, "File path is required"),
  participants: z.string().optional(),
  status: z.enum(["processing", "completed", "failed"]).default("processing"),
  duration: z.number().positive().optional(),
  transcript: z.string().optional(),
  summary: z.string().optional(),
  insights: z.object({
    outcomes: z.array(z.string()),
    actionItems: z.array(z.string()),
    painPoints: z.array(z.string()),
    objections: z.array(z.string()),
  }).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMeetingSchema = insertMeetingSchema.partial();

export const selectMeetingSchema = createSelectSchema(meetings);

// Types
export type Meeting = typeof meetings.$inferSelect;
export type NewMeeting = z.infer<typeof insertMeetingSchema>;
export type UpdateMeeting = z.infer<typeof updateMeetingSchema>;