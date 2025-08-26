import { comprehensiveDealsSeeder } from './comprehensive-deals-seeder';

async function syncDealsAccounts() {
  console.log('🔄 Starting comprehensive deals and accounts synchronization...');
  
  try {
    await comprehensiveDealsSeeder.run();
    console.log('✅ Deals and accounts synchronization completed successfully!');
    console.log('📊 Each account now has deals distributed across different stages');
    console.log('🔗 All modules are properly synchronized with updated deal data');
  } catch (error) {
    console.error('❌ Failed to sync deals and accounts:', error);
    process.exit(1);
  }
}

// Run the sync
syncDealsAccounts();

export { syncDealsAccounts };