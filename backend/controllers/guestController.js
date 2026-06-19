const guestModel = require('../models/guestModel');

<<<<<<< HEAD
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
=======
async function index(req, res, next) {
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
  try {
    const guests = await guestModel.findAll();

    return res.json({
      message: 'Berhasil ambil semua data tamu',
      data: guests,
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function show(req, res, next) {
  try {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'id harus berupa angka' });
    }
    const guest = await guestModel.findById(id);

    if (!guest) {
      return next({ type: 'GUEST_NOT_FOUND' });
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
    }

    return res.json({
      message: 'Detail tamu',
      data: guest,
    });
  } catch (error) {
<<<<<<< HEAD
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

=======
    return next(error);
  }
}

async function byEvent(req, res, next) {
  try {
    const { eventId } = req.params;
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
    const guests = await guestModel.findByEventId(eventId);

    return res.json({
      message: 'Berhasil ambil data tamu berdasarkan event',
      data: guests,
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    const payload = req.validatedGuest;
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2

    const created = await guestModel.create(payload);

    return res.status(201).json({
      message: 'Berhasil tambah tamu',
      data: created,
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.validatedGuest;
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2

    const updated = await guestModel.update(id, payload);

    if (!updated) {
<<<<<<< HEAD
      return res.status(404).json({ message: 'Tamu tidak ditemukan' });
=======
      return next({ type: 'GUEST_NOT_FOUND' });
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
    }

    return res.json({
      message: 'Berhasil update tamu',
      data: updated,
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    return next(error);
  }
}

async function destroy(req, res, next) {
  try {
    const { id } = req.params;

    if (Number.isNaN(Number(id))) {
      return res.status(400).json({ message: 'id harus berupa angka' });
    }
    const deleted = await guestModel.remove(id);

    if (!deleted) {
      return next({ type: 'GUEST_NOT_FOUND' });
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
    }

    return res.json({
      message: 'Berhasil hapus tamu',
    });
  } catch (error) {
<<<<<<< HEAD
    return res.status(500).json({
      message: 'Gagal hapus tamu',
      error: error.message,
    });
=======
    return next(error);
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2
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