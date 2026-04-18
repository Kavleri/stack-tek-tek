const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');

const adminRoutes = require('../routes/adminRoutes');
const bookingRoutes = require('../routes/event');
const guestRoutes = require('../routes/guestRoutes');
const weddingPackageRoutes = require('../routes/weddingPackageRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
require('../config/database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/admins', adminRoutes);
app.use('/api', bookingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/wedding-packages', weddingPackageRoutes);
app.use('/api/payments', paymentRoutes);

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


app.use((req, res) => {
  return res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server.';
  return res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`Menjalankan Backend di http://localhost:${port}`);
});
