const paymentController = require("../controllers/paymentsController");

const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("API Payments is running");
});

router.get("/", paymentController.index);
router.get("/:id", paymentController.show);
router.post("/", paymentController.store);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.destroy);

module.exports = router;

