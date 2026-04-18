const errorMessages = {
  PAYMENT_LIST_EMPTY: { statusCode: 404, message: "Data payment tidak ditemukan" },
  PAYMENT_NOT_FOUND: { statusCode: 404, message: "Data payment tidak ditemukan" },
};

const paymentErrorHandler = (err, req, res, next) => {
  const errorType = err.type || err.message;
  if (errorType && errorMessages[errorType]) {
    const { statusCode, message } = errorMessages[errorType];
    return res.status(statusCode).json({ message });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server terkait payment.";

  return res.status(statusCode).json({ message });
};

module.exports = paymentErrorHandler;