import { db } from "./storage";
import * as schema from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create a sample user
    const sampleUser = await db.insert(schema.users).values({
      email: 'john.smith@company.com',
      passwordHash: 'hashed_password_here',
      firstName: 'John',
      lastName: 'Smith',
      role: 'admin',
      department: 'Sales',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      isActive: true
    }).returning();

    const userId = sampleUser[0].id;

    // Create sample accounts
    const sampleAccounts = await db.insert(schema.accounts).values([
      {
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        industry: 'Technology',
        companySize: '51-200',
        annualRevenue: '5000000',
        website: 'https://techcorp.com',
        phone: '+1-555-0123',
        description: 'Leading technology solutions provider',
        ownerId: userId
      },
      {
        name: 'Global Manufacturing Inc',
        domain: 'globalmfg.com',
        industry: 'Manufacturing',
        companySize: '501-1000',
        annualRevenue: '50000000',
        website: 'https://globalmfg.com',
        phone: '+1-555-0124',
        description: 'Industrial manufacturing company',
        ownerId: userId
      },
      {
        name: 'StartupX',
        domain: 'startupx.io',
        industry: 'Technology',
        companySize: '11-50',
        annualRevenue: '500000',
        website: 'https://startupx.io',
        phone: '+1-555-0125',
        description: 'Innovative startup in the AI space',
        ownerId: userId
      }
    ]).returning();

    // Create sample contacts
    const sampleContacts = await db.insert(schema.contacts).values([
      {
        accountId: sampleAccounts[0].id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        position: 'CTO',
        department: 'Technology',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[1].id,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@globalmfg.com',
        phone: '+1-555-0124',
        position: 'VP Operations',
        department: 'Operations',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[2].id,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@startupx.io',
        phone: '+1-555-0125',
        position: 'CEO',
        department: 'Executive',
        isPrimary: true,
        ownerId: userId
      }
    ]).returning();

    // Create sample leads
    const sampleLeads = await db.insert(schema.leads).values([
      {
        contactId: sampleContacts[0].id,
        accountId: sampleAccounts[0].id,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Solutions',
        position: 'CTO',
        industry: 'Technology',
        stage: 'qualified',
        status: 'active',
        score: 85,
        value: '250000',
        probability: 75,
        source: 'Website',
        assignedTo: userId,
        notes: 'Interested in enterprise solution'
      },
      {
        contactId: sampleContacts[1].id,
        accountId: sampleAccounts[1].id,
        name: 'Michael Chen',
        email: 'michael.chen@globalmfg.com',
        phone: '+1-555-0124',
        company: 'Global Manufacturing Inc',
        position: 'VP Operations',
        industry: 'Manufacturing',
        stage: 'proposal',
        status: 'active',
        score: 92,
        value: '500000',
        probability: 80,
        source: 'Referral',
        assignedTo: userId,
        notes: 'Large scale implementation needed'
      }
    ]).returning();

    // Create sample deals
    const sampleDeals = await db.insert(schema.deals).values([
      {
        name: 'TechCorp Enterprise License',
        title: 'TechCorp Enterprise License',
        leadId: sampleLeads[0].id,
        accountId: sampleAccounts[0].id,
        contactId: sampleContacts[0].id,
        value: '250000',
        stage: 'negotiation',
        probability: 75,
        expectedCloseDate: new Date('2025-03-15'),
        assignedTo: userId,
        description: 'Enterprise software license deal',
        notes: 'Negotiating terms and pricing'
      },
      {
        name: 'Manufacturing Software Suite',
        title: 'Manufacturing Software Suite',
        leadId: sampleLeads[1].id,
        accountId: sampleAccounts[1].id,
        contactId: sampleContacts[1].id,
        value: '500000',
        stage: 'proposal',
        probability: 80,
        expectedCloseDate: new Date('2025-02-28'),
        assignedTo: userId,
        description: 'Complete manufacturing management system',
        notes: 'Proposal submitted, awaiting review'
      }
    ]).returning();

    // Create sample tasks
    await db.insert(schema.tasks).values([
      {
        title: 'Follow up with TechCorp',
        description: 'Follow up on contract negotiations',
        type: 'call',
        priority: 'high',
        status: 'pending',
        assignedTo: userId,
        relatedToType: 'deal',
        relatedToId: sampleDeals[0].id,
        dueDate: new Date('2025-01-25')
      },
      {
        title: 'Prepare proposal presentation',
        description: 'Create presentation for manufacturing client',
        type: 'other',
        priority: 'medium',
        status: 'in-progress',
        assignedTo: userId,
        relatedToType: 'deal',
        relatedToId: sampleDeals[1].id,
        dueDate: new Date('2025-01-30')
      }
    ]);

    // Create sample activities
    await db.insert(schema.activities).values([
      {
        subject: 'Initial Discovery Call',
        type: 'call',
        direction: 'outbound',
        status: 'completed',
        priority: 'medium',
        description: 'Initial discovery call with TechCorp team',
        duration: 45,
        completedAt: new Date('2025-01-20'),
        createdBy: userId,
        assignedTo: userId,
        leadId: sampleLeads[0].id,
        dealId: sampleDeals[0].id,
        contactId: sampleContacts[0].id
      },
      {
        subject: 'Proposal Email',
        type: 'email',
        direction: 'outbound',
        status: 'completed',
        priority: 'high',
        description: 'Sent detailed proposal to manufacturing client',
        completedAt: new Date('2025-01-21'),
        createdBy: userId,
        assignedTo: userId,
        leadId: sampleLeads[1].id,
        dealId: sampleDeals[1].id,
        contactId: sampleContacts[1].id
      }
    ]);

    // Create sample meeting
    await db.insert(schema.meetings).values([
      {
        title: 'TechCorp Strategy Session',
        date: new Date('2025-01-28T14:00:00Z'),
        duration: 60,
        attendees: [userId, sampleContacts[0].id],
        type: 'client-meeting',
        relatedToType: 'deal',
        relatedToId: sampleDeals[0].id,
        summary: 'Discuss implementation strategy and timeline',
        createdBy: userId
      }
    ]);

    console.log("✅ Database seeded successfully!");
    console.log(`Created ${sampleUser.length} users`);
    console.log(`Created ${sampleAccounts.length} accounts`);
    console.log(`Created ${sampleContacts.length} contacts`);
    console.log(`Created ${sampleLeads.length} leads`);
    console.log(`Created ${sampleDeals.length} deals`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}