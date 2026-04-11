const AdminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function looksLikeBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

const authController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password harus diisi.' });
      }

      const user = await AdminModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Username atau password salah.' });
      }

      // Verifikasi password dengan fallback untuk data lama yang masih plain text.
      let isPasswordValid = false;

      if (looksLikeBcryptHash(user.password)) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = password === user.password;

        // Upgrade password legacy ke hash bcrypt saat login berhasil.
        if (isPasswordValid) {
          await AdminModel.updatePassword(user.id, password);
        }
      }

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Username atau password salah.' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, fullName: user.full_name },
        process.env.JWT_SECRET || 'super_secret_key_123_wedding',
        { expiresIn: '12h' } // Token berlaku 12 jam
      );

      res.json({
        message: 'Login berhasil.',
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error saat login:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // Mendapatkan daftar admin (Restricted)
  getAdmins: async (req, res) => {
    try {
      const admins = await AdminModel.findAll();
      res.json(admins);
    } catch (error) {
      console.error('Error saat mengambil daftar admin:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // Menambah admin baru (Restricted)
  createAdmin: async (req, res) => {
    try {
      const { username, password, fullName, role } = req.body;
      if (!username || !password || !fullName) {
        return res.status(400).json({ message: 'Username, password, dan full name harus diisi.' });
      }

      // Cek apakah username sudah dipakai
      const existingUser = await AdminModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan.' });
      }

      const insertId = await AdminModel.create({ username, password, fullName, role });
      res.status(201).json({ message: 'Akun admin berhasil dibuat.', adminId: insertId });
    } catch (error) {
      console.error('Error saat membuat admin:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // Mengubah profil admin (Restricted)
  updateAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, role } = req.body;

      if (!fullName) {
        return res.status(400).json({ message: 'Full name harus diisi.' });
      }

      const affectedRows = await AdminModel.update(id, { fullName, role: role || 'admin' });
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Admin tidak ditemukan.' });
      }

      res.json({ message: 'Profil admin berhasil diperbarui.' });
    } catch (error) {
      console.error('Error saat update admin:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // Menghapus admin (Restricted)
  deleteAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Mencegah admin menghapus dirinya sendiri
      if (parseInt(id) === req.user.id) {
        return res.status(403).json({ message: 'Anda tidak bisa menghapus akun Anda sendiri.' });
      }

      const affectedRows = await AdminModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Admin tidak ditemukan.' });
      }

      res.json({ message: 'Admin berhasil dihapus.' });
    } catch (error) {
      console.error('Error saat menghapus admin:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  },

  // Reset password admin lain (Restricted)
  resetPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({ message: 'Password baru harus diisi.' });
      }

      const affectedRows = await AdminModel.updatePassword(id, newPassword);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Admin tidak ditemukan.' });
      }

      res.json({ message: 'Password berhasil direset.' });
    } catch (error) {
      console.error('Error saat mereset password:', error);
      res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
  }
};

module.exports = authController;
