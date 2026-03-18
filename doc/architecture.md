# Architecture Decision Document

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- **Autentikasi & Manajemen Pengguna**: Login aman untuk akun admin.
- **Manajemen Vendor & Paket**: Katalog dinamis untuk Catering, Dekorasi, dan Dokumentasi (CRUD).
- **Penjadwalan & Booking**: Kalender interaktif dengan validasi anti-bentrok jadwal (*anti-double booking*).
- **Dynamic Client Needs Form**: Formulir input tunggal sebagai *Single Source of Truth* untuk data acara.
- **Manajemen Tamu & Undangan Digital**: Pengelolaan daftar tamu dan pembuatan link undangan digital unik.
- **Pelacakan Pembayaran**: Monitoring status DP, Pelunasan, dan sisa tagihan.
- **Automated Document Engine**: Pembuatan PDF Invoice dan Spesifikasi Teknis dalam satu klik.

**Non-Functional Requirements:**
- **Performa**: Pembuatan dokumen PDF < 3 detik; pemuatan halaman < 1 detik.
- **Keamanan**: Kepatuhan OWASP Top 10, enkripsi data sensitif, dan timeout sesi 30 menit.
- **Reliabilitas**: Uptime 99.5% selama jam bisnis, backup harian otomatis.
- **Maintainability**: Standar kode bersih, dokumentasi inline, dan setup environment di bawah 30 menit.
- **User Experience**: Tema "Syariah Grandeur" (Navy & Gold), responsif (Desktop/Tablet), dan aksesibilitas standar.

**Scale & Complexity:**
- **Domain Utama**: Wedding Organizer (Syariah).
- **Tingkat Kompleksitas**: Medium-High (karena otomatisasi dokumen dinamis dan logika anti-bentrok).
- **Estimasi Komponen Arsitektur**: Dashboard, Auth Module, Vendor Module, Booking/Calendar Engine, PDF Generator, Guest/Invitation Engine.

- Primary domain: Web App (MPA)
- Complexity level: Medium-High
- Estimated architectural components: 6

### Technical Constraints & Dependencies

- **Arsitektur Multi-Page Application (MPA)**: Dipilih untuk stabilitas dan kesederhanaan *state management*.
- **Tailwind CSS**: Digunakan untuk sistem desain yang konsisten dengan token warna kustom (Navy #0B2545, Gold #B89336).
- **PDF Generation Library**: Memerlukan library yang mendukung konversi HTML/CSS ke PDF secara akurat.
- **Database**: Memerlukan persistensi data terpusat untuk sinkronisasi admin dan tim lapangan.

### Cross-Cutting Concerns Identified

- **Integritas Data**: Konsistensi data antara input form, Invoice, Spesifikasi Lapangan, dan Undangan Digital.
- **Konsistensi Brand**: Aplikasi harus mencerminkan nilai syariah dan kesan premium melalui visual dan interaksi.
- **Keamanan Data Klien**: Perlindungan data pribadi pengantin dan tamu di seluruh modul.
- **Penanganan Error**: Pesan error yang informatif dan validasi kuat pada input kritikal (seperti tanggal acara).

## Starter Template Evaluation

### Primary Technology Domain

**Decoupled Web Application (Full-Stack)** dengan Backend REST API dan Frontend React.js, sesuai kebutuhan arsitektur terstruktur (MVC) dan pemisahan logika.

### Starter Options Considered

1.  **Express.js (MVC) + React (Vite)**: Pilihan utama. Memisahkan backend dan frontend secara total untuk skalabilitas dan kemudahan pengujian.
2.  **NestJS + React**: Terlalu kompleks untuk kebutuhan "Extreme Simplicity".
3.  **Next.js**: Sebelumnya dipertimbangkan, namun diganti untuk mematuhi kebutuhan eksplisit sistem RESTful API dan React terpisah.

### Selected Starter: Express.js (Backend) & Vite/React (Frontend)

**Rationale for Selection:**
Memisahkan backend (Express) dan frontend (React) memungkinkan tim untuk fokus pada API yang terstruktur menggunakan pola MVC. Express sangat ringan dan fleksibel untuk mengelola rute RESTful, sementara Vite memberikan pengalaman pengembangan React yang sangat cepat (DX).

**Initialization Commands:**

```bash
# Backend Setup
mkdir backend && cd backend
npm init -y
npm install express pg dotenv cors helmet morgan
npm install -D typescript ts-node-dev @types/express @types/node

# Frontend Setup
npm create vite@latest ../frontend -- --template react-ts
```

## Core Architectural Decisions

### Data Architecture
- **Database**: **PostgreSQL** (via **Supabase**). Terpusat sebagai *Single Source of Truth*.
- **Backend Pattern**: **MVC (Model-View-Controller)**. Logika database dan bisnis dipisahkan dari rute API.
- **ORM**: **Drizzle ORM** atau **Prisma**. Memastikan keamanan tipe data dari database ke API.

### Authentication & Security
- **Autentikasi**: **JWT (JSON Web Token)**. Token disimpan di HttpOnly Cookie untuk keamanan maksimal.
- **Middleware**: Express middleware untuk validasi sesi admin dan proteksi rute API.
- **Security**: Penggunaan **Helmet** untuk header keamanan, **CORS** terbatas pada domain frontend, dan enkripsi data sensitif (bcrypt untuk password).

### API & Communication Patterns
- **API Style**: **RESTful API**. Struktur endpoint yang jelas (misal: `/api/v1/vendors`, `/api/v1/bookings`).
- **Data Exchange**: JSON sebagai format utama pertukaran data antara Express dan React.
- **PDF Generation**: **Puppeteer** di sisi Backend. Backend akan meng-generate PDF dari template HTML/Tailwind dan mengirimkan file/stream ke frontend untuk diunduh.

### Frontend Architecture
- **UI Framework**: **React.js** (Vite).
- **Styling**: **Tailwind CSS v4.0** + **Shadcn UI** (Manual components configuration for Vite).
- **State Management**: **React Query (TanStack Query)** untuk sinkronisasi data API dan global state minimalis dengan **Zustand**.
- **Routing**: **React Router v7**.

### Infrastructure & Deployment
- **Backend Hosting**: **Railway** atau **Render** (Node.js runtime).
- **Frontend Hosting**: **Vercel** atau **Netlify**.
- **API Gateway**: Berbagi domain yang sama atau CORS-enabled cross-origin.
