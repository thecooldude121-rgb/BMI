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
  getAccountWithRelations(id: string): Promise<schema.Account & { contacts: schema.Contact[], deals: schema.Deal[], leads: schema.Lead[], documents: schema.AccountDocument[] } | undefined>;
  getAccountsByOwner(ownerId: string): Promise<schema.Account[]>;
  getAccountHierarchy(accountId: string): Promise<schema.AccountHierarchy[]>;
  createAccount(account: schema.InsertAccount): Promise<schema.Account>;
  updateAccount(id: string, account: Partial<schema.InsertAccount>): Promise<schema.Account>;
  deleteAccount(id: string): Promise<boolean>;
  
  // Account Document methods
  getAccountDocuments(accountId: string): Promise<schema.AccountDocument[]>;
  getAccountDocument(id: string): Promise<schema.AccountDocument | undefined>;
  createAccountDocument(document: schema.InsertAccountDocument): Promise<schema.AccountDocument>;
  updateAccountDocument(id: string, document: Partial<schema.InsertAccountDocument>): Promise<schema.AccountDocument>;
  deleteAccountDocument(id: string): Promise<boolean>;
  
  // Account Hierarchy methods
  createAccountHierarchy(hierarchy: schema.InsertAccountHierarchy): Promise<schema.AccountHierarchy>;
  deleteAccountHierarchy(parentId: string, childId: string): Promise<boolean>;
  
  // Account Enrichment methods
  getAccountEnrichment(accountId: string): Promise<schema.AccountEnrichment[]>;
  createAccountEnrichment(enrichment: schema.InsertAccountEnrichment): Promise<schema.AccountEnrichment>;
  updateAccountEnrichment(id: string, enrichment: Partial<schema.InsertAccountEnrichment>): Promise<schema.AccountEnrichment>;
  
  // Account Audit methods
  getAccountAudit(accountId: string): Promise<schema.AccountAudit[]>;
  createAccountAudit(audit: schema.InsertAccountAudit): Promise<schema.AccountAudit>;
  
  // Account Analytics methods
  getAccountHealth(accountId: string): Promise<{ score: number, factors: any[] }>;
  getAccountMetrics(accountId: string): Promise<{ totalDeals: number, totalRevenue: string, averageDealSize: string, lastActivity: Date | null }>;
  searchAccounts(query: string, filters?: any): Promise<schema.Account[]>;

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
  getActivitiesByLead(leadId: string): Promise<schema.Activity[]>;
  getActivitiesByDeal(dealId: string): Promise<schema.Activity[]>;
  getActivitiesByContact(contactId: string): Promise<schema.Activity[]>;
  getActivitiesByAccount(accountId: string): Promise<schema.Activity[]>;
  getActivitiesByRelatedEntity(entityType: string, entityId: string): Promise<schema.Activity[]>;
  createActivity(activity: schema.InsertActivity): Promise<schema.Activity>;
  updateActivity(id: string, activity: Partial<schema.InsertActivity>): Promise<schema.Activity>;
  completeActivity(id: string, outcome?: string): Promise<schema.Activity>;
  deleteActivity(id: string): Promise<boolean>;
  
  // Enhanced Activity Module methods
  createActivityComment(comment: any): Promise<any>;
  getActivityComments(activityId: string): Promise<any[]>;
  getActivityTemplates(): Promise<any[]>; // For activity templates
  createActivityFromTemplate(templateId: string, data: any): Promise<schema.Activity>;

  // Meeting methods
  getMeetings(): Promise<schema.Meeting[]>;
  getMeeting(id: string): Promise<schema.Meeting | undefined>;
  createMeeting(meeting: schema.InsertMeeting): Promise<schema.Meeting>;
  updateMeeting(id: string, meeting: Partial<schema.InsertMeeting>): Promise<schema.Meeting>;
  deleteMeeting(id: string): Promise<boolean>;

  // Meeting Intelligence methods
  createMeetingSummary(summary: schema.InsertMeetingSummary): Promise<schema.MeetingSummary>;
  getMeetingSummary(meetingId: string): Promise<schema.MeetingSummary | undefined>;
  
  createMeetingOutcome(outcome: schema.InsertMeetingOutcome): Promise<schema.MeetingOutcome>;
  getMeetingOutcomes(meetingId: string): Promise<schema.MeetingOutcome[]>;
  
  createMeetingInsight(insight: schema.InsertMeetingInsight): Promise<schema.MeetingInsight>;
  getMeetingInsights(meetingId: string): Promise<schema.MeetingInsight[]>;
  
  createMeetingQuestion(question: schema.InsertMeetingQuestion): Promise<schema.MeetingQuestion>;
  getMeetingQuestions(meetingId: string): Promise<schema.MeetingQuestion[]>;
  
  createMeetingPainPoint(painPoint: schema.InsertMeetingPainPoint): Promise<schema.MeetingPainPoint>;
  getMeetingPainPoints(meetingId: string): Promise<schema.MeetingPainPoint[]>;
  
  createMeetingFollowUp(followUp: schema.InsertMeetingFollowUp): Promise<schema.MeetingFollowUp>;
  getMeetingFollowUps(meetingId: string): Promise<schema.MeetingFollowUp[]>;
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
    const accounts: schema.Account[] = await db.insert(schema.accounts).values(account).returning();
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

  async getAccountWithRelations(id: string): Promise<schema.Account & { contacts: schema.Contact[], deals: schema.Deal[], leads: schema.Lead[], documents: schema.AccountDocument[] } | undefined> {
    const account = await this.getAccount(id);
    if (!account) return undefined;
    
    const [contacts, deals, leads, documents] = await Promise.all([
      this.getContactsByAccount(id),
      db.select().from(schema.deals).where(eq(schema.deals.accountId, id)),
      db.select().from(schema.leads).where(eq(schema.leads.accountId, id)),
      this.getAccountDocuments(id)
    ]);
    
    return { ...account, contacts, deals, leads, documents };
  }

  async getAccountsByOwner(ownerId: string): Promise<schema.Account[]> {
    return await db.select().from(schema.accounts).where(eq(schema.accounts.ownerId, ownerId));
  }

  async getAccountHierarchy(accountId: string): Promise<schema.AccountHierarchy[]> {
    return await db.select().from(schema.accountHierarchy)
      .where(sql`${schema.accountHierarchy.parentAccountId} = ${accountId} OR ${schema.accountHierarchy.childAccountId} = ${accountId}`);
  }

  // Account Document methods
  async getAccountDocuments(accountId: string): Promise<schema.AccountDocument[]> {
    return await db.select().from(schema.accountDocuments).where(eq(schema.accountDocuments.accountId, accountId));
  }

  async getAccountDocument(id: string): Promise<schema.AccountDocument | undefined> {
    const docs = await db.select().from(schema.accountDocuments).where(eq(schema.accountDocuments.id, id));
    return docs[0];
  }

  async createAccountDocument(document: schema.InsertAccountDocument): Promise<schema.AccountDocument> {
    const docs = await db.insert(schema.accountDocuments).values(document).returning();
    return docs[0];
  }

  async updateAccountDocument(id: string, document: Partial<schema.InsertAccountDocument>): Promise<schema.AccountDocument> {
    const docs = await db.update(schema.accountDocuments).set(document).where(eq(schema.accountDocuments.id, id)).returning();
    return docs[0];
  }

  async deleteAccountDocument(id: string): Promise<boolean> {
    const result = await db.delete(schema.accountDocuments).where(eq(schema.accountDocuments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Account Hierarchy methods
  async createAccountHierarchy(hierarchy: schema.InsertAccountHierarchy): Promise<schema.AccountHierarchy> {
    const hierarchies = await db.insert(schema.accountHierarchy).values(hierarchy).returning();
    return hierarchies[0];
  }

  async deleteAccountHierarchy(parentId: string, childId: string): Promise<boolean> {
    const result = await db.delete(schema.accountHierarchy)
      .where(and(
        eq(schema.accountHierarchy.parentAccountId, parentId),
        eq(schema.accountHierarchy.childAccountId, childId)
      ));
    return (result.rowCount || 0) > 0;
  }

  // Account Enrichment methods
  async getAccountEnrichment(accountId: string): Promise<schema.AccountEnrichment[]> {
    return await db.select().from(schema.accountEnrichment)
      .where(and(
        eq(schema.accountEnrichment.accountId, accountId),
        eq(schema.accountEnrichment.isActive, true)
      ));
  }

  async createAccountEnrichment(enrichment: schema.InsertAccountEnrichment): Promise<schema.AccountEnrichment> {
    const enrichments = await db.insert(schema.accountEnrichment).values(enrichment).returning();
    return enrichments[0];
  }

  async updateAccountEnrichment(id: string, enrichment: Partial<schema.InsertAccountEnrichment>): Promise<schema.AccountEnrichment> {
    const enrichments = await db.update(schema.accountEnrichment).set(enrichment).where(eq(schema.accountEnrichment.id, id)).returning();
    return enrichments[0];
  }

  // Account Audit methods
  async getAccountAudit(accountId: string): Promise<schema.AccountAudit[]> {
    return await db.select().from(schema.accountAudit)
      .where(eq(schema.accountAudit.accountId, accountId))
      .orderBy(desc(schema.accountAudit.timestamp));
  }

  async createAccountAudit(audit: schema.InsertAccountAudit): Promise<schema.AccountAudit> {
    const audits = await db.insert(schema.accountAudit).values(audit).returning();
    return audits[0];
  }

  // Account Analytics methods
  async getAccountHealth(accountId: string): Promise<{ score: number, factors: any[] }> {
    const account = await this.getAccount(accountId);
    if (!account) return { score: 0, factors: [] };

    const factors = [];
    let score = account.healthScore || 50;

    // Calculate health based on activity
    const recentActivities = await db.select().from(schema.activities)
      .where(and(
        eq(schema.activities.accountId, accountId),
        gte(schema.activities.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
      ));

    if (recentActivities.length > 5) {
      score += 10;
      factors.push({ type: 'activity', value: 'High recent activity', impact: '+10' });
    } else if (recentActivities.length === 0) {
      score -= 15;
      factors.push({ type: 'activity', value: 'No recent activity', impact: '-15' });
    }

    // Check deal performance
    const openDeals = await db.select().from(schema.deals)
      .where(and(
        eq(schema.deals.accountId, accountId),
        sql`${schema.deals.stage} NOT IN ('closed-won', 'closed-lost')`
      ));

    if (openDeals.length > 0) {
      score += 5;
      factors.push({ type: 'deals', value: `${openDeals.length} open deals`, impact: '+5' });
    }

    return { score: Math.max(0, Math.min(100, score)), factors };
  }

  async getAccountMetrics(accountId: string): Promise<{ totalDeals: number, totalRevenue: string, averageDealSize: string, lastActivity: Date | null }> {
    const deals = await db.select().from(schema.deals).where(eq(schema.deals.accountId, accountId));
    const activities = await db.select().from(schema.activities)
      .where(eq(schema.activities.accountId, accountId))
      .orderBy(desc(schema.activities.createdAt))
      .limit(1);

    const totalDeals = deals.length;
    const totalRevenue = deals.reduce((sum, deal) => sum + parseFloat(deal.value || '0'), 0);
    const averageDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;

    return {
      totalDeals,
      totalRevenue: totalRevenue.toString(),
      averageDealSize: averageDealSize.toString(),
      lastActivity: activities[0]?.createdAt || null
    };
  }

  async searchAccounts(query: string, filters?: any): Promise<schema.Account[]> {
    let whereClause = sql`1=1`;
    
    if (query) {
      whereClause = sql`${whereClause} AND (
        LOWER(${schema.accounts.name}) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(${schema.accounts.domain}) LIKE LOWER(${'%' + query + '%'}) OR
        LOWER(${schema.accounts.industry}) LIKE LOWER(${'%' + query + '%'})
      )`;
    }

    if (filters?.industry) {
      whereClause = sql`${whereClause} AND ${schema.accounts.industry} = ${filters.industry}`;
    }

    if (filters?.accountType) {
      whereClause = sql`${whereClause} AND ${schema.accounts.accountType} = ${filters.accountType}`;
    }

    if (filters?.accountStatus) {
      whereClause = sql`${whereClause} AND ${schema.accounts.accountStatus} = ${filters.accountStatus}`;
    }

    if (filters?.ownerId) {
      whereClause = sql`${whereClause} AND ${schema.accounts.ownerId} = ${filters.ownerId}`;
    }

    return await db.select().from(schema.accounts).where(whereClause);
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
    return await db.select().from(schema.activities).orderBy(desc(schema.activities.createdAt));
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
    const activities = await db.update(schema.activities)
      .set({ ...activity, updatedAt: new Date() })
      .where(eq(schema.activities.id, id))
      .returning();
    return activities[0];
  }

  async getActivitiesByLead(leadId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities)
      .where(eq(schema.activities.leadId, leadId))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getActivitiesByDeal(dealId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities)
      .where(eq(schema.activities.dealId, dealId))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getActivitiesByContact(contactId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities)
      .where(eq(schema.activities.contactId, contactId))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getActivitiesByAccount(accountId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities)
      .where(eq(schema.activities.accountId, accountId))
      .orderBy(desc(schema.activities.createdAt));
  }

  async getActivitiesByRelatedEntity(entityType: string, entityId: string): Promise<schema.Activity[]> {
    return await db.select().from(schema.activities)
      .where(and(
        eq(schema.activities.relatedToType, entityType),
        eq(schema.activities.relatedToId, entityId)
      ))
      .orderBy(desc(schema.activities.createdAt));
  }

  async completeActivity(id: string, outcome?: string): Promise<schema.Activity> {
    const activities = await db.update(schema.activities)
      .set({ 
        status: 'completed',
        completedAt: new Date(),
        outcome: outcome,
        updatedAt: new Date()
      })
      .where(eq(schema.activities.id, id))
      .returning();
    return activities[0];
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await db.delete(schema.activities).where(eq(schema.activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async createActivityComment(comment: any): Promise<any> {
    const comments = await db.insert(schema.activityComments).values(comment).returning();
    return comments[0];
  }

  async getActivityComments(activityId: string): Promise<any[]> {
    return await db.select().from(schema.activityComments)
      .where(eq(schema.activityComments.activityId, activityId))
      .orderBy(desc(schema.activityComments.createdAt));
  }

  async getActivityTemplates(): Promise<any[]> {
    // For now return mock templates - this would come from a templates table in production
    return [
      { id: '1', name: 'Follow-up Call', type: 'call', description: 'Standard follow-up call template' },
      { id: '2', name: 'Demo Meeting', type: 'meeting', description: 'Product demonstration template' },
      { id: '3', name: 'Proposal Email', type: 'email', description: 'Business proposal template' }
    ];
  }

  async createActivityFromTemplate(templateId: string, data: any): Promise<schema.Activity> {
    // Basic template implementation - would be enhanced with actual template data
    const templateActivity = {
      subject: data.subject || 'Template Activity',
      type: data.type || 'task',
      status: 'open',
      priority: 'medium',
      description: data.description || '',
      relatedToType: data.relatedToType,
      relatedToId: data.relatedToId,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
      ...data
    };
    
    return await this.createActivity(templateActivity);
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

  // Missing meeting implementation
  async getMeetings(): Promise<schema.Meeting[]> {
    return await db.select().from(schema.meetings).orderBy(desc(schema.meetings.scheduledStart));
  }

  async getMeeting(id: string): Promise<schema.Meeting | undefined> {
    const meetings = await db.select().from(schema.meetings).where(eq(schema.meetings.id, id));
    return meetings[0];
  }

  async createMeeting(meeting: schema.InsertMeeting): Promise<schema.Meeting> {
    const meetings = await db.insert(schema.meetings).values(meeting).returning();
    return meetings[0];
  }

  async updateMeeting(id: string, updates: Partial<schema.InsertMeeting>): Promise<schema.Meeting> {
    const meetings = await db.update(schema.meetings).set(updates).where(eq(schema.meetings.id, id)).returning();
    return meetings[0];
  }

  async deleteMeeting(id: string): Promise<boolean> {
    const result = await db.delete(schema.meetings).where(eq(schema.meetings.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Meeting Intelligence methods
  async createMeetingSummary(summary: schema.InsertMeetingSummary): Promise<schema.MeetingSummary> {
    const summaries = await db.insert(schema.meetingSummaries).values(summary).returning();
    return summaries[0];
  }

  async getMeetingSummary(meetingId: string): Promise<schema.MeetingSummary | undefined> {
    const summaries = await db.select().from(schema.meetingSummaries).where(eq(schema.meetingSummaries.meetingId, meetingId));
    return summaries[0];
  }

  async createMeetingOutcome(outcome: schema.InsertMeetingOutcome): Promise<schema.MeetingOutcome> {
    const outcomes = await db.insert(schema.meetingOutcomes).values(outcome).returning();
    return outcomes[0];
  }

  async getMeetingOutcomes(meetingId: string): Promise<schema.MeetingOutcome[]> {
    return await db.select().from(schema.meetingOutcomes).where(eq(schema.meetingOutcomes.meetingId, meetingId));
  }

  async createMeetingInsight(insight: schema.InsertMeetingInsight): Promise<schema.MeetingInsight> {
    const insights = await db.insert(schema.meetingInsights).values(insight).returning();
    return insights[0];
  }

  async getMeetingInsights(meetingId: string): Promise<schema.MeetingInsight[]> {
    return await db.select().from(schema.meetingInsights).where(eq(schema.meetingInsights.meetingId, meetingId));
  }

  async createMeetingQuestion(question: schema.InsertMeetingQuestion): Promise<schema.MeetingQuestion> {
    const questions = await db.insert(schema.meetingQuestions).values(question).returning();
    return questions[0];
  }

  async getMeetingQuestions(meetingId: string): Promise<schema.MeetingQuestion[]> {
    return await db.select().from(schema.meetingQuestions).where(eq(schema.meetingQuestions.meetingId, meetingId));
  }

  async createMeetingPainPoint(painPoint: schema.InsertMeetingPainPoint): Promise<schema.MeetingPainPoint> {
    const painPoints = await db.insert(schema.meetingPainPoints).values(painPoint).returning();
    return painPoints[0];
  }

  async getMeetingPainPoints(meetingId: string): Promise<schema.MeetingPainPoint[]> {
    return await db.select().from(schema.meetingPainPoints).where(eq(schema.meetingPainPoints.meetingId, meetingId));
  }

  async createMeetingFollowUp(followUp: schema.InsertMeetingFollowUp): Promise<schema.MeetingFollowUp> {
    const followUps = await db.insert(schema.meetingFollowUps).values(followUp).returning();
    return followUps[0];
  }

  async getMeetingFollowUps(meetingId: string): Promise<schema.MeetingFollowUp[]> {
    return await db.select().from(schema.meetingFollowUps).where(eq(schema.meetingFollowUps.meetingId, meetingId));
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
