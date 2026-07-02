const db = require('../config/database');

// SELECT shared untuk menjamin event_date/time dikembalikan sebagai STRING
// (mysql2 default mengembalikan JS Date, yang memutus perbandingan string
// di frontend: Events.tsx:259 membandingkan e.event_date === 'YYYY-MM-DD').
// LEFT JOIN wedding_packages supaya package_name/package_price ikut terisi.
const EVENTS_SELECT = `
  SELECT
    e.id, e.invoice_number, e.client_name, e.client_phone,
    DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
    TIME_FORMAT(e.event_time, '%H:%i:%s') AS event_time,
    e.location_name, e.location_address, e.google_maps_link,
    e.package_id, e.status, e.notes_for_field_staff,
    DATE_FORMAT(e.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
    p.package_name,
    p.price AS package_price
  FROM events e
  LEFT JOIN wedding_packages p ON p.id = e.package_id
`;

function mapEventRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    invoice_number: row.invoice_number,
    client_name: row.client_name,
    client_phone: row.client_phone,
    event_date: row.event_date,           // 'YYYY-MM-DD'
    event_time: row.event_time,           // 'HH:MM:SS'
    location_name: row.location_name,
    location_address: row.location_address,
    google_maps_link: row.google_maps_link,
    package_id: row.package_id,
    status: row.status,
    notes_for_field_staff: row.notes_for_field_staff,
    created_at: row.created_at,
    package_name: row.package_name || 'N/A',
    package_price: Number(row.package_price) || 0,
  };
}

async function findAll() {
  const [rows] = await db.query(`${EVENTS_SELECT} ORDER BY e.event_date DESC, e.id DESC`);
  return rows.map(mapEventRow);
}

async function findById(id) {
  const [rows] = await db.query(`${EVENTS_SELECT} WHERE e.id = ? LIMIT 1`, [id]);
  if (rows.length === 0) return null;
  return mapEventRow(rows[0]);
}

// Cek double-booking: event lain berstatus 'confirmed' pada tanggal yang sama.
// excludeId dipakai saat PUT agar event sendiri tidak menabrak dirinya.
async function findConfirmedByDate(eventDate, excludeId = null) {
  const params = [eventDate];
  let sql = `SELECT id FROM events WHERE event_date = ? AND status = 'confirmed'`;
  if (excludeId) {
    sql += ` AND id <> ?`;
    params.push(excludeId);
  }
  const [rows] = await db.query(sql, params);
  return rows;
}

// Invoice format INV/YYYYMMDD/XXXX — sequence harian zero-padded.
// Hitung dari jumlah invoice yang sudah ada pada tanggal tsb supaya unik.
async function generateInvoiceNumber(eventDate) {
  const dateStr = String(eventDate).replace(/-/g, ''); // YYYYMMDD
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total FROM events WHERE invoice_number LIKE ?`,
    [`INV/${dateStr}/%`]
  );
  const nextSeq = String((rows[0].total || 0) + 1).padStart(4, '0');
  return `INV/${dateStr}/${nextSeq}`;
}

async function create(data) {
  const invoiceNumber = await generateInvoiceNumber(data.event_date);

  await db.query(
    `INSERT INTO events
      (invoice_number, client_name, client_phone, event_date, event_time,
       location_name, location_address, google_maps_link, package_id, status, notes_for_field_staff)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      invoiceNumber,
      data.client_name,
      data.client_phone,
      data.event_date,
      data.event_time,
      data.location_name,
      data.location_address ?? null,
      data.google_maps_link ?? null,
      data.package_id ?? null,
      data.status || 'pending',
      data.notes_for_field_staff ?? null,
    ]
  );

  // Re-fetch agar kembalikan row utuh (termasuk id, invoice_number, created_at, package join).
  const [rows] = await db.query(`${EVENTS_SELECT} ORDER BY e.id DESC LIMIT 1`);
  return mapEventRow(rows[0]);
}

async function update(id, data) {
  // Ambil dulu row saat ini untuk partial update.
  const current = await findById(id);
  if (!current) return null;

  await db.query(
    `UPDATE events
     SET
       client_name = ?,
       client_phone = ?,
       event_date = ?,
       event_time = ?,
       location_name = ?,
       location_address = ?,
       google_maps_link = ?,
       package_id = ?,
       status = ?,
       notes_for_field_staff = ?
     WHERE id = ?`,
    [
      data.client_name ?? current.client_name,
      data.client_phone ?? current.client_phone,
      data.event_date ?? current.event_date,
      data.event_time ?? current.event_time,
      data.location_name ?? current.location_name,
      data.location_address !== undefined ? (data.location_address || null) : current.location_address,
      data.google_maps_link !== undefined ? (data.google_maps_link || null) : current.google_maps_link,
      data.package_id !== undefined ? (data.package_id || null) : current.package_id,
      data.status ?? current.status,
      data.notes_for_field_staff !== undefined ? (data.notes_for_field_staff || null) : current.notes_for_field_staff,
      id,
    ]
  );

  return findById(id);
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// Tanggal confirmed saja — untuk endpoint /events/calendar.
async function findBookedDates() {
  const [rows] = await db.query(
    `SELECT DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date
     FROM events
     WHERE status = 'confirmed'
     ORDER BY event_date ASC`
  );
  return rows.map((r) => r.event_date);
}

module.exports = {
  findAll,
  findById,
  findConfirmedByDate,
  findBookedDates,
  create,
  update,
  remove,
};
