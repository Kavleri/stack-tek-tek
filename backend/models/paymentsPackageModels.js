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

  // Get payments with booking details
  static async getWithDetails() {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        b.client_id,
        b.event_id,
        b.total_amount,
        c.name as client_name,
        c.phone as client_phone,
        e.groom_name,
        e.bride_name,
        e.event_date,
        e.location
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN clients c ON b.client_id = c.id
      JOIN events e ON b.event_id = e.id
      ORDER BY p.payment_date DESC
    `);
    return rows;
  }

  // Get payment history by booking ID
  static async getByBookingId(bookingId) {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        b.total_amount as booking_total
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = ?
      ORDER BY p.payment_date DESC
    `, [bookingId]);
    return rows;
  }

  static async create(data) {
    const sql = `
      INSERT INTO payments 
      (booking_id, amount, payment_method, payment_type, payment_date, status, invoice_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.booking_id,
      data.amount,
      data.payment_method || null,
      data.payment_type || 'Full Payment',
      data.payment_date || new Date().toISOString().split('T')[0],
      data.status || 'Completed',
      data.invoice_number || null,
      data.notes || null
    ]);

    return result;
  }

  static async update(id, data) {
    const sql = `
      UPDATE payments
      SET 
        booking_id = COALESCE(?, booking_id),
        amount = COALESCE(?, amount),
        payment_method = COALESCE(?, payment_method),
        payment_type = COALESCE(?, payment_type),
        payment_date = COALESCE(?, payment_date),
        status = COALESCE(?, status),
        invoice_number = COALESCE(?, invoice_number),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      data.booking_id,
      data.amount,
      data.payment_method,
      data.payment_type,
      data.payment_date,
      data.status,
      data.invoice_number,
      data.notes,
      id
    ]);

    return result;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM payments WHERE id = ?", [id]);
    return result;
  }

  // Get payment summary by booking
  static async getPaymentSummary(bookingId) {
    const [rows] = await db.query(`
      SELECT 
        b.id as booking_id,
        b.total_amount,
        SUM(p.amount) as total_paid,
        COUNT(p.id) as total_transactions,
        (b.total_amount - COALESCE(SUM(p.amount), 0)) as remaining_amount,
        GROUP_CONCAT(DISTINCT p.payment_type) as payment_types
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'Completed'
      WHERE b.id = ?
      GROUP BY b.id
    `, [bookingId]);
    return rows;
  }

  // Get unpaid bookings (outstanding payments)
  static async getUnpaidBookings() {
    const [rows] = await db.query(`
      SELECT 
        b.id as booking_id,
        b.total_amount,
        COALESCE(SUM(p.amount), 0) as total_paid,
        (b.total_amount - COALESCE(SUM(p.amount), 0)) as remaining_amount,
        c.name as client_name,
        c.phone as client_phone,
        e.groom_name,
        e.bride_name,
        e.event_date
      FROM bookings b
      LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'Completed'
      LEFT JOIN clients c ON b.client_id = c.id
      LEFT JOIN events e ON b.event_id = e.id
      GROUP BY b.id
      HAVING remaining_amount > 0
      ORDER BY e.event_date ASC
    `);
    return rows;
  }

}

module.exports = payment;

