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
export const leadPriorityEnum = pgEnum('lead_priority', ['low', 'medium', 'high', 'urgent']);
export const leadSourceEnum = pgEnum('lead_source', ['website', 'social_media', 'email_campaign', 'referral', 'cold_call', 'trade_show', 'advertisement', 'partner']);
export const dealStageEnum = pgEnum('deal_stage', ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'discovery', 'demo', 'trial']);
export const dealTypeEnum = pgEnum('deal_type', ['new_business', 'existing_business', 'renewal', 'expansion', 'upsell', 'cross_sell']);
export const dealHealthEnum = pgEnum('deal_health', ['healthy', 'at_risk', 'critical', 'hot_opportunity', 'stalled']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in-progress', 'completed']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high']);
export const activityTypeEnum = pgEnum('activity_type', ['call', 'email', 'meeting', 'task', 'note', 'demo', 'proposal']);
export const activityStatusEnum = pgEnum('activity_status', ['planned', 'completed', 'cancelled']);
export const activityPriorityEnum = pgEnum('activity_priority', ['low', 'medium', 'high', 'urgent']);
export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive']);
export const meetingStatusEnum = pgEnum('meeting_status', ['scheduled', 'ongoing', 'completed', 'cancelled']);
export const meetingTypeEnum = pgEnum('meeting_type', ['call', 'video', 'in-person', 'presentation', 'demo']);
export const participantStatusEnum = pgEnum('participant_status', ['invited', 'accepted', 'declined', 'tentative']);
export const transcriptionStatusEnum = pgEnum('transcription_status', ['pending', 'processing', 'completed', 'failed']);
export const insightTypeEnum = pgEnum('insight_type', ['action_item', 'sentiment', 'key_decision', 'follow_up', 'risk', 'opportunity']);
export const dealRiskLevelEnum = pgEnum('deal_risk_level', ['low', 'medium', 'high', 'critical']);
export const competitorEnum = pgEnum('competitor', ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'monday', 'other', 'none']);
export const dealSourceEnum = pgEnum('deal_source', ['inbound', 'outbound', 'referral', 'marketing', 'partner', 'existing_customer']);

// Lead-specific enums
export const leadQualificationEnum = pgEnum('lead_qualification', ['MQL', 'SQL', 'SAL', 'opportunity', 'customer']);
export const leadChannelEnum = pgEnum('lead_channel', ['organic_search', 'paid_search', 'social_media', 'email', 'direct', 'referral', 'content', 'webinar', 'event']);
export const leadSentimentEnum = pgEnum('lead_sentiment', ['positive', 'neutral', 'negative', 'unknown']);
export const activityOutcomeEnum = pgEnum('activity_outcome', ['successful', 'no_answer', 'voicemail', 'busy', 'wrong_number', 'bounced', 'unsubscribed', 'interested', 'not_interested']);

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

// Account-specific enums
export const accountTypeEnum = pgEnum('account_type', ['prospect', 'customer', 'partner', 'vendor', 'competitor', 'former_customer']);
export const accountStatusEnum = pgEnum('account_status', ['active', 'inactive', 'suspended', 'churned', 'potential']);
export const accountHealthEnum = pgEnum('account_health', ['excellent', 'good', 'at_risk', 'critical', 'churned']);
export const accountSegmentEnum = pgEnum('account_segment', ['enterprise', 'mid_market', 'smb', 'startup', 'government', 'non_profit']);
export const industryEnum = pgEnum('industry', ['technology', 'healthcare', 'finance', 'education', 'manufacturing', 'retail', 'real_estate', 'consulting', 'media', 'transportation', 'energy', 'agriculture', 'biotechnology', 'fashion', 'other']);

