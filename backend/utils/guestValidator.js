function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function parseBooleanLike(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }

  return undefined;
}

function validateGuestId(req, res, next) {
  const { id } = req.params;

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({ message: "id harus berupa angka" });
  }

  return next();
}

function validateGuestEventId(req, res, next) {
  const { eventId } = req.params;

  if (Number.isNaN(Number(eventId))) {
    return res.status(400).json({ message: "eventId harus berupa angka" });
  }

  return next();
}

function validateCreateGuest(req, res, next) {
  const payload = {
    ...req.body,
    is_attended: parseBooleanLike(req.body.is_attended) ?? false,
  };

  if (!payload.event_id) {
    return res.status(400).json({ message: "event_id wajib diisi" });
  }

  if (!isNonEmptyString(payload.guest_name)) {
    return res.status(400).json({ message: "guest_name wajib diisi" });
  }

  if (!isNonEmptyString(payload.guest_phone)) {
    return res.status(400).json({ message: "guest_phone wajib diisi" });
  }

  if (Number.isNaN(Number(payload.event_id))) {
    return res.status(400).json({ message: "event_id harus berupa angka" });
  }

  if (payload.invitation_slug !== undefined && !isNonEmptyString(payload.invitation_slug)) {
    return res.status(400).json({ message: "invitation_slug harus berupa text" });
  }

  req.validatedGuest = payload;
  return next();
}

function validateUpdateGuest(req, res, next) {
  const payload = { ...req.body };

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ message: "Payload update tidak boleh kosong" });
  }

  if (payload.event_id !== undefined && Number.isNaN(Number(payload.event_id))) {
    return res.status(400).json({ message: "event_id harus berupa angka" });
  }

  if (payload.guest_name !== undefined && !isNonEmptyString(payload.guest_name)) {
    return res.status(400).json({ message: "guest_name wajib diisi" });
  }

  if (payload.guest_phone !== undefined && !isNonEmptyString(payload.guest_phone)) {
    return res.status(400).json({ message: "guest_phone wajib diisi" });
  }

  if (payload.invitation_slug !== undefined && !isNonEmptyString(payload.invitation_slug)) {
    return res.status(400).json({ message: "invitation_slug harus berupa text" });
  }

  if (payload.is_attended !== undefined) {
    const parsed = parseBooleanLike(payload.is_attended);
    if (parsed === undefined) {
      return res.status(400).json({ message: "is_attended harus berupa boolean" });
    }
    payload.is_attended = parsed;
  }

  req.validatedGuest = payload;
  return next();
}

module.exports = {
  validateCreateGuest,
  validateGuestEventId,
  validateGuestId,
  validateUpdateGuest,
};