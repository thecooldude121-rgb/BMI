import { users, meetings, type User, type InsertUser, type Meeting, type InsertMeeting, type UpdateMeeting } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Meeting methods
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  getMeeting(id: number): Promise<Meeting | undefined>;
  getAllMeetings(): Promise<Meeting[]>;
  updateMeeting(id: number, meeting: UpdateMeeting): Promise<Meeting | undefined>;
  deleteMeeting(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private meetings: Map<number, Meeting>;
  private currentUserId: number;
  private currentMeetingId: number;

  constructor() {
    this.users = new Map();
    this.meetings = new Map();
    this.currentUserId = 1;
    this.currentMeetingId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMeeting(insertMeeting: InsertMeeting): Promise<Meeting> {
    const id = this.currentMeetingId++;
    const now = new Date();
    const meeting: Meeting = { 
      ...insertMeeting, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.meetings.set(id, meeting);
    return meeting;
  }

  async getMeeting(id: number): Promise<Meeting | undefined> {
    return this.meetings.get(id);
  }

  async getAllMeetings(): Promise<Meeting[]> {
    return Array.from(this.meetings.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateMeeting(id: number, updateMeeting: UpdateMeeting): Promise<Meeting | undefined> {
    const existing = this.meetings.get(id);
    if (!existing) return undefined;
    
    const updated: Meeting = {
      ...existing,
      ...updateMeeting,
      updatedAt: new Date()
    };
    this.meetings.set(id, updated);
    return updated;
  }

  async deleteMeeting(id: number): Promise<boolean> {
    return this.meetings.delete(id);
  }
}

export const storage = new MemStorage();
