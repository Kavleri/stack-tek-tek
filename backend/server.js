const express = require("express");
const cors = require("cors");

const bookingRoutes = require("./routes/event");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes utama
app.use("/api", bookingRoutes);
app.use("/api", paymentRoutes);

// test endpoint
app.get('/api/status', (req, res) => {
	res.json({
		message: 'Backend berhasil nyambung ke Frontend!',
		databaseStatus: 'Sudah menggunakan MySQL',
	});
});

app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});