export const accounts: any = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: industryEnum("industry"),
  companySize: companySizeEnum("company_size").default('unknown'),
  annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
  website: text("website"),
  phone: text("phone"),
  description: text("description"),
  
  // Enhanced address fields
  address: jsonb("address"),
  billingAddress: jsonb("billing_address"),
  shippingAddress: jsonb("shipping_address"),
  
  // Account classification
  accountType: accountTypeEnum("account_type").default('prospect'),
  accountStatus: accountStatusEnum("account_status").default('active'),
  accountSegment: accountSegmentEnum("account_segment"),
  
  // Hierarchy and relationships
  parentAccountId: uuid("parent_account_id").references(() => accounts.id),
  
  // Company details
  employees: integer("employees"),
  foundedYear: integer("founded_year"),
  stockSymbol: text("stock_symbol"),
  linkedinUrl: text("linkedin_url"),
  twitterHandle: text("twitter_handle"),
  faxNumber: text("fax_number"),
  
  // Business metrics
  healthScore: integer("health_score").default(50), // 0-100
  customerSince: timestamp("customer_since"),
  lastActivityDate: timestamp("last_activity_date"),
  
  // Enrichment data
  logoUrl: text("logo_url"),
  technologies: jsonb("technologies"), // Array of technologies used
  socialMedia: jsonb("social_media"), // Social media profiles
  competitors: jsonb("competitors"), // Known competitors
  
  // CRM fields
  ownerId: uuid("owner_id").references(() => users.id),
  tags: jsonb("tags"), // Array of tags
  customFields: jsonb("custom_fields"),
  
  // Document management
  documents: jsonb("documents"), // Array of uploaded document metadata
  
  // Audit fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  
  // AI and automation
  enrichmentStatus: text("enrichment_status").default('pending'), // pending, completed, failed
  enrichmentData: jsonb("enrichment_data"),
  autoAssignmentRules: jsonb("auto_assignment_rules"),
  
  // Compliance and privacy
  gdprConsent: boolean("gdpr_consent").default(false),
  dataProcessingConsent: jsonb("data_processing_consent"),
  
  // Performance tracking
  totalDeals: integer("total_deals").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default('0'),
  averageDealSize: decimal("average_deal_size", { precision: 15, scale: 2 }).default('0'),
  lastContactDate: timestamp("last_contact_date"),
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

