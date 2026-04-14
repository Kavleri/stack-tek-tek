const db = require("../config/databases");

class Guest {

  // ambil semua guest + event
  static getAll(callback) {
    const sql = `
      SELECT g.*, e.event_name, e.event_date, e.location
      FROM guests g
      JOIN events e ON g.event_id = e.id
    `;
    db.query(sql, callback);
  }

  // ambil guest by id
  static getById(id, callback) {
    const sql = "SELECT * FROM guests WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // create guest
  static create(data, callback) {
    const sql = `
      INSERT INTO guests (event_id, guest_name, guest_phone, invitation_slug, is_attended)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      data.event_id,
      data.guest_name,
      data.guest_phone,
      data.invitation_slug,
      data.is_attended || false
    ], callback);
  }

  // update guest
  static update(id, data, callback) {
    const sql = `
      UPDATE guests
      SET event_id=?, guest_name=?, guest_phone=?, is_attended=?
      WHERE id=?
    `;

    db.query(sql, [
      data.event_id,
      data.guest_name,
      data.guest_phone,
      data.is_attended,
      id
    ], callback);
  }

  // delete guest
  static delete(id, callback) {
    const sql = "DELETE FROM guests WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // update hadir (RSVP)
  static markAttended(id, callback) {
    const sql = "UPDATE guests SET is_attended = TRUE WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = Guest;