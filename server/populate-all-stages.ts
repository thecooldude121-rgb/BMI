import { db } from './db';
import { deals, accounts, contacts } from '../shared/schema';

const DEAL_STAGES = [
  'discovery',
  'qualification', 
  'proposal',
  'demo',
  'trial',
  'negotiation',
  'closed-won',
  'closed-lost'
];

async function populateAllStages() {
  console.log('📋 Populating deals across all 8 stages...');
  
  // Get existing accounts and contacts
  const existingAccounts = await db.select().from(accounts).limit(5);
  const existingContacts = await db.select().from(contacts).limit(5);
  
  if (existingAccounts.length === 0 || existingContacts.length === 0) {
    console.log('❌ Need accounts and contacts first');
    return;
  }

  // Sample deals for each stage
  const dealsToCreate = [
    {
      name: 'Enterprise Data Analytics Platform',
      stage: 'discovery',
      value: '2500000',
      probability: 15,
      expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: existingAccounts[0].id,
      contactId: existingContacts[0].id,
      dealHealth: 'healthy',
      dealType: 'new_business',
      aiScore: 72
    },
    {
      name: 'Cloud Infrastructure Modernization',
      stage: 'demo', 
      value: '1800000',
      probability: 60,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: existingAccounts[1].id,
      contactId: existingContacts[1].id,
      dealHealth: 'healthy',
      dealType: 'upsell',
      aiScore: 85
    },
    {
      name: 'AI-Powered Customer Support Suite',
      stage: 'trial',
      value: '950000',
      probability: 75,
      expectedCloseDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: existingAccounts[2].id,
      contactId: existingContacts[2].id,
      dealHealth: 'hot_opportunity',
      dealType: 'new_business', 
      aiScore: 88
    },
    {
      name: 'Digital Transformation Consulting',
      stage: 'closed-won',
      value: '5200000',
      probability: 100,
      expectedCloseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: existingAccounts[3].id,
      contactId: existingContacts[3].id,
      dealHealth: 'healthy',
      dealType: 'new_business',
      aiScore: 95
    },
    {
      name: 'Legacy System Migration Project',
      stage: 'closed-lost',
      value: '3200000',
      probability: 0,
      expectedCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      accountId: existingAccounts[4].id,
      contactId: existingContacts[4].id,
      dealHealth: 'critical',
      dealType: 'renewal',
      aiScore: 25
    }
  ];

  for (const dealData of dealsToCreate) {
    try {
      const [newDeal] = await db.insert(deals).values({
        ...dealData,
        title: dealData.name,
        assignedTo: 'John Smith',
        lastActivityDate: new Date().toISOString(),
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        teamMembers: ['John Smith', 'Jane Doe'],
        followers: ['manager@company.com']
      }).returning();
      
      console.log(`✅ Created deal: ${newDeal.name} (${newDeal.stage})`);
    } catch (error) {
      console.log(`⚠️ Deal might already exist: ${dealData.name}`);
    }
  }

  console.log('📊 Checking stage distribution...');
  const stageDistribution = await db.select().from(deals);
  const stageCounts = DEAL_STAGES.map(stage => ({
    stage,
    count: stageDistribution.filter(deal => deal.stage === stage).length
  }));
  
  console.log('Stage distribution:', stageCounts);
  console.log('✅ All stages populated!');
}

populateAllStages().catch(console.error);