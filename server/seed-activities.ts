import { db } from "./db";
import * as schema from "@shared/schema";

export async function seedDealActivities() {
  try {
    console.log("🎯 Creating comprehensive activities for all deals...");
    
    // Get all deals
    const deals = await db.select().from(schema.deals);
    const contacts = await db.select().from(schema.contacts);
    const accounts = await db.select().from(schema.accounts);
    const users = await db.select().from(schema.users);
    
    if (deals.length === 0) {
      console.log("❌ No deals found. Please seed deals first.");
      return;
    }
    
    const userId = users[0]?.id;
    if (!userId) {
      console.log("❌ No user found.");
      return;
    }
    
    // Clear existing activities
    await db.delete(schema.activities);
    console.log("🗑️ Cleared existing activities");
    
    const activitiesData = [];
    
    // Create 6 activities per deal (3 open, 3 closed) for each type
    for (let i = 0; i < deals.length; i++) {
      const deal = deals[i];
      const contact = contacts[i % contacts.length];
      const account = accounts[i % accounts.length];
      
      // Open Activities
      const openActivities = [
        {
          type: 'task',
          subject: `Follow up on ${deal.name} proposal`,
          status: 'planned',
          priority: 'high',
          description: `Complete follow-up tasks for ${deal.name} deal`,
          direction: 'outbound',
          scheduledAt: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000), // Next few days
          duration: 30
        },
        {
          type: 'meeting',
          subject: `Contract discussion for ${deal.name}`,
          status: 'planned',
          priority: 'medium',
          description: `Scheduled meeting to discuss contract terms for ${deal.name}`,
          direction: 'inbound',
          scheduledAt: new Date(Date.now() + (i + 2) * 24 * 60 * 60 * 1000),
          duration: 60
        },
        {
          type: 'call',
          subject: `Check-in call for ${deal.name}`,
          status: 'planned',
          priority: 'medium',
          description: `Regular check-in call with decision maker for ${deal.name}`,
          direction: 'outbound',
          scheduledAt: new Date(Date.now() + (i + 3) * 24 * 60 * 60 * 1000),
          duration: 45
        }
      ];
      
      // Closed Activities
      const closedActivities = [
        {
          type: 'task',
          subject: `Prepared proposal for ${deal.name}`,
          status: 'completed',
          priority: 'high',
          description: `Completed proposal preparation for ${deal.name}`,
          direction: 'outbound',
          completedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000), // Past few days
          outcome: 'Proposal submitted successfully',
          duration: 120
        },
        {
          type: 'meeting',
          subject: `Discovery meeting for ${deal.name}`,
          status: 'completed',
          priority: 'high',
          description: `Initial discovery meeting for ${deal.name} opportunity`,
          direction: 'inbound',
          completedAt: new Date(Date.now() - (i + 2) * 24 * 60 * 60 * 1000),
          outcome: 'Requirements gathered, next steps defined',
          duration: 90
        },
        {
          type: 'call',
          subject: `Introduction call for ${deal.name}`,
          status: 'completed',
          priority: 'medium',
          description: `Initial introduction and qualification call for ${deal.name}`,
          direction: 'outbound',
          completedAt: new Date(Date.now() - (i + 3) * 24 * 60 * 60 * 1000),
          outcome: 'Qualified opportunity, moving to proposal stage',
          duration: 30
        }
      ];
      
      // Combine all activities for this deal
      const allActivities = [...openActivities, ...closedActivities];
      
      for (const activityData of allActivities) {
        activitiesData.push({
          subject: activityData.subject,
          type: activityData.type,
          direction: activityData.direction,
          status: activityData.status,
          priority: activityData.priority,
          description: activityData.description,
          outcome: activityData.outcome || null,
          duration: activityData.duration,
          scheduledAt: activityData.scheduledAt || null,
          completedAt: activityData.completedAt || null,
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: account.id,
          relatedToType: 'deal',
          relatedToId: deal.id
        });
      }
    }
    
    // Insert all activities
    const insertedActivities = [];
    for (const activityData of activitiesData) {
      const result = await db.insert(schema.activities).values(activityData).returning();
      insertedActivities.push(result[0]);
    }
    
    console.log(`✅ Created ${insertedActivities.length} activities for ${deals.length} deals`);
    console.log(`📊 Open activities: ${insertedActivities.filter(a => a.status === 'planned').length}`);
    console.log(`📊 Closed activities: ${insertedActivities.filter(a => a.status === 'completed').length}`);
    console.log(`📊 Tasks: ${insertedActivities.filter(a => a.type === 'task').length}`);
    console.log(`📊 Meetings: ${insertedActivities.filter(a => a.type === 'meeting').length}`);
    console.log(`📊 Calls: ${insertedActivities.filter(a => a.type === 'call').length}`);
    
    return insertedActivities;
    
  } catch (error) {
    console.error("❌ Error seeding deal activities:", error);
    throw error;
  }
}

// Run if called directly
seedDealActivities().then(() => {
  console.log("🎉 Deal activities seeding completed!");
}).catch(error => {
  console.error("❌ Seeding failed:", error);
});