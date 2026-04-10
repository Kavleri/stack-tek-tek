import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import pool from '../config/db.ts';
import weddingPackageRoutes from '../routes/weddingPackageRoutes.ts';

// Load varibel dari .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Set middleware
app.use(cors({ origin: corsOrigin })); // Biar FE vite (5173) boleh ngambil data
app.use(express.json());
app.use(morgan('dev') as express.RequestHandler); // Buat logging di terminal

app.get('/api/status', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 AS db_ok');

    res.json({
      message: 'Backend berhasil nyambung ke Frontend!',
      databaseStatus: 'MySQL connected',
      databaseCheck: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';

    res.status(500).json({
      message: 'Backend hidup, tetapi koneksi MySQL gagal',
      databaseStatus: 'MySQL connection failed',
      error: message,
    });
  }
});

app.use('/api/wedding-packages', weddingPackageRoutes);

// Jalanin servernya
app.listen(port, () => {
  console.log(`🚀 Yuhu! Backend jalan lancar di http://localhost:${port}`);
});
