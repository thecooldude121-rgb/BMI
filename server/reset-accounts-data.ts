import { comprehensiveAccountsSeeder } from './comprehensive-accounts-seeder';

async function resetAccountsData() {
  console.log('🔄 Starting comprehensive accounts data reset...');
  
  try {
    await comprehensiveAccountsSeeder.run();
    console.log('✅ Accounts data reset completed successfully!');
    console.log('📊 10 high-quality accounts with complete data have been created');
  } catch (error) {
    console.error('❌ Failed to reset accounts data:', error);
    process.exit(1);
  }
}

// Run the reset
resetAccountsData();

export { resetAccountsData };