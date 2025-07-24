import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<schema.User | undefined>;
  getUserByEmail(email: string): Promise<schema.User | undefined>;
  createUser(user: schema.InsertUser): Promise<schema.User>;
  updateUser(id: string, user: Partial<schema.InsertUser>): Promise<schema.User>;

  // Account methods
  getAccounts(): Promise<schema.Account[]>;
  getAccount(id: string): Promise<schema.Account | undefined>;
  createAccount(account: schema.InsertAccount): Promise<schema.Account>;
  updateAccount(id: string, account: Partial<schema.InsertAccount>): Promise<schema.Account>;

  // Contact methods
  getContacts(): Promise<schema.Contact[]>;
  getContact(id: string): Promise<schema.Contact | undefined>;
  getContactsByAccount(accountId: string): Promise<schema.Contact[]>;
  createContact(contact: schema.InsertContact): Promise<schema.Contact>;
  updateContact(id: string, contact: Partial<schema.InsertContact>): Promise<schema.Contact>;

  // Lead methods
  getLeads(): Promise<schema.Lead[]>;
  getLead(id: string): Promise<schema.Lead | undefined>;
  getLeadsByAssignee(assigneeId: string): Promise<schema.Lead[]>;
  createLead(lead: schema.InsertLead): Promise<schema.Lead>;
  updateLead(id: string, lead: Partial<schema.InsertLead>): Promise<schema.Lead>;
  deleteLead(id: string): Promise<boolean>;

  // Deal methods
  getDeals(): Promise<schema.Deal[]>;
  getDeal(id: string): Promise<schema.Deal | undefined>;
  getDealsByAssignee(assigneeId: string): Promise<schema.Deal[]>;
  createDeal(deal: schema.InsertDeal): Promise<schema.Deal>;
  updateDeal(id: string, deal: Partial<schema.InsertDeal>): Promise<schema.Deal>;

  // Task methods
  getTasks(): Promise<schema.Task[]>;
  getTask(id: string): Promise<schema.Task | undefined>;
  getTasksByAssignee(assigneeId: string): Promise<schema.Task[]>;
  createTask(task: schema.InsertTask): Promise<schema.Task>;
  updateTask(id: string, task: Partial<schema.InsertTask>): Promise<schema.Task>;

  // Activity methods
  getActivities(): Promise<schema.Activity[]>;
  getActivity(id: string): Promise<schema.Activity | undefined>;
  getActivitiesByAssignee(assigneeId: string): Promise<schema.Activity[]>;
  createActivity(activity: schema.InsertActivity): Promise<schema.Activity>;
  updateActivity(id: string, activity: Partial<schema.InsertActivity>): Promise<schema.Activity>;

  // Meeting methods
  getMeetings(): Promise<schema.Meeting[]>;
  getMeeting(id: string): Promise<schema.Meeting | undefined>;
  createMeeting(meeting: schema.InsertMeeting): Promise<schema.Meeting>;
  updateMeeting(id: string, meeting: Partial<schema.InsertMeeting>): Promise<schema.Meeting>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return users[0];
  }

  async createUser(user: schema.InsertUser): Promise<schema.User> {
    const users = await db.insert(schema.users).values(user).returning();
    return users[0];
  }

  async updateUser(id: string, user: Partial<schema.InsertUser>): Promise<schema.User> {
    const users = await db.update(schema.users).set(user).where(eq(schema.users.id, id)).returning();
    return users[0];
  }

  // Account methods
  async getAccounts(): Promise<schema.Account[]> {
    return await db.select().from(schema.accounts);
  }

  async getAccount(id: string): Promise<schema.Account | undefined> {
    const accounts = await db.select().from(schema.accounts).where(eq(schema.accounts.id, id));
    return accounts[0];
  }

  async createAccount(account: schema.InsertAccount): Promise<schema.Account> {
    const accounts = await db.insert(schema.accounts).values(account).returning();
    return accounts[0];
  }

  async updateAccount(id: string, account: Partial<schema.InsertAccount>): Promise<schema.Account> {
    const accounts = await db.update(schema.accounts).set(account).where(eq(schema.accounts.id, id)).returning();
    return accounts[0];
  }

  async deleteAccount(id: string): Promise<boolean> {
    const result = await db.delete(schema.accounts).where(eq(schema.accounts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Contact methods
  async getContacts(): Promise<schema.Contact[]> {
    return await db.select().from(schema.contacts);
  }

  async getContact(id: string): Promise<schema.Contact | undefined> {
    const contacts = await db.select().from(schema.contacts).where(eq(schema.contacts.id, id));
    return contacts[0];
  }

  async getContactsByAccount(accountId: string): Promise<schema.Contact[]> {
    return await db.select().from(schema.contacts).where(eq(schema.contacts.accountId, accountId));
  }

  async createContact(contact: schema.InsertContact): Promise<schema.Contact> {
    const contacts = await db.insert(schema.contacts).values(contact).returning();
    return contacts[0];
  }

  async updateContact(id: string, contact: Partial<schema.InsertContact>): Promise<schema.Contact> {
    const contacts = await db.update(schema.contacts).set(contact).where(eq(schema.contacts.id, id)).returning();
    return contacts[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(schema.contacts).where(eq(schema.contacts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Lead methods
  async getLeads(): Promise<schema.Lead[]> {
    return await db.select().from(schema.leads);
  }

  async getLead(id: string): Promise<schema.Lead | undefined> {
    const leads = await db.select().from(schema.leads).where(eq(schema.leads.id, id));
    return leads[0];
  }

  async getLeadsByAssignee(assigneeId: string): Promise<schema.Lead[]> {
    return await db.select().from(schema.leads).where(eq(schema.leads.assignedTo, assigneeId));
  }

  async createLead(lead: schema.InsertLead): Promise<schema.Lead> {
    const leads = await db.insert(schema.leads).values(lead).returning();
    return leads[0];
  }

  async updateLead(id: string, lead: Partial<schema.InsertLead>): Promise<schema.Lead> {
    const leads = await db.update(schema.leads).set(lead).where(eq(schema.leads.id, id)).returning();
    return leads[0];
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(schema.leads).where(eq(schema.leads.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Deal methods
  async getDeals(): Promise<schema.Deal[]> {
    return await db.select().from(schema.deals);
  }

  async getDeal(id: string): Promise<schema.Deal | undefined> {
    const deals = await db.select().from(schema.deals).where(eq(schema.deals.id, id));
    return deals[0];
  }

  async getDealsByAssignee(assigneeId: string): Promise<schema.Deal[]> {
    return await db.select().from(schema.deals).where(eq(schema.deals.assignedTo, assigneeId));
  }

  async createDeal(deal: schema.InsertDeal): Promise<schema.Deal> {
    const deals = await db.insert(schema.deals).values(deal).returning();
    return deals[0];
  }

  async updateDeal(id: string, deal: Partial<schema.InsertDeal>): Promise<schema.Deal> {
    const deals = await db.update(schema.deals).set(deal).where(eq(schema.deals.id, id)).returning();
    return deals[0];
  }

  async deleteDeal(id: string): Promise<boolean> {
    const result = await db.delete(schema.deals).where(eq(schema.deals.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Task methods
  async getTasks(): Promise<schema.Task[]> {
    return await db.select().from(schema.tasks);
  }

  async getTask(id: string): Promise<schema.Task | undefined> {
    const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.id, id));
    return tasks[0];
  }

  async getTasksByAssignee(assigneeId: string): Promise<schema.Task[]> {
    return await db.select().from(schema.tasks).where(eq(schema.tasks.assignedTo, assigneeId));
  }

  async createTask(task: schema.InsertTask): Promise<schema.Task> {
    const tasks = await db.insert(schema.tasks).values(task).returning();
    return tasks[0];
  }

  async updateTask(id: string, task: Partial<schema.InsertTask>): Promise<schema.Task> {
    const tasks = await db.update(schema.tasks).set(task).where(eq(schema.tasks.id, id)).returning();
    return tasks[0];
  }

  // Activity methods
  async getActivities(): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities);
  }

  async getActivity(id: string): Promise<schema.Activity | undefined> {
    const activities = await db.select().from(schema.activities).where(eq(schema.activities.id, id));
    return activities[0];
  }

  async getActivitiesByAssignee(assigneeId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities).where(eq(schema.activities.assignedTo, assigneeId));
  }

  async createActivity(activity: schema.InsertActivity): Promise<schema.Activity> {
    const activities = await db.insert(schema.activities).values(activity).returning();
    return activities[0];
  }

  async updateActivity(id: string, activity: Partial<schema.InsertActivity>): Promise<schema.Activity> {
    const activities = await db.update(schema.activities).set(activity).where(eq(schema.activities.id, id)).returning();
    return activities[0];
  }

  // Meeting methods
  async getMeetings(): Promise<schema.Meeting[]> {
    return await db.select().from(schema.meetings);
  }

  async getMeeting(id: string): Promise<schema.Meeting | undefined> {
    const meetings = await db.select().from(schema.meetings).where(eq(schema.meetings.id, id));
    return meetings[0];
  }

  async createMeeting(meeting: schema.InsertMeeting): Promise<schema.Meeting> {
    const meetings = await db.insert(schema.meetings).values(meeting).returning();
    return meetings[0];
  }

  async updateMeeting(id: string, meeting: Partial<schema.InsertMeeting>): Promise<schema.Meeting> {
    const meetings = await db.update(schema.meetings).set(meeting).where(eq(schema.meetings.id, id)).returning();
    return meetings[0];
  }

  // Gamification methods
  async getSalesPoints(userId?: string): Promise<schema.SalesPoints[]> {
    if (userId) {
      return await db.select().from(schema.salesPoints).where(eq(schema.salesPoints.userId, userId));
    }
    return await db.select().from(schema.salesPoints);
  }

  async createSalesPoints(points: schema.InsertSalesPoints): Promise<schema.SalesPoints> {
    const result = await db.insert(schema.salesPoints).values(points).returning();
    return result[0];
  }

  async getBadges(): Promise<schema.Badge[]> {
    return await db.select().from(schema.badges).where(eq(schema.badges.isActive, true));
  }

  async createBadge(badge: schema.InsertBadge): Promise<schema.Badge> {
    const result = await db.insert(schema.badges).values(badge).returning();
    return result[0];
  }

  async getUserBadges(userId: string): Promise<(schema.UserBadge & { badge: schema.Badge })[]> {
    const result = await db.select({
      id: schema.userBadges.id,
      userId: schema.userBadges.userId,
      badgeId: schema.userBadges.badgeId,
      earnedAt: schema.userBadges.earnedAt,
      progress: schema.userBadges.progress,
      badge: {
        id: schema.badges.id,
        name: schema.badges.name,
        description: schema.badges.description,
        icon: schema.badges.icon,
        color: schema.badges.color,
        points: schema.badges.points
      }
    })
    .from(schema.userBadges)
    .leftJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
    .where(eq(schema.userBadges.userId, userId));
    
    return result as any;
  }

  async awardBadge(userBadge: schema.InsertUserBadge): Promise<schema.UserBadge> {
    const result = await db.insert(schema.userBadges).values(userBadge).returning();
    return result[0];
  }

  async getSalesTargets(userId?: string): Promise<schema.SalesTarget[]> {
    if (userId) {
      return await db.select().from(schema.salesTargets).where(eq(schema.salesTargets.userId, userId));
    }
    return await db.select().from(schema.salesTargets);
  }

  async createSalesTarget(target: schema.InsertSalesTarget): Promise<schema.SalesTarget> {
    const result = await db.insert(schema.salesTargets).values(target).returning();
    return result[0];
  }

  async updateSalesTarget(id: string, updates: Partial<schema.InsertSalesTarget>): Promise<schema.SalesTarget> {
    const result = await db.update(schema.salesTargets).set(updates).where(eq(schema.salesTargets.id, id)).returning();
    return result[0];
  }

  async getAchievements(userId?: string): Promise<schema.Achievement[]> {
    if (userId) {
      return await db.select().from(schema.achievements).where(eq(schema.achievements.userId, userId));
    }
    return await db.select().from(schema.achievements);
  }

  async createAchievement(achievement: schema.InsertAchievement): Promise<schema.Achievement> {
    const result = await db.insert(schema.achievements).values(achievement).returning();
    return result[0];
  }

  // Leaderboard queries
  async getUserLeaderboard(): Promise<any[]> {
    const result = await db.select({
      userId: schema.salesPoints.userId,
      totalPoints: sql<number>`sum(${schema.salesPoints.points})`.as('total_points'),
      userName: sql<string>`${schema.users.firstName} || ' ' || ${schema.users.lastName}`.as('user_name')
    })
    .from(schema.salesPoints)
    .leftJoin(schema.users, eq(schema.salesPoints.userId, schema.users.id))
    .groupBy(schema.salesPoints.userId, schema.users.firstName, schema.users.lastName)
    .orderBy(sql`sum(${schema.salesPoints.points}) desc`)
    .limit(10);
    
    return result;
  }

  async getMonthlyLeaderboard(year: number, month: number): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const result = await db.select({
      userId: schema.salesPoints.userId,
      totalPoints: sql<number>`sum(${schema.salesPoints.points})`.as('total_points'),
      userName: sql<string>`${schema.users.firstName} || ' ' || ${schema.users.lastName}`.as('user_name')
    })
    .from(schema.salesPoints)
    .leftJoin(schema.users, eq(schema.salesPoints.userId, schema.users.id))
    .where(
      and(
        gte(schema.salesPoints.earnedAt, startDate),
        lte(schema.salesPoints.earnedAt, endDate)
      )
    )
    .groupBy(schema.salesPoints.userId, schema.users.firstName, schema.users.lastName)
    .orderBy(sql`sum(${schema.salesPoints.points}) desc`)
    .limit(10);
    
    return result;
  }
}

export const storage = new DatabaseStorage();