export const leads: any = pgTable("leads", {
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
  source: leadSourceEnum("source").default('website'),
  priority: leadPriorityEnum("priority").default('medium'),
  rating: integer("rating").default(1), // 1-5 star rating
  assignedTo: uuid("assigned_to").references(() => users.id),
  lastContact: timestamp("last_contact"),
  notes: text("notes"),
  tags: jsonb("tags"),
  customFields: jsonb("custom_fields"),
  
  // Enhanced fields for next-gen lead management
  leadScore: integer("lead_score").default(0), // AI-powered lead score 0-100
  engagementScore: integer("engagement_score").default(0), // Email/website engagement
  fitScore: integer("fit_score").default(0), // How well lead fits ICP
  intentScore: integer("intent_score").default(0), // Purchase intent signals
  
  // Advanced lead qualification fields
  qualification: leadQualificationEnum("qualification").default('MQL'),
  channel: leadChannelEnum("channel").default('organic_search'),
  sentiment: leadSentimentEnum("sentiment").default('unknown'),
  webActivity: jsonb("web_activity"), // Website activity tracking
  emailActivity: jsonb("email_activity"), // Email engagement tracking
  socialActivity: jsonb("social_activity"), // Social media interactions
  
  // Lead nurturing and assignment
  nurturingCampaignId: text("nurturing_campaign_id"),
  nurturingStage: text("nurturing_stage"),
  autoAssignmentRules: jsonb("auto_assignment_rules"),
  assignmentHistory: jsonb("assignment_history"),
  
  // Deduplication and enrichment  
  enrichmentStatus: text("enrichment_status").default('pending'), // pending, enriched, failed
  enrichmentData: jsonb("enrichment_data"), // Third-party enriched data
  
  // Contact and consent management
  consentStatus: text("consent_status").default('unknown'), // opted_in, opted_out, unknown
  consentTimestamp: timestamp("consent_timestamp"),
  communicationPreferences: jsonb("communication_preferences"),
  
  // Lead attachments and documents
  attachments: jsonb("attachments"), // Array of file metadata
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  companyLinkedinUrl: text("company_linkedin_url"),
  timezone: text("timezone"),
  locale: text("locale").default('en-US'),
  
  // Lead intelligence
  companySize: companySizeEnum("company_size"),
  annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
  technologies: jsonb("technologies"), // Tech stack used by company
  competitors: jsonb("competitors"), // Known competitors they're evaluating
  painPoints: jsonb("pain_points"), // Identified challenges
  interests: jsonb("interests"), // Areas of interest
  
  // Behavioral tracking
  websiteVisits: integer("website_visits").default(0),
  emailOpens: integer("email_opens").default(0),
  emailClicks: integer("email_clicks").default(0),
  contentDownloads: integer("content_downloads").default(0),
  demoRequests: integer("demo_requests").default(0),
  
  // Sales process
  nextAction: text("next_action"),
  nextActionDate: timestamp("next_action_date"),
  lastActivityType: text("last_activity_type"),
  responseTime: integer("response_time"), // Average response time in hours
  
  // Campaign & attribution
  campaignId: text("campaign_id"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  firstTouchpoint: text("first_touchpoint"),
  lastTouchpoint: text("last_touchpoint"),
  
  // AI insights & automation
  aiInsights: jsonb("ai_insights"), // AI-generated insights
  autoNurturing: boolean("auto_nurturing").default(false),
  sequenceId: text("sequence_id"), // Enrolled nurture sequence
  
  // Consent & compliance
  gdprConsent: boolean("gdpr_consent").default(false),
  emailOptIn: boolean("email_opt_in").default(false),
  smsOptIn: boolean("sms_opt_in").default(false),
  dataProcessingConsent: timestamp("data_processing_consent"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lead Scoring Rules Table
export const leadScoringRules = pgTable("lead_scoring_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  condition: jsonb("condition").notNull(), // JSON rule condition
  points: integer("points").notNull(),
  isActive: boolean("is_active").default(true),
  ruleType: text("rule_type").notNull(), // 'demographic', 'behavioral', 'engagement', 'firmographic'
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lead Nurture Sequences Table
export const leadNurtureSequences = pgTable("lead_nurture_sequences", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  trigger: jsonb("trigger").notNull(), // Conditions to start sequence
  steps: jsonb("steps").notNull(), // Array of sequence steps
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lead Activity Log Table  
export const leadActivityLog = pgTable("lead_activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => leads.id).notNull(),
  activityType: activityTypeEnum("activity_type").notNull(),
  activitySubtype: text("activity_subtype"), // email_open, link_click, form_fill, etc.
  description: text("description").notNull(),
  outcome: activityOutcomeEnum("outcome"),
  metadata: jsonb("metadata"), // Additional activity data
  performedBy: uuid("performed_by").references(() => users.id),
  performedAt: timestamp("performed_at").notNull().defaultNow(),
  sourceSystem: text("source_system"), // 'manual', 'email', 'website', 'api'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Lead Duplicate Detection Table
export const leadDuplicates = pgTable("lead_duplicates", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId1: uuid("lead_id_1").references(() => leads.id).notNull(),
  leadId2: uuid("lead_id_2").references(() => leads.id).notNull(),
  similarityScore: decimal("similarity_score", { precision: 5, scale: 2 }).notNull(),
  matchingFields: jsonb("matching_fields").notNull(), // Array of matching field names
  status: text("status").default('pending'), // 'pending', 'merged', 'ignored', 'false_positive'
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Lead Assignment Rules Table
export const leadAssignmentRules = pgTable("lead_assignment_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  criteria: jsonb("criteria").notNull(), // Assignment criteria
  assignTo: uuid("assign_to").references(() => users.id),
  assignmentType: text("assignment_type").default('direct'), // 'direct', 'round_robin', 'load_balanced'
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),
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
  
  // Enhanced Deal Fields
  dealType: dealTypeEnum("deal_type").default('new_business'),
  dealHealth: dealHealthEnum("deal_health").default('healthy'),
  dealSource: dealSourceEnum("deal_source").default('inbound'),
  riskLevel: dealRiskLevelEnum("risk_level").default('low'),
  competitor: competitorEnum("competitor").default('none'),
  
  // Financial Details
  monthlyRecurringRevenue: decimal("monthly_recurring_revenue", { precision: 15, scale: 2 }).default('0'),
  annualContractValue: decimal("annual_contract_value", { precision: 15, scale: 2 }).default('0'),
  discount: decimal("discount", { precision: 5, scale: 2 }).default('0'), // percentage
  costOfAcquisition: decimal("cost_of_acquisition", { precision: 15, scale: 2 }).default('0'),
  
  // Sales Process
  salesCycle: integer("sales_cycle"), // days
  stageHistory: jsonb("stage_history").default('[]'), // Array of stage changes with timestamps
  lastActivityDate: timestamp("last_activity_date"),
  followUpDate: timestamp("follow_up_date"),
  
  // Team & Collaboration
  teamMembers: jsonb("team_members").default('[]'), // Array of user IDs
  followers: jsonb("followers").default('[]'), // Array of user IDs following this deal
  
  // AI & Automation
  aiScore: integer("ai_score").default(0), // 0-100 AI health score
  aiInsights: jsonb("ai_insights").default('{}'),
  automationTriggers: jsonb("automation_triggers").default('[]'),
  
  // Custom Fields
  customFields: jsonb("custom_fields").default('{}'),
  tags: jsonb("tags").default('[]'),
  
  // Metadata
  territory: text("territory"),
  businessUnit: text("business_unit"),
  campaignSource: text("campaign_source"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Deal Stage History for tracking stage transitions
export const dealStageHistory = pgTable("deal_stage_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").references(() => deals.id).notNull(),
  fromStage: dealStageEnum("from_stage"),
  toStage: dealStageEnum("to_stage").notNull(),
  changedBy: uuid("changed_by").references(() => users.id).notNull(),
  notes: text("notes"),
  duration: integer("duration"), // days in previous stage
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Deal Comments for collaboration
export const dealComments: any = pgTable("deal_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").references(() => deals.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  mentions: jsonb("mentions").default('[]'), // Array of mentioned user IDs
  isInternal: boolean("is_internal").default(true),
  parentCommentId: uuid("parent_comment_id").references(() => dealComments.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Deal Attachments
export const dealAttachments = pgTable("deal_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").references(() => deals.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // bytes
  fileType: text("file_type"),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Deal Products/Services for line items
export const dealProducts = pgTable("deal_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  dealId: uuid("deal_id").references(() => deals.id).notNull(),
  productName: text("product_name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 15, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 15, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default('0'),
  isRecurring: boolean("is_recurring").default(false),
  billingFrequency: text("billing_frequency"), // monthly, quarterly, annually
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  direction: text("direction").notNull().default('outbound'), // inbound, outbound
  status: activityStatusEnum("status").notNull().default('planned'),
  priority: activityPriorityEnum("priority").notNull().default('medium'),
  description: text("description"),
  outcome: text("outcome"),
  duration: integer("duration"), // in minutes
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdBy: uuid("created_by").references(() => users.id),
  assignedTo: uuid("assigned_to").references(() => users.id),
  
  // Multi-module relationships - activities can be linked to any CRM entity
  leadId: uuid("lead_id").references(() => leads.id),
  dealId: uuid("deal_id").references(() => deals.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  accountId: uuid("account_id").references(() => accounts.id),
  taskId: uuid("task_id").references(() => tasks.id),
  meetingId: uuid("meeting_id").references(() => meetings.id),
  
  // Additional sync fields
  relatedToType: text("related_to_type"), // 'lead', 'deal', 'contact', 'account', 'task', 'meeting'
  relatedToId: uuid("related_to_id"),
  
  // Email specific fields
  emailSubject: text("email_subject"),
  emailTo: text("email_to"),
  emailFrom: text("email_from"),
  emailCc: text("email_cc"),
  emailBcc: text("email_bcc"),
  
  // Call specific fields
  callType: text("call_type"), // incoming, outgoing
  phoneNumber: text("phone_number"),
  callResult: text("call_result"), // answered, voicemail, busy, no_answer
  
  // Meeting specific fields
  meetingType: text("meeting_type"), // video, phone, in-person
  location: text("location"),
  attendees: jsonb("attendees"), // Array of participant objects
  
  // Task specific fields
  taskStatus: text("task_status"), // pending, in-progress, completed
  dueDate: timestamp("due_date"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// AI Meeting Intelligence Tables
export const meetings = pgTable("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  type: meetingTypeEnum("type").notNull().default('video'),
  status: meetingStatusEnum("status").notNull().default('scheduled'),
  platform: text("platform"), // 'zoom', 'teams', 'google-meet', 'in-person'
  meetingUrl: text("meeting_url"),
  recordingUrl: text("recording_url"),
  calendarEventId: text("calendar_event_id"),
  organizerId: uuid("organizer_id").references(() => users.id).notNull(),
  dealId: uuid("deal_id").references(() => deals.id),
  accountId: uuid("account_id").references(() => accounts.id),
  leadId: uuid("lead_id").references(() => leads.id),
  agenda: text("agenda"),
  location: text("location"),
  isRecorded: boolean("is_recorded").default(false),
  aiProcessingStatus: text("ai_processing_status").default('pending'), // 'pending', 'processing', 'completed', 'failed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetingParticipants = pgTable("meeting_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  userId: uuid("user_id").references(() => users.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role"), // 'organizer', 'attendee', 'presenter'
  status: participantStatusEnum("status").default('invited'),
  joinedAt: timestamp("joined_at"),
  leftAt: timestamp("left_at"),
  duration: integer("duration"), // minutes participated
  isExternal: boolean("is_external").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingTranscripts = pgTable("meeting_transcripts", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  rawTranscript: text("raw_transcript").notNull(),
  speakerSegments: jsonb("speaker_segments"), // Array of {speaker, text, timestamp, duration}
  language: text("language").default('en'),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
  processingSource: text("processing_source"), // 'zoom', 'teams', 'google-meet', 'manual'
  status: transcriptionStatusEnum("status").default('completed'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingSummaries = pgTable("meeting_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  conciseSummary: text("concise_summary").notNull(),
  keyTopics: jsonb("key_topics"), // Array of main discussion topics
  meetingIntent: text("meeting_intent"),
  attendeeRoles: jsonb("attendee_roles"), // Map of participant roles and contexts
  duration: integer("duration"), // actual meeting duration in minutes
  engagementScore: integer("engagement_score"), // 1-100 overall engagement
  sentimentAnalysis: jsonb("sentiment_analysis"), // Overall meeting sentiment
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingOutcomes = pgTable("meeting_outcomes", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  participantEmail: text("participant_email").notNull(),
  participantName: text("participant_name").notNull(),
  nextSteps: jsonb("next_steps"), // Array of actionable next steps
  assignedTasks: jsonb("assigned_tasks"), // Specific tasks assigned to this participant
  commitments: jsonb("commitments"), // Commitments made by this participant
  followUpDate: timestamp("follow_up_date"),
  priority: text("priority").default('medium'), // 'low', 'medium', 'high', 'urgent'
  status: text("status").default('pending'), // 'pending', 'in-progress', 'completed'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const meetingInsights = pgTable("meeting_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  type: insightTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  relatedParticipant: text("related_participant"), // Email or name
  importance: text("importance").default('medium'), // 'low', 'medium', 'high', 'critical'
  timestamp: integer("timestamp"), // Seconds into the meeting when this occurred
  context: text("context"), // Surrounding conversation context
  suggestedAction: text("suggested_action"),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingQuestions = pgTable("meeting_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  question: text("question").notNull(),
  askedBy: text("asked_by"), // Participant who asked
  category: text("category"), // 'technical', 'pricing', 'timeline', 'process', 'other'
  importance: text("importance").default('medium'),
  timestamp: integer("timestamp"), // Seconds into meeting
  isAnswered: boolean("is_answered").default(false),
  answer: text("answer"),
  answeredBy: text("answered_by"),
  followUpRequired: boolean("follow_up_required").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingPainPoints = pgTable("meeting_pain_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  painPoint: text("pain_point").notNull(),
  participantName: text("participant_name"),
  participantEmail: text("participant_email"),
  category: text("category"), // 'technical', 'process', 'cost', 'timeline', 'resource', 'other'
  severity: text("severity").default('medium'), // 'low', 'medium', 'high', 'critical'
  timestamp: integer("timestamp"),
  context: text("context"),
  suggestedSolution: text("suggested_solution"),
  isAddressed: boolean("is_addressed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingFollowUps = pgTable("meeting_follow_ups", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  type: text("type").notNull(), // 'meeting', 'email', 'call', 'demo', 'proposal'
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: text("assigned_to"), // Email or name
  dueDate: timestamp("due_date"),
  priority: text("priority").default('medium'),
  status: text("status").default('pending'),
  calendarEventCreated: boolean("calendar_event_created").default(false),
  emailSent: boolean("email_sent").default(false),
  crmUpdated: boolean("crm_updated").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Gamification Tables
export const salesPoints = pgTable("sales_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull().default(0),
  activityType: text("activity_type").notNull(), // 'deal_closed', 'lead_converted', 'meeting_scheduled', etc.
  activityId: uuid("activity_id"), // Reference to the specific deal, lead, etc.
  description: text("description"),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // Icon name or emoji
  color: text("color").default('blue'),
  criteria: jsonb("criteria"), // JSON describing earning criteria
  points: integer("points").default(0), // Points awarded for earning this badge
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeId: uuid("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  progress: integer("progress").default(100), // Percentage progress towards earning (100 = earned)
});

export const salesTargets = pgTable("sales_targets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  targetType: text("target_type").notNull(), // 'monthly', 'quarterly', 'yearly'
  targetValue: decimal("target_value", { precision: 12, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }).default('0'),
  targetPeriod: text("target_period").notNull(), // '2025-01', '2025-Q1', etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'milestone', 'streak', 'competition'
  value: decimal("value", { precision: 12, scale: 2 }), // Deal value, number of activities, etc.
  achievedAt: timestamp("achieved_at").notNull().defaultNow(),
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

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  organizer: one(users, { fields: [meetings.organizerId], references: [users.id] }),
  deal: one(deals, { fields: [meetings.dealId], references: [deals.id] }),
  account: one(accounts, { fields: [meetings.accountId], references: [accounts.id] }),
  lead: one(leads, { fields: [meetings.leadId], references: [leads.id] }),
  participants: many(meetingParticipants),
  transcripts: many(meetingTranscripts),
  summaries: many(meetingSummaries),
  outcomes: many(meetingOutcomes),
  insights: many(meetingInsights),
  questions: many(meetingQuestions),
  painPoints: many(meetingPainPoints),
  followUps: many(meetingFollowUps),
}));

export const meetingParticipantsRelations = relations(meetingParticipants, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingParticipants.meetingId], references: [meetings.id] }),
  user: one(users, { fields: [meetingParticipants.userId], references: [users.id] }),
  contact: one(contacts, { fields: [meetingParticipants.contactId], references: [contacts.id] }),
}));

export const meetingTranscriptsRelations = relations(meetingTranscripts, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingTranscripts.meetingId], references: [meetings.id] }),
}));

export const meetingSummariesRelations = relations(meetingSummaries, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingSummaries.meetingId], references: [meetings.id] }),
}));

export const meetingOutcomesRelations = relations(meetingOutcomes, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingOutcomes.meetingId], references: [meetings.id] }),
}));

export const meetingInsightsRelations = relations(meetingInsights, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingInsights.meetingId], references: [meetings.id] }),
}));

