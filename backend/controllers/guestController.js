const guestModel = require('../models/guestModel');

async function index(req, res, next) {
  try {
    const guests = await guestModel.findAll();

    return res.json({
      message: 'Berhasil ambil semua data tamu',
      data: guests,
    });
  } catch (error) {
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
    }

    return res.json({
      message: 'Detail tamu',
      data: guest,
    });
  } catch (error) {
    return next(error);
  }
}

async function byEvent(req, res, next) {
  try {
    const { eventId } = req.params;
    const guests = await guestModel.findByEventId(eventId);

    return res.json({
      message: 'Berhasil ambil data tamu berdasarkan event',
      data: guests,
    });
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    const payload = req.validatedGuest;

    const created = await guestModel.create(payload);

    return res.status(201).json({
      message: 'Berhasil tambah tamu',
      data: created,
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.validatedGuest;

    const updated = await guestModel.update(id, payload);

    if (!updated) {
      return next({ type: 'GUEST_NOT_FOUND' });
    }

    return res.json({
      message: 'Berhasil update tamu',
      data: updated,
    });
  } catch (error) {
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
    }

    return res.json({
      message: 'Berhasil hapus tamu',
    });
  } catch (error) {
    return next(error);
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