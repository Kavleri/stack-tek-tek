wedding-system/
├── backend/           # Node.js + Express (MVC)
│   ├── config/        # Koneksi Database MySQL (mysql2/ORM)
│   ├── controllers/   # Logika Bisnis (Proses data)
│   ├── models/        # Skema Database (Tabel-tabel SQL)
│   ├── routes/        # Definisi Endpoint API
│   ├── middlewares/   # Auth & Validasi
│   ├── .env           # Variabel Lingkungan (DB_PASS, PORT)
│   └── src/index.ts   # Entry Point (TypeScript)
└── frontend/          # React + Vite + TypeScript
    ├── public/
    ├── src/
    │   ├── components/ # Komponen Reusable (Navbar, Button)
    │   ├── pages/      # Halaman (Dashboard, Login, EventList)
    │   ├── services/   # Fungsi Fetch API (Axios)
    │   └── App.tsx
    └── .env           # URL Backend API