const pool = require('../config/database');
const bcrypt = require('bcrypt');

const AdminModel = {
  // Ambil user berdasarkan username (untuk login)
  findByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Ambil semua admin (tanpa mengambil password)
  findAll: async () => {
    const [rows] = await pool.query('SELECT id, username, full_name, role, created_at, updated_at FROM admins');
    return rows;
  },

  // Buat admin baru
  create: async ({ username, password, fullName, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, fullName, role || 'admin']
    );
    return result.insertId;
  },

  // Update profil admin (tanpa merubah password)
  update: async (id, { fullName, role }) => {
    const [result] = await pool.query(
      'UPDATE admins SET full_name = ?, role = ? WHERE id = ?',
      [fullName, role, id]
    );
    return result.affectedRows;
  },

  // Hapus admin
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM admins WHERE id = ?', [id]);
    return result.affectedRows;
  },

  // Ubah/Reset password
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows;
  }
};

module.exports = AdminModel;
