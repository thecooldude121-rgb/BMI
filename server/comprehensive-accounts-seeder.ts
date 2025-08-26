import { db } from './db';
import { accounts, contacts, deals, activities, leads } from '@shared/schema';

const comprehensiveAccountsData = [
  {
    name: "Microsoft Corporation",
    domain: "microsoft.com",
    industry: "Technology",
    employees: 221000,
    annualRevenue: 211915000000,
    address: {
      street: "One Microsoft Way",
      city: "Redmond",
      state: "Washington",
      zipCode: "98052",
      country: "United States"
    },
    phone: "+1 (425) 882-8080",
    website: "https://www.microsoft.com",
    description: "Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 1975,
    stockSymbol: "MSFT",
    linkedinUrl: "https://linkedin.com/company/microsoft",
    twitterHandle: "@Microsoft",
    healthScore: 95,
    customerSince: "2018-03-15",
    lastActivityDate: "2025-08-25",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    technologies: ["Azure", "Office 365", "Windows", "Teams", "Power Platform"],
    socialMedia: {
      twitter: "@Microsoft",
      linkedin: "microsoft",
      facebook: "Microsoft"
    },
    competitors: ["Google", "Apple", "Amazon", "Oracle"],
    tags: ["Enterprise", "Cloud", "SaaS", "Strategic Account"],
    customFields: {
      primaryUseCase: "Enterprise Software Solutions",
      keyDecisionMakers: ["Satya Nadella", "Amy Hood", "Brad Smith"],
      contractRenewalDate: "2026-03-15",
      supportLevel: "Premium"
    }
  },
  {
    name: "Salesforce Inc",
    domain: "salesforce.com",
    industry: "Software",
    employees: 79000,
    annualRevenue: 31352000000,
    address: {
      street: "415 Mission Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94105",
      country: "United States"
    },
    phone: "+1 (415) 901-7000",
    website: "https://www.salesforce.com",
    description: "Salesforce is an American cloud-based software company headquartered in San Francisco, California. It provides customer relationship management software and applications focused on sales, customer service, marketing automation, analytics, and application development.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 1999,
    stockSymbol: "CRM",
    linkedinUrl: "https://linkedin.com/company/salesforce",
    twitterHandle: "@Salesforce",
    healthScore: 92,
    customerSince: "2019-07-22",
    lastActivityDate: "2025-08-24",
    logoUrl: "https://logo.clearbit.com/salesforce.com",
    technologies: ["Salesforce Platform", "Heroku", "Tableau", "MuleSoft", "Slack"],
    socialMedia: {
      twitter: "@Salesforce",
      linkedin: "salesforce",
      facebook: "Salesforce"
    },
    competitors: ["Microsoft", "Oracle", "SAP", "HubSpot"],
    tags: ["CRM", "Cloud", "SaaS", "Strategic Partner"],
    customFields: {
      primaryUseCase: "CRM and Customer Success Platform",
      keyDecisionMakers: ["Marc Benioff", "Amy Weaver", "Parker Harris"],
      contractRenewalDate: "2025-12-31",
      supportLevel: "Premium Plus"
    }
  },
  {
    name: "Apple Inc",
    domain: "apple.com",
    industry: "Technology",
    employees: 164000,
    annualRevenue: 394328000000,
    address: {
      street: "One Apple Park Way",
      city: "Cupertino",
      state: "California",
      zipCode: "95014",
      country: "United States"
    },
    phone: "+1 (408) 996-1010",
    website: "https://www.apple.com",
    description: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software, and online services. Apple is the world's largest technology company by revenue and the world's most valuable company.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 1976,
    stockSymbol: "AAPL",
    linkedinUrl: "https://linkedin.com/company/apple",
    twitterHandle: "@Apple",
    healthScore: 98,
    customerSince: "2020-01-10",
    lastActivityDate: "2025-08-26",
    logoUrl: "https://logo.clearbit.com/apple.com",
    technologies: ["iOS", "macOS", "iPadOS", "watchOS", "tvOS"],
    socialMedia: {
      twitter: "@Apple",
      linkedin: "apple",
      instagram: "apple"
    },
    competitors: ["Samsung", "Google", "Microsoft", "Huawei"],
    tags: ["Consumer Electronics", "Innovation", "Premium Brand"],
    customFields: {
      primaryUseCase: "Enterprise Device Management",
      keyDecisionMakers: ["Tim Cook", "Luca Maestri", "Craig Federighi"],
      contractRenewalDate: "2026-01-10",
      supportLevel: "Enterprise"
    }
  },
  {
    name: "Amazon Web Services",
    domain: "aws.amazon.com",
    industry: "Cloud Computing",
    employees: 1500000,
    annualRevenue: 80096000000,
    address: {
      street: "410 Terry Avenue North",
      city: "Seattle",
      state: "Washington",
      zipCode: "98109",
      country: "United States"
    },
    phone: "+1 (206) 266-1000",
    website: "https://aws.amazon.com",
    description: "Amazon Web Services (AWS) is a subsidiary of Amazon that provides on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered pay-as-you-go basis.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 2006,
    stockSymbol: "AMZN",
    linkedinUrl: "https://linkedin.com/company/amazon-web-services",
    twitterHandle: "@awscloud",
    healthScore: 94,
    customerSince: "2019-11-05",
    lastActivityDate: "2025-08-25",
    logoUrl: "https://logo.clearbit.com/aws.amazon.com",
    technologies: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
    socialMedia: {
      twitter: "@awscloud",
      linkedin: "amazon-web-services",
      youtube: "AmazonWebServices"
    },
    competitors: ["Microsoft Azure", "Google Cloud", "IBM Cloud", "Oracle Cloud"],
    tags: ["Cloud Infrastructure", "DevOps", "Scalability"],
    customFields: {
      primaryUseCase: "Cloud Infrastructure and Services",
      keyDecisionMakers: ["Adam Selipsky", "Matt Garman", "Swami Sivasubramanian"],
      contractRenewalDate: "2025-11-05",
      supportLevel: "Enterprise Plus"
    }
  },
  {
    name: "Google LLC",
    domain: "google.com",
    industry: "Technology",
    employees: 190000,
    annualRevenue: 307394000000,
    address: {
      street: "1600 Amphitheatre Parkway",
      city: "Mountain View",
      state: "California",
      zipCode: "94043",
      country: "United States"
    },
    phone: "+1 (650) 253-0000",
    website: "https://www.google.com",
    description: "Google LLC is an American multinational technology company that focuses on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 1998,
    stockSymbol: "GOOGL",
    linkedinUrl: "https://linkedin.com/company/google",
    twitterHandle: "@Google",
    healthScore: 96,
    customerSince: "2020-06-18",
    lastActivityDate: "2025-08-26",
    logoUrl: "https://logo.clearbit.com/google.com",
    technologies: ["Google Cloud", "Android", "Chrome", "Gmail", "Google Workspace"],
    socialMedia: {
      twitter: "@Google",
      linkedin: "google",
      youtube: "Google"
    },
    competitors: ["Microsoft", "Apple", "Amazon", "Meta"],
    tags: ["Search", "Advertising", "AI", "Cloud Services"],
    customFields: {
      primaryUseCase: "Digital Advertising and Cloud Services",
      keyDecisionMakers: ["Sundar Pichai", "Ruth Porat", "Thomas Kurian"],
      contractRenewalDate: "2026-06-18",
      supportLevel: "Premium"
    }
  },
  {
    name: "Meta Platforms Inc",
    domain: "meta.com",
    industry: "Social Media",
    employees: 67317,
    annualRevenue: 134902000000,
    address: {
      street: "1 Hacker Way",
      city: "Menlo Park",
      state: "California",
      zipCode: "94025",
      country: "United States"
    },
    phone: "+1 (650) 543-4800",
    website: "https://www.meta.com",
    description: "Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., and TheFacebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Growth",
    foundedYear: 2004,
    stockSymbol: "META",
    linkedinUrl: "https://linkedin.com/company/meta",
    twitterHandle: "@Meta",
    healthScore: 88,
    customerSince: "2021-02-14",
    lastActivityDate: "2025-08-23",
    logoUrl: "https://logo.clearbit.com/meta.com",
    technologies: ["React", "GraphQL", "PyTorch", "Oculus", "Portal"],
    socialMedia: {
      twitter: "@Meta",
      linkedin: "meta",
      instagram: "meta"
    },
    competitors: ["Google", "TikTok", "Twitter", "Snapchat"],
    tags: ["Social Media", "VR/AR", "Metaverse", "Advertising"],
    customFields: {
      primaryUseCase: "Social Media Advertising Platform",
      keyDecisionMakers: ["Mark Zuckerberg", "Susan Li", "Chris Cox"],
      contractRenewalDate: "2025-08-14",
      supportLevel: "Standard"
    }
  },
  {
    name: "Netflix Inc",
    domain: "netflix.com",
    industry: "Entertainment",
    employees: 12800,
    annualRevenue: 31616000000,
    address: {
      street: "100 Winchester Circle",
      city: "Los Gatos",
      state: "California",
      zipCode: "95032",
      country: "United States"
    },
    phone: "+1 (408) 540-3700",
    website: "https://www.netflix.com",
    description: "Netflix, Inc. is an American subscription streaming service and production company based in Los Gatos, California. It offers a film and television series library through distribution deals as well as its own productions, known as Netflix Originals.",
    accountType: "Mid-Market",
    accountStatus: "Active",
    accountSegment: "Growth",
    foundedYear: 1997,
    stockSymbol: "NFLX",
    linkedinUrl: "https://linkedin.com/company/netflix",
    twitterHandle: "@netflix",
    healthScore: 85,
    customerSince: "2022-04-12",
    lastActivityDate: "2025-08-22",
    logoUrl: "https://logo.clearbit.com/netflix.com",
    technologies: ["React", "Node.js", "Python", "Java", "AWS"],
    socialMedia: {
      twitter: "@netflix",
      linkedin: "netflix",
      instagram: "netflix"
    },
    competitors: ["Disney+", "Amazon Prime Video", "Hulu", "HBO Max"],
    tags: ["Streaming", "Entertainment", "Content", "Global"],
    customFields: {
      primaryUseCase: "Content Distribution Technology",
      keyDecisionMakers: ["Reed Hastings", "Ted Sarandos", "Spencer Neumann"],
      contractRenewalDate: "2025-04-12",
      supportLevel: "Premium"
    }
  },
  {
    name: "Tesla Inc",
    domain: "tesla.com",
    industry: "Automotive",
    employees: 127855,
    annualRevenue: 96773000000,
    address: {
      street: "1 Tesla Road",
      city: "Austin",
      state: "Texas",
      zipCode: "78725",
      country: "United States"
    },
    phone: "+1 (512) 516-8177",
    website: "https://www.tesla.com",
    description: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas. Tesla designs and manufactures electric vehicles, battery energy storage systems, and related products and services.",
    accountType: "Enterprise",
    accountStatus: "Active",
    accountSegment: "Growth",
    foundedYear: 2003,
    stockSymbol: "TSLA",
    linkedinUrl: "https://linkedin.com/company/tesla-motors",
    twitterHandle: "@Tesla",
    healthScore: 90,
    customerSince: "2021-09-30",
    lastActivityDate: "2025-08-24",
    logoUrl: "https://logo.clearbit.com/tesla.com",
    technologies: ["Autopilot", "Supercharger", "Solar Panels", "Powerwall", "Model S/3/X/Y"],
    socialMedia: {
      twitter: "@Tesla",
      linkedin: "tesla-motors",
      instagram: "teslamotors"
    },
    competitors: ["Ford", "General Motors", "Volkswagen", "BYD"],
    tags: ["Electric Vehicles", "Clean Energy", "Innovation", "Sustainability"],
    customFields: {
      primaryUseCase: "Fleet Management and Charging Infrastructure",
      keyDecisionMakers: ["Elon Musk", "Zachary Kirkhorn", "Drew Baglino"],
      contractRenewalDate: "2025-09-30",
      supportLevel: "Enterprise"
    }
  },
  {
    name: "Shopify Inc",
    domain: "shopify.com",
    industry: "E-commerce",
    employees: 11600,
    annualRevenue: 5600000000,
    address: {
      street: "150 Elgin Street",
      city: "Ottawa",
      state: "Ontario",
      zipCode: "K2P 1L4",
      country: "Canada"
    },
    phone: "+1 (613) 241-2828",
    website: "https://www.shopify.com",
    description: "Shopify Inc. is a Canadian multinational e-commerce company headquartered in Ottawa, Ontario. It is also the name of its proprietary e-commerce platform for online stores and retail point-of-sale systems.",
    accountType: "Mid-Market",
    accountStatus: "Active",
    accountSegment: "Growth",
    foundedYear: 2006,
    stockSymbol: "SHOP",
    linkedinUrl: "https://linkedin.com/company/shopify",
    twitterHandle: "@Shopify",
    healthScore: 87,
    customerSince: "2022-01-20",
    lastActivityDate: "2025-08-21",
    logoUrl: "https://logo.clearbit.com/shopify.com",
    technologies: ["Ruby on Rails", "React", "GraphQL", "Kubernetes", "MySQL"],
    socialMedia: {
      twitter: "@Shopify",
      linkedin: "shopify",
      instagram: "shopify"
    },
    competitors: ["WooCommerce", "BigCommerce", "Magento", "Squarespace"],
    tags: ["E-commerce", "SaaS", "Small Business", "Retail"],
    customFields: {
      primaryUseCase: "E-commerce Platform Integration",
      keyDecisionMakers: ["Tobias Lütke", "Amy Shapero", "Harley Finkelstein"],
      contractRenewalDate: "2025-01-20",
      supportLevel: "Standard"
    }
  },
  {
    name: "Stripe Inc",
    domain: "stripe.com",
    industry: "Financial Technology",
    employees: 8000,
    annualRevenue: 7400000000,
    address: {
      street: "510 Townsend Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94103",
      country: "United States"
    },
    phone: "+1 (888) 926-2289",
    website: "https://www.stripe.com",
    description: "Stripe, Inc. is an Irish-American financial services and software as a service company dual-headquartered in San Francisco, California and Dublin, Ireland. The company primarily offers payment processing software and application programming interfaces for e-commerce websites and mobile applications.",
    accountType: "Growth",
    accountStatus: "Active",
    accountSegment: "Strategic",
    foundedYear: 2010,
    stockSymbol: "Private",
    linkedinUrl: "https://linkedin.com/company/stripe",
    twitterHandle: "@stripe",
    healthScore: 93,
    customerSince: "2023-03-08",
    lastActivityDate: "2025-08-25",
    logoUrl: "https://logo.clearbit.com/stripe.com",
    technologies: ["JavaScript", "Ruby", "Go", "React", "API Gateway"],
    socialMedia: {
      twitter: "@stripe",
      linkedin: "stripe",
      github: "stripe"
    },
    competitors: ["PayPal", "Square", "Adyen", "Braintree"],
    tags: ["Payments", "FinTech", "API", "Developer Tools"],
    customFields: {
      primaryUseCase: "Payment Processing Integration",
      keyDecisionMakers: ["Patrick Collison", "John Collison", "Dhivya Suryadevara"],
      contractRenewalDate: "2026-03-08",
      supportLevel: "Premium"
    }
  }
];

