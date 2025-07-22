import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'sales', 'hr', 'user']);
export const companySizeEnum = pgEnum('company_size', ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', 'unknown']);
export const contactStatusEnum = pgEnum('contact_status', ['active', 'inactive', 'bounced', 'unsubscribed']);
export const leadStageEnum = pgEnum('lead_stage', ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']);
export const leadStatusEnum = pgEnum('lead_status', ['active', 'inactive', 'nurturing']);
export const dealStageEnum = pgEnum('deal_stage', ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in-progress', 'completed']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high']);
export const activityTypeEnum = pgEnum('activity_type', ['call', 'email', 'meeting', 'task', 'note', 'demo', 'proposal']);
export const activityStatusEnum = pgEnum('activity_status', ['planned', 'completed', 'cancelled']);
export const activityPriorityEnum = pgEnum('activity_priority', ['low', 'medium', 'high', 'urgent']);
export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive']);

// Core Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default('user'),
  department: text("department"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  companySize: companySizeEnum("company_size").default('unknown'),
  annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  address: jsonb("address"),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  mobile: text("mobile"),
  position: text("position"),
  department: text("department"),
  linkedinUrl: text("linkedin_url"),
  isPrimary: boolean("is_primary").default(false),
  status: contactStatusEnum("status").default('active'),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").references(() => contacts.id),
  accountId: uuid("account_id").references(() => accounts.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company").notNull(),
  position: text("position"),
  industry: text("industry"),
  stage: leadStageEnum("stage").notNull().default('new'),
  status: leadStatusEnum("status").notNull().default('active'),
  score: integer("score").notNull().default(0),
  value: decimal("value", { precision: 15, scale: 2 }).notNull().default('0'),
  probability: integer("probability").notNull().default(0),
  expectedCloseDate: timestamp("expected_close_date"),
  source: text("source"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  lastContact: timestamp("last_contact"),
  notes: text("notes"),
  tags: jsonb("tags"),
  customFields: jsonb("custom_fields"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deals = pgTable("deals", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  leadId: uuid("lead_id").references(() => leads.id),
  accountId: uuid("account_id").references(() => accounts.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  value: decimal("value", { precision: 15, scale: 2 }).notNull().default('0'),
  stage: dealStageEnum("stage").notNull().default('qualification'),
  probability: integer("probability").notNull().default(0),
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  description: text("description"),
  nextStep: text("next_step"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull().default('other'),
  priority: taskPriorityEnum("priority").notNull().default('medium'),
  status: taskStatusEnum("status").notNull().default('pending'),
  assignedTo: uuid("assigned_to").references(() => users.id),
  relatedToType: text("related_to_type"),
  relatedToId: uuid("related_to_id"),
  dueDate: timestamp("due_date").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  type: activityTypeEnum("type").notNull(),
  direction: text("direction").notNull().default('outbound'),
  status: activityStatusEnum("status").notNull().default('planned'),
  priority: activityPriorityEnum("priority").notNull().default('medium'),
  description: text("description"),
  outcome: text("outcome"),
  duration: integer("duration"),
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdBy: uuid("created_by").references(() => users.id),
  assignedTo: uuid("assigned_to").references(() => users.id),
  leadId: uuid("lead_id").references(() => leads.id),
  dealId: uuid("deal_id").references(() => deals.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull().default(30),
  attendees: jsonb("attendees"),
  type: text("type").notNull().default('internal'),
  relatedToType: text("related_to_type"),
  relatedToId: uuid("related_to_id"),
  summary: text("summary"),
  actionItems: jsonb("action_items"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedAccounts: many(accounts),
  ownedContacts: many(contacts),
  assignedLeads: many(leads),
  assignedDeals: many(deals),
  assignedTasks: many(tasks),
  createdActivities: many(activities),
  assignedActivities: many(activities),
  createdMeetings: many(meetings),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  owner: one(users, { fields: [accounts.ownerId], references: [users.id] }),
  contacts: many(contacts),
  leads: many(leads),
  deals: many(deals),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  account: one(accounts, { fields: [contacts.accountId], references: [accounts.id] }),
  owner: one(users, { fields: [contacts.ownerId], references: [users.id] }),
  leads: many(leads),
  deals: many(deals),
  activities: many(activities),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  contact: one(contacts, { fields: [leads.contactId], references: [contacts.id] }),
  account: one(accounts, { fields: [leads.accountId], references: [accounts.id] }),
  assignee: one(users, { fields: [leads.assignedTo], references: [users.id] }),
  deals: many(deals),
  activities: many(activities),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  lead: one(leads, { fields: [deals.leadId], references: [leads.id] }),
  account: one(accounts, { fields: [deals.accountId], references: [accounts.id] }),
  contact: one(contacts, { fields: [deals.contactId], references: [contacts.id] }),
  assignee: one(users, { fields: [deals.assignedTo], references: [users.id] }),
  activities: many(activities),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, { fields: [tasks.assignedTo], references: [users.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  creator: one(users, { fields: [activities.createdBy], references: [users.id] }),
  assignee: one(users, { fields: [activities.assignedTo], references: [users.id] }),
  lead: one(leads, { fields: [activities.leadId], references: [leads.id] }),
  deal: one(deals, { fields: [activities.dealId], references: [deals.id] }),
  contact: one(contacts, { fields: [activities.contactId], references: [contacts.id] }),
}));

export const meetingsRelations = relations(meetings, ({ one }) => ({
  creator: one(users, { fields: [meetings.createdBy], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;
