# Wedding Syari'ah Organizer

## stack-tek-tek
Repo Khusus untuk grub matkul FullStack semester 4

## Deskripsi
Proyek ini adalah sistem manajemen wedding organizer berbasis web yang dikembangkan sebagai tugas akhir mata kuliah Fullstack Web Development. Sistem ini dirancang untuk membantu agensi pernikahan dalam mengelola paket internal, jadwal acara, pembayaran, dan distribusi informasi ke tim lapangan. Fokus utama adalah pada penggunaan internal oleh admin administrasi untuk mencegah double booking dan memfasilitasi operasional harian.

## Fitur Utama
- **Autentikasi Admin**: Login khusus untuk staf administrasi dengan manajemen akun.
- **Manajemen Paket Wedding**: Katalog paket tetap (Bronze, Silver, Gold) dengan detail layanan.
- **Penjadwalan Acara**: Form pemesanan dengan validasi tanggal otomatis dan kalender interaktif.
- **Pembayaran & Invoicing**: Tracking status pembayaran dan generate nomor invoice unik.
- **Guest Management**: Buku tamu digital dan generator link undangan.
- **Distribusi Informasi**: Export work order PDF untuk tim lapangan.

## Teknologi
- **Backend**: Node.js, Express.js, TypeScript, MySQL
- **Frontend**: React.js, TypeScript, Vite
- **Database**: MySQL dengan schema relasional
- **Arsitektur**: MVC (Model-View-Controller) untuk backend

## Struktur Proyek
```
wedding-system/
├── backend/           # Node.js + Express (MVC)
│   ├── config/        # Koneksi Database
│   ├── controllers/   # Logika Bisnis
│   ├── models/        # Skema Database
│   ├── routes/        # Endpoint API
│   ├── middlewares/   # Auth & Validasi
│   ├── src/index.ts   # Entry Point
│   └── package.json
├── frontend/          # React.js dengan Vite
│   ├── src/
│   │   ├── components/ # Komponen Reusable
│   │   ├── pages/      # Halaman Aplikasi
│   │   ├── services/   # Fetch API
│   │   └── App.tsx
│   └── package.json
├── database/          # Schema dan Dummy Data SQL
├── doc/               # Dokumentasi Proyek
└── README.md
```

## Anggota Kelompok
- Muhammad Jibril Ibrahim
- Nurul Hayatu Suhaila
- Muhammad Hisyam Alfaris
- Anis Adriani
- Eka Vitaloka

## link Sprint
- [Sprint Report Fullstack Team stack-tek-tek](https://docs.google.com/spreadsheets/d/1MJ906FOq9rncPM8r5CBfWgvsvadBHi_s/edit?usp=sharing&ouid=104536910473143147355&rtpof=true&sd=true)

## Cara Clone
```bash
git clone https://github.com/Kavleri/stack-tek-tek.git
cd stack-tek-tek
```

## Instalasi
### Persyaratan Sistem
- Node.js (versi 16+)
- MySQL
- Git

### Setup Backend
```bash
cd backend
npm install
# Buat file .env dengan variabel lingkungan (lihat contoh di doc/)
npm run dev
```

### Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### Setup Database
- Buat database MySQL bernama `wedding_organizer`
- Jalankan script SQL di `doc/Database/database.sql` untuk membuat tabel
- (Opsional) Jalankan `dummy_data.sql` untuk data contoh

## Menjalankan Aplikasi
1. Jalankan backend: `cd backend && npm run dev` (server akan berjalan di port default, biasanya 3000)
2. Jalankan frontend: `cd frontend && npm run dev` (akan berjalan di port 5173 dengan Vite)
3. Akses aplikasi di browser: `http://localhost:5173`

## Dokumentasi Tambahan
Lihat folder `doc/` untuk spesifikasi lengkap:
- `FiturUtama.md`: Detail fitur MVP
- `StrukturRepoPlan.md`: Rencana struktur repo
- `Persnyaratan.md`: Ketentuan proyek
- `Database/database.sql`: Schema database

## Lisensi
ISC
