function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Whitelist status sesuai ENUM di skema (events.status).
const ALLOWED_EVENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

function isValidDateString(value) {
  // YYYY-MM-DD kasar, cukup untuk validasi awal.
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTimeString(value) {
  // HH:MM atau HH:MM:SS
  return typeof value === "string" && /^\d{2}:\d{2}(:\d{2})?$/.test(value);
}

// Bangun payload event yang sudah dibersihkan dari req.body.
// strict=true untuk field wajib (CREATE); strict=false membolehkan field hilang (UPDATE).
function buildEventPayload(body, { requireAll }) {
  const errors = [];

  if (requireAll || body.client_name !== undefined) {
    if (!isNonEmptyString(body.client_name)) errors.push("client_name wajib diisi");
  }
  if (requireAll || body.client_phone !== undefined) {
    if (!isNonEmptyString(body.client_phone)) errors.push("client_phone wajib diisi");
  }
  if (requireAll || body.event_date !== undefined) {
    if (!isValidDateString(body.event_date)) errors.push("event_date wajib format YYYY-MM-DD");
  }
  if (requireAll || body.event_time !== undefined) {
    if (!isValidTimeString(body.event_time)) errors.push("event_time wajib format HH:MM");
  }
  if (requireAll || body.location_name !== undefined) {
    if (!isNonEmptyString(body.location_name)) errors.push("location_name wajib diisi");
  }

  if (body.package_id !== undefined && body.package_id !== null && body.package_id !== "") {
    if (Number.isNaN(Number(body.package_id))) errors.push("package_id harus berupa angka");
  }
  if (body.status !== undefined && !ALLOWED_EVENT_STATUSES.includes(body.status)) {
    errors.push(`status harus salah satu: ${ALLOWED_EVENT_STATUSES.join(", ")}`);
  }

  return errors;
}

function normalizeEventPayload(body) {
  const payload = {};
  const stringFields = [
    "client_name", "client_phone", "event_date", "event_time",
    "location_name", "location_address", "google_maps_link", "notes_for_field_staff",
  ];
  stringFields.forEach((f) => {
    if (body[f] !== undefined) payload[f] = typeof body[f] === "string" ? body[f].trim() : body[f];
  });

  // package_id: angka, atau null bila kosong.
  if (body.package_id !== undefined) {
    payload.package_id =
      body.package_id === null || body.package_id === "" ? null : Number(body.package_id);
  }

  if (body.status !== undefined) payload.status = body.status;

  return payload;
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

// --- Validasi untuk endpoint events (CRUD baru) ---

function validateEventId(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "id harus berupa angka positif" });
  }
  return next();
}

function validateCreateEvent(req, res, next) {
  const errors = buildEventPayload(req.body, { requireAll: true });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join("; ") });
  }
  req.validatedEvent = normalizeEventPayload(req.body);
  return next();
}

function validateUpdateEvent(req, res, next) {
  // PUT bisa partial: minimal satu field event harus ada.
  const knownFields = [
    "client_name", "client_phone", "event_date", "event_time",
    "location_name", "location_address", "google_maps_link",
    "package_id", "status", "notes_for_field_staff",
  ];
  const hasAny = knownFields.some((f) => req.body[f] !== undefined);
  if (!hasAny) {
    return res.status(400).json({ message: "Tidak ada field yang dikirim untuk diperbarui" });
  }

  const errors = buildEventPayload(req.body, { requireAll: false });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join("; ") });
  }
  req.validatedEvent = normalizeEventPayload(req.body);
  return next();
}

module.exports = {
  validateCreateBooking,
  validateEventId,
  validateCreateEvent,
  validateUpdateEvent,
};