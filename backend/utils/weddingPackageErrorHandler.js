const errorMessages = {
  WEDDING_PACKAGE_NOT_FOUND: { statusCode: 404, message: 'Paket tidak ditemukan' },
};

const weddingPackageErrorHandler = (err, req, res, next) => {
  const errorType = err.type || err.message;
  if (errorType && errorMessages[errorType]) {
    const { statusCode, message } = errorMessages[errorType];
    return res.status(statusCode).json({ message });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server terkait paket wedding.';

  return res.status(statusCode).json({ message });
};

module.exports = weddingPackageErrorHandler;