

const db = require('../config/database');


async function testDbConnection() {
  console.log('Duke testuar lidhjen me databazën...');
  const isConnected = await db.testConnection();
  if (isConnected) {
    console.log('Databaza është e lidhur!');
  }
}


async function getAllUsers() {
  try {
    const users = await db.query('SELECT * FROM users');
    console.log('Përdoruesit:', users);
    return users;
  } catch (error) {
    console.error('Gabim:', error);
  }
}


async function createUser(name, email) {
  try {
    const result = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    console.log('Përdoruesi u krijua:', result.insertId);
    return result;
  } catch (error) {
    console.error('Gabim:', error);
  }
}


async function updateUser(userId, name) {
  try {
    const result = await db.query(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, userId]
    );
    console.log('Përdoruesi u përditësua:', result.affectedRows);
    return result;
  } catch (error) {
    console.error('Gabim:', error);
  }
}


async function deleteUser(userId) {
  try {
    const result = await db.query('DELETE FROM users WHERE id = ?', [userId]);
    console.log('Përdoruesi u fshi:', result.affectedRows);
    return result;
  } catch (error) {
    console.error('Gabim:', error);
  }
}


async function transferData() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
  
    await connection.query('UPDATE table1 SET ...');
    await connection.query('UPDATE table2 SET ...');
    
    await connection.commit();
    console.log('Transaction u krye me sukses!');
  } catch (error) {
    await connection.rollback();
    console.error('Transaction u anulua:', error);
  } finally {
    connection.release();
  }
}


if (require.main === module) {
  testDbConnection();
}

module.exports = {
  testDbConnection,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  transferData
};

