<div align="center">

# 💒 Dream Syariah — Wedding Organizer Management System

Sistem manajemen internal untuk agensi pernikahan (*wedding organizer*) berbasis web.
Mengelola paket, jadwal acara, pembayaran, buku tamu digital, dan distribusi work order ke tim lapangan — semuanya dalam satu platform.

[![Node.js](https://img.shields.io/badge/Node.js-22.16-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

</div>

---

## 📋 Daftar Isi

- [Latar Belakang](#-latar-belakang)
- [Tujuan dan Manfaat](#-tujuan-dan-manfaat)
- [Desain Database](#-desain-database)
- [Penjelasan Aplikasi](#-penjelasan-aplikasi)
  - [Fitur Utama](#fitur-utama)
  - [Alur Kerja Sistem](#alur-kerja-sistem)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Panduan Instalasi](#-panduan-instalasi)
- [Anggota Tim](#-anggota-tim)
- [Lisensi](#-lisensi)

---

## 🏛️ Latar Belakang

Bisnis *wedding organizer* menghadapi tantangan operasional yang signifikan dalam pengelolaan jadwal dan data klien. Tanpa sistem informasi yang terpusat, agensi pernikahan rentan mengalami:

1. **Double Booking** — Pencatatan jadwal secara manual (spreadsheet/catatan) meningkatkan risiko dua acara dijadwalkan pada tanggal yang sama, yang dapat meny kerugian finansial dan reputasi agensi.

2. **Fragmentasi Data** — Informasi klien, paket layanan, pembayaran, dan daftar tamu tersebar di berbagai dokumen. Proses pencarian dan verifikasi menjadi lambat dan rentan kesalahan.

3. **Komunikasi Lapangan yang Lemah** — Tim dekorasi, katering, dan dokumentasi sering kali tidak memiliki ringkasan acara yang terstruktur, sehingga terjadi miskomunikasi saat hari-H pelaksanaan.

4. **Pelacakan Pembayaran yang Rumit** — Sistem pembayaran bertahap (*booking fee*, DP, termin, pelunasan) sulit dipantau tanpa dashboard terintegrasi.

5. **Layanan Tamu yang Terbatas** — Klien sulit membagikan informasi undangan kepada ratusan tamu secara efisien.

Berdasarkan permasalahan tersebut, dikembangkan sistem **Dream Syariah** — platform manajemen internal yang dirancang khusus untuk menyelesaikan seluruh tantangan operasional di atas melalui satu antarmuka terpadu.

---

## 🎯 Tujuan dan Manfaat

### Tujuan

- Membangun sistem informasi berbasis web yang mengelola seluruh siklus operasional agensi pernikahan (pemesanan → pembayaran → pelaksanaan → evaluasi).
- Mencegah *double booking* melalui validasi tanggal otomatis pada level database.
- Menyediakan dashboard administratif yang memudahkan pemantauan status seluruh acara secara *real-time*.
- Memfasilitasi distribusi informasi dari admin ke tim lapangan melalui *work order* yang terstruktur.

### Manfaat

| Pihak | Manfaat |
|-------|---------|
| **Admin** | Pencatatan terpusat, validasi otomatis, invoice ter-generate, pemantauan piutang |
| **Tim Lapangan** | Work order PDF yang rapi, checklist paket, catatan spesifik per acara |
| **Klien** | Link undangan digital yang mudah dibagikan ke tamu via WhatsApp |
| **Pemilik Agensi** | Visibilitas penuh terhadap jadwal, keuangan, dan status semua acara |

---

## 🗄️ Desain Database

Sistem menggunakan **MySQL** dengan arsitektur relasional. Berikut diagram ERD (*Entity Relationship Diagram*) yang menggambarkan struktur data dan relasi antar tabel:

<div align="center">

![ERD Design](doc/Database/erd%20design.png)

</div>

### Struktur Tabel

| Tabel | Fungsi | Relasi |
|-------|--------|--------|
| **`admins`** | Menyimpan akun admin/owner untuk autentikasi | — |
| **`wedding_packages`** | Katalog paket layanan agensi (Bronze, Silver, Gold, dll.) | → `events` (1:N) |
| **`events`** | Data inti: klien, jadwal, lokasi, status, dan paket yang dipilih | ← `wedding_packages`, → `payments`, → `guests` |
| **`payments`** | Tracking pembayaran bertahap (booking fee, DP, termin, lunas) | ← `events` (cascade delete) |
| **`guests`** | Daftar tamu per acara + slug undangan digital | ← `events` (cascade delete) |

### Relasi Utama

```
wedding_packages  1 ──── N  events
events            1 ──── N  payments
events            1 ──── N  guests
```

> **Note:** Semua data *payments* dan *guests* terhapus otomatis (*cascade*) saat *event* terkait dihapus, menjaga integritas referensial database.

---

## 📖 Penjelasan Aplikasi

### Fitur Utama

#### 🔐 1. Autentikasi & Manajemen Akun
Sistem tertutup tanpa registrasi publik. Hanya admin/owner yang dapat mengakses panel administrasi.

- Login dengan JWT (*JSON Web Token*, expiry 12 jam)
- Role-based access: `admin` (staf) dan `owner` (pemilik)
- CRUD akun admin + reset password (hanya owner/admin aktif)
- Password di-*hash* menggunakan bcrypt (salt rounds 10)

#### 📦 2. Manajemen Paket Wedding
Katalog paket tetap yang disediakan agensi.

- CRUD paket (Bronze, Silver, Gold, dll.)
- Deskripsi detail per paket (katering, dekorasi, dokumentasi, dll.)
- Status aktif/non-aktif per paket
- Tampilan katalog rapi untuk referensi saat konsultasi klien

#### 📅 3. Penjadwalan Acara & Validasi Double Booking
Modul inti yang menjamin tidak ada dua acara *confirmed* di tanggal yang sama.

- Form pemesanan: data klien, pilih paket, input tanggal & lokasi (termasuk link Google Maps)
- **Validasi otomatis**: sistem menolak jika tanggal sudah terisi event *confirmed*
- Kalender interaktif bulanan yang menandai tanggal ter-*booking*
- Status acara: `pending` → `confirmed`
- Nomor invoice auto-generate: `INV/YYYYMMDD/XXXX`

#### 💳 4. Pembayaran & Invoicing
Pelacakan finansial untuk setiap pesanan.

- Input pembayaran bertahap: *booking fee* → DP → termin → lunas
- Metode bayar fleksibel (transfer, cash, dll.)
- Nomor invoice unik otomatis
- Filter daftar piutang (acara yang belum lunas)

#### 👥 5. Guest Management & Undangan Digital
Layanan buku tamu digital dengan link undangan yang dapat dibagikan.

- CRUD daftar tamu per event
- Generator *slug* undangan unik per tamu
- RSVP publik: tamu dapat mengonfirmasi kehadiran melalui link
- Dashboard kehadiran per acara

#### 📄 6. Distribusi Work Order ke Tim Lapangan
Mekanisme serah terima data operasional ke tim lapangan.

- Export **work order PDF** satu klik
- Isi: nama klien, kontak, lokasi, waktu akad/resepsi, checklist detail paket
- Catatan khusus per acara untuk tim dekorasi/katering/dokumentasi

---

### Alur Kerja Sistem

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. PESANAN  │────▶│ 2. VALIDASI  │────▶│ 3. BAYAR DP  │
│  Admin isi   │     │ Tanggal dicek│     │ Status:      │
│  form klien  │     │ otomatis     │     │ confirmed    │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                           ┌─────────────────────┘
                           ▼
                      ┌──────────────┐     ┌──────────────┐
                      │ 4. BAYAR     │────▶│ 5. TEROBIT   │
                      │    TERMIN    │     │ WORK ORDER   │
                      │ Tracking     │     │ PDF untuk    │
                      │ bertahap     │     │ tim lapangan │
                      └──────────────┘     └──────────────┘
                                                │
                           ┌─────────────────────┘
                           ▼
                      ┌──────────────┐
                      │ 6. HARI-H    │
                      │ Tamu hadir   │
                      │ (RSVP check) │
                      └──────────────┘
```

**Penjelasan alur:**

1. **Pemesanan** — Admin mengisi form berdasarkan hasil konsultasi dengan klien (data diri, paket, tanggal, lokasi).
2. **Validasi** — Sistem memeriksa ketersediaan tanggal secara otomatis. Jika sudah ada event *confirmed*, pemesanan ditolak.
3. **Pembayaran DP** — Klien membayar uang muka. Status event berubah menjadi `confirmed`.
4. **Pembayaran Termin** — Admin mencatat pembayaran bertahap hingga status `lunas`.
5. **Work Order** — Admin men-*generate* PDF work order untuk diserahkan ke tim lapangan (dekorasi, katering, dokumentasi).
6. **Hari-H** — Tim lapangan melaksanakan acara sesuai work order. Tamu yang hadir tercatat melalui sistem RSVP digital.

---

## 💻 Teknologi yang Digunakan

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| **Runtime** | Node.js | 22.x |
| **Backend Framework** | Express.js | 5.x |
| **Frontend Framework** | React | 19.x |
| **Build Tool** | Vite | 8.x |
| **Bahasa** | JavaScript (Backend) · TypeScript (Frontend) | ES2022+ |
| **CSS Framework** | Tailwind CSS | 3.4 |
| **Database** | MySQL | 8.x |
| **DB Driver** | mysql2/promise | 3.x |
| **Autentikasi** | JWT (jsonwebtoken) + bcrypt | — |
| **HTTP Security** | Helmet, CORS | — |
| **Logging** | Morgan | — |

### Arsitektur Backend

```
Request → Route → Auth Middleware → Validator → Controller → Model → MySQL
                                                              ↕
                                            ErrorHandler ← Response
```

Arsitektur **MVC** (*Model-View-Controller*) dengan pemisahan yang jelas antara logika bisnis (*controller*), akses data (*model*), dan definisi endpoint (*route*).

---

## 📁 Struktur Proyek

```
stack-tek-tek/
├── backend/                          # Node.js + Express.js (MVC)
│   ├── config/
│   │   └── database.js               # Pool koneksi MySQL
│   ├── controllers/                  # Logika bisnis per modul
│   │   ├── authController.js         # Autentikasi & JWT
│   │   ├── bookingController.js      # Manajemen pemesanan
│   │   ├── eventController.js        # CRUD acara
│   │   ├── guestController.js        # Manajemen tamu
│   │   ├── paymentsController.js     # Tracking pembayaran
│   │   └── weddingPackageController.js # Katalog paket
│   ├── middlewares/                   # Auth & autorisasi
│   ├── models/                       # Query database (raw SQL)
│   ├── routes/                       # Definisi endpoint API
│   ├── utils/                        # Validator & error handler
│   ├── src/
│   │   ├── index.js                  # Entry point (dual-mode)
│   │   └── datadummmy.js            # Dataset in-memory (mode dummy)
│   ├── .env                          # Konfigurasi lingkungan
│   └── package.json
├── frontend/                         # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── admin/                    # Panel admin (Dashboard, Login, dll.)
│   │   ├── guest/                    # Landing page & undangan digital
│   │   ├── components/               # Sidebar, ProtectedRoute
│   │   ├── contexts/                 # AuthContext (JWT management)
│   │   └── App.tsx                   # Routing utama
│   ├── tailwind.config.cjs           # Design tokens & tema
│   ├── vite.config.ts
│   └── package.json
├── database/
│   ├── database.sql                  # Skema database resmi
│   └── dummy_data.sql               # Data contoh (opsional)
├── doc/
│   ├── FiturUtama.md                 # Spesifikasi fitur MVP
│   ├── Sprint_Project.md             # Tugas per sprint
│   ├── Database/
│   │   ├── database.sql
│   │   ├── dummy_data.sql
│   │   └── erd design.png           # Diagram ERD
│   └── UX Design/                    # Desain antarmuka
└── README.md
```

---

## 🚀 Panduan Instalasi

### Persyaratan Sistem

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [MySQL](https://www.mysql.com/) v8 atau lebih baru
- [Git](https://git-scm.com/)

### 1. Clone Repository

```bash
git clone https://github.com/Kavleri/stack-tek-tek.git
cd stack-tek-tek
```

### 2. Setup Database

```bash
# Login ke MySQL, lalu jalankan:
mysql -u root -p < database/database.sql
# (Opsional) Insert data contoh:
mysql -u root -p wedding_organizer < database/dummy_data.sql
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-here

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=wedding_organizer
```

```bash
npm run dev    # Server berjalan di http://localhost:5000
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev    # Aplikasi berjalan di http://localhost:5173
```

### 5. Buka Aplikasi

Buka browser → `http://localhost:5173`

---

## 👥 Anggota Tim

| Nama | GitHub |
|------|--------|
| Muhammad Jibril Ibrahim | [@Kavleri](https://github.com/Kavleri) |
| Nurul Hayatu Suhaila | — |
| Muhammad Hisyam Alfaris | — |
| Anis Adriani | — |
| Eka Vitaloka | — |

---

## 📄 Lisensi

Lisensi ISC — lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.
