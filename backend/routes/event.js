const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');
const bookingValidator = require("../utils/bookingValidator");
const bookingErrorHandler = require("../utils/bookingErrorHandler");

router.post("/booking", authenticateToken, authorizeRoles('admin'), bookingValidator.validateCreateBooking, bookingController.createBooking);
router.get("/packages", bookingController.getPackages);
router.get("/bookings", bookingController.getBookings);

router.use(bookingErrorHandler);

module.exports = router;