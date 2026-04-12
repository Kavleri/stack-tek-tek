const mysql = require("mysql2");

// buat koneksi
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "wedding_organizer",
});

// test koneksi
db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("Koneksi database berhasil");
  }
});

module.exports = db;
