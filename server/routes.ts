import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { z } from "zod";
import { aiInsightsService } from "./aiService";

// Helper function for error handling
const handleError = (error: unknown, res: any) => {
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  res.status(500).json({ error: message });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      // TODO: Implement proper users endpoint - currently returns accounts
      const users = await storage.getAccounts();
      res.json(users);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Account (Company) routes
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAccounts();
      res.json(accounts);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) return res.status(404).json({ error: "Account not found" });
      res.json(account);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const result = schema.insertAccountSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid account data", details: result.error });
      }
      const account = await storage.createAccount(result.data);
      res.status(201).json(account);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.updateAccount(req.params.id, req.body);
      res.json(account);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const success = await storage.deleteAccount(req.params.id);
      if (!success) return res.status(404).json({ error: "Account not found" });
      res.json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/accounts", async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const results = await Promise.all(ids.map(id => storage.deleteAccount(id)));
      const deletedCount = results.filter(Boolean).length;
      res.json({ success: true, deletedCount });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Contact routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
      res.json(contact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/by-account/:accountId", async (req, res) => {
    try {
      const contacts = await storage.getContactsByAccount(req.params.accountId);
      res.json(contacts);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const result = schema.insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid contact data", details: result.error });
      }
      const contact = await storage.createContact(result.data);
      res.status(201).json(contact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      res.json(contact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) return res.status(404).json({ error: "Contact not found" });
      res.json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/contacts", async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const results = await Promise.all(ids.map(id => storage.deleteContact(id)));
      const deletedCount = results.filter(Boolean).length;
      res.json({ success: true, deletedCount });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Lead routes
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      res.json(lead);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/leads/by-assignee/:assigneeId", async (req, res) => {
    try {
      const leads = await storage.getLeadsByAssignee(req.params.assigneeId);
      res.json(leads);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const result = schema.insertLeadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid lead data", details: result.error });
      }
      const lead = await storage.createLead(result.data);
      res.status(201).json(lead);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.updateLead(req.params.id, req.body);
      res.json(lead);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const success = await storage.deleteLead(req.params.id);
      if (!success) return res.status(404).json({ error: "Lead not found" });
      res.json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/leads", async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const results = await Promise.all(ids.map(id => storage.deleteLead(id)));
      const deletedCount = results.filter(Boolean).length;
      res.json({ success: true, deletedCount });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Deal routes
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.getDeal(req.params.id);
      if (!deal) return res.status(404).json({ error: "Deal not found" });
      res.json(deal);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/deals/by-assignee/:assigneeId", async (req, res) => {
    try {
      const deals = await storage.getDealsByAssignee(req.params.assigneeId);
      res.json(deals);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const result = schema.insertDealSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid deal data", details: result.error });
      }
      const deal = await storage.createDeal(result.data);
      res.status(201).json(deal);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/deals/:id", async (req, res) => {
    try {
      const deal = await storage.updateDeal(req.params.id, req.body);
      res.json(deal);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const success = await storage.deleteDeal(req.params.id);
      if (!success) return res.status(404).json({ error: "Deal not found" });
      res.json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/deals", async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "ids must be an array" });
      }
      const results = await Promise.all(ids.map(id => storage.deleteDeal(id)));
      const deletedCount = results.filter(Boolean).length;
      res.json({ success: true, deletedCount });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) return res.status(404).json({ error: "Task not found" });
      res.json(task);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/tasks/by-assignee/:assigneeId", async (req, res) => {
    try {
      const tasks = await storage.getTasksByAssignee(req.params.assigneeId);
      res.json(tasks);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const result = schema.insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid task data", details: result.error });
      }
      const task = await storage.createTask(result.data);
      res.status(201).json(task);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) return res.status(404).json({ error: "Activity not found" });
      res.json(activity);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/activities/by-assignee/:assigneeId", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByAssignee(req.params.assigneeId);
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const result = schema.insertActivitySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid activity data", details: result.error });
      }
      const activity = await storage.createActivity(result.data);
      res.status(201).json(activity);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.updateActivity(req.params.id, req.body);
      res.json(activity);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Meeting routes
  app.get("/api/meetings", async (req, res) => {
    try {
      const meetings = await storage.getMeetings();
      res.json(meetings);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.getMeeting(req.params.id);
      if (!meeting) return res.status(404).json({ error: "Meeting not found" });
      res.json(meeting);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/meetings", async (req, res) => {
    try {
      const result = schema.insertMeetingSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid meeting data", details: result.error });
      }
      const meeting = await storage.createMeeting(result.data);
      res.status(201).json(meeting);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/meetings/:id", async (req, res) => {
    try {
      const meeting = await storage.updateMeeting(req.params.id, req.body);
      res.json(meeting);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI Insights route
  app.post("/api/ai/analyze-sales", async (req, res) => {
    try {
      const { deals, leads, accounts } = req.body;
      
      if (!Array.isArray(deals) || !Array.isArray(leads) || !Array.isArray(accounts)) {
        return res.status(400).json({ error: "Invalid data format. Expected arrays for deals, leads, and accounts." });
      }

      const analysis = await aiInsightsService.analyzeSalesData(deals, leads, accounts);
      res.json(analysis);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      handleError(error, res);
    }
  });

  // Gamification Routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { type = 'all-time', year, month } = req.query;
      
      let leaderboard;
      if (type === 'monthly' && year && month) {
        leaderboard = await storage.getMonthlyLeaderboard(Number(year), Number(month));
      } else {
        leaderboard = await storage.getUserLeaderboard();
      }
      
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      console.error('Error fetching badges:', error);
      res.status(500).json({ error: 'Failed to fetch badges' });
    }
  });

  app.get("/api/user/:userId/badges", async (req, res) => {
    try {
      const { userId } = req.params;
      const userBadges = await storage.getUserBadges(userId);
      res.json(Array.isArray(userBadges) ? userBadges : []);
    } catch (error) {
      console.error('Error fetching user badges:', error);
      res.json([]);
    }
  });

  app.get("/api/user/:userId/points", async (req, res) => {
    try {
      const { userId } = req.params;
      const points = await storage.getSalesPoints(userId);
      const totalPoints = points.reduce((sum, p) => sum + p.points, 0);
      res.json({ points, totalPoints });
    } catch (error) {
      console.error('Error fetching user points:', error);
      res.status(500).json({ error: 'Failed to fetch user points' });
    }
  });

  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const { userId } = req.params;
      const achievements = await storage.getAchievements(userId);
      res.json(Array.isArray(achievements) ? achievements : []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      res.json([]);
    }
  });

  app.get("/api/user/:userId/targets", async (req, res) => {
    try {
      const { userId } = req.params;
      const targets = await storage.getSalesTargets(userId);
      res.json(Array.isArray(targets) ? targets : []);
    } catch (error) {
      console.error('Error fetching sales targets:', error);
      res.json([]);
    }
  });

  app.post("/api/points", async (req, res) => {
    try {
      const points = await storage.createSalesPoints(req.body);
      res.json(points);
    } catch (error) {
      console.error('Error creating sales points:', error);
      res.status(500).json({ error: 'Failed to create sales points' });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const achievement = await storage.createAchievement(req.body);
      res.json(achievement);
    } catch (error) {
      console.error('Error creating achievement:', error);
      res.status(500).json({ error: 'Failed to create achievement' });
    }
  });

  const server = createServer(app);

  return server;
}