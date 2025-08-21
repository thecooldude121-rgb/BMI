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
// Enhanced Activity Module Enums
export const activityTypeEnum = pgEnum('activity_type', ['task', 'call', 'meeting', 'email', 'sms', 'whatsapp', 'note', 'linkedin', 'demo', 'proposal', 'follow_up', 'presentation', 'training', 'webinar', 'custom']);
export const activityStatusEnum = pgEnum('activity_status', ['open', 'in_progress', 'completed', 'overdue', 'cancelled', 'on_hold', 'recurring']);
export const activityPriorityEnum = pgEnum('activity_priority', ['low', 'medium', 'high', 'urgent', 'critical']);
export const activityRecurrenceEnum = pgEnum('activity_recurrence', ['none', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']);
export const activityOutcomeEnum = pgEnum('activity_outcome', ['successful', 'no_answer', 'voicemail', 'busy', 'wrong_number', 'bounced', 'unsubscribed', 'interested', 'not_interested', 'rescheduled', 'completed', 'partial', 'cancelled']);
export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive', 'terminated', 'on_leave', 'suspended']);
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

// AI Growth Recommendations enums
export const recommendationTypeEnum = pgEnum('recommendation_type', ['upsell', 'cross_sell', 'expansion', 'retention', 'engagement', 'pricing', 'contract_renewal', 'product_adoption']);
export const recommendationPriorityEnum = pgEnum('recommendation_priority', ['low', 'medium', 'high', 'critical']);
export const recommendationStatusEnum = pgEnum('recommendation_status', ['pending', 'in_review', 'approved', 'implemented', 'rejected', 'expired']);

// Gamification enums
export const gamificationActionTypeEnum = pgEnum('gamification_action_type', ['lead_created', 'lead_qualified', 'deal_created', 'deal_won', 'deal_lost', 'activity_completed', 'call_made', 'email_sent', 'meeting_scheduled', 'task_completed', 'note_added', 'contact_created', 'account_created', 'daily_login', 'weekly_streak', 'monthly_goal', 'training_completed', 'profile_updated', 'team_collaboration', 'peer_recognition', 'challenge_completed']);
export const badgeTypeEnum = pgEnum('badge_type', ['achievement', 'milestone', 'skill', 'social', 'streak', 'competition', 'leadership', 'learning']);
export const challengeTypeEnum = pgEnum('challenge_type', ['individual', 'team', 'company_wide', 'department']);
export const challengeStatusEnum = pgEnum('challenge_status', ['draft', 'active', 'paused', 'completed', 'cancelled']);
export const challengeDifficultyEnum = pgEnum('challenge_difficulty', ['easy', 'medium', 'hard', 'expert']);
export const rewardTypeEnum = pgEnum('reward_type', ['points', 'badge', 'certificate', 'physical_item', 'experience', 'privilege', 'recognition']);
export const rewardStatusEnum = pgEnum('reward_status', ['available', 'claimed', 'redeemed', 'expired']);
export const recognitionTypeEnum = pgEnum('recognition_type', ['kudos', 'thanks', 'high_five', 'appreciation', 'nomination', 'testimonial']);

// AI Lead Generation specific enums
export const prospectingCampaignStatusEnum = pgEnum('prospecting_campaign_status', ['draft', 'active', 'paused', 'completed', 'failed']);
export const leadEnrichmentStatusEnum = pgEnum('lead_enrichment_status', ['pending', 'processing', 'completed', 'failed', 'partial']);
export const dataSourceEnum = pgEnum('data_source', ['linkedin', 'hunter_io', 'apollo_io', 'zoominfo', 'clearbit', 'fullcontact', 'peopledatalabs', 'web_scraping', 'manual', 'api_import']);
export const intentSignalTypeEnum = pgEnum('intent_signal_type', ['job_posting', 'funding_round', 'tech_stack_change', 'website_change', 'content_engagement', 'competitor_mention', 'hiring_activity', 'product_launch', 'market_expansion', 'compliance_change']);
export const engagementTypeEnum = pgEnum('engagement_type', ['email_open', 'email_click', 'website_visit', 'content_download', 'webinar_attendance', 'demo_request', 'pricing_page_visit', 'linkedin_interaction', 'social_share']);
export const sequenceStatusEnum = pgEnum('sequence_status', ['active', 'paused', 'completed', 'cancelled', 'bounced']);
export const abTestStatusEnum = pgEnum('ab_test_status', ['draft', 'running', 'paused', 'completed', 'analysing']);
export const complianceStatusEnum = pgEnum('compliance_status', ['compliant', 'opt_out', 'gdpr_request', 'ccpa_request', 'pending_deletion', 'deleted']);
export const leadScoringModelEnum = pgEnum('lead_scoring_model', ['demographic', 'behavioral', 'predictive', 'intent_based', 'engagement', 'hybrid']);
export const personalizedContentTypeEnum = pgEnum('personalized_content_type', ['email_subject', 'email_body', 'linkedin_message', 'cold_call_script', 'meeting_agenda', 'proposal_template']);

// Dashboard Widget System Enums
export const widgetTypeEnum = pgEnum('widget_type', ['stats', 'chart', 'recent_activities', 'pipeline', 'leaderboard', 'calendar', 'tasks', 'notes', 'weather', 'news', 'team_performance', 'deal_forecast', 'lead_sources', 'revenue_trend', 'activity_heatmap', 'goal_progress']);
export const widgetSizeEnum = pgEnum('widget_size', ['small', 'medium', 'large', 'extra_large']);
export const chartTypeEnum = pgEnum('chart_type', ['line', 'bar', 'pie', 'doughnut', 'area', 'scatter', 'radar']);
export const timeRangeEnum = pgEnum('time_range', ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_quarter', 'last_quarter', 'this_year', 'last_year', 'custom']);

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

// Enhanced contact persona and role enums
export const contactPersonaEnum = pgEnum("contact_persona", ["decision_maker", "champion", "influencer", "gatekeeper", "end_user", "technical_buyer", "economic_buyer"]);
export const engagementStatusEnum = pgEnum("engagement_status", ["active", "at_risk", "do_not_contact", "recently_engaged", "dormant", "unresponsive"]);
export const preferredChannelEnum = pgEnum("preferred_channel", ["email", "phone", "linkedin", "whatsapp", "sms", "in_person", "video_call"]);

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.id),
  
  // Core contact information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  mobile: text("mobile"),
  workPhone: text("work_phone"),
  personalEmail: text("personal_email"),
  
  // Professional information
  position: text("position"),
  title: text("title"),
  department: text("department"),
  reportingManager: text("reporting_manager"),
  directReports: jsonb("direct_reports"), // Array of contact IDs
  
  // Contact details and preferences
  location: text("location"),
  timezone: text("timezone"),
  bestContactTime: text("best_contact_time"),
  preferredChannel: preferredChannelEnum("preferred_channel").default('email'),
  languagePreference: text("language_preference").default('en'),
  
  // Social and digital presence
  linkedinUrl: text("linkedin_url"),
  twitterHandle: text("twitter_handle"),
  facebookUrl: text("facebook_url"),
  personalWebsite: text("personal_website"),
  
  // Relationship and engagement
  isPrimary: boolean("is_primary").default(false),
  status: contactStatusEnum("status").default('active'),
  engagementStatus: engagementStatusEnum("engagement_status").default('active'),
  relationshipScore: integer("relationship_score").default(50), // 0-100 AI-powered score
  lastTouchDate: timestamp("last_touch_date"),
  lastResponseDate: timestamp("last_response_date"),
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default('0'), // Percentage
  
  // Role and influence
  persona: contactPersonaEnum("persona").default('influencer'),
  influenceLevel: integer("influence_level").default(5), // 1-10 scale
  decisionMakingPower: integer("decision_making_power").default(5), // 1-10 scale
  
  // Contact assignment and ownership
  ownerId: uuid("owner_id").references(() => users.id),
  backupOwnerId: uuid("backup_owner_id").references(() => users.id),
  teamVisibility: text("team_visibility").default('team'), // private, team, company
  
  // Personal and biographical information
  birthday: timestamp("birthday"),
  anniversary: timestamp("anniversary"),
  interests: jsonb("interests"), // Array of interests
  personalNotes: text("personal_notes"),
  familyInfo: jsonb("family_info"),
  
  // Contact intelligence and scoring
  aiInsights: jsonb("ai_insights"),
  behavioralProfile: jsonb("behavioral_profile"),
  communicationStyle: text("communication_style"), // formal, casual, brief, detailed
  
  // Engagement metrics
  emailOpens: integer("email_opens").default(0),
  emailClicks: integer("email_clicks").default(0),
  meetingsAttended: integer("meetings_attended").default(0),
  callsAnswered: integer("calls_answered").default(0),
  
  // Tags and categorization
  tags: jsonb("tags"), // Array of tags
  customFields: jsonb("custom_fields"),
  segments: jsonb("segments"), // Array of segments
  
  // Data enrichment
  enrichmentStatus: text("enrichment_status").default('pending'),
  enrichmentData: jsonb("enrichment_data"),
  dataSource: text("data_source").default('manual'), // manual, import, api, enrichment
  dataQualityScore: integer("data_quality_score").default(50), // 0-100
  
  // Compliance and privacy
  gdprConsent: boolean("gdpr_consent").default(false),
  emailOptIn: boolean("email_opt_in").default(false),
  smsOptIn: boolean("sms_opt_in").default(false),
  marketingConsent: boolean("marketing_consent").default(false),
  dataProcessingConsent: jsonb("data_processing_consent"),
  unsubscribeDate: timestamp("unsubscribe_date"),
  doNotContactReason: text("do_not_contact_reason"),
  
  // File attachments and documents
  profilePhoto: text("profile_photo"),
  businessCard: text("business_card"),
  documents: jsonb("documents"), // Array of document metadata
  
  // Activity tracking
  lastActivityDate: timestamp("last_activity_date"),
  lastActivityType: text("last_activity_type"),
  totalActivities: integer("total_activities").default(0),
  
  // Audit and history
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
  lastModifiedBy: uuid("last_modified_by").references(() => users.id),
  changeLog: jsonb("change_log"), // Array of changes with timestamps
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

export const activities: any = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: text("subject").notNull(),
  type: activityTypeEnum("type").notNull(),
  direction: text("direction").notNull().default('outbound'), // inbound, outbound
  status: activityStatusEnum("status").notNull().default('open'),
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
  
  // Enhanced Activity Module Fields
  recurrence: activityRecurrenceEnum("recurrence").default('none'),
  recurrenceRule: text("recurrence_rule"), // JSON string for complex recurrence patterns
  parentActivityId: uuid("parent_activity_id"), // For recurring activities
  nextAction: text("next_action"), // AI-suggested next best action
  attachments: jsonb("attachments"), // Array of attachment objects
  tags: text("tags").array(), // Activity tags
  followers: text("followers").array(), // Array of user IDs following this activity
  externalId: text("external_id"), // For integration with external systems
  source: text("source").default('manual'), // manual, email, calendar, integration
  confidence: integer("confidence"), // AI confidence score for automated activities
  automationTriggered: boolean("automation_triggered").default(false),
  reminderSent: boolean("reminder_sent").default(false),
  lastReminderAt: timestamp("last_reminder_at"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Activity Comments and Collaboration
export const activityComments = pgTable("activity_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  mentions: text("mentions").array(), // Array of user IDs mentioned in comment
  isInternal: boolean("is_internal").default(true), // Internal team comment vs client-visible
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Activity Audit Log
export const activityAuditLog = pgTable("activity_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // created, updated, completed, deleted, assigned, etc.
  oldValues: jsonb("old_values"), // Previous field values
  newValues: jsonb("new_values"), // New field values
  changedFields: text("changed_fields").array(), // Array of field names that changed
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Activity Templates for automation
export const activityTemplates = pgTable("activity_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: activityTypeEnum("type").notNull(),
  description: text("description"),
  subjectTemplate: text("subject_template").notNull(),
  descriptionTemplate: text("description_template"),
  priority: activityPriorityEnum("priority").default('medium'),
  estimatedDuration: integer("estimated_duration"), // in minutes
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true),
  createdBy: uuid("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

// AI Growth Recommendations Table
export const growthRecommendations = pgTable("growth_recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").notNull().references(() => accounts.id),
  type: recommendationTypeEnum("type").notNull(),
  priority: recommendationPriorityEnum("priority").notNull().default('medium'),
  status: recommendationStatusEnum("status").notNull().default('pending'),
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  rationale: text("rationale").notNull(),
  
  // AI Analysis Data
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0-100% confidence
  potentialRevenue: decimal("potential_revenue", { precision: 15, scale: 2 }),
  estimatedTimeframe: text("estimated_timeframe"), // e.g., "3-6 months"
  requiredActions: jsonb("required_actions"), // Array of action items
  
  // Implementation tracking
  implementedAt: timestamp("implemented_at"),
  implementedBy: uuid("implemented_by").references(() => users.id),
  actualRevenue: decimal("actual_revenue", { precision: 15, scale: 2 }),
  actualTimeframe: text("actual_timeframe"),
  
  // AI insights
  aiInsights: jsonb("ai_insights"), // Detailed AI analysis
  marketTrends: jsonb("market_trends"), // Relevant market data
  competitorAnalysis: jsonb("competitor_analysis"),
  
  // Metadata
  expiresAt: timestamp("expires_at"),
  createdBy: uuid("created_by").references(() => users.id),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  
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

export const insertGrowthRecommendationSchema = createInsertSchema(growthRecommendations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export type GrowthRecommendation = typeof growthRecommendations.$inferSelect;
export type InsertGrowthRecommendation = z.infer<typeof insertGrowthRecommendationSchema>;

// Enhanced Gamification Tables
export const gamificationActions = pgTable("gamification_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  actionType: gamificationActionTypeEnum("action_type").notNull(),
  targetEntity: text("target_entity"), // leads, deals, contacts, accounts, activities
  entityId: uuid("entity_id"),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  points: integer("points").notNull().default(0),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default('1.00'),
  context: jsonb("context"), // Additional action metadata
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  processed: boolean("processed").notNull().default(false),
  challengeId: uuid("challenge_id").references(() => gamificationChallenges.id),
  teamId: uuid("team_id")
});

export const gamificationBadges = pgTable("gamification_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  badgeType: badgeTypeEnum("badge_type").notNull(),
  criteria: jsonb("criteria").notNull(), // Conditions for earning the badge
  iconUrl: text("icon_url"),
  iconColor: text("icon_color").default('#3B82F6'),
  points: integer("points").notNull().default(0),
  rarity: text("rarity").default('common'), // common, rare, epic, legendary
  isActive: boolean("is_active").notNull().default(true),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const userGamificationProfiles = pgTable("user_gamification_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalXP: integer("total_xp").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  levelProgress: decimal("level_progress", { precision: 5, scale: 2 }).default('0.00'),
  totalBadges: integer("total_badges").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastActiveDate: timestamp("last_active_date"),
  leaderboardRank: integer("leaderboard_rank"),
  teamId: uuid("team_id"),
  title: text("title").default('Newcomer'),
  bio: text("bio"),
  preferences: jsonb("preferences").default('{}'),
  achievements: jsonb("achievements").default('[]'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const userBadgeEarnings = pgTable("user_badge_earnings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: uuid("badge_id").notNull().references(() => gamificationBadges.id, { onDelete: 'cascade' }),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  context: jsonb("context"), // How it was earned
  notified: boolean("notified").notNull().default(false),
  displayOrder: integer("display_order").default(0)
});

export const gamificationChallenges = pgTable("gamification_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  challengeType: challengeTypeEnum("challenge_type").notNull(),
  status: challengeStatusEnum("status").notNull().default('draft'),
  difficulty: challengeDifficultyEnum("difficulty").notNull().default('medium'),
  goal: jsonb("goal").notNull(), // Target metrics and conditions
  progress: jsonb("progress").default('{}'), // Current progress tracking
  rewards: jsonb("rewards").default('[]'), // Points, badges, items
  participants: jsonb("participants").default('[]'), // User/team IDs
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  teamId: uuid("team_id"),
  departmentId: uuid("department_id"),
  isPublic: boolean("is_public").notNull().default(true),
  maxParticipants: integer("max_participants"),
  autoEnroll: boolean("auto_enroll").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  challengeId: uuid("challenge_id").notNull().references(() => gamificationChallenges.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  teamId: uuid("team_id"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  progress: jsonb("progress").default('{}'),
  currentRank: integer("current_rank"),
  status: text("status").default('active'), // active, completed, dropped_out
  completedAt: timestamp("completed_at"),
  finalScore: integer("final_score").default(0)
});

export const gamificationRewards = pgTable("gamification_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rewardType: rewardTypeEnum("reward_type").notNull(),
  cost: integer("cost").notNull(), // XP cost
  value: text("value"), // Monetary or practical value
  imageUrl: text("image_url"),
  category: text("category"),
  stock: integer("stock").default(-1), // -1 for unlimited
  isActive: boolean("is_active").notNull().default(true),
  requirements: jsonb("requirements").default('{}'), // Level, badges required
  expiresAfter: integer("expires_after"), // Days after claiming
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const userRewardClaims = pgTable("user_reward_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rewardId: uuid("reward_id").notNull().references(() => gamificationRewards.id, { onDelete: 'cascade' }),
  status: rewardStatusEnum("status").notNull().default('claimed'),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
  redeemedAt: timestamp("redeemed_at"),
  expiresAt: timestamp("expires_at"),
  notes: text("notes"),
  adminNotes: text("admin_notes")
});

export const peerRecognitions = pgTable("peer_recognitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromUserId: uuid("from_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: uuid("to_user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  recognitionType: recognitionTypeEnum("recognition_type").notNull(),
  message: text("message").notNull(),
  points: integer("points").notNull().default(5),
  isPublic: boolean("is_public").notNull().default(true),
  context: jsonb("context"), // Related CRM entity
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at")
});

export const gamificationLeaderboards = pgTable("gamification_leaderboards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // weekly, monthly, quarterly, yearly, all_time
  metric: text("metric").notNull(), // xp, badges, deals_won, activities_completed
  period: text("period").notNull(), // current, previous
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  rankings: jsonb("rankings").default('[]'),
  isActive: boolean("is_active").notNull().default(true),
  teamId: uuid("team_id"),
  departmentId: uuid("department_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const gamificationStreaks = pgTable("gamification_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  streakType: text("streak_type").notNull(), // daily_login, activity_completion, deal_creation
  currentCount: integer("current_count").notNull().default(0),
  longestCount: integer("longest_count").notNull().default(0),
  lastActivityDate: timestamp("last_activity_date"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
  metadata: jsonb("metadata").default('{}')
});

export const gamificationNotifications = pgTable("gamification_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // badge_earned, level_up, challenge_complete, streak_milestone
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").default('{}'),
  isRead: boolean("is_read").notNull().default(false),
  priority: text("priority").default('normal'), // low, normal, high, urgent
  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at")
});

// Dashboard Widget System Tables
export const dashboardWidgets = pgTable("dashboard_widgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  widgetType: widgetTypeEnum("widget_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  size: widgetSizeEnum("size").notNull().default('medium'),
  position: jsonb("position").notNull(), // { x: number, y: number, w: number, h: number }
  configuration: jsonb("configuration").default('{}'), // Widget-specific settings
  dataSource: text("data_source"), // API endpoint or data query
  refreshInterval: integer("refresh_interval").default(300), // seconds
  isVisible: boolean("is_visible").notNull().default(true),
  isMovable: boolean("is_movable").notNull().default(true),
  isResizable: boolean("is_resizable").notNull().default(true),
  minWidth: integer("min_width").default(2),
  minHeight: integer("min_height").default(2),
  maxWidth: integer("max_width").default(12),
  maxHeight: integer("max_height").default(12),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  layout: jsonb("layout").notNull(), // Grid layout configuration
  isDefault: boolean("is_default").notNull().default(false),
  isShared: boolean("is_shared").notNull().default(false),
  sharedWith: jsonb("shared_with").default('[]'), // Array of user IDs
  theme: text("theme").default('light'), // light, dark, auto
  gridCols: integer("grid_cols").default(12),
  gridRows: integer("grid_rows").default(12),
  compactMode: boolean("compact_mode").default(false),
  autoSave: boolean("auto_save").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const widgetTemplates = pgTable("widget_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  widgetType: widgetTypeEnum("widget_type").notNull(),
  category: text("category").notNull(), // analytics, productivity, communication
  icon: text("icon"),
  preview: text("preview"), // Screenshot or preview URL
  defaultConfig: jsonb("default_config").notNull(),
  defaultSize: widgetSizeEnum("default_size").default('medium'),
  supportedSizes: jsonb("supported_sizes").default('["small", "medium", "large"]'),
  dataRequirements: jsonb("data_requirements").default('{}'),
  permissions: jsonb("permissions").default('{}'), // Required user permissions
  isPublic: boolean("is_public").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  version: text("version").default('1.0.0'),
  author: text("author"),
  tags: jsonb("tags").default('[]'),
  rating: text("rating").default('0.00'),
  installCount: integer("install_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const widgetData = pgTable("widget_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  widgetId: uuid("widget_id").notNull().references(() => dashboardWidgets.id, { onDelete: 'cascade' }),
  dataKey: text("data_key").notNull(),
  dataValue: jsonb("data_value").notNull(),
  metadata: jsonb("metadata").default('{}'),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const widgetSharing = pgTable("widget_sharing", {
  id: uuid("id").primaryKey().defaultRandom(),
  widgetId: uuid("widget_id").notNull().references(() => dashboardWidgets.id, { onDelete: 'cascade' }),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  sharedWithId: uuid("shared_with_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  permissions: jsonb("permissions").default('{"view": true, "edit": false, "share": false}'),
  message: text("message"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Schema exports for gamification
export const insertGamificationActionSchema = createInsertSchema(gamificationActions);
export const insertGamificationBadgeSchema = createInsertSchema(gamificationBadges);
export const insertUserGamificationProfileSchema = createInsertSchema(userGamificationProfiles);
export const insertUserBadgeEarningSchema = createInsertSchema(userBadgeEarnings);
export const insertGamificationChallengeSchema = createInsertSchema(gamificationChallenges);
export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants);
export const insertGamificationRewardSchema = createInsertSchema(gamificationRewards);
export const insertUserRewardClaimSchema = createInsertSchema(userRewardClaims);
export const insertPeerRecognitionSchema = createInsertSchema(peerRecognitions);
export const insertGamificationLeaderboardSchema = createInsertSchema(gamificationLeaderboards);
export const insertGamificationStreakSchema = createInsertSchema(gamificationStreaks);
export const insertGamificationNotificationSchema = createInsertSchema(gamificationNotifications);



// Types
export type GamificationAction = typeof gamificationActions.$inferSelect;
export type InsertGamificationAction = z.infer<typeof insertGamificationActionSchema>;

export type GamificationBadge = typeof gamificationBadges.$inferSelect;
export type InsertGamificationBadge = z.infer<typeof insertGamificationBadgeSchema>;

export type UserGamificationProfile = typeof userGamificationProfiles.$inferSelect;
export type InsertUserGamificationProfile = z.infer<typeof insertUserGamificationProfileSchema>;

export type UserBadgeEarning = typeof userBadgeEarnings.$inferSelect;
export type InsertUserBadgeEarning = z.infer<typeof insertUserBadgeEarningSchema>;

export type GamificationChallenge = typeof gamificationChallenges.$inferSelect;
export type InsertGamificationChallenge = z.infer<typeof insertGamificationChallengeSchema>;

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;

export type GamificationReward = typeof gamificationRewards.$inferSelect;
export type InsertGamificationReward = z.infer<typeof insertGamificationRewardSchema>;

export type UserRewardClaim = typeof userRewardClaims.$inferSelect;
export type InsertUserRewardClaim = z.infer<typeof insertUserRewardClaimSchema>;

export type PeerRecognition = typeof peerRecognitions.$inferSelect;
export type InsertPeerRecognition = z.infer<typeof insertPeerRecognitionSchema>;

export type GamificationLeaderboard = typeof gamificationLeaderboards.$inferSelect;
export type InsertGamificationLeaderboard = z.infer<typeof insertGamificationLeaderboardSchema>;

export type GamificationStreak = typeof gamificationStreaks.$inferSelect;
export type InsertGamificationStreak = z.infer<typeof insertGamificationStreakSchema>;

export type GamificationNotification = typeof gamificationNotifications.$inferSelect;
export type InsertGamificationNotification = z.infer<typeof insertGamificationNotificationSchema>;



// HRMS Module - Comprehensive AI-Powered Employee Lifecycle Management System

// Employee Status and Role Enums
export const employmentTypeEnum = pgEnum('employment_type', ['full_time', 'part_time', 'contract', 'temporary', 'intern', 'freelance', 'consultant']);
export const departmentEnum = pgEnum('department', ['hr', 'engineering', 'sales', 'marketing', 'finance', 'operations', 'support', 'design', 'legal', 'product', 'executive', 'research', 'quality_assurance', 'security']);
export const leaveTypeEnum = pgEnum('leave_type', ['annual', 'sick', 'maternity', 'paternity', 'personal', 'bereavement', 'study', 'unpaid', 'sabbatical', 'medical', 'mental_health', 'family_emergency']);
export const leaveStatusEnum = pgEnum('leave_status', ['pending', 'approved', 'rejected', 'cancelled', 'in_review', 'expired']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late', 'partial', 'work_from_home', 'sick_leave', 'vacation', 'business_trip']);
export const performanceRatingEnum = pgEnum('performance_rating', ['exceptional', 'exceeds_expectations', 'meets_expectations', 'below_expectations', 'unsatisfactory', 'not_rated']);

// AI-Powered HRMS Enums
export const onboardingStageEnum = pgEnum('onboarding_stage', ['pre_boarding', 'documentation', 'orientation', 'training', 'probation', 'completed', 'delayed']);
export const offboardingStageEnum = pgEnum('offboarding_stage', ['initiated', 'handover', 'asset_return', 'exit_interview', 'final_settlement', 'completed']);
export const skillLevelEnum = pgEnum('skill_level', ['beginner', 'intermediate', 'advanced', 'expert', 'master']);
export const learningStatusEnum = pgEnum('learning_status', ['not_started', 'in_progress', 'completed', 'certified', 'expired', 'failed']);
export const assessmentTypeEnum = pgEnum('assessment_type', ['technical', 'behavioral', 'leadership', 'cultural_fit', 'performance', 'skill_gap']);
export const recruitmentStageEnum = pgEnum('recruitment_stage', ['applied', 'screening', 'interview', 'assessment', 'reference_check', 'offer', 'hired', 'rejected']);
export const payrollStatusEnum = pgEnum('payroll_status', ['draft', 'calculated', 'approved', 'processed', 'paid', 'error']);
// Compliance status enum already defined above - removed duplicate
export const aiInsightTypeEnum = pgEnum('ai_insight_type', ['performance_prediction', 'retention_risk', 'skill_gap', 'training_recommendation', 'career_path', 'workload_analysis', 'team_dynamics']);
export const workflowStatusEnum = pgEnum('workflow_status', ['pending', 'in_progress', 'completed', 'rejected', 'cancelled', 'escalated']);
export const communicationChannelEnum = pgEnum('communication_channel', ['email', 'slack', 'teams', 'sms', 'push_notification', 'in_app', 'voice']);
export const documentTypeEnum = pgEnum('document_type', ['contract', 'policy', 'handbook', 'certificate', 'form', 'report', 'legal', 'personal']);
export const integrationTypeEnum = pgEnum('integration_type', ['payroll', 'benefits', 'learning', 'communication', 'compliance', 'analytics', 'recruitment']);
export const feedbackTypeEnum = pgEnum('feedback_type', ['performance', 'peer', 'manager', 'self', 'customer', 'exit', 'continuous']);
export const wellnessMetricEnum = pgEnum('wellness_metric', ['stress_level', 'work_life_balance', 'job_satisfaction', 'burnout_risk', 'engagement_score']);
export const goalTypeEnum = pgEnum('goal_type', ['performance', 'learning', 'career', 'project', 'team', 'personal']);
export const goalStatusEnum = pgEnum('goal_status', ['draft', 'active', 'in_progress', 'completed', 'overdue', 'cancelled']);
export const mentorshipStatusEnum = pgEnum('mentorship_status', ['active', 'completed', 'paused', 'cancelled', 'pending_match']);
export const migrationStatusEnum = pgEnum('migration_status', ['pending', 'in_progress', 'completed', 'failed', 'rollback']);
export const auditActionEnum = pgEnum('audit_action', ['create', 'update', 'delete', 'view', 'export', 'import', 'approve', 'reject']);
export const alertSeverityEnum = pgEnum('alert_severity', ['low', 'medium', 'high', 'critical', 'urgent']);
export const tenantStatusEnum = pgEnum('tenant_status', ['active', 'inactive', 'trial', 'suspended', 'churned']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['basic', 'professional', 'enterprise', 'unlimited']);

// ===============================
// AI-POWERED HRMS COMPREHENSIVE SCHEMA
// ===============================

// 1. CORE EMPLOYEE LIFECYCLE MANAGEMENT

// Enhanced Employee Table with AI-powered features
export const employees: any = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: text("employee_id").notNull().unique(), // EMP001, EMP002, etc.
  userId: uuid("user_id").references(() => users.id), // Link to auth user
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  nationality: text("nationality"),
  maritalStatus: text("marital_status"),
  
  // Address Information
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country").default("US"),
  
  // Employment Details
  department: departmentEnum("department").notNull(),
  position: text("position").notNull(),
  jobTitle: text("job_title").notNull(),
  employmentType: employmentTypeEnum("employment_type").notNull().default('full_time'),
  hireDate: timestamp("hire_date").notNull(),
  probationEndDate: timestamp("probation_end_date"),
  terminationDate: timestamp("termination_date"),
  status: employeeStatusEnum("status").notNull().default('active'),
  
  // Reporting Structure
  managerId: uuid("manager_id").references(() => employees.id),
  workLocation: text("work_location").notNull().default('office'), // office, remote, hybrid
  timeZone: text("time_zone").default('UTC'),
  
  // Compensation
  salary: decimal("salary", { precision: 15, scale: 2 }),
  currency: text("currency").default('USD'),
  payFrequency: text("pay_frequency").default('monthly'), // weekly, bi-weekly, monthly
  overtimeEligible: boolean("overtime_eligible").default(false),
  
  // Leave Balances
  annualLeaveBalance: decimal("annual_leave_balance", { precision: 5, scale: 2 }).default('25.0'),
  sickLeaveBalance: decimal("sick_leave_balance", { precision: 5, scale: 2 }).default('10.0'),
  personalLeaveBalance: decimal("personal_leave_balance", { precision: 5, scale: 2 }).default('5.0'),
  
  // Emergency Contact
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  
  // AI-Powered Analytics
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }), // 0-100
  engagementScore: decimal("engagement_score", { precision: 5, scale: 2 }), // 0-100
  retentionRisk: decimal("retention_risk", { precision: 5, scale: 2 }), // 0-100
  skillGapScore: decimal("skill_gap_score", { precision: 5, scale: 2 }), // 0-100
  workloadIndex: decimal("workload_index", { precision: 5, scale: 2 }), // 0-100
  wellnessScore: decimal("wellness_score", { precision: 5, scale: 2 }), // 0-100
  
  // Profile Information
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  skills: jsonb("skills"), // Array of skills with proficiency levels
  languages: jsonb("languages"), // Array of languages with proficiency
  certifications: jsonb("certifications"), // Array of certifications
  socialLinks: jsonb("social_links"), // LinkedIn, GitHub, etc.
  
  // Preferences
  communicationPreference: communicationChannelEnum("communication_preference").default('email'),
  workingHours: jsonb("working_hours"), // Flexible working hours
  notifications: jsonb("notifications"), // Notification preferences
  accessibility: jsonb("accessibility"), // Accessibility requirements
  
  // Multi-tenant Support
  tenantId: uuid("tenant_id"),
  
  // Metadata
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
});

// 2. AI-POWERED ONBOARDING MODULE
export const onboardingProcesses = pgTable("onboarding_processes", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  stage: onboardingStageEnum("stage").notNull().default('pre_boarding'),
  startDate: timestamp("start_date").notNull(),
  expectedCompletionDate: timestamp("expected_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  
  // AI-powered personalization
  personalizedPlan: jsonb("personalized_plan"), // AI-generated onboarding plan
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'), // 0-100%
  automatedTasks: jsonb("automated_tasks"), // AI-generated task list
  
  // Buddy/Mentor Assignment
  buddyId: uuid("buddy_id").references(() => employees.id),
  mentorId: uuid("mentor_id").references(() => employees.id),
  
  // Feedback and Experience
  satisfactionScore: decimal("satisfaction_score", { precision: 3, scale: 2 }), // 1-5
  feedback: text("feedback"),
  improvementSuggestions: text("improvement_suggestions"),
  
  // Resources and Documents
  documentsCompleted: jsonb("documents_completed"),
  trainingModulesCompleted: jsonb("training_modules_completed"),
  systemAccessProvided: jsonb("system_access_provided"),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 3. AI-POWERED RECRUITMENT MODULE
export const jobPostings = pgTable("job_postings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  department: departmentEnum("department").notNull(),
  employmentType: employmentTypeEnum("employment_type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements"), // Skills, experience, education
  responsibilities: jsonb("responsibilities"),
  
  // AI-enhanced features
  aiGeneratedDescription: text("ai_generated_description"),
  skillsExtracted: jsonb("skills_extracted"), // AI-extracted skills
  salaryRange: jsonb("salary_range"), // min/max with AI suggestions
  diversityTargets: jsonb("diversity_targets"), // AI-powered diversity goals
  
  // Posting Configuration
  isActive: boolean("is_active").default(true),
  applicationDeadline: timestamp("application_deadline"),
  hiringManagerId: uuid("hiring_manager_id").references(() => employees.id),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  applicationCount: integer("application_count").default(0),
  qualifiedCandidateCount: integer("qualified_candidate_count").default(0),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobPostingId: uuid("job_posting_id").references(() => jobPostings.id).notNull(),
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  
  // Application Data
  resumeUrl: text("resume_url"),
  coverLetterUrl: text("cover_letter_url"),
  portfolioUrl: text("portfolio_url"),
  linkedinUrl: text("linkedin_url"),
  
  // AI-powered Analysis
  aiScore: decimal("ai_score", { precision: 5, scale: 2 }), // 0-100 AI compatibility score
  skillsMatched: jsonb("skills_matched"), // AI-matched skills
  experienceScore: decimal("experience_score", { precision: 5, scale: 2 }),
  culturalFitScore: decimal("cultural_fit_score", { precision: 5, scale: 2 }),
  
  // Recruitment Pipeline
  stage: recruitmentStageEnum("stage").notNull().default('applied'),
  status: text("status").default('active'), // active, rejected, hired, withdrawn
  
  // Interview Process
  interviews: jsonb("interviews"), // Array of interview records
  assessmentResults: jsonb("assessment_results"), // Technical/behavioral assessments
  referenceChecks: jsonb("reference_checks"),
  
  // Decision Making
  rating: decimal("rating", { precision: 3, scale: 2 }), // 1-5 overall rating
  feedback: text("feedback"),
  rejectionReason: text("rejection_reason"),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 4. AI-POWERED PERFORMANCE MODULE
export const performanceReviews = pgTable("performance_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  reviewerId: uuid("reviewer_id").references(() => employees.id).notNull(),
  reviewPeriod: text("review_period").notNull(), // Q1-2024, Annual-2024, etc.
  reviewType: text("review_type").notNull(), // annual, quarterly, probation, project
  
  // Performance Metrics
  overallRating: performanceRatingEnum("overall_rating"),
  goals: jsonb("goals"), // Performance goals and achievements
  competencies: jsonb("competencies"), // Technical and behavioral competencies
  achievements: jsonb("achievements"), // Key accomplishments
  
  // AI-powered Insights
  aiInsights: jsonb("ai_insights"), // AI-generated performance insights
  improvementAreas: jsonb("improvement_areas"), // AI-identified areas for growth
  careerRecommendations: jsonb("career_recommendations"), // AI career path suggestions
  
  // Feedback
  managerFeedback: text("manager_feedback"),
  employeeSelfReview: text("employee_self_review"),
  peerFeedback: jsonb("peer_feedback"), // 360-degree feedback
  
  // Development Planning
  developmentGoals: jsonb("development_goals"),
  trainingRecommendations: jsonb("training_recommendations"),
  mentorshipNeeds: jsonb("mentorship_needs"),
  
  // Timeline
  reviewStartDate: timestamp("review_start_date"),
  reviewEndDate: timestamp("review_end_date"),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: uuid("approved_by").references(() => employees.id),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 5. AI-POWERED LEARNING & DEVELOPMENT MODULE
export const learningPaths = pgTable("learning_paths", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // technical, leadership, compliance, soft_skills
  level: skillLevelEnum("level").notNull(),
  
  // AI-powered personalization
  prerequisites: jsonb("prerequisites"), // Required skills/courses
  aiRecommendedFor: jsonb("ai_recommended_for"), // AI-recommended employee profiles
  adaptiveLearning: boolean("adaptive_learning").default(false),
  
  // Content Structure
  modules: jsonb("modules"), // Course modules and content
  estimatedDuration: integer("estimated_duration"), // in hours
  
  // Gamification
  points: integer("points").default(0),
  badges: jsonb("badges"), // Badges earned upon completion
  
  // Analytics
  enrollmentCount: integer("enrollment_count").default(0),
  completionRate: decimal("completion_rate", { precision: 5, scale: 2 }).default('0'),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  
  tenantId: uuid("tenant_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const learningEnrollments = pgTable("learning_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  learningPathId: uuid("learning_path_id").references(() => learningPaths.id).notNull(),
  
  // Progress Tracking
  status: learningStatusEnum("status").notNull().default('not_started'),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'), // 0-100%
  currentModule: text("current_module"),
  
  // AI-personalized Learning
  personalizedContent: jsonb("personalized_content"), // AI-customized content
  adaptivePacing: jsonb("adaptive_pacing"), // AI-adjusted learning pace
  aiCoachingInsights: jsonb("ai_coaching_insights"), // AI learning coach feedback
  
  // Completion Data
  startedAt: timestamp("started_at"),
  lastAccessedAt: timestamp("last_accessed_at"),
  completedAt: timestamp("completed_at"),
  certificateUrl: text("certificate_url"),
  
  // Feedback
  rating: decimal("rating", { precision: 3, scale: 2 }), // 1-5 course rating
  feedback: text("feedback"),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 6. AI-POWERED PAYROLL & COMPENSATION MODULE
export const payrollCycles = pgTable("payroll_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // "January 2024 Payroll"
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  payDate: timestamp("pay_date").notNull(),
  status: payrollStatusEnum("status").notNull().default('draft'),
  
  // AI-powered calculations
  aiCalculationSummary: jsonb("ai_calculation_summary"), // AI analysis of payroll
  anomaliesDetected: jsonb("anomalies_detected"), // AI-detected irregularities
  complianceChecks: jsonb("compliance_checks"), // AI compliance validation
  
  // Processing
  totalGrossPay: decimal("total_gross_pay", { precision: 15, scale: 2 }),
  totalDeductions: decimal("total_deductions", { precision: 15, scale: 2 }),
  totalNetPay: decimal("total_net_pay", { precision: 15, scale: 2 }),
  
  processedBy: uuid("processed_by").references(() => employees.id),
  processedAt: timestamp("processed_at"),
  approvedBy: uuid("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 7. AI-POWERED ANALYTICS & INSIGHTS MODULE
export const hrmsAnalytics = pgTable("hrms_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Analytics Configuration
  reportType: text("report_type").notNull(), // turnover, performance, engagement, diversity
  dataSource: jsonb("data_source"), // Tables and fields analyzed
  timeRange: jsonb("time_range"), // Start/end dates
  filters: jsonb("filters"), // Applied filters
  
  // AI-Generated Insights
  insights: jsonb("insights"), // AI-generated insights and patterns
  predictions: jsonb("predictions"), // AI predictions and forecasts
  recommendations: jsonb("recommendations"), // AI action recommendations
  trends: jsonb("trends"), // Identified trends and patterns
  
  // Report Data
  reportData: jsonb("report_data"), // Calculated metrics and data
  visualizations: jsonb("visualizations"), // Chart configurations
  
  // Metadata
  generatedBy: uuid("generated_by").references(() => employees.id),
  scheduledReport: boolean("scheduled_report").default(false),
  reportFrequency: text("report_frequency"), // daily, weekly, monthly
  lastRun: timestamp("last_run"),
  nextRun: timestamp("next_run"),
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 8. AI-POWERED INTEGRATION & API MODULE
export const systemIntegrations = pgTable("system_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: integrationTypeEnum("type").notNull(),
  provider: text("provider").notNull(), // ADP, Workday, BambooHR, etc.
  
  // Configuration
  apiEndpoint: text("api_endpoint"),
  authMethod: text("auth_method"), // oauth, api_key, basic_auth
  credentials: jsonb("credentials"), // Encrypted credentials
  configuration: jsonb("configuration"), // Integration-specific settings
  
  // AI-powered data mapping
  fieldMappings: jsonb("field_mappings"), // AI-suggested field mappings
  dataTransformations: jsonb("data_transformations"), // AI transformation rules
  validationRules: jsonb("validation_rules"), // AI-generated validation
  
  // Status and Monitoring
  isActive: boolean("is_active").default(false),
  lastSync: timestamp("last_sync"),
  syncFrequency: text("sync_frequency"), // realtime, hourly, daily
  syncStatus: text("sync_status"), // success, error, in_progress
  errorLog: jsonb("error_log"), // Integration errors and warnings
  
  // Performance Metrics
  totalRecordsSynced: integer("total_records_synced").default(0),
  averageSyncTime: decimal("average_sync_time", { precision: 8, scale: 2 }), // seconds
  successRate: decimal("success_rate", { precision: 5, scale: 2 }), // 0-100%
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 9. AI-POWERED MULTI-TENANT & MIGRATION MODULE
export const tenants = pgTable("tenants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  domain: text("domain"), // Custom domain
  
  // Subscription and Billing
  subscriptionTier: subscriptionTierEnum("subscription_tier").notNull().default('basic'),
  status: tenantStatusEnum("status").notNull().default('active'),
  billingEmail: text("billing_email").notNull(),
  
  // Features and Limits
  maxEmployees: integer("max_employees").default(50),
  featuresEnabled: jsonb("features_enabled"), // Array of enabled features
  apiRateLimit: integer("api_rate_limit").default(1000), // per hour
  
  // Customization
  branding: jsonb("branding"), // Logo, colors, themes
  localization: jsonb("localization"), // Language, timezone, currency
  customFields: jsonb("custom_fields"), // Tenant-specific custom fields
  
  // AI Configuration
  aiFeatures: jsonb("ai_features"), // Enabled AI features
  aiUsageQuota: integer("ai_usage_quota").default(1000), // Monthly AI requests
  aiUsageCount: integer("ai_usage_count").default(0),
  
  // Compliance and Security
  dataRetentionPolicy: jsonb("data_retention_policy"),
  securitySettings: jsonb("security_settings"),
  complianceFrameworks: text("compliance_frameworks").array(),
  
  // Analytics
  totalEmployees: integer("total_employees").default(0),
  totalUsers: integer("total_users").default(0),
  storageUsed: decimal("storage_used", { precision: 12, scale: 2 }).default('0'), // in GB
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dataMigrations = pgTable("data_migrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id").references(() => tenants.id).notNull(),
  
  // Migration Details
  sourceSystem: text("source_system").notNull(), // BambooHR, Workday, ADP, etc.
  migrationType: text("migration_type").notNull(), // full, incremental, selective
  
  // AI-powered migration planning
  aiMigrationPlan: jsonb("ai_migration_plan"), // AI-generated migration strategy
  fieldMappings: jsonb("field_mappings"), // AI-suggested field mappings
  dataTransformations: jsonb("data_transformations"), // AI transformation rules
  riskAssessment: jsonb("risk_assessment"), // AI-identified migration risks
  
  // Progress Tracking
  status: migrationStatusEnum("status").notNull().default('pending'),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'), // 0-100%
  currentStep: text("current_step"),
  
  // Data Statistics
  totalRecords: integer("total_records").default(0),
  migratedRecords: integer("migrated_records").default(0),
  failedRecords: integer("failed_records").default(0),
  
  // Timeline
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  estimatedDuration: integer("estimated_duration"), // in hours
  
  // Results
  migrationLog: jsonb("migration_log"), // Detailed migration log
  errorReport: jsonb("error_report"), // Failed records and errors
  validationReport: jsonb("validation_report"), // Post-migration validation
  
  // Rollback Information
  rollbackPlan: jsonb("rollback_plan"), // AI-generated rollback strategy
  canRollback: boolean("can_rollback").default(true),
  
  processedBy: uuid("processed_by").references(() => employees.id),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 10. EXISTING HRMS TABLES (Updated for compatibility)
// Note: Updating existing attendance and leave tables to work with new schema

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  type: leaveTypeEnum("type").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  daysRequested: decimal("days_requested", { precision: 5, scale: 2 }).notNull(),
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull().default('pending'),
  
  // Enhanced workflow
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  reviewedBy: uuid("reviewed_by").references(() => employees.id),
  reviewedAt: timestamp("reviewed_at"),
  approverComments: text("approver_comments"),
  
  // AI features
  aiRecommendation: text("ai_recommendation"), // AI approval recommendation
  workloadImpact: jsonb("workload_impact"), // AI workload analysis
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  date: timestamp("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  clockInTime: timestamp("clock_in_time"),
  clockOutTime: timestamp("clock_out_time"),
  totalHours: decimal("total_hours", { precision: 4, scale: 2 }),
  breakHours: decimal("break_hours", { precision: 4, scale: 2 }).default('0'),
  overtimeHours: decimal("overtime_hours", { precision: 4, scale: 2 }).default('0'),
  location: text("location"),
  
  // AI-powered features
  aiAnomalyDetection: jsonb("ai_anomaly_detection"), // AI-detected irregularities
  productivityScore: decimal("productivity_score", { precision: 5, scale: 2 }), // AI productivity rating
  
  notes: text("notes"),
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Training programs remain the same but with tenant support
export const trainingPrograms = pgTable("training_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // onboarding, compliance, skills, leadership
  duration: integer("duration"), // in hours
  
  // AI enhancements
  aiPersonalization: boolean("ai_personalization").default(false),
  adaptiveLearning: boolean("adaptive_learning").default(false),
  
  isActive: boolean("is_active").default(true),
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const trainingEnrollments = pgTable("training_enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  trainingProgramId: uuid("training_program_id").references(() => trainingPrograms.id).notNull(),
  status: learningStatusEnum("status").notNull().default('not_started'),
  progress: decimal("progress", { precision: 5, scale: 2 }).default('0'),
  completedAt: timestamp("completed_at"),
  
  // AI features
  personalizedPath: jsonb("personalized_path"), // AI-customized learning path
  aiCoaching: jsonb("ai_coaching"), // AI coaching insights
  
  tenantId: uuid("tenant_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ===============================
// AI-POWERED HRMS INSERT SCHEMAS & TYPES
// ===============================

// Insert Schemas for new HRMS tables
export const insertOnboardingProcessSchema = createInsertSchema(onboardingProcesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningEnrollmentSchema = createInsertSchema(learningEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayrollCycleSchema = createInsertSchema(payrollCycles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHrmsAnalyticsSchema = createInsertSchema(hrmsAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemIntegrationSchema = createInsertSchema(systemIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDataMigrationSchema = createInsertSchema(dataMigrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Updated insert schemas for existing tables
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPerformanceReviewSchema = createInsertSchema(performanceReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingEnrollmentSchema = createInsertSchema(trainingEnrollments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// AI-Powered HRMS Types
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type OnboardingProcess = typeof onboardingProcesses.$inferSelect;
export type InsertOnboardingProcess = z.infer<typeof insertOnboardingProcessSchema>;

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;

export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type InsertPerformanceReview = z.infer<typeof insertPerformanceReviewSchema>;

export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

export type LearningEnrollment = typeof learningEnrollments.$inferSelect;
export type InsertLearningEnrollment = z.infer<typeof insertLearningEnrollmentSchema>;

export type PayrollCycle = typeof payrollCycles.$inferSelect;
export type InsertPayrollCycle = z.infer<typeof insertPayrollCycleSchema>;

export type HrmsAnalytics = typeof hrmsAnalytics.$inferSelect;
export type InsertHrmsAnalytics = z.infer<typeof insertHrmsAnalyticsSchema>;

export type SystemIntegration = typeof systemIntegrations.$inferSelect;
export type InsertSystemIntegration = z.infer<typeof insertSystemIntegrationSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type DataMigration = typeof dataMigrations.$inferSelect;
export type InsertDataMigration = z.infer<typeof insertDataMigrationSchema>;

export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;

export type TrainingEnrollment = typeof trainingEnrollments.$inferSelect;
export type InsertTrainingEnrollment = z.infer<typeof insertTrainingEnrollmentSchema>;

// Dashboard Widget System Types and Schemas
export const insertDashboardWidgetSchema = createInsertSchema(dashboardWidgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDashboardLayoutSchema = createInsertSchema(dashboardLayouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWidgetTemplateSchema = createInsertSchema(widgetTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWidgetDataSchema = createInsertSchema(widgetData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWidgetSharingSchema = createInsertSchema(widgetSharing).omit({
  id: true,
  createdAt: true,
});

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type InsertDashboardWidget = z.infer<typeof insertDashboardWidgetSchema>;

export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;

export type WidgetTemplate = typeof widgetTemplates.$inferSelect;
export type InsertWidgetTemplate = z.infer<typeof insertWidgetTemplateSchema>;

export type WidgetData = typeof widgetData.$inferSelect;
export type InsertWidgetData = z.infer<typeof insertWidgetDataSchema>;

export type WidgetSharing = typeof widgetSharing.$inferSelect;
export type InsertWidgetSharing = z.infer<typeof insertWidgetSharingSchema>;

// ===============================
// AI LEAD GENERATION PLATFORM SCHEMA
// ===============================

// AI Lead Generation Tables
export const prospectingCampaigns = pgTable("prospecting_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: prospectingCampaignStatusEnum("status").notNull().default('draft'),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  targetConfig: jsonb("target_config").notNull(), // Personas, industries, company sizes, locations, technologies
  leadScoringWeights: jsonb("lead_scoring_weights").notNull(), // fit, intent, engagement, timing weights
  intentSignals: text("intent_signals").array().notNull().default([]),
  searchCriteria: jsonb("search_criteria").notNull(),
  progress: jsonb("progress").notNull().default({}), // searched, found, enriched, qualified counts
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }),
  spentBudget: decimal("spent_budget", { precision: 15, scale: 2 }).default('0'),
  expectedResults: integer("expected_results"),
  actualResults: integer("actual_results").default(0),
  qualifiedResults: integer("qualified_results").default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  avgLeadScore: decimal("avg_lead_score", { precision: 5, scale: 2 }),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  automationRules: jsonb("automation_rules"), // Auto-sync, scoring thresholds, etc.
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const enrichedLeads = pgTable("enriched_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id").notNull().references(() => prospectingCampaigns.id, { onDelete: 'cascade' }),
  originalLeadId: uuid("original_lead_id").references(() => leads.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").default(false),
  phone: text("phone"),
  phoneVerified: boolean("phone_verified").default(false),
  company: text("company").notNull(),
  title: text("title").notNull(),
  department: text("department"),
  seniority: text("seniority"),
  yearsInRole: integer("years_in_role"),
  leadScore: decimal("lead_score", { precision: 5, scale: 2 }).notNull().default('0'),
  intentScore: decimal("intent_score", { precision: 5, scale: 2 }).notNull().default('0'),
  engagementScore: decimal("engagement_score", { precision: 5, scale: 2 }).notNull().default('0'),
  fitScore: decimal("fit_score", { precision: 5, scale: 2 }).notNull().default('0'),
  personaMatch: text("persona_match"),
  dataSources: dataSourceEnum("data_sources").array().notNull().default([]),
  enrichmentStatus: leadEnrichmentStatusEnum("enrichment_status").notNull().default('pending'),
  enrichmentData: jsonb("enrichment_data").notNull().default({}), // Contact, company, intent, AI insights
  socialProfiles: jsonb("social_profiles").default({}), // LinkedIn, Twitter, etc.
  companyIntel: jsonb("company_intel").default({}), // Revenue, employees, tech stack, news, competitors
  intentSignals: jsonb("intent_signals").array().default([]),
  buyingStage: text("buying_stage"),
  engagementHistory: jsonb("engagement_history").array().default([]),
  recommendedActions: text("recommended_actions").array().default([]),
  tags: text("tags").array().default([]),
  status: leadStatusEnum("status").notNull().default('active'),
  assignedTo: uuid("assigned_to").references(() => users.id),
  crmSyncStatus: text("crm_sync_status").default('pending'), // pending, synced, failed
  crmId: text("crm_id"), // External CRM ID when synced
  lastEnrichedAt: timestamp("last_enriched_at"),
  lastEngagedAt: timestamp("last_engaged_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const intentSignals = pgTable("intent_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").references(() => enrichedLeads.id, { onDelete: 'cascade' }),
  companyId: uuid("company_id").references(() => accounts.id),
  signalType: intentSignalTypeEnum("signal_type").notNull(),
  signalSource: dataSourceEnum("signal_source").notNull(),
  signalData: jsonb("signal_data").notNull(), // Raw signal data
  description: text("description").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).notNull(), // 0.00 to 1.00
  impact: text("impact"), // high, medium, low
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"), 
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const engagementTracking = pgTable("engagement_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").notNull().references(() => enrichedLeads.id, { onDelete: 'cascade' }),
  engagementType: engagementTypeEnum("engagement_type").notNull(),
  engagementData: jsonb("engagement_data").notNull(), // Event-specific data
  source: text("source").notNull(), // email, website, social, etc.
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  location: jsonb("location"), // City, country, timezone
  score: decimal("score", { precision: 3, scale: 2 }).default('0'), // Weighted engagement score
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leadScoringModels = pgTable("lead_scoring_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  modelType: leadScoringModelEnum("model_type").notNull(),
  version: text("version").notNull().default('1.0'),
  scoringCriteria: jsonb("scoring_criteria").notNull(), // Detailed scoring rules and weights
  isActive: boolean("is_active").notNull().default(false),
  isDefault: boolean("is_default").notNull().default(false),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }), // Model accuracy percentage
  trainingData: jsonb("training_data"), // Historical data used for training
  performanceMetrics: jsonb("performance_metrics"), // Precision, recall, F1 score, etc.
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const engagementSequences = pgTable("engagement_sequences", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  campaignId: uuid("campaign_id").references(() => prospectingCampaigns.id),
  sequenceSteps: jsonb("sequence_steps").notNull().default([]), // Array of step configurations
  triggerConditions: jsonb("trigger_conditions").notNull(), // When to start the sequence
  status: sequenceStatusEnum("status").notNull().default('active'),
  totalSteps: integer("total_steps").notNull().default(0),
  avgResponseRate: decimal("avg_response_rate", { precision: 5, scale: 2 }),
  avgConversionRate: decimal("avg_conversion_rate", { precision: 5, scale: 2 }),
  isPersonalized: boolean("is_personalized").default(true),
  personalizationRules: jsonb("personalization_rules"), // AI personalization settings
  createdBy: uuid("created_by").notNull().references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sequenceExecutions = pgTable("sequence_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sequenceId: uuid("sequence_id").notNull().references(() => engagementSequences.id, { onDelete: 'cascade' }),
  leadId: uuid("lead_id").notNull().references(() => enrichedLeads.id, { onDelete: 'cascade' }),
  currentStep: integer("current_step").notNull().default(1),
  status: sequenceStatusEnum("status").notNull().default('active'),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  lastExecutedAt: timestamp("last_executed_at"),
  nextExecutionAt: timestamp("next_execution_at"),
  completedAt: timestamp("completed_at"),
  executionData: jsonb("execution_data").default({}), // Step-by-step execution details
  responseReceived: boolean("response_received").default(false),
  conversionAchieved: boolean("conversion_achieved").default(false),
  pausedReason: text("paused_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const abTestCampaigns = pgTable("ab_test_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  testType: text("test_type").notNull(), // email_subject, email_content, sequence_timing, etc.
  parentCampaignId: uuid("parent_campaign_id").references(() => prospectingCampaigns.id),
  variantA: jsonb("variant_a").notNull(), // Control group configuration
  variantB: jsonb("variant_b").notNull(), // Test group configuration
  trafficSplit: decimal("traffic_split", { precision: 3, scale: 2 }).notNull().default('0.5'), // 0.0 to 1.0
  status: abTestStatusEnum("status").notNull().default('draft'),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  testResults: jsonb("test_results"), // Statistical results and winner
  significanceLevel: decimal("significance_level", { precision: 3, scale: 2 }).default('0.95'),
  participantCount: integer("participant_count").default(0),
  conversionGoal: text("conversion_goal").notNull(), // response, meeting_booked, deal_created, etc.
  winningVariant: text("winning_variant"), // 'A' or 'B' or 'inconclusive'
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const personalizedContent = pgTable("personalized_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").notNull().references(() => enrichedLeads.id, { onDelete: 'cascade' }),
  contentType: personalizedContentTypeEnum("content_type").notNull(),
  originalTemplate: text("original_template").notNull(),
  personalizedContent: text("personalized_content").notNull(),
  personalizationFactors: jsonb("personalization_factors").notNull(), // What was used for personalization
  aiModel: text("ai_model"), // Model used for generation
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score
  performanceMetrics: jsonb("performance_metrics"), // Open rates, click rates, responses
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  feedbackScore: decimal("feedback_score", { precision: 3, scale: 2 }), // User feedback on quality
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const complianceTracking = pgTable("compliance_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id").notNull().references(() => enrichedLeads.id, { onDelete: 'cascade' }),
  complianceStatus: complianceStatusEnum("compliance_status").notNull().default('compliant'),
  gdprConsent: boolean("gdpr_consent").default(false),
  ccpaConsent: boolean("ccpa_consent").default(false),
  optInDate: timestamp("opt_in_date"),
  optOutDate: timestamp("opt_out_date"),
  dataRetentionExpiry: timestamp("data_retention_expiry"),
  deletionRequestDate: timestamp("deletion_request_date"),
  lastDataUpdate: timestamp("last_data_update").notNull().defaultNow(),
  auditTrail: jsonb("audit_trail").array().default([]), // All consent/compliance actions
  consentSource: text("consent_source"), // Where consent was obtained
  legalBasis: text("legal_basis"), // GDPR Article 6 basis
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zod schemas for AI lead generation
export const insertProspectingCampaignSchema = createInsertSchema(prospectingCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrichedLeadSchema = createInsertSchema(enrichedLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntentSignalSchema = createInsertSchema(intentSignals).omit({
  id: true,
  createdAt: true,
});

export const insertEngagementTrackingSchema = createInsertSchema(engagementTracking).omit({
  id: true,
  createdAt: true,
});

export const insertLeadScoringModelSchema = createInsertSchema(leadScoringModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEngagementSequenceSchema = createInsertSchema(engagementSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAbTestCampaignSchema = createInsertSchema(abTestCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPersonalizedContentSchema = createInsertSchema(personalizedContent).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceTrackingSchema = createInsertSchema(complianceTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// AI Lead Generation Types
export type ProspectingCampaign = typeof prospectingCampaigns.$inferSelect;
export type EnrichedLead = typeof enrichedLeads.$inferSelect;
export type IntentSignal = typeof intentSignals.$inferSelect;
export type EngagementTracking = typeof engagementTracking.$inferSelect;
export type LeadScoringModel = typeof leadScoringModels.$inferSelect;
export type EngagementSequence = typeof engagementSequences.$inferSelect;
export type SequenceExecution = typeof sequenceExecutions.$inferSelect;
export type AbTestCampaign = typeof abTestCampaigns.$inferSelect;
export type PersonalizedContent = typeof personalizedContent.$inferSelect;
export type ComplianceTracking = typeof complianceTracking.$inferSelect;

export type InsertProspectingCampaign = z.infer<typeof insertProspectingCampaignSchema>;
export type InsertEnrichedLead = z.infer<typeof insertEnrichedLeadSchema>;
export type InsertIntentSignal = z.infer<typeof insertIntentSignalSchema>;
export type InsertEngagementTracking = z.infer<typeof insertEngagementTrackingSchema>;
export type InsertLeadScoringModel = z.infer<typeof insertLeadScoringModelSchema>;
export type InsertEngagementSequence = z.infer<typeof insertEngagementSequenceSchema>;
export type InsertAbTestCampaign = z.infer<typeof insertAbTestCampaignSchema>;
export type InsertPersonalizedContent = z.infer<typeof insertPersonalizedContentSchema>;
export type InsertComplianceTracking = z.infer<typeof insertComplianceTrackingSchema>;

// Industry Trend Tracking System
export const industryTrends = pgTable("industry_trends", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyword: text("keyword").notNull(),
  industry: text("industry").notNull(),
  region: text("region").default('global'),
  trendScore: decimal("trend_score", { precision: 5, scale: 2 }).notNull(), // 0-100 trend strength
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }).notNull(), // % change from previous period
  searchVolume: integer("search_volume").notNull(),
  competitionLevel: text("competition_level").notNull(), // low, medium, high
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }).notNull(), // -1 to 1
  dataSource: text("data_source").notNull(), // google_trends, news_api, social_media
  metadata: jsonb("metadata"), // Additional trend data
  isActive: boolean("is_active").notNull().default(true),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trendKeywords = pgTable("trend_keywords", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyword: text("keyword").notNull(),
  category: text("category").notNull(), // technology, business, marketing, etc.
  industry: text("industry"),
  trackingEnabled: boolean("tracking_enabled").notNull().default(true),
  alertThreshold: decimal("alert_threshold", { precision: 5, scale: 2 }).default('20'), // % change to trigger alert
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trendAlerts = pgTable("trend_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  keywordId: uuid("keyword_id").references(() => trendKeywords.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  alertType: text("alert_type").notNull(), // spike, drop, milestone
  threshold: decimal("threshold", { precision: 5, scale: 2 }).notNull(),
  actualValue: decimal("actual_value", { precision: 5, scale: 2 }).notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default('unread'), // unread, read, dismissed
  triggeredAt: timestamp("triggered_at").notNull().defaultNow(),
});

export const marketIntelligence = pgTable("market_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id"), // Can be linked to accounts
  topic: text("topic").notNull(),
  category: text("category").notNull(), // news, funding, product_launch, acquisition, etc.
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  sourceUrl: text("source_url"),
  sourceType: text("source_type").notNull(), // news, press_release, social_media, filing
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }), // -1 to 1
  impactScore: decimal("impact_score", { precision: 3, scale: 2 }), // 0-1 market impact
  keywords: text("keywords").array().default([]),
  entities: jsonb("entities"), // People, companies, locations mentioned
  publishedAt: timestamp("published_at").notNull(),
  discoveredAt: timestamp("discovered_at").notNull().defaultNow(),
});

export const competitorTracking = pgTable("competitor_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => accounts.id),
  competitorName: text("competitor_name").notNull(),
  competitorDomain: text("competitor_domain"),
  trackingCategories: text("tracking_categories").array().notNull(), // pricing, product, marketing, hiring
  lastProductUpdate: timestamp("last_product_update"),
  lastPricingChange: timestamp("last_pricing_change"),
  lastHiringActivity: timestamp("last_hiring_activity"),
  recentActivities: jsonb("recent_activities").default([]),
  alertsEnabled: boolean("alerts_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations for trend tracking
export const industryTrendsRelations = relations(industryTrends, ({ one }) => ({
  keyword: one(trendKeywords, {
    fields: [industryTrends.keyword],
    references: [trendKeywords.keyword],
  }),
}));

export const trendKeywordsRelations = relations(trendKeywords, ({ one, many }) => ({
  user: one(users, {
    fields: [trendKeywords.userId],
    references: [users.id],
  }),
  alerts: many(trendAlerts),
  trends: many(industryTrends),
}));

export const trendAlertsRelations = relations(trendAlerts, ({ one }) => ({
  keyword: one(trendKeywords, {
    fields: [trendAlerts.keywordId],
    references: [trendKeywords.id],
  }),
  user: one(users, {
    fields: [trendAlerts.userId],
    references: [users.id],
  }),
}));

export const marketIntelligenceRelations = relations(marketIntelligence, ({ one }) => ({
  company: one(accounts, {
    fields: [marketIntelligence.companyId],
    references: [accounts.id],
  }),
}));

export const competitorTrackingRelations = relations(competitorTracking, ({ one }) => ({
  company: one(accounts, {
    fields: [competitorTracking.companyId],
    references: [accounts.id],
  }),
}));

// Insert schemas for trend tracking
export const insertIndustryTrendSchema = createInsertSchema(industryTrends).omit({
  id: true,
  createdAt: true,
});

export const insertTrendKeywordSchema = createInsertSchema(trendKeywords).omit({
  id: true,
  createdAt: true,
});

export const insertTrendAlertSchema = createInsertSchema(trendAlerts).omit({
  id: true,
  triggeredAt: true,
});

export const insertMarketIntelligenceSchema = createInsertSchema(marketIntelligence).omit({
  id: true,
  discoveredAt: true,
});

export const insertCompetitorTrackingSchema = createInsertSchema(competitorTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for trend tracking
export type IndustryTrend = typeof industryTrends.$inferSelect;
export type TrendKeyword = typeof trendKeywords.$inferSelect;
export type TrendAlert = typeof trendAlerts.$inferSelect;
export type MarketIntelligence = typeof marketIntelligence.$inferSelect;
export type CompetitorTracking = typeof competitorTracking.$inferSelect;

export type InsertIndustryTrend = z.infer<typeof insertIndustryTrendSchema>;
export type InsertTrendKeyword = z.infer<typeof insertTrendKeywordSchema>;
export type InsertTrendAlert = z.infer<typeof insertTrendAlertSchema>;
export type InsertMarketIntelligence = z.infer<typeof insertMarketIntelligenceSchema>;
export type InsertCompetitorTracking = z.infer<typeof insertCompetitorTrackingSchema>;
