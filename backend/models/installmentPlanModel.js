const db = require("../config/database");

class InstallmentPlan {
  // Get all installment plans
  static async getAll() {
    const [rows] = await db.query(`
      SELECT 
        ip.*,
        b.total_amount as booking_total,
        c.name as client_name,
        c.phone as client_phone,
        e.groom_name,
        e.bride_name,
        e.event_date
      FROM installment_plans ip
      JOIN bookings b ON ip.booking_id = b.id
      JOIN clients c ON b.client_id = c.id
      JOIN events e ON b.event_id = e.id
      ORDER BY ip.created_at DESC
    `);
    return rows;
  }

  // Get by ID
  static async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        ip.*,
        b.total_amount as booking_total,
        c.name as client_name,
        c.phone as client_phone,
        e.groom_name,
        e.bride_name,
        e.event_date,
        e.location
      FROM installment_plans ip
      JOIN bookings b ON ip.booking_id = b.id
      JOIN clients c ON b.client_id = c.id
      JOIN events e ON b.event_id = e.id
      WHERE ip.id = ?
    `, [id]);
    return rows;
  }

  // Get installment plan by booking ID
  static async getByBookingId(bookingId) {
    const [rows] = await db.query(`
      SELECT 
        ip.*,
        b.total_amount as booking_total,
        c.name as client_name,
        c.phone as client_phone,
        e.groom_name,
        e.bride_name,
        e.event_date
      FROM installment_plans ip
      JOIN bookings b ON ip.booking_id = b.id
      JOIN clients c ON b.client_id = c.id
      JOIN events e ON b.event_id = e.id
      WHERE ip.booking_id = ?
    `, [bookingId]);
    return rows;
  }

  // Get schedules for an installment plan
  static async getSchedules(installmentPlanId) {
    const [rows] = await db.query(`
      SELECT * FROM installment_schedules
      WHERE installment_plan_id = ?
      ORDER BY installment_number ASC
    `, [installmentPlanId]);
    return rows;
  }

  // Create installment plan
  static async create(data) {
    const sql = `
      INSERT INTO installment_plans 
      (booking_id, total_installments, installment_amount, next_due_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.booking_id,
      data.total_installments,
      data.installment_amount,
      data.next_due_date,
      data.status || 'Active',
      data.notes || null
    ]);

    return result;
  }

  // Update installment plan
  static async update(id, data) {
    const sql = `
      UPDATE installment_plans
      SET 
        total_installments = COALESCE(?, total_installments),
        installment_amount = COALESCE(?, installment_amount),
        paid_installments = COALESCE(?, paid_installments),
        next_due_date = COALESCE(?, next_due_date),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      data.total_installments,
      data.installment_amount,
      data.paid_installments,
      data.next_due_date,
      data.status,
      data.notes,
      id
    ]);

    return result;
  }

  // Delete installment plan
  static async delete(id) {
    const [result] = await db.query("DELETE FROM installment_plans WHERE id = ?", [id]);
    return result;
  }

  // Create installment schedule
  static async createSchedule(data) {
    const sql = `
      INSERT INTO installment_schedules
      (installment_plan_id, installment_number, due_date, amount, status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      data.installment_plan_id,
      data.installment_number,
      data.due_date,
      data.amount,
      data.status || 'Pending',
      data.notes || null
    ]);

    return result;
  }

  // Record payment for schedule
  static async recordPayment(scheduleId, data) {
    const sql = `
      UPDATE installment_schedules
      SET 
        paid_amount = paid_amount + ?,
        status = ?,
        payment_date = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [
      data.amount,
      data.status || 'Paid',
      data.payment_date,
      data.notes,
      scheduleId
    ]);

    return result;
  }

  // Get payment history for a booking
  static async getPaymentHistory(bookingId) {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_type,
        p.payment_date,
        p.status,
        p.invoice_number,
        p.notes,
        p.created_at
      FROM payments p
      WHERE p.booking_id = ?
      ORDER BY p.payment_date DESC
    `, [bookingId]);
    return rows;
  }

  // Get summary for dashboard
  static async getSummary() {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total_plans,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_plans,
        SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue_plans,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_plans,
        SUM(installment_amount * total_installments) as total_value,
        SUM(installment_amount * paid_installments) as total_paid
      FROM installment_plans
    `);
    return rows[0];
  }
}

module.exports = InstallmentPlan;
