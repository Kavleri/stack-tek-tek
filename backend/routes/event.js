const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/booking", bookingController.createBooking);
router.get("/packages", bookingController.getPackages);

module.exports = router;