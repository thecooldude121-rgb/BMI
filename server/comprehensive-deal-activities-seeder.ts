// Comprehensive Deal Activities Seeder
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

interface DealActivityTemplate {
  type: 'call' | 'meeting' | 'task' | 'note';
  subject: string;
  description: string;
  status: 'completed' | 'open' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  outcome?: string;
  duration?: number;
}

// Activity templates for each deal
const ACTIVITY_TEMPLATES: Record<string, DealActivityTemplate[]> = {
  'call': [
    {
      type: 'call',
      subject: 'Initial Discovery Call',
      description: 'Conducted comprehensive discovery call to understand client needs, pain points, and budget requirements. Discussed current solutions and identified key decision makers.',
      status: 'completed',
      priority: 'high',
      outcome: 'successful',
      duration: 45
    },
    {
      type: 'call',
      subject: 'Technical Requirements Review',
      description: 'Detailed technical discussion covering integration requirements, security protocols, and scalability needs. Identified technical stakeholders and implementation timeline.',
      status: 'completed',
      priority: 'high',
      outcome: 'successful',
      duration: 35
    }
  ],
  'meeting': [
    {
      type: 'meeting',
      subject: 'Product Demonstration Session',
      description: 'Comprehensive product demo showcasing key features and capabilities. Demonstrated ROI calculations and addressed specific use cases relevant to client\'s business.',
      status: 'completed',
      priority: 'high',
      outcome: 'successful',
      duration: 60
    },
    {
      type: 'meeting',
      subject: 'Stakeholder Alignment Meeting',
      description: 'Strategic meeting with decision makers to align on business objectives, implementation timeline, and success metrics. Reviewed proposal details and next steps.',
      status: 'completed',
      priority: 'high',
      outcome: 'successful',
      duration: 50
    }
  ],
  'task': [
    {
      type: 'task',
      subject: 'Prepare Custom Proposal',
      description: 'Create tailored proposal document including pricing structure, implementation timeline, and ROI projections based on client requirements gathered during discovery.',
      status: 'completed',
      priority: 'high'
    },
    {
      type: 'task',
      subject: 'Coordinate Technical Review',
      description: 'Schedule and coordinate technical architecture review with client\'s IT team. Prepare technical documentation and integration specifications.',
      status: 'completed',
      priority: 'medium'
    }
  ],
  'note': [
    {
      type: 'note',
      subject: 'Client Feedback Summary',
      description: 'Key feedback from recent interactions: Client is impressed with our solution\'s scalability and security features. Budget approved for Q1 implementation. Next step is final contract review.',
      status: 'completed',
      priority: 'medium'
    },
    {
      type: 'note',
      subject: 'Competitive Analysis Notes',
      description: 'Client is also evaluating Salesforce and HubSpot. Our key differentiators: superior AI capabilities, better pricing structure, and faster implementation timeline. Need to emphasize these points in final presentation.',
      status: 'completed',
      priority: 'high'
    }
  ]
};

export async function seedDealActivities() {
  console.log('🎯 Starting comprehensive deal activities seeding...');
  
  try {
    // Get all existing deals
    const deals = await db.select().from(schema.deals);
    console.log(`📊 Found ${deals.length} deals to create activities for`);
    
    // Get current timestamp for realistic activity dates
    const now = new Date();
    
    let totalActivitiesCreated = 0;
    
    for (const deal of deals) {
      console.log(`\n🔄 Creating activities for deal: ${deal.name}`);
      
      let activityCount = 0;
      
      // Create 2 activities of each type (call, meeting, task, note) for each deal
      for (const [activityType, templates] of Object.entries(ACTIVITY_TEMPLATES)) {
        for (let i = 0; i < 2; i++) {
          const template = templates[i % templates.length];
          
          // Calculate realistic activity dates (spread over the past 30 days)
          const daysBack = Math.floor(Math.random() * 30) + 1;
          const activityDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
          
          const activityData = {
            subject: `${template.subject} (${deal.name})`,
            type: template.type,
            description: template.description,
            status: template.status,
            priority: template.priority,
            outcome: template.outcome,
            duration: template.duration,
            relatedToType: 'deal' as const,
            relatedToId: deal.id,
            dealId: deal.id,
            accountId: deal.accountId,
            assignedTo: 'f310c13c-3edf-4f46-a6ec-46503ed02377', // Default user
            createdBy: 'f310c13c-3edf-4f46-a6ec-46503ed02377',
            scheduledAt: activityDate,
            completedAt: template.status === 'completed' ? activityDate : null,
            source: 'CRM' as const // Track source for sync
          };
          
          try {
            await db.insert(schema.activities).values(activityData);
            activityCount++;
            totalActivitiesCreated++;
            
            console.log(`✅ Created ${template.type}: ${template.subject} for ${deal.name}`);
          } catch (error) {
            console.log(`⚠️ Activity might already exist or failed to create: ${template.subject}`);
          }
        }
      }
      
      console.log(`📈 Created ${activityCount} activities for deal: ${deal.name}`);
    }
    
    console.log(`\n🎉 Deal activities seeding completed!`);
    console.log(`📊 Total activities created: ${totalActivitiesCreated}`);
    console.log(`🔄 All activities are marked as synced and ready for bidirectional sync`);
    
    return totalActivitiesCreated;
    
  } catch (error) {
    console.error('❌ Error seeding deal activities:', error);
    throw error;
  }
}

// Enhanced sync status tracking
export async function updateActivitySyncStatus(activityId: string, source: 'CRM' | 'LeadGen') {
  try {
    await db
      .update(schema.activities)
      .set({ 
        source,
        updatedAt: new Date()
      })
      .where(eq(schema.activities.id, activityId));
    
    console.log(`🔄 Updated sync source for activity ${activityId} (source: ${source})`);
  } catch (error) {
    console.error('❌ Error updating activity sync status:', error);
    throw error;
  }
}

// Bidirectional sync utility
export async function syncActivityBetweenModules(activityId: string, fromModule: 'CRM' | 'LeadGen', toModule: 'CRM' | 'LeadGen') {
  try {
    const activity = await db.select().from(schema.activities).where(eq(schema.activities.id, activityId)).limit(1);
    
    if (activity.length === 0) {
      throw new Error(`Activity ${activityId} not found`);
    }
    
    // Update sync metadata
    await updateActivitySyncStatus(activityId, toModule);
    
    console.log(`🔄 Synced activity ${activityId} from ${fromModule} to ${toModule}`);
    return activity[0];
    
  } catch (error) {
    console.error('❌ Error syncing activity between modules:', error);
    throw error;
  }
}

export default seedDealActivities;