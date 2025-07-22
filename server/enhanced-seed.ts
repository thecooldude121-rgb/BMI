import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function createEnhancedSampleData() {
  try {
    console.log("🚀 Creating enhanced sample data...");

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

    // Check and create exactly 5 sample accounts
    const existingAccounts = await db.select().from(schema.accounts).limit(10);
    console.log("🏢 Existing accounts:", existingAccounts.length);
    
    let sampleAccounts;
    if (existingAccounts.length >= 5) {
      sampleAccounts = existingAccounts.slice(0, 5);
      console.log("✅ Using existing 5 accounts");
    } else {
      // Delete all existing accounts first
      await db.delete(schema.accounts);
      console.log("🏢 Creating exactly 5 sample accounts...");
      sampleAccounts = await db.insert(schema.accounts).values([
      {
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        industry: 'Technology',
        companySize: '51-200',
        annualRevenue: '5000000',
        website: 'https://techcorp.com',
        phone: '+1-555-0123',
        description: 'Leading technology solutions provider specializing in enterprise software',
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
        description: 'Industrial manufacturing company with operations worldwide',
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
        description: 'Innovative startup in the AI and machine learning space',
        ownerId: userId
      },
      {
        name: 'Healthcare Systems Corp',
        domain: 'healthsys.com',
        industry: 'Healthcare',
        companySize: '201-500',
        annualRevenue: '25000000',
        website: 'https://healthsys.com',
        phone: '+1-555-0126',
        description: 'Healthcare technology and systems integration company',
        ownerId: userId
      },
      {
        name: 'Financial Services Group',
        domain: 'finservices.com',
        industry: 'Financial Services',
        companySize: '1000+',
        annualRevenue: '100000000',
        website: 'https://finservices.com',
        phone: '+1-555-0127',
        description: 'Comprehensive financial services and consulting firm',
        ownerId: userId
      }
      ]).returning();
    }

    // Check and create exactly 5 sample contacts
    const existingContacts = await db.select().from(schema.contacts).limit(10);
    console.log("👥 Existing contacts:", existingContacts.length);
    
    let sampleContacts;
    if (existingContacts.length >= 5) {
      sampleContacts = existingContacts.slice(0, 5);
      console.log("✅ Using existing 5 contacts");
    } else {
      await db.delete(schema.contacts);
      console.log("👥 Creating exactly 5 sample contacts...");
      sampleContacts = await db.insert(schema.contacts).values([
      {
        accountId: sampleAccounts[0].id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@techcorp.com',
        phone: '+1-555-0123',
        mobile: '+1-555-1123',
        position: 'Chief Technology Officer',
        department: 'Technology',
        linkedinUrl: 'https://linkedin.com/in/sarah-johnson-tech',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[1].id,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@globalmfg.com',
        phone: '+1-555-0124',
        mobile: '+1-555-1124',
        position: 'VP Operations',
        department: 'Operations',
        linkedinUrl: 'https://linkedin.com/in/michael-chen-ops',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[2].id,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@startupx.io',
        phone: '+1-555-0125',
        mobile: '+1-555-1125',
        position: 'CEO & Founder',
        department: 'Executive',
        linkedinUrl: 'https://linkedin.com/in/emma-wilson-ceo',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[3].id,
        firstName: 'David',
        lastName: 'Rodriguez',
        email: 'david.rodriguez@healthsys.com',
        phone: '+1-555-0126',
        mobile: '+1-555-1126',
        position: 'Director of IT',
        department: 'Information Technology',
        linkedinUrl: 'https://linkedin.com/in/david-rodriguez-it',
        isPrimary: true,
        ownerId: userId
      },
      {
        accountId: sampleAccounts[4].id,
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@finservices.com',
        phone: '+1-555-0127',
        mobile: '+1-555-1127',
        position: 'Head of Digital Transformation',
        department: 'Strategy',
        linkedinUrl: 'https://linkedin.com/in/lisa-thompson-finance',
        isPrimary: true,
        ownerId: userId
      }
      ]).returning();
    }

    // Check and create exactly 5 sample leads
    const existingLeads = await db.select().from(schema.leads).limit(10);
    console.log("🎯 Existing leads:", existingLeads.length);
    
    let sampleLeads;
    if (existingLeads.length >= 5) {
      sampleLeads = existingLeads.slice(0, 5);
      console.log("✅ Using existing 5 leads");
    } else {
      await db.delete(schema.leads);
      console.log("🎯 Creating exactly 5 sample leads...");
      sampleLeads = await db.insert(schema.leads).values([
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
        source: 'Website Inquiry',
        assignedTo: userId,
        notes: 'Interested in enterprise software solution for team collaboration and project management'
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
        source: 'Referral',
        assignedTo: userId,
        notes: 'Large scale implementation needed for manufacturing process optimization'
      },
      {
        contactId: sampleContacts[2].id,
        accountId: sampleAccounts[2].id,
        name: 'Emma Wilson',
        email: 'emma.wilson@startupx.io',
        phone: '+1-555-0125',
        company: 'StartupX',
        position: 'CEO & Founder',
        industry: 'Technology',
        stage: 'new',
        status: 'active',
        score: 78,
        value: '75000',
        probability: 60,
        expectedCloseDate: new Date('2025-04-30'),
        source: 'Conference',
        assignedTo: userId,
        notes: 'Startup looking for AI integration tools and analytics platform'
      },
      {
        contactId: sampleContacts[3].id,
        accountId: sampleAccounts[3].id,
        name: 'David Rodriguez',
        email: 'david.rodriguez@healthsys.com',
        phone: '+1-555-0126',
        company: 'Healthcare Systems Corp',
        position: 'Director of IT',
        industry: 'Healthcare',
        stage: 'contacted',
        status: 'active',
        score: 88,
        value: '350000',
        probability: 70,
        expectedCloseDate: new Date('2025-05-15'),
        source: 'LinkedIn Campaign',
        assignedTo: userId,
        notes: 'Healthcare organization needs HIPAA-compliant collaboration platform'
      },
      {
        contactId: sampleContacts[4].id,
        accountId: sampleAccounts[4].id,
        name: 'Lisa Thompson',
        email: 'lisa.thompson@finservices.com',
        phone: '+1-555-0127',
        company: 'Financial Services Group',
        position: 'Head of Digital Transformation',
        industry: 'Financial Services',
        stage: 'qualified',
        status: 'active',
        score: 95,
        value: '750000',
        probability: 85,
        expectedCloseDate: new Date('2025-03-31'),
        source: 'Cold Outreach',
        assignedTo: userId,
        notes: 'Major financial services firm looking for digital transformation platform'
      }
      ]).returning();
    }

    // Check and create exactly 5 sample deals
    const existingDeals = await db.select().from(schema.deals).limit(10);
    console.log("💼 Existing deals:", existingDeals.length);
    
    let sampleDeals;
    if (existingDeals.length >= 5) {
      sampleDeals = existingDeals.slice(0, 5);
      console.log("✅ Using existing 5 deals");
    } else {
      await db.delete(schema.deals);
      console.log("💼 Creating exactly 5 sample deals...");
      sampleDeals = await db.insert(schema.deals).values([
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
        description: 'Enterprise software license deal with annual subscription model',
        nextStep: 'Schedule contract review meeting with legal team',
        notes: 'Negotiating terms and pricing. Client interested in 3-year commitment for discount.'
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
        description: 'Complete manufacturing management system with IoT integration',
        nextStep: 'Prepare technical demonstration for executive team',
        notes: 'Proposal submitted, awaiting review. Strong technical fit confirmed.'
      },
      {
        name: 'StartupX AI Platform',
        title: 'StartupX AI Platform',
        leadId: sampleLeads[2].id,
        accountId: sampleAccounts[2].id,
        contactId: sampleContacts[2].id,
        value: '75000',
        stage: 'qualification',
        probability: 60,
        expectedCloseDate: new Date('2025-04-30'),
        assignedTo: userId,
        description: 'AI analytics platform for startup growth optimization',
        nextStep: 'Conduct needs assessment workshop',
        notes: 'Initial interest confirmed. Need to understand specific AI requirements.'
      },
      {
        name: 'Healthcare Compliance System',
        title: 'Healthcare Compliance System',
        leadId: sampleLeads[3].id,
        accountId: sampleAccounts[3].id,
        contactId: sampleContacts[3].id,
        value: '350000',
        stage: 'qualification',
        probability: 70,
        expectedCloseDate: new Date('2025-05-15'),
        assignedTo: userId,
        description: 'HIPAA-compliant healthcare management and collaboration platform',
        nextStep: 'Security assessment and compliance review',
        notes: 'Security and compliance requirements are top priority. Budget confirmed.'
      },
      {
        name: 'Financial Digital Transformation',
        title: 'Financial Digital Transformation',
        leadId: sampleLeads[4].id,
        accountId: sampleAccounts[4].id,
        contactId: sampleContacts[4].id,
        value: '750000',
        stage: 'proposal',
        probability: 85,
        expectedCloseDate: new Date('2025-03-31'),
        assignedTo: userId,
        description: 'Comprehensive digital transformation platform for financial services',
        nextStep: 'Final presentation to board of directors',
        notes: 'Strong champion support. Technical requirements approved. Pricing discussions ongoing.'
      }
      ]).returning();
    }

    console.log("✅ Enhanced sample data created successfully!");
    console.log(`Created ${sampleAccounts.length} accounts`);
    console.log(`Created ${sampleContacts.length} contacts`);
    console.log(`Created ${sampleLeads.length} leads`);
    console.log(`Created ${sampleDeals.length} deals`);

    return {
      accounts: sampleAccounts.length,
      contacts: sampleContacts.length,
      leads: sampleLeads.length,
      deals: sampleDeals.length
    };

  } catch (error) {
    console.error("Error creating enhanced sample data:", error);
    throw error;
  }
}