export const meetingQuestionsRelations = relations(meetingQuestions, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingQuestions.meetingId], references: [meetings.id] }),
}));

export const meetingPainPointsRelations = relations(meetingPainPoints, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingPainPoints.meetingId], references: [meetings.id] }),
}));

export const meetingFollowUpsRelations = relations(meetingFollowUps, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingFollowUps.meetingId], references: [meetings.id] }),
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

export const insertMeetingParticipantSchema = createInsertSchema(meetingParticipants).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingTranscriptSchema = createInsertSchema(meetingTranscripts).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingSummarySchema = createInsertSchema(meetingSummaries).omit({
  id: true,
  createdAt: true,
});

// Account Document Management Tables
export const accountDocuments = pgTable("account_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // contract, proposal, invoice, presentation, etc.
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"), // in bytes
  mimeType: text("mime_type"),
  version: integer("version").default(1),
  description: text("description"),
  tags: jsonb("tags"), // Array of tags for categorization
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  isPublic: boolean("is_public").default(false),
  expirationDate: timestamp("expiration_date"),
  signatureRequired: boolean("signature_required").default(false),
  signatureStatus: text("signature_status"), // pending, signed, rejected
  signedBy: uuid("signed_by").references(() => users.id),
  signedAt: timestamp("signed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Account Hierarchy for parent-child relationships
export const accountHierarchy = pgTable("account_hierarchy", {
  id: uuid("id").primaryKey().defaultRandom(),
  parentAccountId: uuid("parent_account_id").references(() => accounts.id).notNull(),
  childAccountId: uuid("child_account_id").references(() => accounts.id).notNull(),
  relationshipType: text("relationship_type").default('subsidiary'), // subsidiary, division, branch, partner
  hierarchyLevel: integer("hierarchy_level").default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Account Enrichment Data for auto-filled information
export const accountEnrichment = pgTable("account_enrichment", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.id).notNull(),
  source: text("source").notNull(), // clearbit, zoominfo, apollo, manual
  data: jsonb("data").notNull(), // Enriched company data
  confidence: integer("confidence"), // 0-100 confidence score
  lastEnriched: timestamp("last_enriched").notNull().defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Account Audit Log for tracking changes
export const accountAudit = pgTable("account_audit", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // created, updated, deleted, merged
  fieldChanged: text("field_changed"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMeetingOutcomeSchema = createInsertSchema(meetingOutcomes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMeetingInsightSchema = createInsertSchema(meetingInsights).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingQuestionSchema = createInsertSchema(meetingQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingPainPointSchema = createInsertSchema(meetingPainPoints).omit({
  id: true,
  createdAt: true,
});

export const insertMeetingFollowUpSchema = createInsertSchema(meetingFollowUps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Enhanced Lead Schema validation
export const insertLeadScoringRuleSchema = createInsertSchema(leadScoringRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadNurtureSequenceSchema = createInsertSchema(leadNurtureSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadActivityLogSchema = createInsertSchema(leadActivityLog).omit({
  id: true,
  createdAt: true,
});

export const insertLeadDuplicateSchema = createInsertSchema(leadDuplicates).omit({
  id: true,
  createdAt: true,
});

export const insertLeadAssignmentRuleSchema = createInsertSchema(leadAssignmentRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSalesPointsSchema = createInsertSchema(salesPoints).omit({
  id: true,
  createdAt: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({
  id: true,
});

export const insertSalesTargetSchema = createInsertSchema(salesTargets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
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

export type AccountDocument = typeof accountDocuments.$inferSelect;
export type InsertAccountDocument = typeof accountDocuments.$inferInsert;
export type AccountHierarchy = typeof accountHierarchy.$inferSelect;
export type InsertAccountHierarchy = typeof accountHierarchy.$inferInsert;
export type AccountEnrichment = typeof accountEnrichment.$inferSelect;
export type InsertAccountEnrichment = typeof accountEnrichment.$inferInsert;
export type AccountAudit = typeof accountAudit.$inferSelect;
export type InsertAccountAudit = typeof accountAudit.$inferInsert;

// Account insert schemas
export const insertAccountDocumentSchema = createInsertSchema(accountDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountHierarchySchema = createInsertSchema(accountHierarchy).omit({
  id: true,
  createdAt: true,
});

export const insertAccountEnrichmentSchema = createInsertSchema(accountEnrichment).omit({
  id: true,
  lastEnriched: true,
});

export const insertAccountAuditSchema = createInsertSchema(accountAudit).omit({
  id: true,
  timestamp: true,
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

export type InsertMeetingParticipant = z.infer<typeof insertMeetingParticipantSchema>;
export type MeetingParticipant = typeof meetingParticipants.$inferSelect;

export type InsertMeetingTranscript = z.infer<typeof insertMeetingTranscriptSchema>;
export type MeetingTranscript = typeof meetingTranscripts.$inferSelect;

export type InsertMeetingSummary = z.infer<typeof insertMeetingSummarySchema>;
export type MeetingSummary = typeof meetingSummaries.$inferSelect;

export type InsertMeetingOutcome = z.infer<typeof insertMeetingOutcomeSchema>;
export type MeetingOutcome = typeof meetingOutcomes.$inferSelect;

export type InsertMeetingInsight = z.infer<typeof insertMeetingInsightSchema>;
export type MeetingInsight = typeof meetingInsights.$inferSelect;

export type InsertMeetingQuestion = z.infer<typeof insertMeetingQuestionSchema>;
export type MeetingQuestion = typeof meetingQuestions.$inferSelect;

export type InsertMeetingPainPoint = z.infer<typeof insertMeetingPainPointSchema>;
export type MeetingPainPoint = typeof meetingPainPoints.$inferSelect;

export type InsertMeetingFollowUp = z.infer<typeof insertMeetingFollowUpSchema>;
export type MeetingFollowUp = typeof meetingFollowUps.$inferSelect;

export type InsertSalesPoints = z.infer<typeof insertSalesPointsSchema>;
export type SalesPoints = typeof salesPoints.$inferSelect;

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

export type InsertSalesTarget = z.infer<typeof insertSalesTargetSchema>;
export type SalesTarget = typeof salesTargets.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Enhanced Lead Types
export type InsertLeadScoringRule = z.infer<typeof insertLeadScoringRuleSchema>;
export type LeadScoringRule = typeof leadScoringRules.$inferSelect;

export type InsertLeadNurtureSequence = z.infer<typeof insertLeadNurtureSequenceSchema>;
export type LeadNurtureSequence = typeof leadNurtureSequences.$inferSelect;

export type InsertLeadActivityLog = z.infer<typeof insertLeadActivityLogSchema>;
export type LeadActivityLog = typeof leadActivityLog.$inferSelect;

export type InsertLeadDuplicate = z.infer<typeof insertLeadDuplicateSchema>;
export type LeadDuplicate = typeof leadDuplicates.$inferSelect;

export type InsertLeadAssignmentRule = z.infer<typeof insertLeadAssignmentRuleSchema>;
export type LeadAssignmentRule = typeof leadAssignmentRules.$inferSelect;
