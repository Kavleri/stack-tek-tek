const errorMessages = {
  GUEST_NOT_FOUND: { statusCode: 404, message: "Tamu tidak ditemukan" },
};

const guestErrorHandler = (err, req, res, next) => {
  const errorType = err.type || err.message;
  if (errorType && errorMessages[errorType]) {
    const { statusCode, message } = errorMessages[errorType];
    return res.status(statusCode).json({ message });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server terkait tamu.";

  return res.status(statusCode).json({ message });
};

module.exports = guestErrorHandler;