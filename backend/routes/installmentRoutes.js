const installmentController = require("../controllers/installmentController");
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');

const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.send("API Installments is running");
});

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Get all installment plans
router.get("/", installmentController.index);

// Get summary
router.get("/summary/dashboard", installmentController.getSummary);

// Get installment plan by ID
router.get("/:id", installmentController.show);

// Get installment plan by booking ID
router.get("/booking/:bookingId", installmentController.getByBooking);

// Get payment history for a booking
router.get("/history/:bookingId", installmentController.getPaymentHistory);

// Create installment plan
router.post("/", installmentController.store);

// Update installment plan
router.put("/:id", installmentController.update);

// Record payment for schedule
router.post("/:scheduleId/payment", installmentController.recordPayment);

// Delete installment plan
router.delete("/:id", installmentController.destroy);

module.exports = router;
