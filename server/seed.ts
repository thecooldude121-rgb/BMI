import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedMinimalActivities(userId: string, accountIds: string[], contactIds: string[], leadIds: string[], dealIds: string[]) {
  console.log("🎯 Starting minimal activities seeding (4 activities total)...");
  
  // Clear existing activities for minimal setup
  await db.delete(schema.activities);
  console.log("🗑️ Cleared existing activities for minimal setup");
  
  const minimalActivities = [
    // Completed Activities (2)
    {
      subject: "Discovery call completed",
      type: "call",
      status: "completed",
      priority: "high",
      description: "Initial discovery call to understand requirements",
      outcome: "Identified key needs and budget parameters",
      duration: 45,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
      relatedToType: "deal",
      relatedToId: dealIds[0]
    },
    {
      subject: "Proposal presentation delivered",
      type: "presentation",
      status: "completed",
      priority: "medium",
      description: "Presented comprehensive solution proposal to stakeholders",
      outcome: "Positive feedback received, next steps discussed",
      duration: 60,
      scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      relatedToType: "account",
      relatedToId: accountIds[0]
    },
    // Upcoming Activities (2)
    {
      subject: "Contract negotiation meeting",
      type: "meeting",
      status: "open",
      priority: "high",
      description: "Negotiate final contract terms and pricing details",
      scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      relatedToType: "deal",
      relatedToId: dealIds[1] || dealIds[0]
    },
    {
      subject: "Follow-up email with decision makers",
      type: "email",
      status: "open",
      priority: "medium",
      description: "Send follow-up materials and schedule next steps",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      relatedToType: "account",
      relatedToId: accountIds[1] || accountIds[0]
    }
  ];
  
  // Insert minimal activities into database
  for (const activityData of minimalActivities) {
    await db.insert(schema.activities).values(activityData);
  }

  console.log("✅ Minimal activities seeding completed! Created 4 activities (2 completed, 2 upcoming)");
  
  return {
    total: 4,
    completed: 2,
    upcoming: 2
  };
}

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if user exists, if not create one
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'john.smith@company.com')).limit(1);
    let userId: string;
    
    if (existingUser.length === 0) {
      console.log("👤 Creating user...");
      const user = await db.insert(schema.users).values({
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        position: "Sales Manager",
        department: "Sales"
      }).returning();
      userId = user[0].id;
    } else {
      console.log("👤 Using existing user data");
      userId = existingUser[0].id;
    }

    // Sample data for each module
    const sampleAccounts = [
      {
        name: "TechCorp Solutions",
        website: "https://techcorp.com",
        industry: "Technology",
        size: "501-1000",
        phone: "+1-555-0123",
        email: "contact@techcorp.com",
        address: "123 Tech Street, San Francisco, CA 94105",
        description: "Leading provider of enterprise software solutions",
        revenue: 50000000,
        employeeCount: 750,
        type: "Customer"
      },
      {
        name: "GreenEnergy Dynamics",
        website: "https://greenenergydynamics.com", 
        industry: "Energy",
        size: "101-200",
        phone: "+1-555-0128",
        email: "hello@greenenergydynamics.com",
        address: "987 Solar Way, Austin, TX 78701",
        description: "Renewable energy solutions and smart grid technology",
        revenue: 18000000,
        employeeCount: 180,
        type: "Prospect"
      }
    ];

    // Insert accounts
    const accounts = await db.insert(schema.accounts).values(sampleAccounts).returning();
    console.log(`Created ${accounts.length} accounts`);

    // Sample contacts
    const sampleContacts = [
      {
        firstName: "Sarah",
        lastName: "Johnson", 
        email: "sarah.johnson@techcorp.com",
        phone: "+1-555-0123",
        title: "CTO",
        accountId: accounts[0].id
      },
      {
        firstName: "Mike",
        lastName: "Wilson",
        email: "mike.wilson@greenenergydynamics.com", 
        phone: "+1-555-0128",
        title: "VP Engineering",
        accountId: accounts[1].id
      }
    ];

    const contacts = await db.insert(schema.contacts).values(sampleContacts).returning();
    console.log(`Created ${contacts.length} contacts`);

    // Sample leads
    const sampleLeads = [
      {
        firstName: "Emily",
        lastName: "Chen",
        email: "emily.chen@startup.com",
        phone: "+1-555-0199",
        company: "Innovation Startup",
        title: "Founder",
        status: "active",
        source: "website",
        score: 85
      },
      {
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@enterprise.com", 
        phone: "+1-555-0188",
        company: "Enterprise Corp",
        title: "IT Director",
        status: "nurturing",
        source: "referral",
        score: 92
      }
    ];

    const leads = await db.insert(schema.leads).values(sampleLeads).returning();
    console.log(`Created ${leads.length} leads`);

    // Sample deals
    const sampleDeals = [
      {
        title: "TechCorp Enterprise Solution",
        accountId: accounts[0].id,
        contactId: contacts[0].id,
        amount: 125000,
        stage: "proposal",
        probability: 75,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Enterprise software implementation"
      },
      {
        title: "GreenEnergy Smart Grid Platform",
        accountId: accounts[1].id,
        contactId: contacts[1].id,
        amount: 85000,
        stage: "negotiation", 
        probability: 85,
        expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Smart grid monitoring system"
      }
    ];

    const deals = await db.insert(schema.deals).values(sampleDeals).returning();
    console.log(`Created ${deals.length} deals`);

    // Seed minimal activities
    await seedMinimalActivities(
      userId,
      accounts.map(a => a.id),
      contacts.map(c => c.id), 
      leads.map(l => l.id),
      deals.map(d => d.id)
    );

    console.log("✅ Database seeded successfully!");
    return {
      users: 1,
      accounts: accounts.length,
      contacts: contacts.length,
      leads: leads.length,
      deals: deals.length,
      activities: 4
    };

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
