const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const bookingValidator = require("../utils/bookingValidator");
const bookingErrorHandler = require("../utils/bookingErrorHandler");

router.post("/booking", bookingValidator.validateCreateBooking, bookingController.createBooking);
router.get("/packages", bookingController.getPackages);

router.use(bookingErrorHandler);

module.exports = router;