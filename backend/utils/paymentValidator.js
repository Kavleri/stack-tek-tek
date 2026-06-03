const ALLOWED_PAYMENT_TYPES = ["booking_fee", "down_payment", "installment", "final_payment"];
const ALLOWED_PAYMENT_STATUSES = ["pending", "confirmed", "rejected"];

function validateNumericField(value, fieldName) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return `${fieldName} harus berupa angka`;
  }

  return null;
}

function validateOptionalStringField(value, fieldName) {
  if (value !== undefined && value !== null && typeof value !== "string") {
    return `${fieldName} harus berupa text`;
  }

  return null;
}

function validatePaymentId(req, res, next) {
  const { id } = req.params;
  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  return next();
}

function validateCreatePayment(req, res, next) {
  const data = {
    ...req.body,
    status: req.body.status || "pending",
  };

  if (!data.event_id) {
    return res.status(400).json({ message: "event_id wajib diisi" });
  }

  if (!data.payment_amount) {
    return res.status(400).json({ message: "payment_amount wajib diisi" });
  }

  if (!data.payment_date) {
    return res.status(400).json({ message: "payment_date wajib diisi" });
  }

  const eventIdError = validateNumericField(data.event_id, "event_id");
  if (eventIdError) {
    return res.status(400).json({ message: eventIdError });
  }

  const amountError = validateNumericField(data.payment_amount, "payment_amount");
  if (amountError) {
    return res.status(400).json({ message: amountError });
  }

  const methodError = validateOptionalStringField(data.payment_method, "payment_method");
  if (methodError) {
    return res.status(400).json({ message: methodError });
  }

  const noteError = validateOptionalStringField(data.receipt_note, "receipt_note");
  if (noteError) {
    return res.status(400).json({ message: noteError });
  }

  const proofError = validateOptionalStringField(data.proof_of_payment, "proof_of_payment");
  if (proofError) {
    return res.status(400).json({ message: proofError });
  }

  if (data.payment_type !== undefined) {
    if (typeof data.payment_type !== "string") {
      return res.status(400).json({ message: "payment_type harus berupa text" });
    }
    if (!ALLOWED_PAYMENT_TYPES.includes(data.payment_type)) {
      return res.status(400).json({ message: "payment_type tidak valid" });
    }
  }

  if (data.status !== undefined && !ALLOWED_PAYMENT_STATUSES.includes(data.status)) {
    return res.status(400).json({ message: "status payment tidak valid" });
  }

  req.validatedPayment = data;
  return next();
}

function validateUpdatePayment(req, res, next) {
  const data = { ...req.body };

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Payload update tidak boleh kosong" });
  }

  if (data.event_id !== undefined) {
    const eventIdError = validateNumericField(data.event_id, "event_id");
    if (eventIdError) {
      return res.status(400).json({ message: eventIdError });
    }
  }

  if (data.payment_amount !== undefined) {
    const amountError = validateNumericField(data.payment_amount, "payment_amount");
    if (amountError) {
      return res.status(400).json({ message: amountError });
    }
  }

  const methodError = validateOptionalStringField(data.payment_method, "payment_method");
  if (methodError) {
    return res.status(400).json({ message: methodError });
  }

  const noteError = validateOptionalStringField(data.receipt_note, "receipt_note");
  if (noteError) {
    return res.status(400).json({ message: noteError });
  }

  const proofError = validateOptionalStringField(data.proof_of_payment, "proof_of_payment");
  if (proofError) {
    return res.status(400).json({ message: proofError });
  }

  if (data.payment_type !== undefined) {
    if (typeof data.payment_type !== "string") {
      return res.status(400).json({ message: "payment_type harus berupa text" });
    }
    if (!ALLOWED_PAYMENT_TYPES.includes(data.payment_type)) {
      return res.status(400).json({ message: "payment_type tidak valid" });
    }
  }

  if (data.status !== undefined && !ALLOWED_PAYMENT_STATUSES.includes(data.status)) {
    return res.status(400).json({ message: "status payment tidak valid" });
  }

  req.validatedPayment = data;
  return next();
}

module.exports = {
  validateCreatePayment,
  validatePaymentId,
  validateUpdatePayment,
};