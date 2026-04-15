const guestModel = require('../models/guestModel');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function parseBooleanLike(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'false' || normalized === '0') {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return undefined;
}

function validatePayload(payload, requireAllFields = true) {
  if (requireAllFields && !payload.event_id) {
    return 'event_id wajib diisi';
  }

  if (requireAllFields && !isNonEmptyString(payload.guest_name)) {
    return 'guest_name wajib diisi';
  }

  if (requireAllFields && !isNonEmptyString(payload.guest_phone)) {
    return 'guest_phone wajib diisi';
  }

  if (payload.invitation_slug !== undefined && !isNonEmptyString(payload.invitation_slug)) {
    return 'invitation_slug harus berupa text';
  }

  if (payload.event_id !== undefined && Number.isNaN(Number(payload.event_id))) {
    return 'event_id harus berupa angka';
  }

  if (payload.is_attended !== undefined && parseBooleanLike(payload.is_attended) === undefined) {
    return 'is_attended harus berupa boolean';
  }

  return null;
}

async function index(req, res) {
  try {
    const guests = await guestModel.findAll();

    return res.json({
      message: 'Berhasil ambil semua data tamu',
      data: guests,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal ambil data tamu',
      error: error.message,
    });
  }
}

async function show(req, res) {
  try {
    const { id } = req.params;
    const guest = await guestModel.findById(id);

    if (!guest) {
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
    }

    return res.json({
      message: 'Detail tamu',
      data: guest,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal ambil detail tamu',
      error: error.message,
    });
  }
}

async function byEvent(req, res) {
  try {
    const { eventId } = req.params;

    if (Number.isNaN(Number(eventId))) {
      return res.status(400).json({ message: 'eventId harus berupa angka' });
    }

    const guests = await guestModel.findByEventId(eventId);

    return res.json({
      message: 'Berhasil ambil data tamu berdasarkan event',
      data: guests,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal ambil data tamu berdasarkan event',
      error: error.message,
    });
  }
}

async function store(req, res) {
  try {
    const payload = {
      ...req.body,
      is_attended: parseBooleanLike(req.body.is_attended) ?? false,
    };

    const validationError = validatePayload(payload, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const created = await guestModel.create(payload);

    return res.status(201).json({
      message: 'Berhasil tambah tamu',
      data: created,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal tambah tamu',
      error: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
    };

    if (payload.is_attended !== undefined) {
      payload.is_attended = parseBooleanLike(payload.is_attended);
    }

    const validationError = validatePayload(payload, false);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updated = await guestModel.update(id, payload);

    if (!updated) {
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
    }

    return res.json({
      message: 'Berhasil update tamu',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal update tamu',
      error: error.message,
    });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;
    const deleted = await guestModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
    }

    return res.json({
      message: 'Berhasil hapus tamu',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal hapus tamu',
      error: error.message,
    });
  }
}

module.exports = {
  byEvent,
  destroy,
  index,
  show,
  store,
  update,
};