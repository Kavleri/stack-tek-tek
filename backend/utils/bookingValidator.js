function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validateCreateBooking(req, res, next) {
  const payload = { ...req.body };

  if (!isNonEmptyString(payload.client_name)) {
    return res.status(400).json({ message: "client_name wajib diisi" });
  }

  if (!isNonEmptyString(payload.client_phone)) {
    return res.status(400).json({ message: "client_phone wajib diisi" });
  }

  if (!isNonEmptyString(payload.event_date)) {
    return res.status(400).json({ message: "event_date wajib diisi" });
  }

  if (!isNonEmptyString(payload.event_time)) {
    return res.status(400).json({ message: "event_time wajib diisi" });
  }

  if (payload.package_id !== undefined && payload.package_id !== null && Number.isNaN(Number(payload.package_id))) {
    return res.status(400).json({ message: "package_id harus berupa angka" });
  }

  req.validatedBooking = payload;
  return next();
}

module.exports = {
  validateCreateBooking,
};