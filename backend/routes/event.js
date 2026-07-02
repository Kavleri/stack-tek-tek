const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const eventController = require("../controllers/eventController");
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeMiddleware');
const bookingValidator = require("../utils/bookingValidator");
const bookingErrorHandler = require("../utils/bookingErrorHandler");

// ---------------------------------------------------------------------
// LEGACY ROUTES (dipertahankan agar tidak regresi).
// /packages & /bookings di sini bersifat PUBLIK sesuai perilaku lama.
// didaftarkan SEBELUM middleware auth global di bawah.
// ---------------------------------------------------------------------
router.post("/booking", authenticateToken, authorizeRoles('admin'), bookingValidator.validateCreateBooking, bookingController.createBooking);
router.get("/packages", bookingController.getPackages);
router.get("/bookings", bookingController.getBookings);

// ---------------------------------------------------------------------
// CRUD /events (baru) — sesuai kontrak frontend.
// authenticateToken SAJA (tanpa authorizeRoles), persis mode dummy,
// supaya owner_utama (role 'owner') tetap bisa akses.
// URUTAN PENTING: /calendar & /  harus didaftarkan sebelum /:id.
// ---------------------------------------------------------------------
router.use(authenticateToken);

router.get("/calendar", eventController.calendar);
router.get("/", eventController.index);
router.get("/:id", bookingValidator.validateEventId, eventController.show);
router.post("/", bookingValidator.validateCreateEvent, eventController.store);
router.put("/:id", bookingValidator.validateEventId, bookingValidator.validateUpdateEvent, eventController.update);
router.delete("/:id", bookingValidator.validateEventId, eventController.destroy);

router.use(bookingErrorHandler);

module.exports = router;
