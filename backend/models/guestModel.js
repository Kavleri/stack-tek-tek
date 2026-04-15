const db = require('../config/database');

function mapGuestRow(row) {
  return {
    id: row.id,
    event_id: row.event_id,
    guest_name: row.guest_name,
    guest_phone: row.guest_phone,
    invitation_slug: row.invitation_slug,
    is_attended: Boolean(row.is_attended),
    created_at: row.created_at,
  };
}

async function findAll() {
  const [rows] = await db.query(
    'SELECT id, event_id, guest_name, guest_phone, invitation_slug, is_attended, created_at FROM guests ORDER BY id DESC'
  );

  return rows.map(mapGuestRow);
}

async function findById(id) {
  const [rows] = await db.query(
    'SELECT id, event_id, guest_name, guest_phone, invitation_slug, is_attended, created_at FROM guests WHERE id = ? LIMIT 1',
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return mapGuestRow(rows[0]);
}

async function findByEventId(eventId) {
  const [rows] = await db.query(
    'SELECT id, event_id, guest_name, guest_phone, invitation_slug, is_attended, created_at FROM guests WHERE event_id = ? ORDER BY id DESC',
    [eventId]
  );

  return rows.map(mapGuestRow);
}

async function create(input) {
  const invitationSlug = input.invitation_slug ?? slugifyGuestName(input.guest_name);

  const [result] = await db.query(
    `
      INSERT INTO guests (event_id, guest_name, guest_phone, invitation_slug, is_attended)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      input.event_id,
      input.guest_name,
      input.guest_phone ?? null,
      invitationSlug,
      input.is_attended ? 1 : 0,
    ]
  );

  return findById(result.insertId);
}

async function update(id, input) {
  const current = await findById(id);

  if (!current) {
    return null;
  }

  const nextSlug = input.invitation_slug ?? current.invitation_slug ?? slugifyGuestName(input.guest_name ?? current.guest_name);

  await db.query(
    `
      UPDATE guests
      SET event_id = ?, guest_name = ?, guest_phone = ?, invitation_slug = ?, is_attended = ?
      WHERE id = ?
    `,
    [
      input.event_id ?? current.event_id,
      input.guest_name ?? current.guest_name,
      input.guest_phone ?? current.guest_phone,
      nextSlug,
      typeof input.is_attended === 'boolean' ? input.is_attended : current.is_attended,
      id,
    ]
  );

  return findById(id);
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM guests WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

function slugifyGuestName(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  create,
  findAll,
  findByEventId,
  findById,
  remove,
  update,
};