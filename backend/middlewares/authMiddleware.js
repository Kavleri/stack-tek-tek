

const jwt = require('jsonwebtoken');

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const jwtSecret = getJwtSecret();

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Konfigurasi JWT_SECRET belum diatur.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
