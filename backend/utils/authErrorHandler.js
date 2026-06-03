const errorMessages = {
  INVALID_CREDENTIALS: { statusCode: 401, message: 'Username atau password salah.' },
  JWT_SECRET_MISSING: { statusCode: 500, message: 'Konfigurasi JWT_SECRET belum diatur.' },
  USERNAME_TAKEN: { statusCode: 400, message: 'Username sudah digunakan.' },
  ADMIN_NOT_FOUND: { statusCode: 404, message: 'Admin tidak ditemukan.' },
  SELF_DELETION: { statusCode: 403, message: 'Anda tidak bisa menghapus akun Anda sendiri.' }
};

const authErrorHandler = (err, req, res, next) => {
  console.error(`[Auth Error] ${req.method} ${req.originalUrl} -`, err.message || err);

  const errorType = err.type || err.message;
  if (errorType && errorMessages[errorType]) {
    const { statusCode, message } = errorMessages[errorType];
    return res.status(statusCode).json({ message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token autentikasi tidak valid.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token autentikasi telah kadaluarsa.' });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server terkait autentikasi.';

  return res.status(statusCode).json({
    message: message
  });
};

module.exports = authErrorHandler;
