// Quick script to create comprehensive activities for deals
import { db } from "./server/db.js";
import * as schema from "./shared/schema.js";
import { eq } from "drizzle-orm";

async function createComprehensiveActivitiesForAllDeals() {
  console.log("🎯 Creating comprehensive activities for all deals...");
  
  // Get all deals and their existing activity counts
  const deals = await db.select().from(schema.deals);
  const users = await db.select().from(schema.users);
  const userId = users[0]?.id;
  
  if (!userId) {
    console.log("No users found, skipping activity creation");
    return;
  }

  let totalCreated = 0;
  
  for (const deal of deals) {
    // Check existing activities for this deal
    const existingActivities = await db.select().from(schema.activities)
      .where(eq(schema.activities.dealId, deal.id));
    
    // Get associated account and contacts
    const account = await db.select().from(schema.accounts)
      .where(eq(schema.accounts.id, deal.accountId)).limit(1);
    const contacts = await db.select().from(schema.contacts)
      .where(eq(schema.contacts.accountId, deal.accountId)).limit(1);
    
    if (!account[0] || !contacts[0]) continue;
    
    const contact = contacts[0];
    const acc = account[0];
    
    console.log(`Deal: ${deal.name} has ${existingActivities.length} activities`);
    
    // If deal has fewer than 8 activities, create comprehensive set
    if (existingActivities.length < 8) {
      const activitiesToCreate = [
        // Discovery Phase
        {
          subject: `Initial Qualification - ${deal.name}`,
          type: "call",
          status: "completed",
          priority: "medium",
          description: `Initial lead qualification call for ${deal.name}`,
          outcome: "Lead qualified and interested in solution",
          duration: 20,
          scheduledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["qualification", "discovery"]
        },
        {
          subject: `Needs Assessment - ${deal.name}`,
          type: "meeting",
          status: "completed",
          priority: "high",
          description: `Detailed needs assessment meeting for ${deal.name}`,
          outcome: "Requirements gathered, next steps defined",
          duration: 60,
          scheduledAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["needs-assessment", "requirements"]
        },
        // Product Demo Phase
        {
          subject: `Product Demo - ${deal.name}`,
          type: "demo",
          status: deal.stage === 'qualification' ? "open" : "completed",
          priority: "critical",
          description: `Product demonstration tailored for ${acc.name}`,
          outcome: deal.stage === 'qualification' ? undefined : "Demo successful, strong interest expressed",
          duration: 90,
          scheduledAt: deal.stage === 'qualification' ? 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) :
            new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
          completedAt: deal.stage === 'qualification' ? undefined :
            new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["demo", "presentation"]
        },
        // Proposal Phase
        {
          subject: `Proposal Development - ${deal.name}`,
          type: "task",
          status: deal.stage === 'qualification' || deal.stage === 'discovery' ? "open" : "completed",
          priority: "high",
          description: `Develop comprehensive proposal for ${deal.name}`,
          outcome: deal.stage === 'qualification' || deal.stage === 'discovery' ? undefined : "Proposal completed and delivered",
          duration: 180,
          scheduledAt: deal.stage === 'qualification' || deal.stage === 'discovery' ? 
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) :
            new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          completedAt: deal.stage === 'qualification' || deal.stage === 'discovery' ? undefined :
            new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["proposal", "documentation"]
        },
        // Communication Activities
        {
          subject: `Weekly Check-in Email - ${deal.name}`,
          type: "email",
          status: "completed",
          priority: "medium",
          description: `Weekly status update for ${deal.name}`,
          outcome: "Status shared, positive feedback received",
          duration: 10,
          scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["check-in", "communication"]
        },
        // Contract Phase
        {
          subject: `Contract Discussion - ${deal.name}`,
          type: "call",
          status: deal.stage === 'closed-won' ? "completed" : 
                 deal.stage === 'negotiation' ? "in_progress" : "open",
          priority: "critical",
          description: `Contract terms discussion for ${deal.name}`,
          outcome: deal.stage === 'closed-won' ? "Terms agreed, contract executed" : undefined,
          duration: 45,
          scheduledAt: deal.stage === 'closed-won' ? 
            new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) :
            new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          completedAt: deal.stage === 'closed-won' ? 
            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) : undefined,
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["contract", "negotiation"]
        },
        // Implementation Planning
        {
          subject: `Implementation Planning - ${deal.name}`,
          type: "task",
          status: deal.stage === 'closed-won' ? "in_progress" : "open",
          priority: deal.stage === 'closed-won' ? "critical" : "medium",
          description: `Plan implementation timeline for ${deal.name}`,
          outcome: deal.stage === 'closed-won' ? "Implementation plan created" : undefined,
          duration: 120,
          scheduledAt: deal.stage === 'closed-won' ? 
            new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) :
            new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          completedAt: undefined,
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["implementation", "planning"]
        },
        // Follow-up Activity
        {
          subject: `Next Steps Follow-up - ${deal.name}`,
          type: "follow_up",
          status: deal.stage === 'closed-lost' ? "cancelled" : "open",
          priority: "medium",
          description: `Follow up on next steps for ${deal.name}`,
          outcome: deal.stage === 'closed-lost' ? undefined : "Next meeting scheduled",
          duration: 15,
          scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          completedAt: undefined,
          createdBy: userId,
          assignedTo: userId,
          dealId: deal.id,
          contactId: contact.id,
          accountId: acc.id,
          relatedToType: "deal",
          relatedToId: deal.id,
          tags: ["follow-up", "next-steps"]
        }
      ];
      
      // Filter out activities that might conflict with existing ones
      const filteredActivities = activitiesToCreate.slice(0, Math.max(0, 10 - existingActivities.length));
      
      try {
        const created = await db.insert(schema.activities).values(filteredActivities).returning();
        totalCreated += created.length;
        console.log(`✅ Created ${created.length} activities for deal: ${deal.name}`);
      } catch (error) {
        console.log(`⚠️ Error creating activities for ${deal.name}:`, error.message);
      }
    }
  }
  
  console.log(`🎯 Total comprehensive activities created: ${totalCreated}`);
}

createComprehensiveActivitiesForAllDeals().then(() => {
  console.log("✅ Script completed");
  process.exit(0);
}).catch(error => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});