export class ComprehensiveAccountsSeeder {
  async clearExistingData() {
    console.log('🧹 Clearing existing data...');
    
    // Delete in order to respect foreign key constraints
    await db.delete(activities);
    await db.delete(deals);
    await db.delete(contacts);
    await db.delete(leads);
    await db.delete(accounts);
    
    console.log('✅ Existing data cleared');
  }

  async seedComprehensiveAccounts() {
    console.log('🏢 Creating comprehensive accounts with full data...');
    
    const createdAccounts = [];
    
    for (const accountData of comprehensiveAccountsData) {
      try {
        const [account] = await db.insert(accounts).values({
          name: accountData.name,
          domain: accountData.domain,
          industry: accountData.industry,
          employees: accountData.employees,
          annualRevenue: accountData.annualRevenue.toString(),
          address: accountData.address,
          phone: accountData.phone,
          website: accountData.website,
          description: accountData.description,
          accountType: accountData.accountType,
          accountStatus: accountData.accountStatus,
          accountSegment: accountData.accountSegment,
          foundedYear: accountData.foundedYear,
          stockSymbol: accountData.stockSymbol,
          linkedinUrl: accountData.linkedinUrl,
          twitterHandle: accountData.twitterHandle,
          healthScore: accountData.healthScore,
          logoUrl: accountData.logoUrl,
          technologies: accountData.technologies,
          socialMedia: accountData.socialMedia,
          competitors: accountData.competitors,
          tags: accountData.tags,
          customFields: accountData.customFields,
          totalDeals: 0,
          totalRevenue: "0",
          averageDealSize: "0"
        }).returning();
        
        createdAccounts.push(account);
        console.log(`✅ Created account: ${accountData.name}`);
      } catch (error) {
        console.error(`❌ Error creating account ${accountData.name}:`, error);
        throw error;
      }
    }
    
    console.log(`✅ Created ${createdAccounts.length} comprehensive accounts`);
    return createdAccounts;
  }

