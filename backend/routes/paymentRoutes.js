const paymentController = require("../controllers/paymentsController");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("API Payments is running");
});

// GET ALL
router.get("/payments", paymentController.index);

// GET BY ID
router.get("/payments/:id", paymentController.show);

// CREATE
router.post("/payments", paymentController.store);

// UPDATE
router.put("/payments/:id", paymentController.update);

// DELETE
router.delete("/payments/:id", paymentController.destroy);

module.exports = router;

