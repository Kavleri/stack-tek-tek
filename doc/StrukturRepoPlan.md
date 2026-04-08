wedding-system/
├── backend/           # Node.js + Express (MVC)
│   ├── config/        # Koneksi Database (Sequelize/Mongoose)
│   ├── controllers/   # Logika Bisnis (Proses data)
│   ├── models/        # Skema Database (Tabel-tabel SQL)
│   ├── routes/        # Definisi Endpoint API
│   ├── middlewares/   # Auth & Validasi
│   ├── .env           # Variabel Lingkungan (DB_PASS, PORT)
│   └── server.js      # Entry Point
└── frontend/          # React.js
    ├── public/
    ├── src/
    │   ├── components/ # Komponen Reusable (Navbar, Button)
    │   ├── pages/      # Halaman (Dashboard, Login, EventList)
    │   ├── services/   # Fungsi Fetch API (Axios)
    │   └── App.js
    └── .env           # URL Backend API