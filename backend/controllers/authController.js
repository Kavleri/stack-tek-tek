const AdminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function looksLikeBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

const authController = {
  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await AdminModel.findByUsername(username);
      if (!user) {
        return next({ type: 'INVALID_CREDENTIALS' });
      }

      let isPasswordValid = false;

      if (looksLikeBcryptHash(user.password)) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = password === user.password;

        if (isPasswordValid) {
          await AdminModel.updatePassword(user.id, password);
        }
      }

      if (!isPasswordValid) {
        return next({ type: 'INVALID_CREDENTIALS' });
      }

      const jwtSecret = getJwtSecret();

      if (!jwtSecret) {
        return next({ type: 'JWT_SECRET_MISSING' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, fullName: user.full_name },
        jwtSecret,
        { expiresIn: '12h' }
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
      next(error);
    }
  },

  getAdmins: async (req, res, next) => {
    try {
      const admins = await AdminModel.findAll();
      res.json(admins);
    } catch (error) {
      next(error);
    }
  },

  createAdmin: async (req, res, next) => {
    try {
      const { username, password, fullName, role } = req.body;

      const existingUser = await AdminModel.findByUsername(username);
      if (existingUser) {
        return next({ type: 'USERNAME_TAKEN' });
      }

      const insertId = await AdminModel.create({ username, password, fullName, role });
      res.status(201).json({ message: 'Akun admin berhasil dibuat.', adminId: insertId });
    } catch (error) {
      next(error);
    }
  },

  updateAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { fullName, role } = req.body;

      const affectedRows = await AdminModel.update(id, { fullName, role: role || 'admin' });
      if (affectedRows === 0) {
        return next({ type: 'ADMIN_NOT_FOUND' });
      }

      res.json({ message: 'Profil admin berhasil diperbarui.' });
    } catch (error) {
      next(error);
    }
  },

  deleteAdmin: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (parseInt(id) === req.user.id) {
        return next({ type: 'SELF_DELETION' });
      }

      const affectedRows = await AdminModel.delete(id);
      if (affectedRows === 0) {
        return next({ type: 'ADMIN_NOT_FOUND' });
      }

      res.json({ message: 'Admin berhasil dihapus.' });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const affectedRows = await AdminModel.updatePassword(id, newPassword);
      if (affectedRows === 0) {
        return next({ type: 'ADMIN_NOT_FOUND' });
      }

      res.json({ message: 'Password berhasil direset.' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
