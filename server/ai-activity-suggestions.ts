import { eq, and, sql, desc, asc } from 'drizzle-orm';
import { db } from './db';
import * as schema from '../shared/schema';

export interface ActivitySuggestion {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'task' | 'note' | 'follow_up';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  title: string;
  description: string;
  suggestedDate: Date;
  estimatedDuration: number; // in minutes
  relatedToType: 'lead' | 'deal' | 'contact' | 'account';
  relatedToId: string;
  relatedToName: string;
  reasoning: string;
  confidence: number; // 0-100
  tags: string[];
  context: {
    trigger: string;
    dataPoints: string[];
    expectedOutcome: string;
  };
}

export interface SuggestionContext {
  leads: any[];
  deals: any[];
  contacts: any[];
  accounts: any[];
  activities: any[];
  currentDate: Date;
}

class AIActivitySuggestionEngine {
  private context: SuggestionContext | null = null;

  async generateSuggestions(userId: string = '1'): Promise<ActivitySuggestion[]> {
    // Fetch comprehensive CRM data for analysis
    await this.loadContext();
    
    const suggestions: ActivitySuggestion[] = [];
    
    // Generate different types of suggestions
    suggestions.push(...this.generateLeadNurturingSuggestions());
    suggestions.push(...this.generateDealProgressionSuggestions());
    suggestions.push(...this.generateContactEngagementSuggestions());
    suggestions.push(...this.generateAccountManagementSuggestions());
    suggestions.push(...this.generateOverdueSuggestions());
    suggestions.push(...this.generateProactiveSuggestions());
    
    // Sort by priority and confidence
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      })
      .slice(0, 20); // Return top 20 suggestions
  }

  private async loadContext(): Promise<void> {
    const [leads, deals, contacts, accounts, activities] = await Promise.all([
      db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)),
      db.select().from(schema.deals).orderBy(desc(schema.deals.createdAt)),
      db.select().from(schema.contacts).orderBy(desc(schema.contacts.createdAt)),
      db.select().from(schema.accounts).orderBy(desc(schema.accounts.createdAt)),
      db.select().from(schema.activities).orderBy(desc(schema.activities.createdAt))
    ]);

    this.context = {
      leads,
      deals,
      contacts,
      accounts,
      activities,
      currentDate: new Date()
    };
  }

  private generateLeadNurturingSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { leads, activities, currentDate } = this.context;

    leads.forEach(lead => {
      // Find leads without recent activities
      const leadActivities = activities.filter(a => a.leadId === lead.id);
      const lastActivity = leadActivities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      const daysSinceLastActivity = lastActivity 
        ? Math.floor((currentDate.getTime() - new Date(lastActivity.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Cold leads need warming up
      if (daysSinceLastActivity > 7 && lead.status === 'new') {
        suggestions.push({
          id: `lead-nurture-${lead.id}`,
          type: 'email',
          priority: 'medium',
          title: `Follow up with ${lead.firstName} ${lead.lastName}`,
          description: `This lead has been inactive for ${daysSinceLastActivity} days. Send a personalized follow-up email to re-engage.`,
          suggestedDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          estimatedDuration: 15,
          relatedToType: 'lead',
          relatedToId: lead.id,
          relatedToName: `${lead.firstName} ${lead.lastName}`,
          reasoning: `Lead has been inactive for ${daysSinceLastActivity} days, suggesting potential loss of interest`,
          confidence: 85,
          tags: ['nurturing', 'follow-up', 'cold-lead'],
          context: {
            trigger: 'Inactive lead detection',
            dataPoints: [`${daysSinceLastActivity} days since last activity`, `Lead status: ${lead.status}`],
            expectedOutcome: 'Re-engage lead and assess continued interest'
          }
        });
      }

      // High-scoring leads need progression
      if (Number(lead.score) >= 80 && lead.status === 'qualified') {
        suggestions.push({
          id: `lead-convert-${lead.id}`,
          type: 'call',
          priority: 'high',
          title: `Schedule conversion call with ${lead.firstName} ${lead.lastName}`,
          description: `High-scoring qualified lead (${lead.score}/100) ready for conversion discussion.`,
          suggestedDate: new Date(currentDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours
          estimatedDuration: 30,
          relatedToType: 'lead',
          relatedToId: lead.id,
          relatedToName: `${lead.firstName} ${lead.lastName}`,
          reasoning: `High lead score (${lead.score}) indicates strong conversion potential`,
          confidence: 92,
          tags: ['conversion', 'hot-lead', 'high-priority'],
          context: {
            trigger: 'High lead score threshold',
            dataPoints: [`Lead score: ${lead.score}/100`, `Status: ${lead.status}`],
            expectedOutcome: 'Convert qualified lead to opportunity'
          }
        });
      }
    });

    return suggestions;
  }

  private generateDealProgressionSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { deals, activities, currentDate } = this.context;

    deals.forEach(deal => {
      const dealActivities = activities.filter(a => a.dealId === deal.id);
      const daysSinceLastActivity = dealActivities.length > 0
        ? Math.floor((currentDate.getTime() - new Date(Math.max(...dealActivities.map(a => new Date(a.createdAt).getTime()))).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      // Stalled deals need attention
      if (daysSinceLastActivity > 5 && deal.stage !== 'closed-won' && deal.stage !== 'closed-lost') {
        const priority = Number(deal.value) > 50000 ? 'urgent' : 'high';
        
        suggestions.push({
          id: `deal-progress-${deal.id}`,
          type: 'call',
          priority,
          title: `Revive stalled deal: ${deal.name}`,
          description: `Deal worth $${Number(deal.value).toLocaleString()} has been inactive for ${daysSinceLastActivity} days. Immediate action required.`,
          suggestedDate: new Date(currentDate.getTime() + 60 * 60 * 1000), // 1 hour
          estimatedDuration: 45,
          relatedToType: 'deal',
          relatedToId: deal.id,
          relatedToName: deal.name,
          reasoning: `High-value deal stalled for ${daysSinceLastActivity} days requires immediate intervention`,
          confidence: 95,
          tags: ['deal-rescue', 'high-value', 'urgent'],
          context: {
            trigger: 'Stalled deal detection',
            dataPoints: [`${daysSinceLastActivity} days inactive`, `Value: $${deal.value}`, `Stage: ${deal.stage}`],
            expectedOutcome: 'Re-engage stakeholders and advance deal stage'
          }
        });
      }

      // Deals approaching close date
      if (deal.expectedCloseDate) {
        const daysToClose = Math.floor((new Date(deal.expectedCloseDate).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysToClose <= 7 && daysToClose > 0 && deal.stage === 'negotiation') {
          suggestions.push({
            id: `deal-close-${deal.id}`,
            type: 'meeting',
            priority: 'urgent',
            title: `Final push for ${deal.name}`,
            description: `Deal closes in ${daysToClose} days. Schedule final negotiation meeting to secure commitment.`,
            suggestedDate: new Date(currentDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours
            estimatedDuration: 60,
            relatedToType: 'deal',
            relatedToId: deal.id,
            relatedToName: deal.name,
            reasoning: `Deal approaching close date with ${daysToClose} days remaining`,
            confidence: 88,
            tags: ['closing', 'time-sensitive', 'negotiation'],
            context: {
              trigger: 'Close date proximity',
              dataPoints: [`${daysToClose} days to close`, `Stage: ${deal.stage}`, `Value: $${deal.value}`],
              expectedOutcome: 'Finalize terms and close deal'
            }
          });
        }
      }
    });

    return suggestions;
  }

  private generateContactEngagementSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { contacts, activities, currentDate } = this.context;

    contacts.forEach(contact => {
      // VIP contacts need regular touchpoints
      if (contact.isDecisionMaker && Number(contact.influenceLevel) >= 8) {
        const contactActivities = activities.filter(a => a.contactId === contact.id);
        const daysSinceLastTouch = contactActivities.length > 0
          ? Math.floor((currentDate.getTime() - new Date(Math.max(...contactActivities.map(a => new Date(a.createdAt).getTime()))).getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        if (daysSinceLastTouch > 14) {
          suggestions.push({
            id: `vip-contact-${contact.id}`,
            type: 'call',
            priority: 'high',
            title: `VIP check-in with ${contact.firstName} ${contact.lastName}`,
            description: `High-influence decision maker (Level ${contact.influenceLevel}) hasn't been contacted in ${daysSinceLastTouch} days.`,
            suggestedDate: new Date(currentDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours
            estimatedDuration: 20,
            relatedToType: 'contact',
            relatedToId: contact.id,
            relatedToName: `${contact.firstName} ${contact.lastName}`,
            reasoning: `VIP contact with high influence level requires regular engagement`,
            confidence: 90,
            tags: ['vip', 'relationship-building', 'decision-maker'],
            context: {
              trigger: 'VIP contact maintenance',
              dataPoints: [`Influence level: ${contact.influenceLevel}`, `Decision maker: ${contact.isDecisionMaker}`, `${daysSinceLastTouch} days since contact`],
              expectedOutcome: 'Maintain strong relationship and gather intelligence'
            }
          });
        }
      }

      // Low engagement contacts need re-activation
      if (Number(contact.responseRate) < 30 && contact.lastTouchDate) {
        const daysSinceLastTouch = Math.floor((currentDate.getTime() - new Date(contact.lastTouchDate).getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastTouch > 30) {
          suggestions.push({
            id: `reactivate-contact-${contact.id}`,
            type: 'email',
            priority: 'medium',
            title: `Re-engage ${contact.firstName} ${contact.lastName}`,
            description: `Contact has low response rate (${contact.responseRate}%) and hasn't been reached in ${daysSinceLastTouch} days.`,
            suggestedDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
            estimatedDuration: 10,
            relatedToType: 'contact',
            relatedToId: contact.id,
            relatedToName: `${contact.firstName} ${contact.lastName}`,
            reasoning: `Low engagement contact needs re-activation strategy`,
            confidence: 75,
            tags: ['re-engagement', 'low-response', 'nurturing'],
            context: {
              trigger: 'Low engagement detection',
              dataPoints: [`Response rate: ${contact.responseRate}%`, `${daysSinceLastTouch} days since last touch`],
              expectedOutcome: 'Improve engagement and response rates'
            }
          });
        }
      }
    });

    return suggestions;
  }

  private generateAccountManagementSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { accounts, deals, currentDate } = this.context;

    accounts.forEach(account => {
      // At-risk accounts need immediate attention
      if (Number(account.healthScore) < 50) {
        suggestions.push({
          id: `account-rescue-${account.id}`,
          type: 'meeting',
          priority: 'urgent',
          title: `Account rescue meeting: ${account.name}`,
          description: `Account health score is critically low (${account.healthScore}/100). Schedule emergency review meeting.`,
          suggestedDate: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          estimatedDuration: 90,
          relatedToType: 'account',
          relatedToId: account.id,
          relatedToName: account.name,
          reasoning: `Critical account health score requires immediate intervention`,
          confidence: 95,
          tags: ['account-rescue', 'critical', 'churn-risk'],
          context: {
            trigger: 'Critical account health',
            dataPoints: [`Health score: ${account.healthScore}/100`, `Account type: ${account.type}`],
            expectedOutcome: 'Identify issues and create recovery plan'
          }
        });
      }

      // High-value accounts with expansion potential
      const accountDeals = deals.filter(d => d.accountId === account.id);
      const totalAccountValue = accountDeals.reduce((sum, deal) => sum + Number(deal.value || 0), 0);
      
      if (totalAccountValue > 100000 && Number(account.healthScore) > 80) {
        suggestions.push({
          id: `account-expansion-${account.id}`,
          type: 'meeting',
          priority: 'high',
          title: `Expansion opportunity: ${account.name}`,
          description: `High-value account ($${totalAccountValue.toLocaleString()}) with excellent health (${account.healthScore}/100) shows expansion potential.`,
          suggestedDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
          estimatedDuration: 60,
          relatedToType: 'account',
          relatedToId: account.id,
          relatedToName: account.name,
          reasoning: `High-value, healthy account with strong expansion potential`,
          confidence: 85,
          tags: ['expansion', 'upsell', 'high-value'],
          context: {
            trigger: 'Expansion opportunity identification',
            dataPoints: [`Total value: $${totalAccountValue.toLocaleString()}`, `Health score: ${account.healthScore}/100`],
            expectedOutcome: 'Identify and pursue expansion opportunities'
          }
        });
      }
    });

    return suggestions;
  }

  private generateOverdueSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { activities, currentDate } = this.context;

    // Find overdue activities
    const overdueActivities = activities.filter(activity => {
      const dueDate = activity.dueDate || activity.scheduledAt;
      return dueDate && 
             new Date(dueDate) < currentDate && 
             activity.status === 'planned';
    });

    overdueActivities.forEach(activity => {
      const daysPastDue = Math.floor((currentDate.getTime() - new Date(activity.dueDate || activity.scheduledAt).getTime()) / (1000 * 60 * 60 * 24));
      
      suggestions.push({
        id: `overdue-followup-${activity.id}`,
        type: 'task',
        priority: daysPastDue > 7 ? 'urgent' : 'high',
        title: `Complete overdue: ${activity.subject}`,
        description: `Activity "${activity.subject}" is ${daysPastDue} days overdue. Immediate completion or rescheduling required.`,
        suggestedDate: new Date(currentDate.getTime() + 30 * 60 * 1000), // 30 minutes
        estimatedDuration: activity.duration || 30,
        relatedToType: activity.relatedToType || 'account',
        relatedToId: activity.relatedToId || activity.accountId || '',
        relatedToName: activity.subject,
        reasoning: `Overdue activity impacts workflow and relationship management`,
        confidence: 100,
        tags: ['overdue', 'urgent', 'completion'],
        context: {
          trigger: 'Overdue activity detection',
          dataPoints: [`${daysPastDue} days overdue`, `Activity type: ${activity.type}`, `Priority: ${activity.priority}`],
          expectedOutcome: 'Complete or reschedule overdue activity'
        }
      });
    });

    return suggestions;
  }

  private generateProactiveSuggestions(): ActivitySuggestion[] {
    if (!this.context) return [];
    
    const suggestions: ActivitySuggestion[] = [];
    const { leads, deals, contacts, currentDate } = this.context;

    // Quarterly business reviews for key accounts
    const keyContacts = contacts.filter(c => 
      c.isDecisionMaker && 
      Number(c.influenceLevel) >= 7
    );

    keyContacts.forEach(contact => {
      suggestions.push({
        id: `qbr-${contact.id}`,
        type: 'meeting',
        priority: 'medium',
        title: `Quarterly review with ${contact.firstName} ${contact.lastName}`,
        description: `Schedule quarterly business review to discuss performance, challenges, and future opportunities.`,
        suggestedDate: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
        estimatedDuration: 60,
        relatedToType: 'contact',
        relatedToId: contact.id,
        relatedToName: `${contact.firstName} ${contact.lastName}`,
        reasoning: `Proactive relationship management with key decision maker`,
        confidence: 70,
        tags: ['qbr', 'strategic', 'relationship'],
        context: {
          trigger: 'Proactive relationship management',
          dataPoints: [`Decision maker: ${contact.isDecisionMaker}`, `Influence level: ${contact.influenceLevel}`],
          expectedOutcome: 'Strengthen relationship and identify new opportunities'
        }
      });
    });

    return suggestions;
  }
}

export const aiActivitySuggestionEngine = new AIActivitySuggestionEngine();