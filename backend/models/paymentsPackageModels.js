const db = require("../config/database");

class payment {

  // GET ALL
  static getAll(callback) {
    const sql = "SELECT * FROM payments";
    db.query(sql, callback);
  }

  // GET BY ID
  static getById(id, callback) {
    const sql = "SELECT * FROM payments WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // CREATE
  static create(data, callback) {
    const sql = `
      INSERT INTO payments 
      (event_id, payment_amount, payment_date, payment_type, payment_method, receipt_note, proof_of_payment)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      data.event_id,
      data.payment_amount,
      data.payment_date,
      data.payment_type,
      data.payment_method,
      data.receipt_note,
      data.proof_of_payment
    ], callback);
  }

  // UPDATE
  static update(id, data, callback) {
    const sql = `
      UPDATE payments
      SET 
        event_id = ?, 
        payment_amount = ?, 
        payment_date = ?, 
        payment_type = ?, 
        payment_method = ?, 
        receipt_note = ?, 
        proof_of_payment = ?
      WHERE id = ?
    `;

    db.query(sql, [
      data.event_id,
      data.payment_amount,
      data.payment_date,
      data.payment_type,
      data.payment_method,
      data.receipt_note,
      data.proof_of_payment,
      id
    ], callback);
  }

  // DELETE
  static delete(id, callback) {
    const sql = "DELETE FROM payments WHERE id = ?";
    db.query(sql, [id], callback);
  }

}

module.exports = payment;

