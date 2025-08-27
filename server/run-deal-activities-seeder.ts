#!/usr/bin/env tsx
// DISABLED: Activity seeder disabled per user request
// No automatic activity creation without explicit user instruction

import { seedDealActivities } from './comprehensive-deal-activities-seeder';

async function runSeeder() {
  console.log('⚠️ Deal Activities Seeder is DISABLED per user request');
  console.log('❌ No automatic activity creation without explicit user instruction');
  process.exit(0);
}

// DISABLED - User explicitly requested no automatic activity creation
// runSeeder();