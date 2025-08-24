import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedVariedCRMData() {
  try {
    console.log("🌱 Starting varied CRM data seeding (10 records per module)...");

    // Check if data already exists to prevent duplication
    const existingAccounts = await db.select().from(schema.accounts);
    if (existingAccounts.length > 2) {
      console.log("📊 CRM data already exists, skipping seeding to prevent duplicates");
      return { accounts: 0, contacts: 0, leads: 0, deals: 0, activities: 0, message: "Data already exists" };
    }

    // Clear existing data first (respecting foreign key constraints)
    await db.delete(schema.meetings);
    await db.delete(schema.activities);
    await db.delete(schema.tasks);
    await db.delete(schema.deals);
    await db.delete(schema.leads);  
    await db.delete(schema.contacts);
    await db.delete(schema.accounts);
    console.log("🗑️ Cleared existing CRM data");

    // Get existing user
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'john.smith@company.com')).limit(1);
    if (existingUser.length === 0) {
      console.log("❌ No user found. Please run main seeding first.");
      return;
    }

    const userId = existingUser[0].id;

    // Create 10 varied accounts
    const accountsToCreate = [
      { name: "TechCorp Solutions", industry: "Technology", size: "501-1000", revenue: 50000000, type: "Customer" },
      { name: "GreenEnergy Dynamics", industry: "Energy", size: "101-200", revenue: 18000000, type: "Prospect" },
      { name: "Healthcare Partners LLC", industry: "Healthcare", size: "201-500", revenue: 25000000, type: "Customer" },
      { name: "EduTech Innovations", industry: "Education", size: "51-100", revenue: 12000000, type: "Customer" },
      { name: "Logistics Prime", industry: "Transportation", size: "501-1000", revenue: 75000000, type: "Prospect" },
      { name: "Biotech Research Corp", industry: "Biotechnology", size: "201-500", revenue: 45000000, type: "Customer" },
      { name: "Fashion Forward Studio", industry: "Fashion", size: "11-50", revenue: 5000000, type: "Prospect" },
      { name: "AgriTech Solutions", industry: "Agriculture", size: "101-200", revenue: 22000000, type: "Customer" },
      { name: "MediaStream Networks", industry: "Media", size: "201-500", revenue: 35000000, type: "Prospect" },
      { name: "FinTech Innovators", industry: "Financial Services", size: "101-200", revenue: 28000000, type: "Prospect" }
    ];

    const accounts = [];
    for (let i = 0; i < accountsToCreate.length; i++) {
      const data = accountsToCreate[i];
      const result = await db.insert(schema.accounts).values({
        name: data.name,
        website: `https://${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: data.industry,
        size: data.size,
        phone: `+1-555-012${i}`,
        email: `contact@${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
        address: `${100 + i} Business St, City, State ${10000 + i}`,
        description: `${data.industry} company specializing in innovative solutions`,
        revenue: data.revenue,
        employeeCount: Math.floor(data.revenue / 100000),
        type: data.type
      }).returning();
      accounts.push(result[0]);
    }
    console.log(`✅ Created ${accounts.length} accounts`);

    // Create 10 varied contacts
    const contactNames = [
      { firstName: "Sarah", lastName: "Johnson", title: "VP of Engineering", department: "Engineering" },
      { firstName: "Michael", lastName: "Chen", title: "Chief Technology Officer", department: "Technology" },
      { firstName: "Emily", lastName: "Rodriguez", title: "Director of Operations", department: "Operations" },
      { firstName: "David", lastName: "Kumar", title: "Product Manager", department: "Product" },
      { firstName: "Lisa", lastName: "Williams", title: "Head of Procurement", department: "Procurement" },
      { firstName: "Robert", lastName: "Anderson", title: "Research Director", department: "Research" },
      { firstName: "Maria", lastName: "Garcia", title: "Creative Director", department: "Design" },
      { firstName: "James", lastName: "Thompson", title: "VP of Sales", department: "Sales" },
      { firstName: "Anna", lastName: "Lee", title: "Business Development Manager", department: "Business Development" },
      { firstName: "Carlos", lastName: "Martinez", title: "Chief Financial Officer", department: "Finance" }
    ];

    const contacts = [];
    for (let i = 0; i < contactNames.length; i++) {
      const contact = contactNames[i];
      const result = await db.insert(schema.contacts).values({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: `${contact.firstName.toLowerCase()}.${contact.lastName.toLowerCase()}@${accounts[i].name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1-555-100${i}`,
        title: contact.title,
        accountId: accounts[i].id,
        department: contact.department,
        leadSource: ["website", "referral", "trade_show", "social_media", "cold_call"][i % 5],
        status: i === 4 ? "inactive" : "active"
      }).returning();
      contacts.push(result[0]);
    }
    console.log(`✅ Created ${contacts.length} contacts`);

    // Create 10 varied leads
    const leadData = [
      { firstName: "Alex", lastName: "Thompson", company: "NextGen Startup", title: "Founder & CEO", industry: "Technology", rating: "Hot", estimatedValue: 50000 },
      { firstName: "Jessica", lastName: "Brown", company: "Industrial Solutions Ltd", title: "Operations Manager", industry: "Manufacturing", rating: "Warm", estimatedValue: 120000 },
      { firstName: "Ryan", lastName: "Wilson", company: "Strategic Consulting Group", title: "Senior Partner", industry: "Consulting", rating: "Hot", estimatedValue: 75000 },
      { firstName: "Sophie", lastName: "Davis", company: "Retail Chain Plus", title: "IT Director", industry: "Retail", rating: "Warm", estimatedValue: 90000 },
      { firstName: "Marcus", lastName: "Johnson", company: "Luxury Hotels Group", title: "VP of Technology", industry: "Hospitality", rating: "Cold", estimatedValue: 30000 },
      { firstName: "Rachel", lastName: "Kim", company: "Community Impact Foundation", title: "Program Director", industry: "Non-Profit", rating: "Warm", estimatedValue: 25000 },
      { firstName: "Daniel", lastName: "Rodriguez", company: "BuildTech Construction", title: "Project Manager", industry: "Construction", rating: "Hot", estimatedValue: 85000 },
      { firstName: "Emma", lastName: "Taylor", company: "Taylor & Associates Law", title: "Managing Partner", industry: "Legal", rating: "Warm", estimatedValue: 40000 },
      { firstName: "Kevin", lastName: "Chang", company: "Gourmet Food Services", title: "Operations Director", industry: "Food Service", rating: "Cold", estimatedValue: 35000 },
      { firstName: "Natalie", lastName: "White", company: "Prime Real Estate Group", title: "Sales Manager", industry: "Real Estate", rating: "Hot", estimatedValue: 65000 }
    ];

    const leads = [];
    for (let i = 0; i < leadData.length; i++) {
      const lead = leadData[i];
      const result = await db.insert(schema.leads).values({
        name: `${lead.firstName} ${lead.lastName}`,
        email: `${lead.firstName.toLowerCase()}.${lead.lastName.toLowerCase()}@${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1-555-200${i}`,
        company: lead.company,
        position: lead.title,
        industry: lead.industry,
        stage: ["new", "contacted", "qualified", "proposal"][i % 4],
        status: ["active", "inactive", "nurturing"][i % 3],
        source: ["website", "trade_show", "referral", "social_media", "cold_call"][i % 5],
        value: lead.estimatedValue,
        rating: lead.rating === "Hot" ? 5 : lead.rating === "Warm" ? 3 : 1,
        notes: `Interested in solutions for ${lead.industry.toLowerCase()} sector`
      }).returning();
      leads.push(result[0]);
    }
    console.log(`✅ Created ${leads.length} leads`);

    // Create 10 varied deals (4 proposal, 4 negotiation, 2 other stages)
    const dealData = [
      // Proposal stage deals (4)
      { name: "TechCorp Enterprise License", amount: 250000, stage: "proposal", probability: 75, type: "New Business" },
      { name: "Biotech Research Platform", amount: 275000, stage: "proposal", probability: 55, type: "New Business" },
      { name: "FinTech Security Suite", amount: 220000, stage: "proposal", probability: 70, type: "New Business" },
      { name: "AgriTech IoT Implementation", amount: 165000, stage: "proposal", probability: 60, type: "New Business" },
      
      // Negotiation stage deals (4)
      { name: "GreenEnergy Solar Integration", amount: 180000, stage: "negotiation", probability: 65, type: "New Business" },
      { name: "Fashion Design Studio Tools", amount: 45000, stage: "negotiation", probability: 80, type: "New Business" },
      { name: "Healthcare Digital Transformation", amount: 320000, stage: "negotiation", probability: 70, type: "New Business" },
      { name: "MediaStream Content Platform", amount: 280000, stage: "negotiation", probability: 85, type: "New Business" },
      
      // Other stages (2)
      { name: "EduTech Platform Expansion", amount: 95000, stage: "closed-won", probability: 100, type: "Expansion" },
      { name: "Logistics Optimization Suite", amount: 450000, stage: "qualification", probability: 30, type: "New Business" }
    ];

    const deals = [];
    for (let i = 0; i < dealData.length; i++) {
      const deal = dealData[i];
      const result = await db.insert(schema.deals).values({
        name: deal.name,
        title: deal.name,
        value: deal.amount,
        stage: deal.stage,
        probability: deal.probability,
        expectedCloseDate: new Date(Date.now() + (30 + i * 15) * 24 * 60 * 60 * 1000),
        accountId: accounts[i].id,
        contactId: contacts[i].id,
        description: `${deal.type} opportunity for ${accounts[i].name}`,
        nextStep: "Follow up with decision maker",
        notes: "Standard competitive landscape analysis needed"
      }).returning();
      deals.push(result[0]);
    }
    console.log(`✅ Created ${deals.length} deals`);

    // Create comprehensive activities that sync across all CRM modules
    console.log("🎯 Creating synchronized activities across all CRM modules...");
    
    const activitiesData = [
      // Lead-related activities
      { type: 'call', subject: 'Discovery call with TechCorp', leadId: leads[0].id, accountId: accounts[0].id, contactId: contacts[0].id, status: 'completed', outcome: 'Qualified opportunity', direction: 'outbound' },
      { type: 'email', subject: 'Follow-up email to GreenEnergy', leadId: leads[1].id, accountId: accounts[1].id, contactId: contacts[1].id, status: 'completed', outcome: 'Proposal requested', direction: 'outbound' },
      { type: 'meeting', subject: 'Product demo for Healthcare Partners', leadId: leads[2].id, accountId: accounts[2].id, contactId: contacts[2].id, status: 'planned', direction: 'outbound' },
      
      // Deal-related activities
      { type: 'meeting', subject: 'Contract negotiation meeting', dealId: deals[0].id, accountId: accounts[0].id, contactId: contacts[0].id, status: 'completed', outcome: 'Terms agreed', direction: 'inbound' },
      { type: 'call', subject: 'Closing call with decision maker', dealId: deals[1].id, accountId: accounts[1].id, contactId: contacts[1].id, status: 'planned', direction: 'outbound' },
      { type: 'email', subject: 'Contract documents sent', dealId: deals[2].id, accountId: accounts[2].id, contactId: contacts[2].id, status: 'completed', outcome: 'Documents reviewed', direction: 'outbound' },
      
      // Contact-focused activities
      { type: 'call', subject: 'Relationship building call', contactId: contacts[3].id, accountId: accounts[3].id, status: 'completed', outcome: 'Good rapport established', direction: 'outbound' },
      { type: 'email', subject: 'Monthly check-in email', contactId: contacts[4].id, accountId: accounts[4].id, status: 'completed', outcome: 'Partnership discussed', direction: 'outbound' },
      
      // Account-focused activities
      { type: 'meeting', subject: 'Quarterly business review', accountId: accounts[5].id, contactId: contacts[5].id, status: 'planned', direction: 'inbound' },
      { type: 'email', subject: 'New product announcement', accountId: accounts[6].id, contactId: contacts[6].id, status: 'completed', outcome: 'Interest expressed', direction: 'outbound' },
      
      // Cross-module activities (lead to deal progression)
      { type: 'task', subject: 'Convert qualified lead to deal', leadId: leads[3].id, dealId: deals[3].id, accountId: accounts[3].id, contactId: contacts[3].id, status: 'completed', outcome: 'Deal created successfully', direction: 'outbound' },
      { type: 'note', subject: 'Customer feedback on proposal', dealId: deals[4].id, contactId: contacts[4].id, accountId: accounts[4].id, status: 'completed', outcome: 'Positive feedback received', direction: 'inbound' }
    ];

    const activities = [];
    for (let i = 0; i < activitiesData.length; i++) {
      const activityData = activitiesData[i];
      const result = await db.insert(schema.activities).values({
        subject: activityData.subject,
        type: activityData.type,
        direction: activityData.direction,
        status: activityData.status,
        priority: 'medium',
        description: `${activityData.type.charAt(0).toUpperCase() + activityData.type.slice(1)} activity for ${activityData.subject}`,
        outcome: activityData.outcome,
        duration: Math.floor(Math.random() * 60) + 15, // 15-75 minutes
        scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Next 7 days
        completedAt: activityData.status === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null, // Last 30 days
        createdBy: userId,
        assignedTo: userId,
        leadId: activityData.leadId || null,
        dealId: activityData.dealId || null,
        contactId: activityData.contactId || null,
        accountId: activityData.accountId || null,
        relatedToType: activityData.leadId ? 'lead' : activityData.dealId ? 'deal' : activityData.contactId ? 'contact' : 'account',
        relatedToId: activityData.leadId || activityData.dealId || activityData.contactId || activityData.accountId
      }).returning();
      activities.push(result[0]);
    }
    
    console.log(`✅ Created ${activities.length} synchronized activities across all CRM modules`);
    console.log("🎉 Varied CRM data seeding completed successfully!");
    return { accounts: accounts.length, contacts: contacts.length, leads: leads.length, deals: deals.length, activities: activities.length };

  } catch (error) {
    console.error("❌ Error seeding varied CRM data:", error);
    throw error;
  }
}