import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if user already exists
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'john.smith@company.com')).limit(1);
    
    let sampleUser;
    if (existingUser.length > 0) {
      sampleUser = existingUser;
      console.log("👤 Using existing user data");
    } else {
      // Create a sample user
      sampleUser = await db.insert(schema.users).values({
        email: 'john.smith@company.com',
        passwordHash: 'hashed_password_here',
        firstName: 'John',
        lastName: 'Smith',
        role: 'admin',
        department: 'Sales',
        avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        isActive: true
      }).returning();
    }

    const userId = sampleUser[0].id;

    // Create sample accounts (5 companies)
    const sampleAccounts = await db.insert(schema.accounts).values([
      {
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        industry: 'Technology',
        companySize: '51-200',
        annualRevenue: '5000000',
        website: 'https://techcorp.com',
        phone: '+1-555-0123',
        description: 'Leading technology solutions provider specializing in enterprise software',
        address: { street: '123 Tech Ave', city: 'San Francisco', state: 'CA', zip: '94102', country: 'USA' },
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
        description: 'Industrial manufacturing company with worldwide operations',
        address: { street: '456 Industrial Blvd', city: 'Detroit', state: 'MI', zip: '48201', country: 'USA' },
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
        description: 'Innovative startup in the AI space focused on machine learning solutions',
        address: { street: '789 Innovation St', city: 'Austin', state: 'TX', zip: '73301', country: 'USA' },
        ownerId: userId
      },
      {
        name: 'HealthTech Innovations',
        domain: 'healthtech.com',
        industry: 'Healthcare',
        companySize: '201-500',
        annualRevenue: '15000000',
        website: 'https://healthtech.com',
        phone: '+1-555-0126',
        description: 'Healthcare technology company developing medical devices and software',
        address: { street: '321 Medical Dr', city: 'Boston', state: 'MA', zip: '02101', country: 'USA' },
        ownerId: userId
      },
      {
        name: 'Green Energy Corp',
        domain: 'greenenergy.com',
        industry: 'Energy',
        companySize: '1000+',
        annualRevenue: '100000000',
        website: 'https://greenenergy.com',
        phone: '+1-555-0127',
        description: 'Renewable energy company focused on solar and wind power solutions',
        address: { street: '654 Solar Way', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'USA' },
        ownerId: userId
      }
    ]).returning();

    // Create sample contacts (5 contacts)
    const sampleContacts = await db.insert(schema.contacts).values([
      {
        accountId: sampleAccounts[0].id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        mobile: '+1-555-0223',
        position: 'Chief Technology Officer',
        department: 'Technology',
        linkedinUrl: 'https://linkedin.com/in/sarah-johnson-tech',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[1].id,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@globalmfg.com',
        phone: '+1-555-0124',
        mobile: '+1-555-0224',
        position: 'VP Operations',
        department: 'Operations',
        linkedinUrl: 'https://linkedin.com/in/michael-chen-ops',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[2].id,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@startupx.io',
        phone: '+1-555-0125',
        mobile: '+1-555-0225',
        position: 'Chief Executive Officer',
        department: 'Executive',
        linkedinUrl: 'https://linkedin.com/in/emma-wilson-ceo',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[3].id,
        firstName: 'Dr. Robert',
        lastName: 'Martinez',
        email: 'robert.martinez@healthtech.com',
        phone: '+1-555-0126',
        mobile: '+1-555-0226',
        position: 'Chief Medical Officer',
        department: 'Medical',
        linkedinUrl: 'https://linkedin.com/in/dr-robert-martinez',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[4].id,
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@greenenergy.com',
        phone: '+1-555-0127',
        mobile: '+1-555-0227',
        position: 'VP of Business Development',
        department: 'Sales',
        linkedinUrl: 'https://linkedin.com/in/lisa-thompson-energy',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      }
    ]).returning();

    // Create sample leads (5 leads)
    const sampleLeads = await db.insert(schema.leads).values([
      {
        contactId: sampleContacts[0].id,
        accountId: sampleAccounts[0].id,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Solutions',
        position: 'Chief Technology Officer',
        industry: 'Technology',
        stage: 'qualified',
        status: 'active',
        score: 85,
        value: '250000',
        probability: 75,
        expectedCloseDate: new Date('2025-03-15'),
        source: 'website',
        assignedTo: userId,
        lastContact: new Date('2025-01-20'),
        notes: 'Interested in enterprise solution for team collaboration',
        tags: ['enterprise', 'high-value', 'technology'],
        customFields: { budget: '200k-300k', timeline: 'Q1 2025', decision_makers: 3 }
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
        expectedCloseDate: new Date('2025-02-28'),
        source: 'referral',
        assignedTo: userId,
        lastContact: new Date('2025-01-21'),
        notes: 'Large scale implementation needed for factory automation',
        tags: ['manufacturing', 'automation', 'high-value'],
        customFields: { budget: '400k-600k', timeline: 'Q1 2025', decision_makers: 5 }
      },
      {
        contactId: sampleContacts[2].id,
        accountId: sampleAccounts[2].id,
        name: 'Emma Wilson',
        email: 'emma.wilson@startupx.io',
        phone: '+1-555-0125',
        company: 'StartupX',
        position: 'Chief Executive Officer',
        industry: 'Technology',
        stage: 'new',
        status: 'active',
        score: 70,
        value: '75000',
        probability: 25,
        expectedCloseDate: new Date('2025-04-30'),
        source: 'cold_call',
        assignedTo: userId,
        lastContact: new Date('2025-01-19'),
        notes: 'Startup looking for AI/ML platform solutions',
        tags: ['startup', 'ai', 'ml'],
        customFields: { budget: '50k-100k', timeline: 'Q2 2025', decision_makers: 2 }
      },
      {
        contactId: sampleContacts[3].id,
        accountId: sampleAccounts[3].id,
        name: 'Dr. Robert Martinez',
        email: 'robert.martinez@healthtech.com',
        phone: '+1-555-0126',
        company: 'HealthTech Innovations',
        position: 'Chief Medical Officer',
        industry: 'Healthcare',
        stage: 'contacted',
        status: 'active',
        score: 88,
        value: '350000',
        probability: 60,
        expectedCloseDate: new Date('2025-05-15'),
        source: 'trade_show',
        assignedTo: userId,
        lastContact: new Date('2025-01-18'),
        notes: 'Healthcare technology integration for patient management system',
        tags: ['healthcare', 'medical', 'compliance'],
        customFields: { budget: '300k-400k', timeline: 'Q2 2025', decision_makers: 4 }
      },
      {
        contactId: sampleContacts[4].id,
        accountId: sampleAccounts[4].id,
        name: 'Lisa Thompson',
        email: 'lisa.thompson@greenenergy.com',
        phone: '+1-555-0127',
        company: 'Green Energy Corp',
        position: 'VP of Business Development',
        industry: 'Energy',
        stage: 'qualified',
        status: 'active',
        score: 95,
        value: '750000',
        probability: 85,
        expectedCloseDate: new Date('2025-03-30'),
        source: 'partner',
        assignedTo: userId,
        lastContact: new Date('2025-01-22'),
        notes: 'Large enterprise solution for energy management and reporting',
        tags: ['energy', 'enterprise', 'sustainability'],
        customFields: { budget: '600k-800k', timeline: 'Q1 2025', decision_makers: 6 }
      }
    ]).returning();

    // Create sample deals (5 deals)
    const sampleDeals = await db.insert(schema.deals).values([
      {
        name: 'TechCorp Enterprise License',
        title: 'Enterprise Software Platform Implementation',
        leadId: sampleLeads[0].id,
        accountId: sampleAccounts[0].id,
        contactId: sampleContacts[0].id,
        value: '250000',
        stage: 'negotiation',
        probability: 75,
        expectedCloseDate: new Date('2025-03-15'),
        assignedTo: userId,
        description: 'Complete enterprise software platform with custom integrations and training',
        nextStep: 'Schedule final pricing discussion with procurement team',
        notes: 'Negotiating terms and pricing. Customer very interested, budget approved.'
      },
      {
        name: 'Manufacturing Software Suite',
        title: 'Global Manufacturing Automation Platform',
        leadId: sampleLeads[1].id,
        accountId: sampleAccounts[1].id,
        contactId: sampleContacts[1].id,
        value: '500000',
        stage: 'proposal',
        probability: 80,
        expectedCloseDate: new Date('2025-02-28'),
        assignedTo: userId,
        description: 'Complete manufacturing management system with IoT integration and real-time analytics',
        nextStep: 'Present proposal to board of directors',
        notes: 'Proposal submitted, awaiting review. Strong technical fit, procurement approved.'
      },
      {
        name: 'StartupX AI Platform',
        title: 'AI/ML Development Platform',
        leadId: sampleLeads[2].id,
        accountId: sampleAccounts[2].id,
        contactId: sampleContacts[2].id,
        value: '75000',
        stage: 'qualification',
        probability: 25,
        expectedCloseDate: new Date('2025-04-30'),
        assignedTo: userId,
        description: 'AI/ML platform for startup development with scalable infrastructure',
        nextStep: 'Conduct technical demo and proof of concept',
        notes: 'Early stage discussion. Need to validate technical requirements and budget.'
      },
      {
        name: 'HealthTech Integration',
        title: 'Healthcare Management System Integration',
        leadId: sampleLeads[3].id,
        accountId: sampleAccounts[3].id,
        contactId: sampleContacts[3].id,
        value: '350000',
        stage: 'proposal',
        probability: 60,
        expectedCloseDate: new Date('2025-05-15'),
        assignedTo: userId,
        description: 'Healthcare technology integration for patient management with HIPAA compliance',
        nextStep: 'Address compliance questions and provide security documentation',
        notes: 'Medical team excited about solution. Compliance review in progress.'
      },
      {
        name: 'Green Energy Analytics',
        title: 'Enterprise Energy Management Platform',
        leadId: sampleLeads[4].id,
        accountId: sampleAccounts[4].id,
        contactId: sampleContacts[4].id,
        value: '750000',
        stage: 'negotiation',
        probability: 85,
        expectedCloseDate: new Date('2025-03-30'),
        assignedTo: userId,
        description: 'Large enterprise solution for energy management, reporting, and sustainability tracking',
        nextStep: 'Finalize contract terms and implementation timeline',
        notes: 'Very strong opportunity. Verbal commitment received, finalizing paperwork.'
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
        description: 'Discuss implementation strategy and timeline',
        scheduledStart: new Date('2025-01-28T14:00:00Z'),
        scheduledEnd: new Date('2025-01-28T15:00:00Z'),
        type: 'video',
        status: 'completed',
        organizerId: userId,
        dealId: sampleDeals[0].id
      }
    ]);

    console.log("✅ Database seeded successfully!");
    console.log(`Created/Used ${sampleUser.length} users`);
    console.log(`Created ${sampleAccounts.length} accounts`);
    console.log(`Created ${sampleContacts.length} contacts`);
    console.log(`Created ${sampleLeads.length} leads`);
    console.log(`Created ${sampleDeals.length} deals`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}