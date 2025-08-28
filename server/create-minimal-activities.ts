#!/usr/bin/env tsx

import { db } from './db';
import { activities, deals } from '../shared/schema';

async function createMinimalActivities() {
  try {
    console.log('🎯 Creating exactly 1 activity of each type for ALL deals scheduled for November 30th...');
    
    // Get ALL deals
    const dealsData = await db.select().from(deals);
    if (dealsData.length === 0) {
      console.log('❌ No deals found to create activities for');
      return;
    }
    
    console.log(`📊 Found ${dealsData.length} deals to create activities for`);
    const now = new Date();
    const userId = 'f310c13c-3edf-4f46-a6ec-46503ed02377'; // Default user
    
    // November 30th, 2025 - scheduled date for all activities
    const november30 = new Date('2025-11-30T10:00:00Z');
    
    // Define activity templates - 1 of each type  
    const activityTemplates = [
      // 1 Call
      {
        subject: 'Follow-up Call',
        type: 'call',
        description: 'Scheduled follow-up call to discuss project progress',
        status: 'planned',
        priority: 'high',
        duration: 30,
        dueDate: november30,
        completedAt: null,
      },
      
      // 1 Meeting
      {
        subject: 'Strategy Meeting',
        type: 'meeting',
        description: 'Strategic planning meeting with stakeholders',
        status: 'planned',
        priority: 'high',
        duration: 60,
        dueDate: november30,
        completedAt: null,
      },
      
      // 1 Task
      {
        subject: 'Project Review',
        type: 'task',
        description: 'Complete project review and documentation',
        status: 'planned',
        priority: 'medium',
        duration: 90,
        dueDate: november30,
        completedAt: null,
      },
      
      // 1 Note
      {
        subject: 'Meeting Notes',
        type: 'note',
        description: 'Prepare notes for upcoming client discussion',
        status: 'planned',
        priority: 'low',
        duration: 20,
        dueDate: november30,
        completedAt: null,
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
    console.log(`📊 Each deal now has: 1 call, 1 meeting, 1 task, 1 note`);
    console.log(`📊 All activities scheduled for November 30th, 2025`);
    console.log(`📊 Total breakdown: ${totalCreatedCount} activities (${dealsData.length} calls, ${dealsData.length} meetings, ${dealsData.length} tasks, ${dealsData.length} notes)`);
    
  } catch (error) {
    console.error('❌ Error creating activities:', error);
    process.exit(1);
  }
}

createMinimalActivities();