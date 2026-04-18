const paymentController = require("../controllers/paymentsController");
const { authenticateToken } = require('../middlewares/authMiddleware');
const paymentValidator = require('../utils/paymentValidator');
const paymentErrorHandler = require('../utils/paymentErrorHandler');

const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("API Payments is running");
});

router.use(authenticateToken);

router.get("/", paymentController.index);
router.get("/:id", paymentValidator.validatePaymentId, paymentController.show);
router.post("/", paymentValidator.validateCreatePayment, paymentController.store);
router.put("/:id", paymentValidator.validatePaymentId, paymentValidator.validateUpdatePayment, paymentController.update);
router.delete("/:id", paymentValidator.validatePaymentId, paymentController.destroy);

router.use(paymentErrorHandler);

module.exports = router;

