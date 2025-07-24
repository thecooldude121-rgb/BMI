import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedEnhancedCRMData() {
  try {
    console.log("🌱 Starting enhanced CRM data seeding (10 records per module)...");

    // Clear existing data first
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
    const accountsData = [
      {
        name: "TechCorp Solutions",
        website: "https://techcorp.com",
        industry: "Technology",
        size: "501-1000",
        phone: "+1-555-0123",
        email: "contact@techcorp.com",
        address: "123 Tech Street, San Francisco, CA 94105",
        description: "Leading provider of enterprise software solutions with AI integration",
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
      },
      {
        name: "Healthcare Partners LLC",
        website: "https://healthpartners.com",
        industry: "Healthcare",
        size: "201-500",
        phone: "+1-555-0125",
        email: "contact@healthpartners.com",
        address: "789 Medical Center Dr, Boston, MA 02101",
        description: "Regional healthcare services with telemedicine platform",
        revenue: 25000000,
        employeeCount: 300,
        type: "Customer"
      },
      {
        name: "EduTech Innovations",
        website: "https://edutechinnovations.com",
        industry: "Education",
        size: "51-100",
        phone: "+1-555-0129",
        email: "info@edutechinnovations.com",
        address: "246 Learning Lane, Seattle, WA 98101",
        description: "Digital learning platforms for K-12 education",
        revenue: 12000000,
        employeeCount: 85,
        type: "Customer"
      },
      {
        name: "Logistics Prime",
        website: "https://logisticsprime.com",
        industry: "Transportation",
        size: "501-1000",
        phone: "+1-555-0130",
        email: "operations@logisticsprime.com",
        address: "135 Freight Rd, Atlanta, GA 30301",
        description: "AI-powered supply chain and logistics optimization",
        revenue: 75000000,
        employeeCount: 650,
        type: "Prospect"
      },
      {
        name: "Biotech Research Corp",
        website: "https://biotechresearch.com",
        industry: "Biotechnology",
        size: "201-500",
        phone: "+1-555-0131",
        email: "research@biotechresearch.com",
        address: "789 Innovation Dr, Cambridge, MA 02139",
        description: "Pharmaceutical research and drug development",
        revenue: 45000000,
        employeeCount: 320,
        type: "Customer"
      },
      {
        name: "Fashion Forward Studio",
        website: "https://fashionforwardstudio.com",
        industry: "Fashion",
        size: "11-50",
        phone: "+1-555-0132",
        email: "design@fashionforwardstudio.com",
        address: "567 Style St, Los Angeles, CA 90210",
        description: "Sustainable fashion design and eco-friendly manufacturing",
        revenue: 5000000,
        employeeCount: 35,
        type: "Prospect"
      },
      {
        name: "AgriTech Solutions",
        website: "https://agritechsolutions.com",
        industry: "Agriculture",
        size: "101-200",
        phone: "+1-555-0133",
        email: "support@agritechsolutions.com",
        address: "890 Farm Rd, Des Moines, IA 50301",
        description: "Smart farming technology and precision agriculture",
        revenue: 22000000,
        employeeCount: 140,
        type: "Customer"
      },
      {
        name: "MediaStream Networks",
        website: "https://mediastream.com",
        industry: "Media",
        size: "201-500",
        phone: "+1-555-0134",
        email: "contact@mediastream.com",
        address: "432 Broadcast Blvd, Nashville, TN 37201",
        description: "Digital media streaming and content distribution platform",
        revenue: 35000000,
        employeeCount: 280,
        type: "Prospect"
      },
      {
        name: "FinTech Innovators",
        website: "https://fintechinnovators.com",
        industry: "Financial Services",
        size: "101-200",
        phone: "+1-555-0135",
        email: "hello@fintechinnovators.com",
        address: "321 Blockchain Ave, Miami, FL 33101",
        description: "Cryptocurrency and blockchain financial solutions",
        revenue: 28000000,
        employeeCount: 165,
        type: "Prospect"
      }
    ];

    const createdAccounts = await db.insert(schema.accounts).values(accountsData).returning();
    console.log(`✅ Created ${createdAccounts.length} accounts`);

    // Create 10 varied contacts
    const contactsData = [
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@techcorp.com",
        phone: "+1-555-1001",
        title: "VP of Engineering",
        accountId: createdAccounts[0].id,
        department: "Engineering",
        leadSource: "Website",
        status: "Active"
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "m.chen@greenenergy.com",
        phone: "+1-555-1002",
        title: "Chief Technology Officer",
        accountId: createdAccounts[1].id,
        department: "Technology",
        leadSource: "Referral",
        status: "Active"
      },
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "e.rodriguez@healthpartners.com",
        phone: "+1-555-1003",
        title: "Director of Operations",
        accountId: createdAccounts[2].id,
        department: "Operations",
        leadSource: "Trade Show",
        status: "Active"
      },
      {
        firstName: "David",
        lastName: "Kumar",
        email: "d.kumar@edutech.com",
        phone: "+1-555-1004",
        title: "Product Manager",
        accountId: createdAccounts[3].id,
        department: "Product",
        leadSource: "LinkedIn",
        status: "Active"
      },
      {
        firstName: "Lisa",
        lastName: "Williams",
        email: "l.williams@logisticsprime.com",
        phone: "+1-555-1005",
        title: "Head of Procurement",
        accountId: createdAccounts[4].id,
        department: "Procurement",
        leadSource: "Cold Call",
        status: "Inactive"
      },
      {
        firstName: "Robert",
        lastName: "Anderson",
        email: "r.anderson@biotechresearch.com",
        phone: "+1-555-1006",
        title: "Research Director",
        accountId: createdAccounts[5].id,
        department: "Research",
        leadSource: "Conference",
        status: "Active"
      },
      {
        firstName: "Maria",
        lastName: "Garcia",
        email: "m.garcia@fashionforward.com",
        phone: "+1-555-1007",
        title: "Creative Director",
        accountId: createdAccounts[6].id,
        department: "Design",
        leadSource: "Social Media",
        status: "Active"
      },
      {
        firstName: "James",
        lastName: "Thompson",
        email: "j.thompson@agritech.com",
        phone: "+1-555-1008",
        title: "VP of Sales",
        accountId: createdAccounts[7].id,
        department: "Sales",
        leadSource: "Partnership",
        status: "Active"
      },
      {
        firstName: "Anna",
        lastName: "Lee",
        email: "a.lee@mediastream.com",
        phone: "+1-555-1009",
        title: "Business Development Manager",
        accountId: createdAccounts[8].id,
        department: "Business Development",
        leadSource: "Website",
        status: "Active"
      },
      {
        firstName: "Carlos",
        lastName: "Martinez",
        email: "c.martinez@fintech.com",
        phone: "+1-555-1010",
        title: "Chief Financial Officer",
        accountId: createdAccounts[9].id,
        department: "Finance",
        leadSource: "Email Campaign",
        status: "Active"
      }
    ];

    const createdContacts = await db.insert(schema.contacts).values(contactsData).returning();
    console.log(`✅ Created ${createdContacts.length} contacts`);

    // Create 10 varied leads
    const leadsData = [
      {
        firstName: "Alex",
        lastName: "Thompson",
        email: "alex.thompson@startup.com",
        phone: "+1-555-2001",
        company: "NextGen Startup",
        title: "Founder & CEO",
        leadSource: "Website",
        status: "New",
        rating: "Hot",
        industry: "Technology",
        estimatedValue: 50000,
        notes: "Interested in enterprise software solutions for scaling business"
      },
      {
        firstName: "Jessica",
        lastName: "Brown",
        email: "j.brown@manufacturing.com",
        phone: "+1-555-2002",
        company: "Industrial Solutions Ltd",
        title: "Operations Manager", 
        leadSource: "Trade Show",
        status: "Qualified",
        rating: "Warm",
        industry: "Manufacturing",
        estimatedValue: 120000,
        notes: "Looking for automation and efficiency improvements"
      },
      {
        firstName: "Ryan",
        lastName: "Wilson",
        email: "r.wilson@consulting.com",
        phone: "+1-555-2003",
        company: "Strategic Consulting Group",
        title: "Senior Partner",
        leadSource: "Referral",
        status: "Contacted",
        rating: "Hot",
        industry: "Consulting",
        estimatedValue: 75000,
        notes: "Needs digital transformation consulting services"
      },
      {
        firstName: "Sophie",
        lastName: "Davis",
        email: "s.davis@retailchain.com",
        phone: "+1-555-2004",
        company: "Retail Chain Plus",
        title: "IT Director",
        leadSource: "LinkedIn",
        status: "Qualified",
        rating: "Warm",
        industry: "Retail",
        estimatedValue: 90000,
        notes: "Exploring omnichannel retail solutions"
      },
      {
        firstName: "Marcus",
        lastName: "Johnson",
        email: "m.johnson@hospitality.com",
        phone: "+1-555-2005",
        company: "Luxury Hotels Group",
        title: "VP of Technology",
        leadSource: "Cold Call",
        status: "New",
        rating: "Cold",
        industry: "Hospitality",
        estimatedValue: 30000,
        notes: "Initial interest in guest experience technology"
      },
      {
        firstName: "Rachel",
        lastName: "Kim",
        email: "r.kim@nonprofit.org",
        phone: "+1-555-2006",
        company: "Community Impact Foundation",
        title: "Program Director",
        leadSource: "Social Media",
        status: "Contacted",
        rating: "Warm",
        industry: "Non-Profit",
        estimatedValue: 25000,
        notes: "Non-profit pricing for donor management system"
      },
      {
        firstName: "Daniel",
        lastName: "Rodriguez",
        email: "d.rodriguez@construction.com",
        phone: "+1-555-2007",
        company: "BuildTech Construction",
        title: "Project Manager",
        leadSource: "Partnership",
        status: "Qualified",
        rating: "Hot",
        industry: "Construction",
        estimatedValue: 85000,
        notes: "Project management and workforce tracking needs"
      },
      {
        firstName: "Emma",
        lastName: "Taylor",
        email: "e.taylor@lawfirm.com",
        phone: "+1-555-2008",
        company: "Taylor & Associates Law",
        title: "Managing Partner",
        leadSource: "Conference",
        status: "New",
        rating: "Warm",
        industry: "Legal",
        estimatedValue: 40000,
        notes: "Legal practice management and client portal"
      },
      {
        firstName: "Kevin",
        lastName: "Chang",
        email: "k.chang@foodservice.com",
        phone: "+1-555-2009",
        company: "Gourmet Food Services",
        title: "Operations Director",
        leadSource: "Email Campaign",
        status: "Contacted",
        rating: "Cold",
        industry: "Food Service",
        estimatedValue: 35000,
        notes: "Inventory and supply chain management system"
      },
      {
        firstName: "Natalie",
        lastName: "White",
        email: "n.white@realestate.com",
        phone: "+1-555-2010",
        company: "Prime Real Estate Group",
        title: "Sales Manager",
        leadSource: "Website",
        status: "Qualified",
        rating: "Hot",
        industry: "Real Estate",
        estimatedValue: 65000,
        notes: "CRM and lead management for real estate team"
      }
    ];

    const createdLeads = await db.insert(schema.leads).values(leadsData).returning();
    console.log(`✅ Created ${createdLeads.length} leads`);

    // Create 10 varied deals
    const dealsData = [
      {
        name: "TechCorp Enterprise License",
        amount: 250000,
        stage: "Proposal",
        probability: 75,
        expectedCloseDate: new Date('2025-02-15'),
        accountId: createdAccounts[0].id,
        contactId: createdContacts[0].id,
        description: "Annual enterprise software license with implementation services",
        type: "New Business",
        leadSource: "Website",
        nextStep: "Present proposal to executive team",
        competitorAnalysis: "Competing against Salesforce and Microsoft"
      },
      {
        name: "GreenEnergy Solar Integration",
        amount: 180000,
        stage: "Negotiation",
        probability: 65,
        expectedCloseDate: new Date('2025-03-01'),
        accountId: createdAccounts[1].id,
        contactId: createdContacts[1].id,
        description: "Smart grid integration and energy management platform",
        type: "New Business",
        leadSource: "Referral",
        nextStep: "Finalize contract terms and pricing",
        competitorAnalysis: "Primary competitor is Tesla Energy"
      },
      {
        name: "Healthcare Digital Transformation",
        amount: 320000,
        stage: "Discovery",
        probability: 40,
        expectedCloseDate: new Date('2025-04-10'),
        accountId: createdAccounts[2].id,
        contactId: createdContacts[2].id,
        description: "Complete digital transformation including EHR integration",
        type: "New Business",
        leadSource: "Trade Show",
        nextStep: "Conduct needs assessment workshop",
        competitorAnalysis: "Epic and Cerner are main competitors"
      },
      {
        name: "EduTech Platform Expansion",
        amount: 95000,
        stage: "Closed Won",
        probability: 100,
        expectedCloseDate: new Date('2025-01-20'),
        accountId: createdAccounts[3].id,
        contactId: createdContacts[3].id,
        description: "Expand learning platform to 5 additional school districts",
        type: "Expansion",
        leadSource: "LinkedIn",
        nextStep: "Begin implementation planning",
        competitorAnalysis: "Won against Google Classroom"
      },
      {
        name: "Logistics Optimization Suite",
        amount: 450000,
        stage: "Qualification",
        probability: 30,
        expectedCloseDate: new Date('2025-05-15'),
        accountId: createdAccounts[4].id,
        contactId: createdContacts[4].id,
        description: "AI-powered logistics and route optimization system",
        type: "New Business",
        leadSource: "Cold Call",
        nextStep: "Schedule technical demonstration",
        competitorAnalysis: "Oracle and SAP are key competitors"
      },
      {
        name: "Biotech Research Platform",
        amount: 275000,
        stage: "Proposal",
        probability: 55,
        expectedCloseDate: new Date('2025-03-20'),
        accountId: createdAccounts[5].id,
        contactId: createdContacts[5].id,
        description: "Laboratory data management and research collaboration platform",
        type: "New Business",
        leadSource: "Conference",
        nextStep: "Address security and compliance requirements",
        competitorAnalysis: "LabWare and Thermo Fisher are competitors"
      },
      {
        name: "Fashion Design Studio Tools",
        amount: 45000,
        stage: "Negotiation",
        probability: 80,
        expectedCloseDate: new Date('2025-02-05'),
        accountId: createdAccounts[6].id,
        contactId: createdContacts[6].id,
        description: "Design collaboration and supply chain management tools",
        type: "New Business",
        leadSource: "Social Media",
        nextStep: "Final contract review and signature",
        competitorAnalysis: "Adobe and Gerber are alternatives"
      },
      {
        name: "AgriTech IoT Implementation",
        amount: 165000,
        stage: "Discovery",
        probability: 50,
        expectedCloseDate: new Date('2025-04-30'),
        accountId: createdAccounts[7].id,
        contactId: createdContacts[7].id,
        description: "IoT sensors and precision agriculture monitoring system",
        type: "New Business",
        leadSource: "Partnership",
        nextStep: "Site survey and technical requirements gathering",
        competitorAnalysis: "John Deere and Climate Corp competing"
      },
      {
        name: "MediaStream Content Platform",
        amount: 380000,
        stage: "Closed Lost",
        probability: 0,
        expectedCloseDate: new Date('2025-01-15'),
        accountId: createdAccounts[8].id,
        contactId: createdContacts[8].id,
        description: "Video streaming and content management platform upgrade",
        type: "Renewal",
        leadSource: "Website",
        nextStep: "Post-mortem analysis and future opportunity planning",
        competitorAnalysis: "Lost to AWS Media Services"
      },
      {
        name: "FinTech Security Suite",
        amount: 220000,
        stage: "Proposal",
        probability: 70,
        expectedCloseDate: new Date('2025-02-28'),
        accountId: createdAccounts[9].id,
        contactId: createdContacts[9].id,
        description: "Blockchain security and fraud detection system",
        type: "New Business",
        leadSource: "Email Campaign",
        nextStep: "Technical proof of concept demonstration",
        competitorAnalysis: "IBM and Chainalysis are main competitors"
      }
    ];

    const createdDeals = await db.insert(schema.deals).values(dealsData).returning();
    console.log(`✅ Created ${createdDeals.length} deals`);

    console.log("🎉 Enhanced CRM data seeding completed successfully!");
    console.log(`📊 Summary: ${createdAccounts.length} accounts, ${createdContacts.length} contacts, ${createdLeads.length} leads, ${createdDeals.length} deals`);

  } catch (error) {
    console.error("❌ Error seeding enhanced CRM data:", error);
    throw error;
  }
}