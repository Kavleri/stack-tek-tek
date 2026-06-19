 const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'wedding_organizer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi database berhasil');
    connection.release();
  } catch (err) {
    console.error('❌ Koneksi database gagal:');
    console.error(err && err.stack ? err.stack : err);
    if (err && err.code) {
      console.error('Kode error DB:', err.code);
    }
    console.error('Pastikan service MySQL/MariaDB berjalan dan kredensial di file .env benar.');
  }
}

testDatabaseConnection();

module.exports = pool;
