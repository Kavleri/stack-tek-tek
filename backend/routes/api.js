const guestsController = require("../controllers/guestscontroller");

const express = require("express");
const router = express.Router();

// route test
router.get("/", (req, res) => {
    res.send("Wedding Organizer API");
});

// 🔹 GET semua tamu
router.get("/guests", guestsController.index);

// 🔹 POST tambah tamu
router.post("/guests", guestsController.store);

// 🔹 PUT update status tamu
router.put("/guests/:id", guestsController.update);

// 🔹 DELETE hapus tamu
router.delete("/guests/:id", guestsController.destroy);

module.exports = router;