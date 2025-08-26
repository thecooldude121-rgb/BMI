import { db } from './db';
import { deals } from '@shared/schema';

// Available deal stages from schema: ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'discovery', 'demo', 'trial']
const dealStages = ['qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'discovery', 'demo', 'trial'];

const comprehensiveDealsData = [
  {
    accountId: 'dbd7e90b-cef6-4412-98bd-bd8338852204', // Amazon Web Services
    name: "AWS Enterprise Cloud Migration",
    title: "AWS Enterprise Cloud Migration",
    value: 5200000,
    stage: "qualification",
    probability: 25,
    closeDate: "2025-12-15",
    description: "Comprehensive cloud migration and infrastructure modernization project for enterprise clients"
  },
  {
    accountId: 'a681b975-0e51-4dbc-a97b-96fa6869cd35', // Apple Inc
    name: "Apple Device Management Enterprise Solution",
    title: "Apple Device Management Enterprise Solution",
    value: 2800000,
    stage: "proposal",
    probability: 60,
    closeDate: "2025-11-30",
    description: "Enterprise device management and security solution for Mac and iOS devices across global workforce"
  },
  {
    accountId: 'e4d96e8b-9e20-4890-b329-61234f5ae786', // Google LLC
    name: "Google Workspace AI Integration Platform",
    title: "Google Workspace AI Integration Platform",
    value: 1900000,
    stage: "negotiation",
    probability: 85,
    closeDate: "2025-10-20",
    description: "Advanced AI-powered collaboration platform integration with custom enterprise features"
  },
  {
    accountId: '15ca7ec3-bc28-43bc-b588-e28a77293fb3', // Meta Platforms Inc
    name: "Meta Business Intelligence Analytics Suite",
    title: "Meta Business Intelligence Analytics Suite",
    value: 3400000,
    stage: "closed-won",
    probability: 100,
    closeDate: "2025-08-15",
    description: "Comprehensive business intelligence and analytics platform for social media insights and advertising optimization"
  },
  {
    accountId: '8016a2be-04b4-4afb-8a04-836618f0ede2', // Microsoft Corporation
    name: "Microsoft Azure Enterprise Transformation",
    title: "Microsoft Azure Enterprise Transformation",
    value: 6800000,
    stage: "closed-lost",
    probability: 0,
    closeDate: "2025-07-30",
    description: "Large-scale digital transformation initiative using Microsoft Azure cloud services and enterprise applications"
  },
  {
    accountId: 'c192850b-a6d5-4b90-9ee8-b55feba098d5', // Netflix Inc
    name: "Netflix Content Analytics Platform",
    title: "Netflix Content Analytics Platform",
    value: 2100000,
    stage: "discovery",
    probability: 35,
    closeDate: "2026-01-25",
    description: "Advanced content recommendation and analytics platform for streaming optimization and user engagement"
  },
  {
    accountId: '8e07721d-4919-429d-a290-6ffbd272403d', // Salesforce Inc
    name: "Salesforce CRM Integration & Automation",
    title: "Salesforce CRM Integration & Automation",
    value: 1500000,
    stage: "demo",
    probability: 50,
    closeDate: "2025-12-10",
    description: "Advanced CRM integration and automation solution with custom workflows and AI-powered insights"
  },
  {
    accountId: 'e5208665-baf8-4d41-ab34-79ab76a30476', // Shopify Inc
    name: "Shopify E-commerce Analytics Enhancement",
    title: "Shopify E-commerce Analytics Enhancement",
    value: 950000,
    stage: "trial",
    probability: 70,
    closeDate: "2025-11-05",
    description: "Enhanced e-commerce analytics and merchant insights platform with real-time reporting capabilities"
  },
  {
    accountId: '0c957293-b3e4-4ccb-85e0-ca0a09147c94', // Stripe Inc
    name: "Stripe Payment Processing Integration",
    title: "Stripe Payment Processing Integration",
    value: 1200000,
    stage: "qualification",
    probability: 30,
    closeDate: "2025-12-20",
    description: "Advanced payment processing integration with fraud detection and compliance monitoring features"
  },
  {
    accountId: 'db69e726-c591-4af8-b3a8-aded0833e0fe', // Tesla Inc
    name: "Tesla Fleet Management & Analytics Platform",
    title: "Tesla Fleet Management & Analytics Platform",
    value: 4500000,
    stage: "proposal",
    probability: 65,
    closeDate: "2025-11-15",
    description: "Comprehensive fleet management system with real-time vehicle analytics and predictive maintenance capabilities"
  }
];

export class ComprehensiveDealsSeeder {
  async clearExistingDeals() {
    console.log('🧹 Clearing existing deals...');
    await db.delete(deals);
    console.log('✅ Existing deals cleared');
  }

  async seedComprehensiveDeals() {
    console.log('💼 Creating comprehensive deals with diverse stages...');
    
    const createdDeals = [];
    
    for (const dealData of comprehensiveDealsData) {
      try {
        const [deal] = await db.insert(deals).values({
          name: dealData.name,
          title: dealData.title,
          accountId: dealData.accountId,
          value: dealData.value,
          stage: dealData.stage,
          probability: dealData.probability,
          expectedCloseDate: new Date(dealData.closeDate),
          description: dealData.description
        }).returning();
        
        createdDeals.push(deal);
        console.log(`✅ Created deal: ${dealData.name} (${dealData.stage})`);
      } catch (error) {
        console.error(`❌ Error creating deal ${dealData.name}:`, error);
        throw error;
      }
    }
    
    console.log(`✅ Created ${createdDeals.length} comprehensive deals across all stages`);
    return createdDeals;
  }

  async updateAccountDealCounts() {
    console.log('🔄 Updating account deal counts and metrics...');
    
    // Update account metrics with actual deal data
    const updateQuery = `
      UPDATE accounts 
      SET 
        total_deals = (
          SELECT COUNT(*) 
          FROM deals 
          WHERE deals.account_id = accounts.id
        ),
        total_revenue = (
          SELECT COALESCE(SUM(value), 0) 
          FROM deals 
          WHERE deals.account_id = accounts.id AND stage = 'closed-won'
        ),
        average_deal_size = (
          SELECT COALESCE(AVG(value), 0) 
          FROM deals 
          WHERE deals.account_id = accounts.id
        )
    `;
    
    await db.execute(updateQuery);
    console.log('✅ Account metrics updated with real deal data');
  }

  async run() {
    try {
      await this.clearExistingDeals();
      const deals = await this.seedComprehensiveDeals();
      await this.updateAccountDealCounts();
      
      console.log('🎉 Comprehensive deals seeding completed successfully!');
      console.log(`📊 Distribution: ${dealStages.length} different stages across 10 accounts`);
      return { success: true, dealsCreated: deals.length };
    } catch (error) {
      console.error('❌ Error in comprehensive deals seeding:', error);
      throw error;
    }
  }
}

export const comprehensiveDealsSeeder = new ComprehensiveDealsSeeder();