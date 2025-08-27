#!/usr/bin/env tsx

import { db } from './db';
import { activities } from '../shared/schema';

async function clearActivities() {
  try {
    console.log('🗑️ Deleting all activities...');
    const result = await db.delete(activities);
    console.log('✅ All activities deleted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting activities:', error);
    process.exit(1);
  }
}

clearActivities();