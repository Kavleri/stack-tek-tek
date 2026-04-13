const db = require("../config/database");

class payment {

  static async getAll() {
    const [rows] = await db.query("SELECT * FROM payments");
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);
    return rows;
  }

  static async create(data) {
    const sql = `
      INSERT INTO payments 
      (event_id, payment_amount, payment_date, payment_type, payment_method, receipt_note, proof_of_payment, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.event_id,
      data.payment_amount,
      data.payment_date,
      data.payment_type,
      data.payment_method,
      data.receipt_note,
      data.proof_of_payment,
      data.status
    ]);

    return result;
  }

  static async update(id, data) {
    const sql = `
      UPDATE payments
      SET 
        event_id = COALESCE(?, event_id), 
        payment_amount = COALESCE(?, payment_amount), 
        payment_date = COALESCE(?, payment_date), 
        payment_type = COALESCE(?, payment_type), 
        payment_method = COALESCE(?, payment_method), 
        receipt_note = COALESCE(?, receipt_note), 
        proof_of_payment = COALESCE(?, proof_of_payment),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      data.event_id,
      data.payment_amount,
      data.payment_date,
      data.payment_type,
      data.payment_method,
      data.receipt_note,
      data.proof_of_payment,
      data.status,
      id
    ]);

    return result;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM payments WHERE id = ?", [id]);
    return result;
  }

}

module.exports = payment;

