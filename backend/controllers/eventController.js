const eventModel = require('../models/eventModel');

// Cek apakah suatu tanggal sudah ditempati event 'confirmed' lain.
// excludeId dipakai saat update agar event sendiri tidak menabrak dirinya.
async function hasDateConflict(eventDate, excludeId = null) {
  const conflicts = await eventModel.findConfirmedByDate(eventDate, excludeId);
  return conflicts.length > 0;
}

async function index(req, res, next) {
  try {
    const events = await eventModel.findAll();
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return next({ type: 'EVENT_NOT_FOUND' });
    }
    res.json({ event });
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    const data = req.validatedEvent;

    // Double-booking: hanya cek saat event akan berstatus 'confirmed'.
    if (data.status === 'confirmed' && await hasDateConflict(data.event_date)) {
      return next({ type: 'BOOKING_DATE_CONFLICT' });
    }

    const event = await eventModel.create(data);
    res.status(201).json({ message: 'Acara berhasil dibuat.', event });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = req.params.id;
    const existing = await eventModel.findById(id);
    if (!existing) {
      return next({ type: 'EVENT_NOT_FOUND' });
    }

    const data = req.validatedEvent;
    // Tanggal efektif setelah update (fallback ke nilai yang sudah ada).
    const effectiveDate = data.event_date || existing.event_date;
    const effectiveStatus = data.status || existing.status;

    // Double-booking saat hasil akhir berstatus 'confirmed', exclude id sendiri.
    if (effectiveStatus === 'confirmed' && await hasDateConflict(effectiveDate, id)) {
      return next({ type: 'BOOKING_DATE_CONFLICT' });
    }

    const event = await eventModel.update(id, data);
    res.json({ message: 'Acara berhasil diperbarui.', event });
  } catch (err) {
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const deleted = await eventModel.remove(req.params.id);
    if (!deleted) {
      return next({ type: 'EVENT_NOT_FOUND' });
    }
    // Payments & guests terkait otomatis terhapus via FK ON DELETE CASCADE.
    res.json({ message: 'Acara beserta data terkait berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
}

async function calendar(req, res, next) {
  try {
    const bookedDates = await eventModel.findBookedDates();
    res.json({ bookedDates });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  calendar,
};
