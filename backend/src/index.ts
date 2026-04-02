import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load varibel dari .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Set middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Biar FE vite (5173) boleh ngambil data
app.use(express.json());
app.use(morgan('dev')); // Buat logging di terminal

// Rute tes buat ngecek koneksi dari frontend
app.get('/api/status', (req, res) => {
  // Karena disuruh pakai data dummy (lokal) dulu, kita balikin JSON hardcode aja
  // Nanti ke depannya ini bakal konek beneran ke Database (Supabase)
  res.json({
    message: 'Backend berhasil nyambung ke Frontend!',
    databaseStatus: 'Sedang pakai data DUMMY lokal (Bukan Supabase beneran)',
    dummyData: {
      client: 'Kavleri',
      event: 'Dream Syariah Wedding',
    }
  });
});

// Jalanin servernya
app.listen(port, () => {
  console.log(`🚀 Yuhu! Backend jalan lancar di http://localhost:${port}`);
});
