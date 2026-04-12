const payment = require("../models/paymentsPackageModels");
const { validatePayment } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class paymentController {

  // GET ALL
  index(req, res) {
    payment.getAll((err, results) => {
      if (err) {
        return res.json({ message: "Gagal ambil data payment" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Data payment tidak ditemukan" });
      }

      res.json({
        message: "Berhasil ambil semua data payment",
        data: results,
      });
    });
  }

  // GET BY ID
  show(req, res) {
    const { id } = req.params;

    payment.getById(id, (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({
        message: "Detail payment",
        data: results[0],
      });
    });
  }

  // CREATE
  store(req, res) {
    const data = req.body;

    const validationError = validatePayment(data);

    if (validationError) {
      return errorHandler(res, validationError, 400, "Validasi gagal");
    }

    payment.create(data, (err) => {
      if (err) {
        return errorHandler(res, err, 500, "Gagal tambah payment");
      }

      res.status(201).json({
        message: "Payment berhasil ditambahkan",
        data: data,
      });
    });
  }

  // UPDATE
  update(req, res) {
    const { id } = req.params;
    const data = req.body;

    payment.update(id, data, (err) => {
      if (err) {
        return res.json({ message: "Gagal update payment" });
      }

      res.json({
        message: "Payment berhasil diupdate",
      });
    });
  }

  // DELETE
  destroy(req, res) {
    const { id } = req.params;

    payment.delete(id, (err) => {
      if (err) {
        return res.json({ message: "Gagal hapus payment" });
      }

      res.json({
        message: "Payment berhasil dihapus",
      });
    });
  }
}

const object = new paymentController();
module.exports = object;
