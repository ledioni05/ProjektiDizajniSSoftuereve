// api-gateway/test.js
require('dotenv').config();
const mysql = require('mysql2');

console.log('='.repeat(50));
console.log('🚀 TEST I SHPEJTË I LIDHJES');
console.log('='.repeat(50));

// Konfigurimi direkt
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'plusmetaldss',
  port: process.env.DB_PORT || 3306
};

console.log('\n⚙️  Konfigurimi:');
Object.entries(config).forEach(([key, value]) => {
  console.log(`  ${key}: ${value || '(bosh)'}`);
});
console.log('');

// Testo direkt
const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.log('❌ DËSHTOI LIDHJA!');
    console.log('Gabim:', err.code, '-', err.message);
    
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('\n📌 PROBLEMI: Databaza nuk ekziston!');
      console.log('👉 Zgjidhja:');
      console.log('1. Hap phpMyAdmin: http://localhost:8008');
      console.log('2. Krijo databazën:');
      console.log('   CREATE DATABASE plus_metal_db;');
      console.log('3. Kliko "Go"');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('\n📌 PROBLEMI: MySQL nuk është duke punuar!');
      console.log('👉 Zgjidhja:');
      console.log('1. Hap XAMPP Control Panel');
      console.log('2. Kliko "Start" pranë MySQL');
      console.log('3. Prisni 5 sekonda');
    }
  } else {
    console.log('✅✅✅ U LIDH ME SUKSES!');
    
    // Shiko tabelat
    connection.query('SHOW TABLES', (err, tables) => {
      if (err) {
        console.log('Gabim:', err.message);
      } else {
        if (tables.length === 0) {
          console.log('\n📭 Databaza është bosh');
          console.log('💡 Krijoni tabelat tuaja!');
        } else {
          console.log(`\n📊 Gjithsej ${tables.length} tabela:`);
          tables.forEach((table, index) => {
            const tableName = Object.values(table)[0];
            console.log(`   ${index + 1}. ${tableName}`);
          });
        }
      }
      connection.end();
      console.log('\n✨ Testi përfundoi!');
    });
  }
});