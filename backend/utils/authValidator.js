const authValidator = {
  validateLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi.' });
    }
    next();
  },

  validateCreateAdmin: (req, res, next) => {
    const { username, password, fullName } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ message: 'Username, password, dan full name harus diisi.' });
    }
    next();
  },

  validateUpdateAdmin: (req, res, next) => {
    const { fullName } = req.body;
    if (!fullName) {
      return res.status(400).json({ message: 'Full name harus diisi.' });
    }
    next();
  },

  validateResetPassword: (req, res, next) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'Password baru harus diisi.' });
    }
    next();
  }
};

module.exports = authValidator;
