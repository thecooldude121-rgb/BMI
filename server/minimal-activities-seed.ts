import { db } from "./db";
import * as schema from "@shared/schema";

export async function seedMinimalActivities() {
  try {
    console.log("🎯 Starting minimal activities seeding (4 activities total)...");

    // Clear existing activities
    await db.delete(schema.activities);
    console.log("🗑️ Cleared existing activities");

    // Get existing deals and accounts for relationships
    const deals = await db.select().from(schema.deals).limit(3);
    const accounts = await db.select().from(schema.accounts).limit(3);

    if (deals.length === 0 || accounts.length === 0) {
      console.log("❌ No deals or accounts found. Please run main seeding first.");
      return;
    }

    // Create exactly 4 activities - 2 completed, 2 upcoming
    const activitiesData = [
      // Completed Activities
      {
        subject: "Discovery call completed",
        type: "call" as const,
        status: "completed" as const,
        priority: "high" as const,
        description: "Initial discovery call to understand requirements and pain points",
        outcome: "Identified key integration needs and budget parameters",
        duration: 45,
        scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        relatedToType: "deal" as const,
        relatedToId: deals[0].id,
        relatedTo: {
          id: deals[0].id,
          name: deals[0].title,
          type: "deal"
        }
      },
      {
        subject: "Proposal presentation delivered",
        type: "presentation" as const,
        status: "completed" as const,
        priority: "medium" as const,
        description: "Presented comprehensive solution proposal to stakeholders",
        outcome: "Positive feedback received, next steps discussed",
        duration: 60,
        scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        relatedToType: "account" as const,
        relatedToId: accounts[0].id,
        relatedTo: {
          id: accounts[0].id,
          name: accounts[0].name,
          type: "account"
        }
      },
      // Upcoming Activities
      {
        subject: "Contract negotiation meeting",
        type: "meeting" as const,
        status: "open" as const,
        priority: "high" as const,
        description: "Negotiate final contract terms and pricing details",
        scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        relatedToType: "deal" as const,
        relatedToId: deals[1].id,
        relatedTo: {
          id: deals[1].id,
          name: deals[1].title,
          type: "deal"
        }
      },
      {
        subject: "Follow-up email with decision makers",
        type: "email" as const,
        status: "open" as const,
        priority: "medium" as const,
        description: "Send follow-up materials and schedule next steps",
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        relatedToType: "account" as const,
        relatedToId: accounts[1].id,
        relatedTo: {
          id: accounts[1].id,
          name: accounts[1].name,
          type: "account"
        }
      }
    ];

    // Insert activities
    for (const activityData of activitiesData) {
      await db.insert(schema.activities).values(activityData);
    }

    console.log("✅ Minimal activities seeding completed! Created 4 activities (2 completed, 2 upcoming)");
    
    return {
      total: 4,
      completed: 2,
      upcoming: 2
    };

  } catch (error) {
    console.error("❌ Error seeding minimal activities:", error);
    throw error;
  }
}