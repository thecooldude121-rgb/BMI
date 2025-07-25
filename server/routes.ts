import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { z } from "zod";
import { aiInsightsService } from "./aiService";
import { meetingIntelligenceService } from "./meetingIntelligence";
import { aiGrowthService, AccountAnalysisData } from "./services/aiGrowthService";

// Import HRMS schemas
const { 
  insertEmployeeSchema,
  insertLeaveRequestSchema,
  insertAttendanceSchema,
  insertPerformanceReviewSchema,
  insertTrainingProgramSchema,
  insertTrainingEnrollmentSchema
} = schema;

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

  // Enhanced Account routes
  app.get("/api/accounts/:id/with-relations", async (req, res) => {
    try {
      const account = await storage.getAccountWithRelations(req.params.id);
      if (!account) return res.status(404).json({ error: "Account not found" });
      res.json(account);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/:id/health", async (req, res) => {
    try {
      const health = await storage.getAccountHealth(req.params.id);
      res.json(health);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/:id/metrics", async (req, res) => {
    try {
      const metrics = await storage.getAccountMetrics(req.params.id);
      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/search", async (req, res) => {
    try {
      const { query, ...filters } = req.query;
      const accounts = await storage.searchAccounts(String(query || ''), filters);
      res.json(accounts);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Account Document routes
  app.get("/api/accounts/:id/documents", async (req, res) => {
    try {
      const documents = await storage.getAccountDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/:id/documents", async (req, res) => {
    try {
      const documentData = { ...req.body, accountId: req.params.id };
      const document = await storage.createAccountDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Account Hierarchy routes
  app.get("/api/accounts/:id/hierarchy", async (req, res) => {
    try {
      const hierarchy = await storage.getAccountHierarchy(req.params.id);
      res.json(hierarchy);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/hierarchy", async (req, res) => {
    try {
      const hierarchy = await storage.createAccountHierarchy(req.body);
      res.status(201).json(hierarchy);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Account Enrichment routes
  app.get("/api/accounts/:id/enrichment", async (req, res) => {
    try {
      const enrichment = await storage.getAccountEnrichment(req.params.id);
      res.json(enrichment);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/:id/enrichment", async (req, res) => {
    try {
      const enrichmentData = { ...req.body, accountId: req.params.id };
      const enrichment = await storage.createAccountEnrichment(enrichmentData);
      res.status(201).json(enrichment);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Account Health Dashboard routes
  app.get("/api/accounts/health/metrics", async (req, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      const accounts = await storage.getAccounts();
      
      // Calculate health metrics
      const totalAccounts = accounts.length;
      const atRiskAccounts = accounts.filter((a: any) => (a.healthScore || 0) < 40).length;
      const avgHealthScore = accounts.length > 0 
        ? Math.round(accounts.reduce((sum: number, a: any) => sum + (a.healthScore || 0), 0) / accounts.length)
        : 0;
      const engagementRate = Math.round(Math.random() * 30 + 70); // Mock calculation
      const churnProbability = Math.round(Math.random() * 20 + 10); // Mock calculation
      const revenueAtRisk = accounts
        .filter((a: any) => (a.healthScore || 0) < 40)
        .reduce((sum: number, a: any) => sum + parseFloat(a.totalRevenue || '0'), 0);
      const improvingAccounts = accounts.filter((a: any) => (a.healthScore || 0) >= 70).length;

      const metrics = [
        {
          id: '1',
          name: 'Overall Health Score',
          value: avgHealthScore,
          trend: 'up',
          change: 5.2,
          color: 'blue',
          description: 'Average health score across all accounts'
        },
        {
          id: '2',
          name: 'At-Risk Accounts',
          value: atRiskAccounts,
          trend: 'down',
          change: -2,
          color: 'red',
          description: 'Accounts with health score below 40'
        },
        {
          id: '3',
          name: 'Engagement Rate',
          value: engagementRate,
          trend: 'up',
          change: 8.1,
          color: 'green',
          description: 'Average engagement across all touchpoints'
        },
        {
          id: '4',
          name: 'Churn Probability',
          value: churnProbability,
          trend: 'down',
          change: -3.5,
          color: 'orange',
          description: 'Predicted churn risk within next 90 days'
        },
        {
          id: '5',
          name: 'Revenue at Risk',
          value: Math.round(revenueAtRisk),
          trend: 'stable',
          change: 0,
          color: 'purple',
          description: 'Potential revenue loss from at-risk accounts'
        },
        {
          id: '6',
          name: 'Health Improving',
          value: improvingAccounts,
          trend: 'up',
          change: 12,
          color: 'emerald',
          description: 'Accounts showing positive health trends'
        }
      ];

      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/health", async (req, res) => {
    try {
      const { filter = 'all', timeframe = '30d' } = req.query;
      const accounts = await storage.getAccounts();
      
      // Enhanced account health data with AI insights
      const accountsHealth = accounts.map((account: any) => ({
        id: account.id,
        name: account.name,
        healthScore: account.healthScore || Math.round(Math.random() * 100),
        healthTrend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)],
        riskLevel: (account.healthScore || 0) >= 80 ? 'low' : 
                   (account.healthScore || 0) >= 60 ? 'medium' : 
                   (account.healthScore || 0) >= 40 ? 'high' : 'critical',
        lastActivity: account.lastActivityDate || new Date().toISOString(),
        predictedChurn: Math.round(Math.random() * 100),
        engagementScore: Math.round(Math.random() * 100),
        revenueRisk: Math.round(Math.random() * 50),
        factors: [
          { name: 'Product Usage', impact: Math.round(Math.random() * 20 - 10), trend: 'positive' },
          { name: 'Support Tickets', impact: Math.round(Math.random() * 20 - 10), trend: 'negative' },
          { name: 'Payment History', impact: Math.round(Math.random() * 20 - 10), trend: 'neutral' }
        ],
        insights: [
          {
            type: 'opportunity',
            message: 'High engagement suggests expansion potential',
            priority: 'medium',
            confidence: Math.round(Math.random() * 30 + 70)
          }
        ],
        recommendations: [
          {
            action: 'Schedule quarterly business review',
            impact: 'Improve retention by 15%',
            effort: 'medium',
            timeline: '2 weeks'
          }
        ]
      }));

      res.json(accountsHealth);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/health/insights", async (req, res) => {
    try {
      const { timeframe = '30d' } = req.query;
      
      // Mock predictive insights powered by AI
      const insights = [
        {
          id: '1',
          type: 'churn_risk',
          title: 'High Churn Risk Detected',
          description: 'AI has identified 3 enterprise accounts with declining engagement patterns and reduced activity.',
          confidence: 87,
          impact: 'high',
          timeline: 'Next 30 days',
          accountsAffected: 3,
          potentialValue: '$450K ARR',
          recommendations: [
            'Schedule executive check-ins immediately',
            'Review and address any support tickets',
            'Propose value-add services or feature updates'
          ]
        },
        {
          id: '2',
          type: 'expansion_opportunity',
          title: 'Expansion Opportunities Identified',
          description: 'Based on usage patterns, 8 accounts show strong signals for upselling additional services.',
          confidence: 92,
          impact: 'high',
          timeline: 'Next 60 days',
          accountsAffected: 8,
          potentialValue: '$280K expansion',
          recommendations: [
            'Present usage analytics to demonstrate value',
            'Propose pilot programs for additional features',
            'Schedule product demo sessions'
          ]
        },
        {
          id: '3',
          type: 'engagement_drop',
          title: 'Engagement Anomaly Alert',
          description: 'Unusual drop in product engagement detected across 5 mid-market accounts.',
          confidence: 78,
          impact: 'medium',
          timeline: 'Last 14 days',
          accountsAffected: 5,
          potentialValue: '$180K at risk',
          recommendations: [
            'Investigate product usage barriers',
            'Provide additional training resources',
            'Schedule health check calls'
          ]
        }
      ];

      res.json(insights);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/health/generate-insights", async (req, res) => {
    try {
      const { timeframe } = req.body;
      
      // Simulate AI insight generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newInsights = [
        {
          id: Date.now().toString(),
          type: 'revenue_growth',
          title: 'Revenue Growth Opportunity',
          description: 'AI analysis suggests potential for 25% revenue increase through strategic account expansion.',
          confidence: 89,
          impact: 'high',
          timeline: 'Next 90 days',
          accountsAffected: 12,
          potentialValue: '$380K potential',
          recommendations: [
            'Focus on high-usage accounts',
            'Introduce premium feature demos',
            'Create customized expansion proposals'
          ]
        }
      ];

      res.json({ success: true, insights: newInsights });
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

  // Enhanced Contacts API endpoints
  app.get("/api/contacts/metrics", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      
      // Calculate contact metrics
      const totalContacts = contacts.length;
      const activeContacts = contacts.filter((c: any) => c.status === 'active').length;
      const averageRelationshipScore = contacts.length > 0 
        ? Math.round(contacts.reduce((sum: number, c: any) => sum + (c.relationshipScore || 50), 0) / contacts.length)
        : 0;
      const totalTouchpoints = contacts.reduce((sum: number, c: any) => sum + (c.totalActivities || 0), 0);
      const responseRate = contacts.length > 0 
        ? Math.round(contacts.reduce((sum: number, c: any) => sum + (c.responseRate || 0), 0) / contacts.length)
        : 0;
      const recentlyEngaged = contacts.filter((c: any) => c.engagementStatus === 'recently_engaged').length;

      const metrics = {
        totalContacts,
        activeContacts,
        averageRelationshipScore,
        totalTouchpoints,
        responseRate,
        recentlyEngaged
      };

      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/segments", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      
      // Group contacts by various segments
      const segments: any = {
        byPersona: {},
        byEngagementStatus: {},
        byDepartment: {},
        byInfluenceLevel: { high: 0, medium: 0, low: 0 }
      };

      contacts.forEach((contact: any) => {
        // Group by persona
        const persona = contact.persona || 'unknown';
        segments.byPersona[persona] = (segments.byPersona[persona] || 0) + 1;

        // Group by engagement status
        const engagement = contact.engagementStatus || 'unknown';
        segments.byEngagementStatus[engagement] = (segments.byEngagementStatus[engagement] || 0) + 1;

        // Group by department
        const department = contact.department || 'unknown';
        segments.byDepartment[department] = (segments.byDepartment[department] || 0) + 1;

        // Group by influence level
        const influence = Number(contact.influenceLevel) || 5;
        if (influence >= 8) segments.byInfluenceLevel.high++;
        else if (influence >= 5) segments.byInfluenceLevel.medium++;
        else segments.byInfluenceLevel.low++;
      });

      res.json(segments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts/:id/engagement", async (req, res) => {
    try {
      const { id } = req.params;
      const { type, outcome, notes } = req.body;
      
      // Update contact engagement metrics
      const contact = await storage.getContact(id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });

      const updates = {
        lastTouchDate: new Date(),
        lastActivityType: type,
        totalActivities: Number(contact.totalActivities || 0) + 1,
        ...(outcome === 'responded' && {
          lastResponseDate: new Date(),
          responseRate: String(Math.min(100, Number(contact.responseRate || 0) + 5))
        })
      };

      const updatedContact = await storage.updateContact(id, updates);
      res.json(updatedContact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts/:id/relationship-score", async (req, res) => {
    try {
      const { id } = req.params;
      const { score, reason } = req.body;
      
      if (score < 0 || score > 100) {
        return res.status(400).json({ error: "Score must be between 0 and 100" });
      }

      const updatedContact = await storage.updateContact(id, {
        relationshipScore: score
      });

      res.json(updatedContact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/:id/activities", async (req, res) => {
    try {
      const { id } = req.params;
      const activities = await storage.getActivities();
      const contactActivities = activities.filter(activity => activity.contactId === id);
      res.json(contactActivities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts/:id/tags", async (req, res) => {
    try {
      const { id } = req.params;
      const { tags } = req.body;
      
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }

      const contact = await storage.getContact(id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });

      const existingTags = Array.isArray(contact.tags) ? contact.tags : [];
      const newTags = Array.from(new Set([...existingTags, ...tags]));

      const updatedContact = await storage.updateContact(id, {
        tags: newTags
      });

      res.json(updatedContact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/contacts/:id/tags", async (req, res) => {
    try {
      const { id } = req.params;
      const { tags } = req.body;
      
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }

      const contact = await storage.getContact(id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });

      const existingTags = Array.isArray(contact.tags) ? contact.tags : [];
      const newTags = existingTags.filter((tag: string) => !tags.includes(tag));

      const updatedContact = await storage.updateContact(id, {
        tags: newTags
      });

      res.json(updatedContact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts/bulk-update", async (req, res) => {
    try {
      const { contactIds, updates } = req.body;
      
      if (!Array.isArray(contactIds)) {
        return res.status(400).json({ error: "contactIds must be an array" });
      }

      const results = await Promise.all(
        contactIds.map(id => storage.updateContact(id, updates))
      );

      const successCount = results.filter(Boolean).length;
      res.json({ success: true, updatedCount: successCount });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/contacts/:id/communication-preference", async (req, res) => {
    try {
      const { id } = req.params;
      const { preferredChannel, bestContactTime, languagePreference } = req.body;

      const updatedContact = await storage.updateContact(id, {
        preferredChannel,
        bestContactTime,
        languagePreference
      });

      res.json(updatedContact);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/health-check", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      
      const healthReport = {
        total: contacts.length,
        dataQuality: {
          missingEmails: contacts.filter(c => !c.email).length,
          missingPhones: contacts.filter(c => !c.phone && !c.mobile).length,
          incompleteProfiles: contacts.filter(c => !c.position || !c.department).length,
          duplicates: 0 // TODO: Implement duplicate detection
        },
        engagement: {
          never_contacted: contacts.filter(c => !c.lastTouchDate).length,
          dormant: contacts.filter(c => c.engagementStatus === 'dormant').length,
          at_risk: contacts.filter(c => c.engagementStatus === 'at_risk').length,
          unresponsive: contacts.filter(c => c.engagementStatus === 'unresponsive').length
        },
        compliance: {
          gdpr_consent: contacts.filter(c => c.gdprConsent).length,
          email_opt_in: contacts.filter(c => c.emailOptIn).length,
          marketing_consent: contacts.filter(c => c.marketingConsent).length,
          do_not_contact: contacts.filter(c => c.engagementStatus === 'do_not_contact').length
        }
      };

      res.json(healthReport);
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

  app.get("/api/deals/by-account/:accountId", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      const filteredDeals = deals.filter(deal => deal.accountId === req.params.accountId);
      res.json(filteredDeals);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/deals/by-account/:accountId", async (req, res) => {
    try {
      const deals = await storage.getDealsByAccount(req.params.accountId);
      res.json(deals);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/deals/:id/activities", async (req, res) => {
    try {
      const { id } = req.params;
      const activities = await storage.getActivities();
      const dealActivities = activities.filter(activity => activity.dealId === id);
      res.json(dealActivities);
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

  // Enhanced Activity Module Routes - PUT SPECIFIC ROUTES BEFORE PARAMETERIZED ONES
  app.get("/api/activities/metrics", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      console.log(`📊 Processing ${activities.length} activities for metrics calculation`);
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const totalActivities = activities.length;
      const openActivities = activities.filter(a => a.status === 'planned' || a.status === 'in_progress').length;
      
      // Safe date parsing for completedToday
      const completedToday = activities.filter(a => {
        if (a.status !== 'completed') return false;
        if (!a.completedAt) return false;
        
        try {
          const completedDate = new Date(a.completedAt);
          return !isNaN(completedDate.getTime()) && completedDate >= today;
        } catch (error) {
          console.warn(`Invalid completedAt date for activity ${a.id}:`, a.completedAt);
          return false;
        }
      }).length;
      
      // Safe date parsing for overdue activities
      const overdueActivities = activities.filter(a => {
        if (a.status !== 'planned' && a.status !== 'in_progress') return false;
        if (!a.dueDate && !a.scheduledAt) return false;
        
        try {
          const dueDate = new Date(a.dueDate || a.scheduledAt);
          return !isNaN(dueDate.getTime()) && dueDate < now;
        } catch (error) {
          console.warn(`Invalid dueDate for activity ${a.id}:`, a.dueDate);
          return false;
        }
      }).length;
      
      // Calculate average completion time (in minutes)
      const completedActivities = activities.filter(a => a.status === 'completed' && a.duration && typeof a.duration === 'number');
      const avgCompletionTime = completedActivities.length > 0 
        ? Math.round(completedActivities.reduce((sum, a) => sum + (a.duration || 0), 0) / completedActivities.length)
        : 0;
      
      // Calculate completion rate
      const totalTasksWithDueDate = activities.filter(a => a.dueDate || a.scheduledAt).length;
      const completedTasks = activities.filter(a => a.status === 'completed').length;
      const completionRate = totalTasksWithDueDate > 0 
        ? Math.round((completedTasks / totalTasksWithDueDate) * 100)
        : 0;

      const metrics = {
        totalActivities,
        openActivities,
        completedToday,
        overdueActivities,
        avgCompletionTime,
        completionRate
      };

      console.log('📈 Activities metrics calculated:', metrics);
      res.json(metrics);
    } catch (error) {
      console.error('❌ Error calculating activities metrics:', error);
      // Return default metrics in case of error
      res.json({
        totalActivities: 0,
        openActivities: 0,
        completedToday: 0,
        overdueActivities: 0,
        avgCompletionTime: 0,
        completionRate: 0
      });
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

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) return res.status(404).json({ error: "Activity not found" });
      res.json(activity);
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

  // Cross-module activity sync routes
  app.get("/api/leads/:leadId/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByLead(req.params.leadId);
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/deals/:dealId/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByDeal(req.params.dealId);
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/contacts/:contactId/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByContact(req.params.contactId);
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/:accountId/activities", async (req, res) => {
    try {
      const activities = await storage.getActivitiesByAccount(req.params.accountId);
      res.json(activities);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/activities/:id/complete", async (req, res) => {
    try {
      const { outcome } = req.body;
      const activity = await storage.completeActivity(req.params.id, outcome);
      res.json(activity);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI Growth Recommendations Routes
  app.get("/api/accounts/:id/growth-recommendations", async (req, res) => {
    try {
      const accountId = req.params.id;
      const recommendations = await storage.getAccountGrowthRecommendations(accountId);
      res.json(recommendations);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/:id/growth-recommendations/generate", async (req, res) => {
    try {
      const accountId = req.params.id;
      const analysis = await storage.generateGrowthRecommendations(accountId);
      res.json(analysis);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/:id/growth-recommendations/:recommendationId/implement", async (req, res) => {
    try {
      const { id: accountId, recommendationId } = req.params;
      const result = await storage.implementGrowthRecommendation(accountId, recommendationId);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  });



  app.post("/api/activities/:id/comments", async (req, res) => {
    try {
      const { content, mentions, isInternal } = req.body;
      const comment = await storage.createActivityComment({
        activityId: req.params.id,
        authorId: req.body.authorId || '1', // TODO: Get from auth
        content,
        mentions: mentions || [],
        isInternal: isInternal !== false
      });
      res.status(201).json(comment);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/activities/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getActivityComments(req.params.id);
      res.json(comments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/activities/bulk", async (req, res) => {
    try {
      const { action, activityIds, data } = req.body;
      
      if (!Array.isArray(activityIds)) {
        return res.status(400).json({ error: "activityIds must be an array" });
      }

      let results = [];
      switch (action) {
        case 'complete':
          results = await Promise.all(
            activityIds.map(id => storage.completeActivity(id, data?.outcome))
          );
          break;
        case 'assign':
          results = await Promise.all(
            activityIds.map(id => storage.updateActivity(id, { assignedTo: data?.assignedTo }))
          );
          break;
        case 'update_status':
          results = await Promise.all(
            activityIds.map(id => storage.updateActivity(id, { status: data?.status }))
          );
          break;
        case 'delete':
          results = await Promise.all(
            activityIds.map(id => storage.deleteActivity(id))
          );
          break;
        default:
          return res.status(400).json({ error: "Invalid action" });
      }

      res.json({ success: true, affected: results.filter(Boolean).length });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/activities/templates", async (req, res) => {
    try {
      const templates = await storage.getActivityTemplates();
      res.json(templates);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI-Powered Activity Suggestions
  app.get("/api/activities/ai-suggestions", async (req, res) => {
    try {
      console.log('🤖 AI suggestions API called');
      
      // Return mock suggestions for now to demonstrate functionality
      const suggestions = [
        {
          id: 'ai-lead-followup-1',
          type: 'email',
          priority: 'high',
          title: 'Follow up with Sarah Johnson from TechCorp',
          description: 'Lead has been inactive for 12 days. High lead score (85/100) indicates strong conversion potential.',
          suggestedDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 15,
          relatedToType: 'lead',
          relatedToId: 'lead-1',
          relatedToName: 'Sarah Johnson',
          reasoning: 'High-value lead with extended inactivity requires immediate re-engagement',
          confidence: 92,
          tags: ['follow-up', 'high-value', 'conversion-ready'],
          context: {
            trigger: 'Inactive high-scoring lead detection',
            dataPoints: ['12 days since last activity', 'Lead score: 85/100', 'Company size: 500+ employees'],
            expectedOutcome: 'Re-engage lead and schedule conversion call'
          }
        },
        {
          id: 'ai-deal-stalled-1',
          type: 'call',
          priority: 'urgent',
          title: 'Revive stalled deal: Enterprise Software License',
          description: 'Deal worth $125,000 has been inactive for 8 days. Risk of deal slippage.',
          suggestedDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 45,
          relatedToType: 'deal',
          relatedToId: 'deal-1',
          relatedToName: 'Enterprise Software License',
          reasoning: 'High-value deal requires immediate intervention to prevent loss',
          confidence: 95,
          tags: ['deal-rescue', 'high-value', 'urgent'],
          context: {
            trigger: 'Stalled high-value deal detection',
            dataPoints: ['8 days inactive', 'Value: $125,000', 'Stage: Negotiation'],
            expectedOutcome: 'Re-engage stakeholders and advance to closing'
          }
        },
        {
          id: 'ai-account-health-1',
          type: 'meeting',
          priority: 'critical',
          title: 'Account rescue meeting: GlobalTech Solutions',
          description: 'Account health score dropped to 35/100. Immediate intervention required.',
          suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 90,
          relatedToType: 'account',
          relatedToId: 'account-1',
          relatedToName: 'GlobalTech Solutions',
          reasoning: 'Critical account health decline indicates churn risk',
          confidence: 98,
          tags: ['account-rescue', 'churn-risk', 'critical'],
          context: {
            trigger: 'Critical account health decline',
            dataPoints: ['Health score: 35/100', 'No activity in 15 days', 'Contract renewal in 60 days'],
            expectedOutcome: 'Identify issues and create recovery plan'
          }
        }
      ];
      
      console.log(`✨ Returning ${suggestions.length} AI suggestions`);
      res.json(suggestions);
    } catch (error) {
      console.error('❌ Error generating AI suggestions:', error);
      res.json([]);
    }
  });

  app.post("/api/activities/ai-suggestions/accept", async (req, res) => {
    try {
      const { suggestionId, customizations } = req.body;
      
      // Extract activity data from suggestion and create activity
      const activityData = {
        subject: customizations.title || 'AI Suggested Activity',
        type: customizations.type || 'task',
        priority: customizations.priority || 'medium',
        status: 'planned' as const,
        scheduledAt: customizations.scheduledAt || new Date(),
        duration: customizations.duration || 30,
        description: customizations?.description || '',
        assignedTo: req.body.userId || '1',
        createdBy: req.body.userId || '1',
        ...(customizations.relatedToType === 'lead' && { leadId: customizations.relatedToId }),
        ...(customizations.relatedToType === 'deal' && { dealId: customizations.relatedToId }),
        ...(customizations.relatedToType === 'contact' && { contactId: customizations.relatedToId }),
        ...(customizations.relatedToType === 'account' && { accountId: customizations.relatedToId }),
      };

      const activity = await storage.createActivity(activityData);
      
      console.log(`✅ Created activity from AI suggestion: ${suggestionId}`);
      res.status(201).json(activity);
    } catch (error) {
      console.error('❌ Error accepting AI suggestion:', error);
      handleError(error, res);
    }
  });

  app.post("/api/activities/ai-suggestions/feedback", async (req, res) => {
    try {
      const { suggestionId, helpful, reason } = req.body;
      
      // In a real implementation, this would be stored for ML model improvement
      console.log(`📊 AI Suggestion Feedback - ID: ${suggestionId}, Helpful: ${helpful}, Reason: ${reason}`);
      
      res.json({ success: true, message: 'Feedback recorded' });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/activities/from-template", async (req, res) => {
    try {
      const { templateId, relatedToType, relatedToId, customFields } = req.body;
      const activity = await storage.createActivityFromTemplate(templateId, {
        relatedToType,
        relatedToId,
        ...customFields
      });
      res.status(201).json(activity);
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

  // AI Meeting Intelligence Routes (duplicates removed)

  app.delete("/api/meetings/:id", async (req, res) => {
    try {
      await storage.deleteMeeting(req.params.id);
      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  });

  // Meeting Analysis Route
  app.post("/api/meetings/:id/analyze", async (req, res) => {
    try {
      const { transcript, meetingMetadata, previousMeetingActions } = req.body;
      
      if (!transcript || !meetingMetadata) {
        return res.status(400).json({ error: "Transcript and meeting metadata are required" });
      }

      const analysis = await meetingIntelligenceService.analyzeMeeting({
        transcript,
        meetingMetadata,
        previousMeetingActions
      });

      // Store analysis results in database
      const meetingId = req.params.id;
      
      // Store summary
      if (analysis.summary) {
        await storage.createMeetingSummary({
          meetingId,
          conciseSummary: analysis.summary.conciseSummary,
          keyTopics: analysis.summary.keyTopics,
          meetingIntent: analysis.summary.meetingIntent,
          attendeeRoles: analysis.summary.attendeeRoles,
          duration: analysis.summary.duration,
          engagementScore: analysis.summary.engagementScore,
          sentimentAnalysis: analysis.summary.sentimentAnalysis
        });
      }

      // Store outcomes
      for (const outcome of analysis.outcomes) {
        await storage.createMeetingOutcome({
          meetingId,
          ...outcome,
          followUpDate: outcome.followUpDate ? new Date(outcome.followUpDate) : null
        });
      }

      // Store insights
      for (const insight of analysis.insights) {
        await storage.createMeetingInsight({
          meetingId,
          ...insight
        });
      }

      // Store questions
      for (const question of analysis.questions) {
        await storage.createMeetingQuestion({
          meetingId,
          ...question
        });
      }

      // Store pain points
      for (const painPoint of analysis.painPoints) {
        await storage.createMeetingPainPoint({
          meetingId,
          ...painPoint
        });
      }

      // Store follow-ups
      for (const followUp of analysis.followUps) {
        await storage.createMeetingFollowUp({
          meetingId,
          ...followUp,
          dueDate: followUp.dueDate ? new Date(followUp.dueDate) : null
        });
      }

      // Update meeting AI processing status
      await storage.updateMeeting(meetingId, { aiProcessingStatus: 'completed' });

      res.json(analysis);
    } catch (error) {
      console.error('Meeting Analysis Error:', error);
      handleError(error, res);
    }
  });

  // Meeting Platform Integration Routes
  app.post("/api/meetings/create-with-platform", async (req, res) => {
    try {
      const meetingData = schema.insertMeetingSchema.parse(req.body);
      const meeting = await storage.createMeeting(meetingData);
      
      // Generate platform-specific meeting links
      let platformLink = '';
      const platform = req.body.platform || 'google-meet';
      
      if (platform === 'google-meet') {
        // Generate Google Meet link (simplified - would use Google Calendar API in production)
        const startTime = new Date(meetingData.scheduledStart);
        const endTime = new Date(meetingData.scheduledEnd || meetingData.scheduledStart);
        
        const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
        googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
        googleCalendarUrl.searchParams.set('text', meetingData.title || 'Meeting');
        googleCalendarUrl.searchParams.set('details', meetingData.description || '');
        googleCalendarUrl.searchParams.set('dates', 
          `${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
        );
        
        platformLink = googleCalendarUrl.toString();
      } else if (platform === 'teams') {
        // Generate Teams meeting link
        const startTime = new Date(meetingData.scheduledStart);
        const endTime = new Date(meetingData.scheduledEnd || meetingData.scheduledStart);
        
        platformLink = `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(meetingData.title || 'Meeting')}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;
      }

      res.json({ 
        ...meeting, 
        platformLink,
        platform 
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/meetings/generate-link", async (req, res) => {
    try {
      const { platform, title, scheduledStart, scheduledEnd, description, attendees } = req.body;
      
      let meetingLink = '';
      
      if (platform === 'google-meet') {
        const startTime = new Date(scheduledStart);
        const endTime = new Date(scheduledEnd || scheduledStart);
        
        const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
        googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
        googleCalendarUrl.searchParams.set('text', title);
        googleCalendarUrl.searchParams.set('details', description || '');
        googleCalendarUrl.searchParams.set('dates', 
          `${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
        );
        if (attendees && Array.isArray(attendees)) {
          googleCalendarUrl.searchParams.set('add', attendees.join(','));
        }
        
        meetingLink = googleCalendarUrl.toString();
      } else if (platform === 'teams') {
        const startTime = new Date(scheduledStart);
        const endTime = new Date(scheduledEnd || scheduledStart);
        
        meetingLink = `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(title)}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;
      }

      res.json({ 
        meetingLink,
        platform,
        deepLink: meetingLink
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  // Development/Testing Routes
  app.post("/api/seed-varied-data", async (req, res) => {
    try {
      const { seedVariedCRMData } = await import("./simple-seed");
      const result = await seedVariedCRMData();
      res.json({ success: true, message: "Varied CRM data seeded successfully", data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/seed-hrms-data", async (req, res) => {
    try {
      const { seedHRMSData } = await import("./hrms-seed");
      const result = await seedHRMSData();
      res.json({ success: true, message: "HRMS data seeded successfully", data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Calendar Integration Routes
  app.post("/api/calendar/sync", async (req, res) => {
    try {
      const { provider, accessToken } = req.body;
      
      // This would integrate with Google Calendar or Outlook Calendar APIs
      // For now, return a mock success response
      res.json({ 
        success: true, 
        provider,
        message: `Calendar sync enabled for ${provider}` 
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/calendar/events", async (req, res) => {
    try {
      // This would fetch calendar events from integrated calendars
      // Mock response for now
      const events = [
        {
          id: '1',
          title: 'Team Standup',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 3600000).toISOString(),
          source: 'google-calendar'
        }
      ];
      
      res.json(events);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Meeting Intelligence Data Routes
  app.get("/api/meetings/:id/summary", async (req, res) => {
    try {
      const summary = await storage.getMeetingSummary(req.params.id);
      res.json(summary);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id/outcomes", async (req, res) => {
    try {
      const outcomes = await storage.getMeetingOutcomes(req.params.id);
      res.json(outcomes);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id/insights", async (req, res) => {
    try {
      const insights = await storage.getMeetingInsights(req.params.id);
      res.json(insights);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getMeetingQuestions(req.params.id);
      res.json(questions);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id/pain-points", async (req, res) => {
    try {
      const painPoints = await storage.getMeetingPainPoints(req.params.id);
      res.json(painPoints);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/meetings/:id/follow-ups", async (req, res) => {
    try {
      const followUps = await storage.getMeetingFollowUps(req.params.id);
      res.json(followUps);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI Growth Recommendations Routes
  app.get("/api/growth-recommendations", async (req, res) => {
    try {
      const accountId = req.query.accountId as string;
      const recommendations = await storage.getGrowthRecommendations(accountId);
      res.json(recommendations);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/growth-recommendations/:id", async (req, res) => {
    try {
      const recommendation = await storage.getGrowthRecommendation(req.params.id);
      if (!recommendation) return res.status(404).json({ error: "Recommendation not found" });
      res.json(recommendation);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/accounts/:accountId/generate-recommendations", async (req, res) => {
    try {
      const accountId = req.params.accountId;
      const userId = req.body.userId || '1'; // TODO: Get from auth
      
      // Fetch comprehensive account data for AI analysis
      const account = await storage.getAccount(accountId);
      if (!account) return res.status(404).json({ error: "Account not found" });
      
      const deals = await storage.getDealsByAccount(accountId);
      const activities = await storage.getActivitiesByAccount(accountId);
      const contacts = await storage.getContactsByAccount(accountId);
      const leads = await storage.getLeads(); // Filter by account manually since method doesn't exist
      
      // Calculate key metrics for AI analysis
      const totalRevenue = deals
        .filter(d => d.stage === 'closed-won')
        .reduce((sum, d) => sum + Number(d.value || 0), 0);
      
      const avgDealSize = deals.length > 0 ? totalRevenue / deals.length : 0;
      const dealCloseRate = deals.length > 0 
        ? (deals.filter(d => d.stage === 'closed-won').length / deals.length) * 100 
        : 0;
      
      const lastActivityDate = activities.length > 0 
        ? new Date(Math.max(...activities.map(a => new Date(a.createdAt).getTime())))
        : null;
      
      const engagementScore = Math.min(100, activities.length * 10); // Simple engagement scoring
      const healthScore = Math.round((dealCloseRate + Math.min(engagementScore, 100)) / 2);
      
      const analysisData: AccountAnalysisData = {
        account,
        deals,
        activities,
        contacts,
        leads,
        totalRevenue,
        avgDealSize,
        dealCloseRate,
        lastActivityDate,
        engagementScore,
        healthScore
      };
      
      // Generate AI recommendations
      const aiRecommendations = await aiGrowthService.generateGrowthRecommendations({
        accountId,
        analysisData,
        userId
      });
      
      // Save recommendations to database
      const savedRecommendations = [];
      for (const rec of aiRecommendations) {
        const saved = await storage.createGrowthRecommendation(rec);
        savedRecommendations.push(saved);
      }
      
      res.json({
        accountAnalysis: {
          totalRevenue,
          avgDealSize,
          dealCloseRate,
          healthScore,
          engagementScore,
          lastActivityDate
        },
        recommendations: savedRecommendations
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/growth-recommendations/:id", async (req, res) => {
    try {
      const recommendation = await storage.updateGrowthRecommendation(req.params.id, req.body);
      res.json(recommendation);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/growth-recommendations/:id/implement", async (req, res) => {
    try {
      const { userId, actualRevenue, actualTimeframe } = req.body;
      const recommendation = await storage.implementGrowthRecommendation(
        req.params.id, 
        userId || '1', // TODO: Get from auth
        actualRevenue,
        actualTimeframe
      );
      res.json(recommendation);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/growth-recommendations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGrowthRecommendation(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Recommendation not found" });
      res.json({ success: true });
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/accounts/:accountId/growth-potential", async (req, res) => {
    try {
      const analysis = await aiGrowthService.analyzeAccountGrowthPotential(req.params.accountId);
      res.json(analysis);
    } catch (error) {
      handleError(error, res);
    }
  });

  // ========================================
  // COMPREHENSIVE GAMIFICATION ROUTES
  // ========================================

  // Gamification Actions
  app.post('/api/gamification/actions', async (req, res) => {
    try {
      const actionData = schema.insertGamificationActionSchema.parse(req.body);
      const action = await storage.createGamificationAction(actionData);
      res.json(action);
    } catch (error) {
      console.error('Error creating gamification action:', error);
      res.status(500).json({ error: 'Failed to create gamification action' });
    }
  });

  app.get('/api/gamification/actions/:userId?', async (req, res) => {
    try {
      const { userId } = req.params;
      const actions = await storage.getGamificationActions(userId);
      res.json(actions);
    } catch (error) {
      console.error('Error fetching gamification actions:', error);
      res.status(500).json({ error: 'Failed to fetch gamification actions' });
    }
  });

  // User Gamification Profiles
  app.get('/api/gamification/profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await storage.getUserGamificationProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error('Error fetching user gamification profile:', error);
      res.status(500).json({ error: 'Failed to fetch user gamification profile' });
    }
  });

  app.post('/api/gamification/profile', async (req, res) => {
    try {
      const profileData = schema.insertUserGamificationProfileSchema.parse(req.body);
      const profile = await storage.createUserGamificationProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error('Error creating user gamification profile:', error);
      res.status(500).json({ error: 'Failed to create user gamification profile' });
    }
  });

  // Gamification Badges
  app.get('/api/gamification/badges', async (req, res) => {
    try {
      const badges = await storage.getGamificationBadges();
      res.json(badges);
    } catch (error) {
      console.error('Error fetching gamification badges:', error);
      res.status(500).json({ error: 'Failed to fetch gamification badges' });
    }
  });

  app.post('/api/gamification/badges', async (req, res) => {
    try {
      const badgeData = schema.insertGamificationBadgeSchema.parse(req.body);
      const badge = await storage.createGamificationBadge(badgeData);
      res.json(badge);
    } catch (error) {
      console.error('Error creating gamification badge:', error);
      res.status(500).json({ error: 'Failed to create gamification badge' });
    }
  });

  app.get('/api/gamification/badges/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const badges = await storage.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error('Error fetching user badges:', error);
      res.status(500).json({ error: 'Failed to fetch user badges' });
    }
  });

  // Gamification Challenges
  app.get('/api/gamification/challenges', async (req, res) => {
    try {
      const { status } = req.query;
      const challenges = await storage.getGamificationChallenges(status as string);
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching gamification challenges:', error);
      res.status(500).json({ error: 'Failed to fetch gamification challenges' });
    }
  });

  app.post('/api/gamification/challenges', async (req, res) => {
    try {
      const challengeData = schema.insertGamificationChallengeSchema.parse(req.body);
      const challenge = await storage.createGamificationChallenge(challengeData);
      res.json(challenge);
    } catch (error) {
      console.error('Error creating gamification challenge:', error);
      res.status(500).json({ error: 'Failed to create gamification challenge' });
    }
  });

  app.post('/api/gamification/challenges/:challengeId/join', async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userId } = req.body;
      await storage.joinChallenge(challengeId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error joining challenge:', error);
      res.status(500).json({ error: 'Failed to join challenge' });
    }
  });

  // Leaderboards
  app.get('/api/gamification/leaderboard', async (req, res) => {
    try {
      const { type, teamId } = req.query;
      const leaderboard = await storage.getLeaderboard(type as string, teamId as string);
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  // Notifications
  app.get('/api/gamification/notifications/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { unreadOnly } = req.query;
      const notifications = await storage.getUserNotifications(userId, unreadOnly === 'true');
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.patch('/api/gamification/notifications/:notificationId/read', async (req, res) => {
    try {
      const { notificationId } = req.params;
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Peer Recognition
  app.post('/api/gamification/recognition', async (req, res) => {
    try {
      const recognitionData = schema.insertPeerRecognitionSchema.parse(req.body);
      const recognition = await storage.createPeerRecognition(recognitionData);
      res.json(recognition);
    } catch (error) {
      console.error('Error creating peer recognition:', error);
      res.status(500).json({ error: 'Failed to create peer recognition' });
    }
  });

  app.get('/api/gamification/recognition/:userId?', async (req, res) => {
    try {
      const { userId } = req.params;
      const recognitions = await storage.getPeerRecognitions(userId);
      res.json(recognitions);
    } catch (error) {
      console.error('Error fetching peer recognitions:', error);
      res.status(500).json({ error: 'Failed to fetch peer recognitions' });
    }
  });

  // Rewards
  app.get('/api/gamification/rewards', async (req, res) => {
    try {
      const rewards = await storage.getGamificationRewards();
      res.json(rewards);
    } catch (error) {
      console.error('Error fetching gamification rewards:', error);
      res.status(500).json({ error: 'Failed to fetch gamification rewards' });
    }
  });

  app.post('/api/gamification/rewards/:rewardId/claim', async (req, res) => {
    try {
      const { rewardId } = req.params;
      const { userId } = req.body;
      const claim = await storage.claimReward(userId, rewardId);
      res.json(claim);
    } catch (error) {
      console.error('Error claiming reward:', error);
      const message = error instanceof Error ? error.message : 'Failed to claim reward';
      res.status(500).json({ error: message });
    }
  });

  // Streaks
  app.get('/api/gamification/streaks/:userId/:streakType', async (req, res) => {
    try {
      const { userId, streakType } = req.params;
      const streak = await storage.getUserStreak(userId, streakType);
      res.json(streak);
    } catch (error) {
      console.error('Error fetching user streak:', error);
      res.status(500).json({ error: 'Failed to fetch user streak' });
    }
  });

  // Analytics and Metrics
  app.get('/api/gamification/metrics', async (req, res) => {
    try {
      const metrics = await storage.getGamificationMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching gamification metrics:', error);
      res.status(500).json({ error: 'Failed to fetch gamification metrics' });
    }
  });

  // Utility route to trigger gamification action (for CRM integration)
  app.post('/api/gamification/trigger', async (req, res) => {
    try {
      const { actionType, targetEntity, entityId, userId, points, context } = req.body;
      
      const action = await storage.createGamificationAction({
        actionType,
        targetEntity,
        entityId,
        userId,
        points: points || 10,
        context
      });
      
      res.json(action);
    } catch (error) {
      console.error('Error triggering gamification action:', error);
      res.status(500).json({ error: 'Failed to trigger gamification action' });
    }
  });

  // HRMS Employee Management Routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json(employee);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/employees/user/:userId", async (req, res) => {
    try {
      const employee = await storage.getEmployeeByUserId(req.params.userId);
      if (!employee) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.json(employee);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/employees/department/:department", async (req, res) => {
    try {
      const employees = await storage.getEmployeesByDepartment(req.params.department);
      res.json(employees);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/employees/manager/:managerId", async (req, res) => {
    try {
      const employees = await storage.getEmployeesByManager(req.params.managerId);
      res.json(employees);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const result = insertEmployeeSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid employee data", details: result.error.issues });
        return;
      }
      const employee = await storage.createEmployee(result.data);
      res.status(201).json(employee);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      res.json(employee);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  });

  // HRMS Leave Management Routes
  app.get("/api/leave-requests", async (req, res) => {
    try {
      const requests = await storage.getLeaveRequests();
      res.json(requests);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/leave-requests/:id", async (req, res) => {
    try {
      const request = await storage.getLeaveRequest(req.params.id);
      if (!request) {
        res.status(404).json({ error: "Leave request not found" });
        return;
      }
      res.json(request);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/leave-requests/employee/:employeeId", async (req, res) => {
    try {
      const requests = await storage.getLeaveRequestsByEmployee(req.params.employeeId);
      res.json(requests);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/leave-requests/status/:status", async (req, res) => {
    try {
      const requests = await storage.getLeaveRequestsByStatus(req.params.status);
      res.json(requests);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/leave-requests", async (req, res) => {
    try {
      const result = insertLeaveRequestSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid leave request data", details: result.error.issues });
        return;
      }
      const request = await storage.createLeaveRequest(result.data);
      res.status(201).json(request);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/leave-requests/:id", async (req, res) => {
    try {
      const request = await storage.updateLeaveRequest(req.params.id, req.body);
      res.json(request);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.delete("/api/leave-requests/:id", async (req, res) => {
    try {
      const success = await storage.deleteLeaveRequest(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Leave request not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      handleError(error, res);
    }
  });

  // HRMS Attendance Management Routes
  app.get("/api/attendance", async (req, res) => {
    try {
      const attendance = await storage.getAttendance();
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/attendance/employee/:employeeId", async (req, res) => {
    try {
      const attendance = await storage.getAttendanceByEmployee(req.params.employeeId);
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/attendance/date/:date", async (req, res) => {
    try {
      const date = new Date(req.params.date);
      const attendance = await storage.getAttendanceByDate(date);
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/attendance/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        res.status(400).json({ error: "Start date and end date are required" });
        return;
      }
      const attendance = await storage.getAttendanceByDateRange(new Date(startDate as string), new Date(endDate as string));
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const result = insertAttendanceSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid attendance data", details: result.error.issues });
        return;
      }
      const attendance = await storage.createAttendance(result.data);
      res.status(201).json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const attendance = await storage.updateAttendance(req.params.id, req.body);
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/attendance/clock-in", async (req, res) => {
    try {
      const { employeeId, location } = req.body;
      if (!employeeId) {
        res.status(400).json({ error: "Employee ID is required" });
        return;
      }
      const attendance = await storage.clockIn(employeeId, location);
      res.status(201).json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/attendance/clock-out", async (req, res) => {
    try {
      const { attendanceId } = req.body;
      if (!attendanceId) {
        res.status(400).json({ error: "Attendance ID is required" });
        return;
      }
      const attendance = await storage.clockOut(attendanceId);
      res.json(attendance);
    } catch (error) {
      handleError(error, res);
    }
  });

  // HRMS Performance Management Routes
  app.get("/api/performance-reviews", async (req, res) => {
    try {
      const reviews = await storage.getPerformanceReviews();
      res.json(reviews);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/performance-reviews/:id", async (req, res) => {
    try {
      const review = await storage.getPerformanceReview(req.params.id);
      if (!review) {
        res.status(404).json({ error: "Performance review not found" });
        return;
      }
      res.json(review);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/performance-reviews/employee/:employeeId", async (req, res) => {
    try {
      const reviews = await storage.getPerformanceReviewsByEmployee(req.params.employeeId);
      res.json(reviews);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/performance-reviews/reviewer/:reviewerId", async (req, res) => {
    try {
      const reviews = await storage.getPerformanceReviewsByReviewer(req.params.reviewerId);
      res.json(reviews);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/performance-reviews", async (req, res) => {
    try {
      const result = insertPerformanceReviewSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid performance review data", details: result.error.issues });
        return;
      }
      const review = await storage.createPerformanceReview(result.data);
      res.status(201).json(review);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/performance-reviews/:id", async (req, res) => {
    try {
      const review = await storage.updatePerformanceReview(req.params.id, req.body);
      res.json(review);
    } catch (error) {
      handleError(error, res);
    }
  });

  // HRMS Training Management Routes
  app.get("/api/training-programs", async (req, res) => {
    try {
      const programs = await storage.getTrainingPrograms();
      res.json(programs);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/training-programs/:id", async (req, res) => {
    try {
      const program = await storage.getTrainingProgram(req.params.id);
      if (!program) {
        res.status(404).json({ error: "Training program not found" });
        return;
      }
      res.json(program);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/training-programs", async (req, res) => {
    try {
      const result = insertTrainingProgramSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid training program data", details: result.error.issues });
        return;
      }
      const program = await storage.createTrainingProgram(result.data);
      res.status(201).json(program);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/training-programs/:id", async (req, res) => {
    try {
      const program = await storage.updateTrainingProgram(req.params.id, req.body);
      res.json(program);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/training-enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getTrainingEnrollments();
      res.json(enrollments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/training-enrollments/employee/:employeeId", async (req, res) => {
    try {
      const enrollments = await storage.getTrainingEnrollmentsByEmployee(req.params.employeeId);
      res.json(enrollments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/training-enrollments/program/:programId", async (req, res) => {
    try {
      const enrollments = await storage.getTrainingEnrollmentsByProgram(req.params.programId);
      res.json(enrollments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/training-enrollments", async (req, res) => {
    try {
      const result = insertTrainingEnrollmentSchema.safeParse(req.body);
      if (!result.success) {
        res.status(400).json({ error: "Invalid training enrollment data", details: result.error.issues });
        return;
      }
      const enrollment = await storage.createTrainingEnrollment(result.data);
      res.status(201).json(enrollment);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/training-enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.updateTrainingEnrollment(req.params.id, req.body);
      res.json(enrollment);
    } catch (error) {
      handleError(error, res);
    }
  });

  // HRMS Analytics Routes
  app.get("/api/hrms/metrics/employees", async (req, res) => {
    try {
      const metrics = await storage.getEmployeeMetrics();
      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/metrics/attendance", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const metrics = await storage.getAttendanceMetrics(start, end);
      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/metrics/leave", async (req, res) => {
    try {
      const metrics = await storage.getLeaveMetrics();
      res.json(metrics);
    } catch (error) {
      handleError(error, res);
    }
  });

  // ===============================================
  // AI-POWERED HRMS COMPREHENSIVE API ROUTES
  // ===============================================

  // AI-Powered Onboarding Module Routes
  app.get("/api/hrms/onboarding", async (req, res) => {
    try {
      const processes = await storage.getOnboardingProcesses();
      res.json(processes);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/onboarding/:id", async (req, res) => {
    try {
      const process = await storage.getOnboardingProcess(req.params.id);
      if (!process) {
        res.status(404).json({ error: "Onboarding process not found" });
        return;
      }
      res.json(process);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/onboarding/employee/:employeeId", async (req, res) => {
    try {
      const processes = await storage.getOnboardingProcessesByEmployee(req.params.employeeId);
      res.json(processes);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/onboarding", async (req, res) => {
    try {
      const process = await storage.createOnboardingProcess(req.body);
      res.status(201).json(process);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/onboarding/:id", async (req, res) => {
    try {
      const process = await storage.updateOnboardingProcess(req.params.id, req.body);
      res.json(process);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/onboarding/ai-plan/:employeeId", async (req, res) => {
    try {
      const plan = await storage.generateAIOnboardingPlan(req.params.employeeId);
      res.json(plan);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI-Powered Recruitment Module Routes
  app.get("/api/hrms/jobs", async (req, res) => {
    try {
      const jobs = await storage.getJobPostings();
      res.json(jobs);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobPosting(req.params.id);
      if (!job) {
        res.status(404).json({ error: "Job posting not found" });
        return;
      }
      res.json(job);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/jobs", async (req, res) => {
    try {
      const job = await storage.createJobPosting(req.body);
      res.status(201).json(job);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/jobs/:id", async (req, res) => {
    try {
      const job = await storage.updateJobPosting(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/applications", async (req, res) => {
    try {
      const applications = await storage.getJobApplications();
      res.json(applications);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/applications/:id", async (req, res) => {
    try {
      const application = await storage.getJobApplication(req.params.id);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json(application);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/jobs/:jobId/applications", async (req, res) => {
    try {
      const applications = await storage.getJobApplicationsByPosting(req.params.jobId);
      res.json(applications);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/applications", async (req, res) => {
    try {
      const application = await storage.createJobApplication(req.body);
      res.status(201).json(application);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/applications/:id", async (req, res) => {
    try {
      const application = await storage.updateJobApplication(req.params.id, req.body);
      res.json(application);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/applications/:id/ai-screen", async (req, res) => {
    try {
      const screening = await storage.aiScreenApplication(req.params.id);
      res.json(screening);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI-Powered Learning & Development Module Routes
  app.get("/api/hrms/learning-paths", async (req, res) => {
    try {
      const paths = await storage.getLearningPaths();
      res.json(paths);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/learning-paths/:id", async (req, res) => {
    try {
      const path = await storage.getLearningPath(req.params.id);
      if (!path) {
        res.status(404).json({ error: "Learning path not found" });
        return;
      }
      res.json(path);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/learning-paths", async (req, res) => {
    try {
      const path = await storage.createLearningPath(req.body);
      res.status(201).json(path);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/learning-paths/:id", async (req, res) => {
    try {
      const path = await storage.updateLearningPath(req.params.id, req.body);
      res.json(path);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/learning-enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getLearningEnrollments();
      res.json(enrollments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/learning-enrollments/employee/:employeeId", async (req, res) => {
    try {
      const enrollments = await storage.getLearningEnrollmentsByEmployee(req.params.employeeId);
      res.json(enrollments);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/learning-enrollments", async (req, res) => {
    try {
      const enrollment = await storage.createLearningEnrollment(req.body);
      res.status(201).json(enrollment);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/learning-enrollments/:id", async (req, res) => {
    try {
      const enrollment = await storage.updateLearningEnrollment(req.params.id, req.body);
      res.json(enrollment);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/learning/personalized-path/:employeeId", async (req, res) => {
    try {
      const path = await storage.generatePersonalizedLearningPath(req.params.employeeId);
      res.json(path);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI-Powered Payroll Module Routes
  app.get("/api/hrms/payroll", async (req, res) => {
    try {
      const cycles = await storage.getPayrollCycles();
      res.json(cycles);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/payroll/:id", async (req, res) => {
    try {
      const cycle = await storage.getPayrollCycle(req.params.id);
      if (!cycle) {
        res.status(404).json({ error: "Payroll cycle not found" });
        return;
      }
      res.json(cycle);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/payroll", async (req, res) => {
    try {
      const cycle = await storage.createPayrollCycle(req.body);
      res.status(201).json(cycle);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/payroll/:id", async (req, res) => {
    try {
      const cycle = await storage.updatePayrollCycle(req.params.id, req.body);
      res.json(cycle);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/payroll/:id/process-ai", async (req, res) => {
    try {
      const result = await storage.processPayrollWithAI(req.params.id);
      res.json(result);
    } catch (error) {
      handleError(error, res);
    }
  });

  // System Integration & Migration Routes
  app.get("/api/hrms/integrations", async (req, res) => {
    try {
      const integrations = await storage.getSystemIntegrations();
      res.json(integrations);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/integrations/:id", async (req, res) => {
    try {
      const integration = await storage.getSystemIntegration(req.params.id);
      if (!integration) {
        res.status(404).json({ error: "Integration not found" });
        return;
      }
      res.json(integration);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/integrations", async (req, res) => {
    try {
      const integration = await storage.createSystemIntegration(req.body);
      res.status(201).json(integration);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/integrations/:id", async (req, res) => {
    try {
      const integration = await storage.updateSystemIntegration(req.params.id, req.body);
      res.json(integration);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Multi-tenant Support Routes
  app.get("/api/hrms/tenants", async (req, res) => {
    try {
      const tenants = await storage.getTenants();
      res.json(tenants);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/tenants/:id", async (req, res) => {
    try {
      const tenant = await storage.getTenant(req.params.id);
      if (!tenant) {
        res.status(404).json({ error: "Tenant not found" });
        return;
      }
      res.json(tenant);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/tenants", async (req, res) => {
    try {
      const tenant = await storage.createTenant(req.body);
      res.status(201).json(tenant);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/tenants/:id", async (req, res) => {
    try {
      const tenant = await storage.updateTenant(req.params.id, req.body);
      res.json(tenant);
    } catch (error) {
      handleError(error, res);
    }
  });

  // Data Migration Routes
  app.get("/api/hrms/migrations", async (req, res) => {
    try {
      const migrations = await storage.getDataMigrations();
      res.json(migrations);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/migrations/:id", async (req, res) => {
    try {
      const migration = await storage.getDataMigration(req.params.id);
      if (!migration) {
        res.status(404).json({ error: "Migration not found" });
        return;
      }
      res.json(migration);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/migrations", async (req, res) => {
    try {
      const migration = await storage.createDataMigration(req.body);
      res.status(201).json(migration);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.patch("/api/hrms/migrations/:id", async (req, res) => {
    try {
      const migration = await storage.updateDataMigration(req.params.id, req.body);
      res.json(migration);
    } catch (error) {
      handleError(error, res);
    }
  });

  // AI Analytics & Insights Routes
  app.get("/api/hrms/employees/:id/insights", async (req, res) => {
    try {
      const insights = await storage.generateEmployeeInsights(req.params.id);
      res.json(insights);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/analytics", async (req, res) => {
    try {
      const analytics = await storage.getHRMSAnalytics();
      res.json(analytics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.post("/api/hrms/analytics", async (req, res) => {
    try {
      const analytics = await storage.createHRMSAnalytics(req.body);
      res.status(201).json(analytics);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/employees/:id/retention-prediction", async (req, res) => {
    try {
      const prediction = await storage.predictEmployeeRetention(req.params.id);
      res.json(prediction);
    } catch (error) {
      handleError(error, res);
    }
  });

  app.get("/api/hrms/employees/:id/career-path", async (req, res) => {
    try {
      const careerPath = await storage.suggestCareerPath(req.params.id);
      res.json(careerPath);
    } catch (error) {
      handleError(error, res);
    }
  });

  const server = createServer(app);

  return server;
}