const paymentController = require("../controllers/paymentsController");
const { authenticateToken } = require('../middlewares/authMiddleware');

const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("API Payments is running");
});

router.use(authenticateToken);

router.get("/", paymentController.index);
router.get("/:id", paymentController.show);
router.post("/", paymentController.store);
router.put("/:id", paymentController.update);
router.delete("/:id", paymentController.destroy);

module.exports = router;

