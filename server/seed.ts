import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedEnhancedActivities(userId: string, accountIds: string[], contactIds: string[], leadIds: string[], dealIds: string[]) {
  console.log("🎯 Starting enhanced activities seeding...");
  
  // Check if activities already exist - always seed enhanced activities
  const existingActivities = await db.select().from(schema.activities);
  console.log(`Found ${existingActivities.length} existing activities - proceeding with enhanced seeding`);
  
  const enhancedActivities = [
    // Lead follow-up activities
    {
      subject: "Initial Outreach - TechCorp Lead",
      type: "call",
      direction: "outbound",
      status: "completed",
      priority: "high",
      description: "Cold call to introduce our enterprise solution",
      outcome: "Positive response, scheduled demo meeting",
      duration: 15,
      scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      leadId: leadIds[0],
      relatedToType: "lead",
      relatedToId: leadIds[0],
      callType: "outgoing",
      phoneNumber: "+1-555-0123",
      callResult: "answered",
      source: "manual",
      tags: ["lead-qualification", "initial-contact"]
    },
    {
      subject: "Demo Presentation - Enterprise Solution",
      type: "meeting",
      direction: "outbound", 
      status: "completed",
      priority: "high",
      description: "Product demonstration focusing on enterprise features",
      outcome: "Strong interest shown, proposal requested",
      duration: 45,
      scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      leadId: leadIds[0],
      dealId: dealIds[0],
      relatedToType: "deal",
      relatedToId: dealIds[0],
      meetingType: "video",
      location: "Zoom Meeting",
      attendees: [
        { name: "John Smith", email: "john@techcorp.com", role: "CTO" },
        { name: "Sarah Johnson", email: "sarah@ourcompany.com", role: "Sales Rep" }
      ],
      tags: ["demo", "enterprise", "high-value"]
    },
    {
      subject: "Proposal Follow-up Email",
      type: "email",
      direction: "outbound",
      status: "completed",
      priority: "medium",
      description: "Follow-up email with detailed proposal attached",
      outcome: "Email opened, proposal downloaded",
      scheduledAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      dealId: dealIds[0],
      contactId: contactIds[0],
      relatedToType: "deal",
      relatedToId: dealIds[0],
      emailSubject: "Enterprise Solution Proposal - TechCorp",
      emailTo: "john@techcorp.com",
      emailFrom: "sarah@ourcompany.com",
      tags: ["proposal", "follow-up", "email-campaign"]
    },
    // Account management activities
    {
      subject: "Quarterly Business Review - GlobalMFG",
      type: "meeting",
      direction: "outbound",
      status: "planned",
      priority: "high",
      description: "Quarterly review of account performance and future planning",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[1],
      relatedToType: "account",
      relatedToId: accountIds[1],
      meetingType: "in-person",
      location: "Global Manufacturing HQ, Detroit",
      tags: ["qbr", "account-management", "strategic"]
    },
    {
      subject: "Support Ticket Resolution Follow-up",
      type: "task",
      direction: "inbound",
      status: "planned",
      priority: "medium",
      description: "Follow up on recent support ticket resolution and ensure customer satisfaction",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[1],
      contactId: contactIds[1],
      relatedToType: "account",
      relatedToId: accountIds[1],
      taskStatus: "pending",
      tags: ["support", "customer-success", "follow-up"]
    },
    // Additional 15 more activities for comprehensive testing...
    {
      subject: "LinkedIn Connection Request",
      type: "note",
      direction: "outbound",
      status: "completed",
      priority: "low",
      description: "Connect with prospect on LinkedIn with personalized message",
      outcome: "Connection accepted, engaged with content",
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      leadId: leadIds[2] || leadIds[0],
      relatedToType: "lead",
      relatedToId: leadIds[2] || leadIds[0],
      tags: ["social-selling", "linkedin", "lead-nurturing"]
    },
    {
      subject: "Contract Negotiation Call",
      type: "call",
      direction: "outbound",
      status: "completed",
      priority: "critical",
      description: "Discussion on contract terms and pricing negotiations",
      outcome: "Agreed on revised terms, contract pending legal review",
      duration: 60,
      scheduledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      dealId: dealIds[1] || dealIds[0],
      accountId: accountIds[0],
      relatedToType: "deal",
      relatedToId: dealIds[1] || dealIds[0],
      callType: "outgoing",
      phoneNumber: "+1-555-0124",
      callResult: "answered",
      tags: ["negotiation", "contract", "legal-review"]
    },
    {
      subject: "Technical Requirements Assessment",
      type: "meeting",
      direction: "outbound",
      status: "planned",
      priority: "high",
      description: "Deep dive into technical requirements and integration needs",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      dealId: dealIds[2] || dealIds[0],
      contactId: contactIds[2] || contactIds[0],
      relatedToType: "deal",
      relatedToId: dealIds[2] || dealIds[0],
      meetingType: "video",
      location: "Microsoft Teams",
      attendees: [
        { name: "Tech Lead", email: "tech@prospect.com", role: "Technical Lead" },
        { name: "Solutions Engineer", email: "se@ourcompany.com", role: "Solutions Engineer" }
      ],
      tags: ["technical", "requirements", "integration"]
    },
    {
      subject: "Implementation Kickoff Meeting",
      type: "meeting",
      direction: "outbound",
      status: "completed",
      priority: "high",
      description: "Project kickoff with implementation team and customer stakeholders",
      outcome: "Project timeline approved, team introductions completed",
      duration: 90,
      scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[2] || accountIds[0],
      relatedToType: "account",
      relatedToId: accountIds[2] || accountIds[0],
      meetingType: "video",
      location: "Zoom Meeting",
      tags: ["implementation", "kickoff", "project-management"]
    },
    {
      subject: "Cold Email Campaign - Healthcare Prospects",
      type: "email",
      direction: "outbound",
      status: "planned",
      priority: "medium",
      description: "Targeted email campaign to healthcare industry prospects",
      scheduledAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      relatedToType: "lead",
      relatedToId: leadIds[3] || leadIds[0],
      emailSubject: "Transforming Healthcare Operations with Smart Technology",
      emailTo: "prospects@healthcare.com",
      emailFrom: "sales@ourcompany.com",
      tags: ["prospecting", "healthcare", "email-campaign"]
    },
    {
      subject: "Industry Conference Follow-up",
      type: "task",
      direction: "outbound",
      status: "planned",
      priority: "medium",
      description: "Follow up with contacts met at the recent industry conference",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      taskStatus: "pending",
      tags: ["conference", "networking", "follow-up"]
    },
    {
      subject: "Competitive Analysis Research",
      type: "task",
      direction: "inbound",
      status: "completed",
      priority: "medium",
      description: "Research competitor pricing and feature comparison",
      outcome: "Compiled comprehensive competitive analysis report",
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      taskStatus: "completed",
      tags: ["competitive-intelligence", "research", "analysis"]
    },
    {
      subject: "Customer Satisfaction Survey Follow-up",
      type: "call",
      direction: "outbound",
      status: "completed",
      priority: "medium",
      description: "Follow up on recent customer satisfaction survey results",
      outcome: "Discussed improvement areas, customer satisfied with response",
      duration: 25,
      scheduledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[3] || accountIds[0],
      contactId: contactIds[3] || contactIds[0],
      relatedToType: "account",
      relatedToId: accountIds[3] || accountIds[0],
      callType: "outgoing",
      callResult: "answered",
      tags: ["customer-satisfaction", "feedback", "improvement"]
    },
    {
      subject: "MQL Qualification Call",
      type: "call",
      direction: "outbound",
      status: "planned",
      priority: "high",
      description: "Qualify marketing qualified lead and assess sales readiness",
      scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      leadId: leadIds[4] || leadIds[0],
      relatedToType: "lead",
      relatedToId: leadIds[4] || leadIds[0],
      callType: "outgoing",
      phoneNumber: "+1-555-0199",
      tags: ["mql", "qualification", "lead-scoring"]
    },
    {
      subject: "Partner Channel Discussion",
      type: "meeting",
      direction: "outbound",
      status: "completed",
      priority: "medium",
      description: "Explore partnership opportunities and channel strategy",
      outcome: "Identified mutual opportunities, next steps defined",
      duration: 45,
      scheduledAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      meetingType: "in-person",
      location: "Partner Office",
      tags: ["partnership", "channel", "strategy"]
    },
    {
      subject: "Contract Renewal Discussion",
      type: "meeting",
      direction: "outbound",
      status: "planned",
      priority: "critical",
      description: "Discuss contract renewal and potential expansion opportunities",
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[4] || accountIds[0],
      contactId: contactIds[4] || contactIds[0],
      relatedToType: "account",
      relatedToId: accountIds[4] || accountIds[0],
      meetingType: "video",
      location: "Google Meet",
      tags: ["renewal", "expansion", "retention"]
    },
    {
      subject: "Product Training Session",
      type: "meeting",
      direction: "outbound",
      status: "completed",
      priority: "medium",
      description: "Provide product training to customer team",
      outcome: "Training completed successfully, team confident with product",
      duration: 120,
      scheduledAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      accountId: accountIds[1] || accountIds[0],
      relatedToType: "account",
      relatedToId: accountIds[1] || accountIds[0],
      meetingType: "video",
      location: "Training Platform",
      tags: ["training", "education", "onboarding"]
    },
    {
      subject: "LinkedIn Article Engagement",
      type: "note",
      direction: "outbound",
      status: "completed",
      priority: "low",
      description: "Engage with prospect's LinkedIn content and share relevant insights",
      outcome: "Meaningful conversation started, relationship building in progress",
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      leadId: leadIds[1] || leadIds[0],
      relatedToType: "lead",
      relatedToId: leadIds[1] || leadIds[0],
      tags: ["social-selling", "engagement", "relationship-building"]
    },
    {
      subject: "Urgent: Contract Signature Required",
      type: "task",
      direction: "outbound",
      status: "planned",
      priority: "urgent",
      description: "Follow up on pending contract signature - deal at risk",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdBy: userId,
      assignedTo: userId,
      dealId: dealIds[3] || dealIds[0],
      relatedToType: "deal",
      relatedToId: dealIds[3] || dealIds[0],
      taskStatus: "pending",
      tags: ["urgent", "contract", "at-risk", "signature"]
    }
  ];
  
  // Insert activities in batches to avoid potential issues
  const batchSize = 5;
  for (let i = 0; i < enhancedActivities.length; i += batchSize) {
    const batch = enhancedActivities.slice(i, i + batchSize);
    await db.insert(schema.activities).values(batch);
  }
  
  console.log(`✅ Created ${enhancedActivities.length} enhanced activities`);
}

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if user already exists
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'john.smith@company.com')).limit(1);
    
    let sampleUser: schema.User[];
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

    // Check existing data counts to prevent duplicates
    const existingAccounts = await db.select().from(schema.accounts);
    const existingContacts = await db.select().from(schema.contacts);
    const existingLeads = await db.select().from(schema.leads);
    const existingDeals = await db.select().from(schema.deals);

    let sampleAccounts: schema.Account[] = [];
    let sampleContacts: schema.Contact[] = [];
    let sampleLeads: schema.Lead[] = [];
    let sampleDeals: schema.Deal[] = [];

    // Create sample accounts (limit to 10, only if less than 10 exist)
    if (existingAccounts.length < 10) {
      const accountsToCreate = Math.min(10 - existingAccounts.length, 10);
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
        },
        {
          name: 'DataFlow Analytics',
          domain: 'dataflow.com',
          industry: 'Technology',
          companySize: '201-500',
          annualRevenue: '25000000',
          website: 'https://dataflow.com',
          phone: '+1-555-0128',
          description: 'Advanced data analytics and business intelligence solutions',
          address: { street: '987 Data St', city: 'Seattle', state: 'WA', zip: '98101', country: 'USA' },
          ownerId: userId
        },
        {
          name: 'EduTech Pro',
          domain: 'edutech.com',
          industry: 'Education',
          companySize: '51-200',
          annualRevenue: '8000000',
          website: 'https://edutech.com',
          phone: '+1-555-0129',
          description: 'Educational technology platform for schools and universities',
          address: { street: '456 Learning Ave', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA' },
          ownerId: userId
        },
        {
          name: 'TransLogistics Corp',
          domain: 'translogistics.com',
          industry: 'Transportation',
          companySize: '1000+',
          annualRevenue: '75000000',
          website: 'https://translogistics.com',
          phone: '+1-555-0130',
          description: 'Global logistics and transportation management solutions',
          address: { street: '321 Transport Blvd', city: 'Memphis', state: 'TN', zip: '38101', country: 'USA' },
          ownerId: userId
        },
        {
          name: 'BioInnovate Labs',
          domain: 'bioinnovate.com',
          industry: 'Biotechnology',
          companySize: '51-200',
          annualRevenue: '12000000',
          website: 'https://bioinnovate.com',
          phone: '+1-555-0131',
          description: 'Biotechnology research and development laboratory',
          address: { street: '789 Bio Dr', city: 'San Diego', state: 'CA', zip: '92101', country: 'USA' },
          ownerId: userId
        },
        {
          name: 'Fashion Forward Inc',
          domain: 'fashionforward.com',
          industry: 'Fashion',
          companySize: '51-200',
          annualRevenue: '18000000',
          website: 'https://fashionforward.com',
          phone: '+1-555-0132',
          description: 'Modern fashion and apparel design company',
          address: { street: '123 Fashion Ave', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
          ownerId: userId
        }
      ].slice(0, accountsToCreate)).returning();
    } else {
      sampleAccounts = existingAccounts.slice(0, 10);
    }

    // Create sample contacts (limit to 10, only if less than 10 exist)
    if (existingContacts.length < 10 && sampleAccounts.length > 0) {
      const contactsToCreate = Math.min(10 - existingContacts.length, 10);
      sampleContacts = await db.insert(schema.contacts).values([
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
      },
      {
        accountId: sampleAccounts[5]?.id || sampleAccounts[0].id,
        firstName: 'David',
        lastName: 'Anderson',
        email: 'david.anderson@dataflow.com',
        phone: '+1-555-0128',
        mobile: '+1-555-0228',
        position: 'Chief Data Officer',
        department: 'Technology',
        linkedinUrl: 'https://linkedin.com/in/david-anderson-data',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[6]?.id || sampleAccounts[0].id,
        firstName: 'Jennifer',
        lastName: 'Lee',
        email: 'jennifer.lee@edutech.com',
        phone: '+1-555-0129',
        mobile: '+1-555-0229',
        position: 'VP of Product',
        department: 'Product',
        linkedinUrl: 'https://linkedin.com/in/jennifer-lee-edutech',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[7]?.id || sampleAccounts[0].id,
        firstName: 'Mark',
        lastName: 'Williams',
        email: 'mark.williams@translogistics.com',
        phone: '+1-555-0130',
        mobile: '+1-555-0230',
        position: 'Director of Operations',
        department: 'Operations',
        linkedinUrl: 'https://linkedin.com/in/mark-williams-logistics',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[8]?.id || sampleAccounts[0].id,
        firstName: 'Dr. Anna',
        lastName: 'Rodriguez',
        email: 'anna.rodriguez@bioinnovate.com',
        phone: '+1-555-0131',
        mobile: '+1-555-0231',
        position: 'Research Director',
        department: 'Research',
        linkedinUrl: 'https://linkedin.com/in/dr-anna-rodriguez-bio',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      },
      {
        accountId: sampleAccounts[9]?.id || sampleAccounts[0].id,
        firstName: 'Sophie',
        lastName: 'Brown',
        email: 'sophie.brown@fashionforward.com',
        phone: '+1-555-0132',
        mobile: '+1-555-0232',
        position: 'Creative Director',
        department: 'Design',
        linkedinUrl: 'https://linkedin.com/in/sophie-brown-fashion',
        isPrimary: true,
        status: 'active',
        ownerId: userId
      }
      ].slice(0, contactsToCreate)).returning();
    } else {
      sampleContacts = existingContacts.slice(0, 10);
    }

    // Create sample leads (limit to 10, only if less than 10 exist)
    if (existingLeads.length < 10 && sampleContacts.length > 0) {
      const leadsToCreate = Math.min(10 - existingLeads.length, 10);
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
      },
      {
        contactId: sampleContacts[5]?.id || sampleContacts[0].id,
        accountId: sampleAccounts[5]?.id || sampleAccounts[0].id,
        name: 'David Anderson',
        email: 'david.anderson@dataflow.com',
        phone: '+1-555-0128',
        company: 'DataFlow Analytics',
        position: 'Chief Data Officer',
        industry: 'Technology',
        stage: 'new',
        status: 'active',
        score: 78,
        value: '180000',
        probability: 35,
        expectedCloseDate: new Date('2025-06-15'),
        source: 'social_media',
        assignedTo: userId,
        lastContact: new Date('2025-01-23'),
        notes: 'Interested in advanced analytics platform for big data processing',
        tags: ['analytics', 'big-data', 'technology'],
        customFields: { budget: '150k-200k', timeline: 'Q2 2025', decision_makers: 3 }
      },
      {
        contactId: sampleContacts[6]?.id || sampleContacts[0].id,
        accountId: sampleAccounts[6]?.id || sampleAccounts[0].id,
        name: 'Jennifer Lee',
        email: 'jennifer.lee@edutech.com',
        phone: '+1-555-0129',
        company: 'EduTech Pro',
        position: 'VP of Product',
        industry: 'Education',
        stage: 'contacted',
        status: 'active',
        score: 82,
        value: '120000',
        probability: 45,
        expectedCloseDate: new Date('2025-05-30'),
        source: 'website',
        assignedTo: userId,
        lastContact: new Date('2025-01-24'),
        notes: 'Educational platform integration for student management system',
        tags: ['education', 'platform', 'students'],
        customFields: { budget: '100k-150k', timeline: 'Q2 2025', decision_makers: 2 }
      },
      {
        contactId: sampleContacts[7]?.id || sampleContacts[0].id,
        accountId: sampleAccounts[7]?.id || sampleAccounts[0].id,
        name: 'Mark Williams',
        email: 'mark.williams@translogistics.com',
        phone: '+1-555-0130',
        company: 'TransLogistics Corp',
        position: 'Director of Operations',
        industry: 'Transportation',
        stage: 'qualified',
        status: 'active',
        score: 90,
        value: '450000',
        probability: 70,
        expectedCloseDate: new Date('2025-04-15'),
        source: 'trade_show',
        assignedTo: userId,
        lastContact: new Date('2025-01-25'),
        notes: 'Global logistics optimization and tracking system implementation',
        tags: ['logistics', 'transportation', 'global'],
        customFields: { budget: '400k-500k', timeline: 'Q2 2025', decision_makers: 4 }
      },
      {
        contactId: sampleContacts[8]?.id || sampleContacts[0].id,
        accountId: sampleAccounts[8]?.id || sampleAccounts[0].id,
        name: 'Dr. Anna Rodriguez',
        email: 'anna.rodriguez@bioinnovate.com',
        phone: '+1-555-0131',
        company: 'BioInnovate Labs',
        position: 'Research Director',
        industry: 'Biotechnology',
        stage: 'proposal',
        status: 'active',
        score: 86,
        value: '280000',
        probability: 65,
        expectedCloseDate: new Date('2025-06-30'),
        source: 'referral',
        assignedTo: userId,
        lastContact: new Date('2025-01-26'),
        notes: 'Laboratory management system with compliance tracking and reporting',
        tags: ['biotech', 'lab-management', 'compliance'],
        customFields: { budget: '250k-300k', timeline: 'Q2 2025', decision_makers: 3 }
      },
      {
        contactId: sampleContacts[9]?.id || sampleContacts[0].id,
        accountId: sampleAccounts[9]?.id || sampleAccounts[0].id,
        name: 'Sophie Brown',
        email: 'sophie.brown@fashionforward.com',
        phone: '+1-555-0132',
        company: 'Fashion Forward Inc',
        position: 'Creative Director',
        industry: 'Fashion',
        stage: 'contacted',
        status: 'active',
        score: 74,
        value: '95000',
        probability: 40,
        expectedCloseDate: new Date('2025-07-15'),
        source: 'cold_call',
        assignedTo: userId,
        lastContact: new Date('2025-01-27'),
        notes: 'Design collaboration platform for fashion teams and supply chain management',
        tags: ['fashion', 'design', 'collaboration'],
        customFields: { budget: '80k-120k', timeline: 'Q3 2025', decision_makers: 2 }
      }
      ].slice(0, leadsToCreate)).returning();
    } else {
      sampleLeads = existingLeads.slice(0, 10);
    }

    // Create sample deals (limit to 10, only if less than 10 exist)
    if (existingDeals.length < 10 && sampleLeads.length > 0) {
      const dealsToCreate = Math.min(10 - existingDeals.length, 10);
      sampleDeals = await db.insert(schema.deals).values([
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
      },
      {
        name: 'DataFlow Analytics Platform',
        title: 'Advanced Data Analytics Solution',
        leadId: sampleLeads[5]?.id || sampleLeads[0].id,
        accountId: sampleAccounts[5]?.id || sampleAccounts[0].id,
        contactId: sampleContacts[5]?.id || sampleContacts[0].id,
        value: '180000',
        stage: 'qualification',
        probability: 35,
        expectedCloseDate: new Date('2025-06-15'),
        assignedTo: userId,
        description: 'Big data analytics platform with real-time processing and visualization',
        nextStep: 'Schedule technical architecture review',
        notes: 'Initial interest shown. Need to understand technical requirements better.'
      },
      {
        name: 'EduTech Student Platform',
        title: 'Educational Management System',
        leadId: sampleLeads[6]?.id || sampleLeads[0].id,
        accountId: sampleAccounts[6]?.id || sampleAccounts[0].id,
        contactId: sampleContacts[6]?.id || sampleContacts[0].id,
        value: '120000',
        stage: 'qualification',
        probability: 45,
        expectedCloseDate: new Date('2025-05-30'),
        assignedTo: userId,
        description: 'Student information system with learning management integration',
        nextStep: 'Conduct needs assessment with academic team',
        notes: 'Educational sector opportunity. Focus on student outcomes and ease of use.'
      },
      {
        name: 'TransLogistics Optimization',
        title: 'Global Transportation Management System',
        leadId: sampleLeads[7]?.id || sampleLeads[0].id,
        accountId: sampleAccounts[7]?.id || sampleAccounts[0].id,
        contactId: sampleContacts[7]?.id || sampleContacts[0].id,
        value: '450000',
        stage: 'proposal',
        probability: 70,
        expectedCloseDate: new Date('2025-04-15'),
        assignedTo: userId,
        description: 'Comprehensive logistics platform with route optimization and tracking',
        nextStep: 'Present ROI analysis to executive committee',
        notes: 'Strong business case. Operations team very engaged.'
      },
      {
        name: 'BioInnovate Lab System',
        title: 'Laboratory Information Management System',
        leadId: sampleLeads[8]?.id || sampleLeads[0].id,
        accountId: sampleAccounts[8]?.id || sampleAccounts[0].id,
        contactId: sampleContacts[8]?.id || sampleContacts[0].id,
        value: '280000',
        stage: 'negotiation',
        probability: 65,
        expectedCloseDate: new Date('2025-06-30'),
        assignedTo: userId,
        description: 'LIMS with regulatory compliance and data integrity features',
        nextStep: 'Address compliance requirements and finalize pricing',
        notes: 'Research team satisfied with functionality. Working through compliance details.'
      },
      {
        name: 'Fashion Design Collaboration',
        title: 'Creative Design and Supply Chain Platform',
        leadId: sampleLeads[9]?.id || sampleLeads[0].id,
        accountId: sampleAccounts[9]?.id || sampleAccounts[0].id,
        contactId: sampleContacts[9]?.id || sampleContacts[0].id,
        value: '95000',
        stage: 'qualification',
        probability: 40,
        expectedCloseDate: new Date('2025-07-15'),
        assignedTo: userId,
        description: 'Design collaboration platform with supply chain integration',
        nextStep: 'Demo creative workflow features to design team',
        notes: 'Creative team interested. Need to show value for design workflow efficiency.'
      }
      ].slice(0, dealsToCreate)).returning();
    } else {
      sampleDeals = existingDeals.slice(0, 10);
    }

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

    // Create enhanced activities for the next-generation Activities Module
    await seedEnhancedActivities(
      userId, 
      sampleAccounts.map(a => a.id), 
      sampleContacts.map(c => c.id), 
      sampleLeads.map(l => l.id), 
      sampleDeals.map(d => d.id)
    );

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
    console.log(`Created/Used ${Array.isArray(sampleUser) ? sampleUser.length : 1} users`);
    console.log(`Created ${sampleAccounts.length} accounts`);
    console.log(`Created ${sampleContacts.length} contacts`);
    console.log(`Created ${sampleLeads.length} leads`);
    console.log(`Created ${sampleDeals.length} deals`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}