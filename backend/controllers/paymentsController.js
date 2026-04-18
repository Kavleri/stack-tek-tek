const payment = require("../models/paymentsPackageModels");

class paymentController {

  async index(req, res, next) {
    try {
      const results = await payment.getAll();

      if (results.length === 0) {
        return next({ type: "PAYMENT_LIST_EMPTY" });
      }

      res.json({
        message: "Berhasil ambil semua data payment",
        data: results,
      });
    } catch (err) {
      return next(err);
    }
  }

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const results = await payment.getById(id);

      if (results.length === 0) {
        return next({ type: "PAYMENT_NOT_FOUND" });
      }

      res.json({
        message: "Detail payment",
        data: results[0],
      });
    } catch (err) {
      return next(err);
    }
  }

  async store(req, res, next) {
    const data = req.validatedPayment;

    try {
      await payment.create(data);
      res.status(201).json({
        message: "Payment berhasil ditambahkan",
        data: data,
      });
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const data = req.validatedPayment;

    try {
      const result = await payment.update(id, data);

      if (result.affectedRows === 0) {
        return next({ type: "PAYMENT_NOT_FOUND" });
      }

      res.json({
        message: "Payment berhasil diupdate",
      });
    } catch (err) {
      return next(err);
    }
  }

  async destroy(req, res, next) {
    const { id } = req.params;

    try {
      const result = await payment.delete(id);

      if (result.affectedRows === 0) {
        return next({ type: "PAYMENT_NOT_FOUND" });
      }

      res.json({
        message: "Payment berhasil dihapus",
      });
    } catch (err) {
      return next(err);
    }
  }
}

const object = new paymentController();
module.exports = object;

