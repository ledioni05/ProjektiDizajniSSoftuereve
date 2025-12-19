
require('dotenv').config();
const db = require('../config/database');

async function testConnection() {
  console.log('=====================================');
  console.log('Testimi i lidhjes me databazën...');
  console.log('=====================================');
  console.log('Host:', process.env.DB_HOST || 'localhost');
  console.log('Database:', process.env.DB_NAME || 'plus_metal_db');
  console.log('User:', process.env.DB_USER || 'root');
  console.log('=====================================\n');

  try {
    const isConnected = await db.testConnection();
    
    if (isConnected) {
   
      const [tables] = await db.pool.execute('SHOW TABLES');
      console.log('\n✅ Tabelat në databazë:');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${index + 1}. ${tableName}`);
      });
      
      console.log('\n✅ Lidhja me databazën funksionon perfektisht!');
    }
  } catch (error) {
    console.error('\n❌ Gabim:', error.message);
    console.log('\nKontrolloni:');
    console.log('1. A është MySQL serveri i startuar?');
    console.log('2. A janë kredencialet e sakta në skedarin .env?');
    console.log('3. A ekziston databaza me emrin që keni specifikuar?');
  }
  
  process.exit(0);
}

testConnection();

