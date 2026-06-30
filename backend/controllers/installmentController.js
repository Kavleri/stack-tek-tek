const InstallmentPlan = require("../models/installmentPlanModel");

class InstallmentController {
  // Get all installment plans
  async index(req, res, next) {
    try {
      const results = await InstallmentPlan.getAll();

      if (results.length === 0) {
        return res.json({
          message: "Belum ada rencana cicilan",
          data: [],
        });
      }

      res.json({
        message: "Berhasil ambil semua data cicilan",
        data: results,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Get installment plan by ID
  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await InstallmentPlan.getById(id);

      if (results.length === 0) {
        return next({ type: "INSTALLMENT_PLAN_NOT_FOUND" });
      }

      // Get schedules
      const schedules = await InstallmentPlan.getSchedules(id);

      res.json({
        message: "Detail rencana cicilan",
        data: {
          ...results[0],
          schedules: schedules,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // Get installment plan by booking ID
  async getByBooking(req, res, next) {
    const { bookingId } = req.params;

    try {
      const plans = await InstallmentPlan.getByBookingId(bookingId);

      if (plans.length === 0) {
        return res.json({
          message: "Belum ada rencana cicilan untuk booking ini",
          data: null,
        });
      }

      const plan = plans[0];
      const schedules = await InstallmentPlan.getSchedules(plan.id);

      res.json({
        message: "Detail rencana cicilan",
        data: {
          ...plan,
          schedules: schedules,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // Create installment plan with schedules
  async store(req, res, next) {
    const data = req.body;

    try {
      // Validate required fields
      if (!data.booking_id || !data.total_installments || !data.installment_amount) {
        return res.status(400).json({
          message: "Data tidak lengkap",
          required: ["booking_id", "total_installments", "installment_amount"],
        });
      }

      // Create installment plan
      const planResult = await InstallmentPlan.create(data);
      const planId = planResult.insertId;

      // Create schedules
      const schedules = [];
      const baseDate = new Date(data.first_due_date || new Date());

      for (let i = 1; i <= data.total_installments; i++) {
        const dueDate = new Date(baseDate);
        dueDate.setMonth(dueDate.getMonth() + (i - 1));

        const schedule = await InstallmentPlan.createSchedule({
          installment_plan_id: planId,
          installment_number: i,
          due_date: dueDate.toISOString().split('T')[0],
          amount: data.installment_amount,
          status: 'Pending',
        });

        schedules.push({
          id: schedule.insertId,
          installment_number: i,
          due_date: dueDate.toISOString().split('T')[0],
          amount: data.installment_amount,
        });
      }

      res.status(201).json({
        message: "Rencana cicilan berhasil dibuat",
        data: {
          plan_id: planId,
          total_installments: data.total_installments,
          installment_amount: data.installment_amount,
          schedules: schedules,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // Update installment plan
  async update(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    try {
      await InstallmentPlan.update(id, data);

      res.json({
        message: "Rencana cicilan berhasil diperbarui",
        data: data,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Record payment for schedule
  async recordPayment(req, res, next) {
    const { scheduleId } = req.params;
    const data = req.body;

    try {
      // Validate data
      if (!data.amount || !data.payment_date) {
        return res.status(400).json({
          message: "Data pembayaran tidak lengkap",
          required: ["amount", "payment_date"],
        });
      }

      await InstallmentPlan.recordPayment(scheduleId, {
        amount: data.amount,
        status: data.status || 'Paid',
        payment_date: data.payment_date,
        notes: data.notes,
      });

      res.json({
        message: "Pembayaran cicilan berhasil dicatat",
        data: data,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Get payment history
  async getPaymentHistory(req, res, next) {
    const { bookingId } = req.params;

    try {
      const history = await InstallmentPlan.getPaymentHistory(bookingId);
      const schedules = await InstallmentPlan.getSchedules(
        (await InstallmentPlan.getByBookingId(bookingId))[0]?.id
      );

      res.json({
        message: "Riwayat pembayaran",
        data: {
          payments: history,
          installment_schedules: schedules || [],
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // Get summary
  async getSummary(req, res, next) {
    try {
      const summary = await InstallmentPlan.getSummary();

      res.json({
        message: "Ringkasan cicilan",
        data: summary,
      });
    } catch (err) {
      return next(err);
    }
  }

  // Delete installment plan
  async destroy(req, res, next) {
    const { id } = req.params;

    try {
      await InstallmentPlan.delete(id);

      res.json({
        message: "Rencana cicilan berhasil dihapus",
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new InstallmentController();
