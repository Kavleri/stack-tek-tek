const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const bookingRoutes = require("./routes/event");
app.use("/api", bookingRoutes);

app.listen(3000, () => {
    console.log("Server jalan di http://localhost:3000");
});
