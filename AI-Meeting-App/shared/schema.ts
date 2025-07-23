import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  participants: text("participants"),
  audioFileName: text("audio_file_name").notNull(),
  audioFilePath: text("audio_file_path").notNull(),
  duration: integer("duration"), // in seconds
  status: text("status").notNull().default("processing"), // processing, completed, failed
  transcript: text("transcript"),
  summary: text("summary"),
  keyOutcomes: json("key_outcomes").$type<string[]>(),
  painPoints: json("pain_points").$type<string[]>(),
  objections: json("objections").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type UpdateMeeting = z.infer<typeof updateMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

// Keep existing users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
