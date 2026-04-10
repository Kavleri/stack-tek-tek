const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const adminRoutes = require('../routes/adminRoutes');
// Import file koneksi database agar langsung teruji saat server jalan
require('../config/database');

const app = express();
const port = process.env.PORT || 5000;

// Set middleware
app.use(cors({ origin: 'http://localhost:5173' })); // FE Vite
app.use(express.json());
app.use(morgan('dev')); // Buat logging di terminal

// Register admin routes
app.use('/api/admins', adminRoutes);

// Rute tes buat ngecek koneksi dari frontend
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Backend berhasil nyambung ke Frontend!',
    databaseStatus: 'Sedang pakai MySQL Lokal',
    dummyData: {
      client: 'Kavleri',
      event: 'Dream Syariah Wedding',
    }
  });
});

// Jalanin servernya
app.listen(port, () => {
  console.log(`Menjalankan Backend di http://localhost:${port}`);
});
