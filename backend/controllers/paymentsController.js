const payment = require("../models/paymentsPackageModels");
const { validatePayment } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class paymentController {

  async index(req, res) {
    try {
      const results = await payment.getAll();

      if (results.length === 0) {
        return res.status(404).json({ message: "Data payment tidak ditemukan" });
      }

      res.json({
        message: "Berhasil ambil semua data payment",
        data: results,
      });
    } catch (err) {
      return res.status(500).json({ message: "Gagal ambil data payment", error: err.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const results = await payment.getById(id);

      if (results.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({
        message: "Detail payment",
        data: results[0],
      });
    } catch (err) {
      return res.status(500).json({ message: "Gagal ambil detail payment", error: err.message });
    }
  }

  async store(req, res) {
    const data = {
      ...req.body,
      status: req.body.status || "pending",
    };

    const validationError = validatePayment(data);

    if (validationError) {
      return errorHandler(res, validationError, 400, "Validasi gagal");
    }

    try {
      await payment.create(data);
      res.status(201).json({
        message: "Payment berhasil ditambahkan",
        data: data,
      });
    } catch (err) {
      return errorHandler(res, err, 500, "Gagal tambah payment");
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      await payment.update(id, data);
      res.json({
        message: "Payment berhasil diupdate",
      });
    } catch (err) {
      return res.status(500).json({ message: "Gagal update payment", error: err.message });
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    try {
      await payment.delete(id);
      res.json({
        message: "Payment berhasil dihapus",
      });
    } catch (err) {
      return res.status(500).json({ message: "Gagal hapus payment", error: err.message });
    }
  }
}

const object = new paymentController();
module.exports = object;

