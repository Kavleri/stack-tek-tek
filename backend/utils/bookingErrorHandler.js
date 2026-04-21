const errorMessages = {
  BOOKING_DATE_CONFLICT: { statusCode: 409, message: "Tanggal sudah dibooking!" },
};

const bookingErrorHandler = (err, req, res, next) => {
  const errorType = err.type || err.message;
  if (errorType && errorMessages[errorType]) {
    const { statusCode, message } = errorMessages[errorType];
    return res.status(statusCode).json({ message });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server terkait booking.";

  return res.status(statusCode).json({ message });
};

module.exports = bookingErrorHandler;