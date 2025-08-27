#!/usr/bin/env tsx
import { seedDealActivities } from './comprehensive-deal-activities-seeder';

async function runSeeder() {
  try {
    console.log('🚀 Starting Deal Activities Seeder...');
    const result = await seedDealActivities();
    console.log(`✅ Successfully created ${result} activities`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
}

runSeeder();