  async createSampleContactsAndDeals(accounts: any[]) {
    console.log('👥 Creating sample contacts and deals for accounts...');
    
    const contactsData = [
      // Microsoft contacts
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@microsoft.com",
        phone: "+1 (425) 882-8081",
        title: "Director of Enterprise Solutions",
        department: "Sales",
        accountId: accounts[0].id
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@microsoft.com",
        phone: "+1 (425) 882-8082",
        title: "Senior Product Manager",
        department: "Product",
        accountId: accounts[0].id
      },
      // Salesforce contacts
      {
        firstName: "Emily",
        lastName: "Rodriguez",
        email: "emily.rodriguez@salesforce.com",
        phone: "+1 (415) 901-7001",
        title: "VP of Customer Success",
        department: "Customer Success",
        accountId: accounts[1].id
      },
      // Apple contact
      {
        firstName: "David",
        lastName: "Kim",
        email: "david.kim@apple.com",
        phone: "+1 (408) 996-1011",
        title: "Enterprise Sales Manager",
        department: "Sales",
        accountId: accounts[2].id
      },
      // AWS contact
      {
        firstName: "Jennifer",
        lastName: "Brown",
        email: "jennifer.brown@amazon.com",
        phone: "+1 (206) 266-1001",
        title: "Solutions Architect",
        department: "Solutions",
        accountId: accounts[3].id
      }
    ];

