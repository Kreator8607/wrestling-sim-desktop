const WrestlingSimDatabase = require('./src/db/database.js');

async function testDatabaseLoad() {
  try {
    console.log('✓ Database module loaded successfully');
    console.log('✓ WrestlingSimDatabase class available');
    
    // Test instantiation
    const db = new WrestlingSimDatabase('./test-db.db');
    console.log('✓ Database instance created');
    
    // Test initialization
    await db.initialize();
    console.log('✓ Database initialized with sql.js');
    
    // Test basic operations
    const stats = db.getStats();
    console.log('✓ Database statistics:', stats);
    
    db.close();
    console.log('✓ Database closed successfully');
    console.log('\n✅ All database tests passed!');
  } catch (error) {
    console.error('✗ Database test failed:', error.message);
    process.exit(1);
  }
}

testDatabaseLoad();
