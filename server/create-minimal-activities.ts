#!/usr/bin/env tsx

import { db } from './db';
import { activities, deals } from '../shared/schema';

async function createMinimalActivities() {
  try {
    console.log('🎯 Creating exactly 2 activities of each type for ALL deals...');
    
    // Get ALL deals
    const dealsData = await db.select().from(deals);
    if (dealsData.length === 0) {
      console.log('❌ No deals found to create activities for');
      return;
    }
    
    console.log(`📊 Found ${dealsData.length} deals to create activities for`);
    const now = new Date();
    const userId = 'f310c13c-3edf-4f46-a6ec-46503ed02377'; // Default user
    
    // Define minimal activity templates
    const activityTemplates = [
      // 2 Calls
      {
        subject: 'Discovery Call',
        type: 'call',
        description: 'Initial discovery call to understand requirements',
        status: 'completed',
        priority: 'medium',
        duration: 45,
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        subject: 'Follow-up Call',
        type: 'call', 
        description: 'Follow-up call to discuss proposal',
        status: 'completed',
        priority: 'high',
        duration: 30,
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      
      // 2 Meetings
      {
        subject: 'Product Demo',
        type: 'meeting',
        description: 'Product demonstration meeting',
        status: 'completed',
        priority: 'high',
        duration: 60,
        completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        subject: 'Stakeholder Meeting',
        type: 'meeting',
        description: 'Meeting with key stakeholders',
        status: 'completed',
        priority: 'high',
        duration: 90,
        completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      
      // 2 Tasks
      {
        subject: 'Prepare Proposal',
        type: 'task',
        description: 'Prepare detailed proposal document',
        status: 'completed',
        priority: 'medium',
        duration: 120,
        completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        subject: 'Technical Review',
        type: 'task',
        description: 'Review technical requirements',
        status: 'completed',
        priority: 'medium',
        duration: 60,
        completedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      
      // 2 Notes
      {
        subject: 'Client Requirements',
        type: 'note',
        description: 'Notes on client requirements and preferences',
        status: 'completed',
        priority: 'low',
        duration: 15,
        completedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        subject: 'Competitive Analysis',
        type: 'note',
        description: 'Analysis of competitive landscape',
        status: 'completed',
        priority: 'low',
        duration: 30,
        completedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      }
    ];
    
    let totalCreatedCount = 0;
    
    // Create activities for each deal
    for (const deal of dealsData) {
      console.log(`\n🔄 Creating activities for deal: ${deal.name}`);
      let dealActivityCount = 0;
      
      for (const template of activityTemplates) {
        const activityData = {
          ...template,
          subject: `${template.subject} (${deal.name})`,
          relatedToType: 'deal' as const,
          relatedToId: deal.id,
          dealId: deal.id,
          accountId: deal.accountId,
          assignedTo: userId,
          createdBy: userId,
          source: 'manual' as const,
          outcome: 'Successful completion'
        };
        
        await db.insert(activities).values(activityData);
        dealActivityCount++;
        totalCreatedCount++;
        console.log(`✅ Created ${template.type}: ${template.subject} for ${deal.name}`);
      }
      
      console.log(`📈 Created ${dealActivityCount} activities for ${deal.name}`);
    }
    
    console.log(`\n🎉 Successfully created ${totalCreatedCount} activities total across ${dealsData.length} deals`);
    console.log(`📊 Each deal now has: 2 calls, 2 meetings, 2 tasks, 2 notes`);
    console.log(`📊 Total breakdown: ${totalCreatedCount} activities (${dealsData.length * 2} calls, ${dealsData.length * 2} meetings, ${dealsData.length * 2} tasks, ${dealsData.length * 2} notes)`);
    
  } catch (error) {
    console.error('❌ Error creating activities:', error);
    process.exit(1);
  }
}

createMinimalActivities();