    const dealsData = [
      // Microsoft deal
      {
        name: "Microsoft Enterprise License Renewal",
        title: "Microsoft Enterprise License Renewal",
        value: 2500000,
        stage: "negotiation",
        probability: 85,
        closeDate: "2025-12-31",
        accountId: accounts[0].id,
        description: "Annual enterprise license renewal for Office 365 and Azure services"
      },
      // Salesforce deal
      {
        name: "Salesforce Platform Expansion",
        title: "Salesforce Platform Expansion",
        value: 850000,
        stage: "proposal",
        probability: 70,
        closeDate: "2025-10-15",
        accountId: accounts[1].id,
        description: "Expansion of Salesforce platform to include Marketing Cloud and Service Cloud"
      },
      // Apple deal
      {
        name: "Apple Device Management Solution",
        title: "Apple Device Management Solution",
        value: 1200000,
        stage: "qualification",
        probability: 60,
        closeDate: "2025-11-30",
        accountId: accounts[2].id,
        description: "Enterprise device management solution for Mac and iOS devices"
      },
      // AWS deal
      {
        name: "AWS Cloud Migration Project",
        title: "AWS Cloud Migration Project",
        value: 3200000,
        stage: "discovery",
        probability: 45,
        closeDate: "2026-02-28",
        accountId: accounts[3].id,
        description: "Complete cloud migration and infrastructure modernization project"
      },
      // Google deal
      {
        name: "Google Workspace Implementation",
        title: "Google Workspace Implementation",
        value: 680000,
        stage: "closed-won",
        probability: 100,
        closeDate: "2025-07-15",
        accountId: accounts[4].id,
        description: "Google Workspace deployment for global workforce"
      }
    ];

    // Create contacts
    for (const contactData of contactsData) {
      await db.insert(contacts).values(contactData);
    }

    // Create deals
    for (const dealData of dealsData) {
      await db.insert(deals).values(dealData);
    }

    console.log(`✅ Created ${contactsData.length} contacts and ${dealsData.length} deals`);
  }

  async run() {
    try {
      await this.clearExistingData();
      const accounts = await this.seedComprehensiveAccounts();
      await this.createSampleContactsAndDeals(accounts);
      
      console.log('🎉 Comprehensive accounts seeding completed successfully!');
      return { success: true, accountsCreated: accounts.length };
    } catch (error) {
      console.error('❌ Error in comprehensive accounts seeding:', error);
      throw error;
    }
  }
}

export const comprehensiveAccountsSeeder = new ComprehensiveAccountsSeeder();