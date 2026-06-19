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
    └── src/
        ├── assets/                  # Aset statis (logo, ikon kustom, gambar)
        │   ├── logo-dream-syariah.svg
        │   └── images/
        ├── components/              # Komponen global/reusable (bisa dipakai di banyak halaman)
        │   ├── common/              # Komponen dasar UI (Atomic Design)
        │   │   ├── Button.jsx
        │   │   ├── Card.jsx
        │   │   ├── Table.jsx
        │   │   └── Badge.jsx        # Untuk status 'Confirmed', 'DP', 'Booking', 'Gold', dll.
        │   └── layout/              # Komponen pembungkus struktur halaman
        │       ├── Sidebar.jsx      # Menu Utama (Dashboard, Paket Layanan, dll.)
        │       ├── Header.jsx       # Bar pencarian ("Cari..."), Notifikasi, & Profil
        │       └── DashboardLayout.jsx
        ├── features/                # Modul/Fitur utama berdasarkan menu di dashboard
        │   ├── dashboard/           # Khusus untuk halaman Dashboard utama
        │   │   ├── components/
        │   │   │   ├── StatCard.jsx         # Card untuk "Acara Bulan Ini", "Total Tamu", dll.
        │   │   │   ├── UpcomingEvents.jsx   # List "Acara Mendatang"
        │   │   │   └── MiniCalendar.jsx     # Widget "Kalender" di sisi kanan
        │   │   └── DashboardPage.jsx
        │   ├── paket-layanan/       # Menu: Paket Layanan
        │   │   └── PaketPage.jsx
        │   ├── jadwal-acara/        # Menu: Jadwal Acara
        │   │   └── JadwalPage.jsx
        │   ├── invoice/             # Menu: Invoice
        │   │   └── InvoicePage.jsx
        │   ├── buku-tamu/           # Menu: Buku Tamu
        │   │   └── BukuTamuPage.jsx
        │   └── work-order/          # Menu: Work Order
        │       └── WorkOrderPage.jsx
        ├── hooks/                   # Custom hooks untuk logic yang reusable
        │   └── useFetchData.js
        ├── routes/                  # Konfigurasi routing aplikasi
        │   └── AppRoutes.jsx
        ├── services/                # Integrasi API (Axios / Fetch)
        │   ├── api.js
        │   └── dashboardService.js  # Mengambil data stat, acara mendatang, & kalender
        ├── styles/                  # File styling global (Tailwind / CSS)
        │   └── index.css
        ├── utils/                   # Fungsi pembantu (helper functions)
        │   └── formatCurrency.js    # Untuk memformat uang (e.g., mengubah ke "Rp 45.2 Jt")
        ├── App.jsx
        └── main.jsx
    .env           # Variabel Lingkungan (API_URL, dll.)