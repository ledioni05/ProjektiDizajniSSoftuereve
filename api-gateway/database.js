const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'plusmetaldss',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};


const pool = mysql.createPool(dbConfig);


async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Lidhja me databazën u krye me sukses!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Gabim në lidhjen me databazën:', error.message);
    return false;
  }
}


async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Gabim në ekzekutimin e query:', error.message);
    throw error;
  }
}

async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  query,
  getConnection,
  testConnection
};

