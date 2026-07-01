

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) return next(err);
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
