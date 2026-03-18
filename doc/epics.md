# DreamWO - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for DreamWO, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Admin dapat melakukan login secara aman ke sistem.
FR2: Sistem mendukung hingga 2 atau lebih akun admin yang berbeda untuk WO Anda.
FR3: Pengguna yang tidak terautentikasi tidak dapat mengakses dashboard atau data internal.
FR4: Sistem menyediakan fitur untuk menambahkan (add) akun admin baru.
FR5: Sistem menyediakan fitur untuk mengubah (edit) data akun admin yang sudah ada.
FR6: Admin dapat melakukan registrasi akun admin baru (Login/Register).
FR7: Admin dapat mengelola profil mereka sendiri (Profile Management).
FR8: Admin dapat membuat record klien baru (Nama, Kontak, dll).
FR9: Admin dapat mengelola record klien (Edit/Delete).
FR10: Admin dapat menginput detail acara (Tanggal, Lokasi, Tema).
FR11: Admin dapat mengelola katalog paket vendor (CRUD Catering, Dekorasi, Dokumentasi).
FR12: Admin dapat memilih paket/item vendor secara dinamis untuk kebutuhan klien.
FR13: Sistem melakukan validasi tanggal acara secara otomatis untuk mencegah bentrok (anti-double booking).
FR14: Admin dapat melihat semua jadwal acara melalui kalender interaktif.
FR15: Sistem memberikan notifikasi otomatis terkait jadwal booking.
FR16: Sistem menyimpan seluruh data secara permanen di database pusat (Persistence).
FR17: Sistem dapat menghasilkan file PDF Invoice otomatis berdasarkan data yang diinput.
FR18: Sistem dapat menghasilkan file PDF Spesifikasi Teknis (Checklist Lapangan) secara otomatis.
FR19: Dokumen PDF menyertakan branding (Logo & Nama WO) di setiap halaman.
FR20: Invoice mencakup rincian item, status pembayaran (DP/Lunas), dan instruksi pembayaran.
FR21: Admin dapat melacak sisa tagihan klien melalui dashboard.
FR22: Sistem dapat menghasilkan link unik untuk Undangan Digital sederhana.
FR23: Admin dapat mengelola daftar tamu (Guest Management) untuk setiap acara.
FR24: Admin dapat melihat daftar seluruh record klien dan status proyek di Dashboard utama.
FR25: Admin dapat bernavigasi antar-halaman (Dashboard, Form, Kalender, Paket Vendor) dengan menu yang jelas.
FR26: Antarmuka mengikuti panduan visual yang konsisten dan responsif (Dashboard & Form ramah tablet/mobil).
FR27: Sistem memberikan notifikasi status proses secara real-time.
FR28: Sistem memvalidasi kolom wajib (seperti Tanggal Acara) agar tidak kosong saat disimpan.
FR29: Admin dapat melihat ringkasan/preview data sebelum melakukan penyimpanan final.
FR30: Sistem memberikan pesan error yang informatif jika input tidak valid (misal: format tanggal salah).

### NonFunctional Requirements

NFR1: Document Generation - Proses pembuatan PDF harus selesai dalam maksimal 3 detik.
NFR2: Page Load Time - Halaman dashboard dan form harus dimuat di bawah 1 detik (10 Mbps).
NFR3: Security - Kepatuhan OWASP Top 10 (SQLi, XSS, Broken Auth).
NFR4: Digital Invitation Security - Link undangan digital menggunakan token unik/obfuscated.
NFR5: Data Encryption - Enkripsi data sensitif (password, data klien) saat disimpan.
NFR6: Session Management - Timeout otomatis setelah 30 menit tidak aktif.
NFR7: Reliability - Uptime target 99.5% pada jam operasional (08:00 - 20:00).
NFR8: Backups - Backup database harian otomatis (24 jam).
NFR9: Code Standards - Komentar inline, README untuk environment setup < 30 menit.

### Additional Requirements

- **Starter Template**: Decoupled Web App dengan Express.js (Backend) dan Vite/React (Frontend).
- **Database**: PostgreSQL (via Supabase) sebagai Single Source of Truth.
- **ORM**: Drizzle ORM atau Prisma untuk tipe keamanan data.
- **Authentication**: JWT disimpan di HttpOnly Cookie.
- **PDF Generation**: Puppeteer di sisi Backend menggunakan template HTML/Tailwind.
- **Styling**: Tailwind CSS v4.0 + Shadcn UI.
- **State Management**: TanStack Query (React Query) + Zustand.
- **Routing**: React Router v7.
- **Infrastructure**: Backend (Railway/Render), Frontend (Vercel/Netlify).

### UX Design Requirements

UX-DR1: Conflict-Guard Calendar - Visualisasi "Gold Dot" untuk tersedia dan "Navy Stripe" untuk penuh pada kalender.
UX-DR2: Vendor Item Card - Kartu putih dengan label harga Gold dan tombol "+" untuk seleksi instan.
UX-DR3: Guest Data Grid - Tabel dengan badge Gold untuk status "Undangan Terkirim" dan tombol kopi link.
UX-DR4: Payment Status Badge - Solid Gold untuk Lunas, Navy border untuk DP/Unpaid.
UX-DR5: Split-View Preview - Pratinjau dokumen (Invoice/Specs) berdampingan dengan form input pada desktop.
UX-DR6: One-Click Syariah Handover - Aksi sentral "Selesaikan & Serahkan" untuk validasi dan generate aset.
UX-DR7: Elegant Loading State - Animasi logo mandala berputar selama proses backend (PDF gen).
UX-DR8: "Syariah Grandeur" Aesthetics - Penggunaan Navy (#0B2545) dan Gold (#B89336) secara konsisten.
UX-DR9: Typography - Lora (Serif) untuk heading elegan, Inter (Sans) untuk keterbacaan data.

### FR Coverage Map

FR1: Epic 1 - Secure Login
FR2: Epic 1 - Support 2 Admin Accounts
FR3: Epic 1 - Unauthorized Access Protection
FR4: Epic 1 - Add new Admin account
FR5: Epic 1 - Edit existing Admin account
FR6: Epic 1 - Admin registration (Login/Register)
FR7: Epic 1 - Profile management
FR8: Epic 3 - Create Client Record
FR9: Epic 4 - Manage Client Record (Edit/Delete)
FR10: Epic 3 - Event Detail Input (Date, Location, Theme)
FR11: Epic 2 - Catalog Package Management (CRUD)
FR12: Epic 4 - Select Package/Item for Client
FR13: Epic 3 - Interactive Calendar & Anti-Double Booking Validation
FR14: Epic 3 - Calendar View for all client events
FR15: Epic 3 - Automatic Booking Notifications
FR16: Epic 4 - Centralized Persistence (PostgreSQL)
FR17: Epic 5 - Automated PDF Invoice generation
FR18: Epic 5 - Automated PDF Technical Specs (Field Checklist)
FR19: Epic 5 - Branding on PDF Output (Logo & Name)
FR20: Epic 5 - Invoice content (Items, Payment Status, Instructions)
FR21: Epic 5 - Track remaining balance on Dashboard
FR22: Epic 6 - Unique Digital Invitation Link generator
FR23: Epic 6 - Guest Management for each event
FR24: Epic 4 - Dashboard view of all client records/projects
FR25: Epic 1 - Navigation Menu (Dashboard, Form, Calendar, Paket)
FR26: Epic 5 - Premium UI Dashboard & Responsive Form Layouts
FR27: Epic 5 - Real-time process status notifications
FR28: Epic 3 - Mandatory Field Validation (Date)
FR29: Epic 4 - Data Summary/Preview before saving
FR30: Epic 3 - Informative error messages for invalid input
- NFR1-9: Epic 5 - Performance, Security, Reliability Engineering
- UX-DR1: Epic 3 - Conflict-Guard Calendar Visuals
- UX-DR2: Epic 2 - Vendor Item Card UI
- UX-DR3: Epic 6 - Guest Data Grid & Badge UI
- UX-DR4: Epic 5 - Payment Status Badge UI
- UX-DR5: Epic 4 - Split-View Preview UI
- UX-DR6: Epic 5 - One-Click Syariah Handover Action
- UX-DR7: Epic 5 - Elegant Loading State (Mandala)
- UX-DR8-9: Global - Syariah Grandeur Branding & Typography

## Epic List

### Epic 1: Workspace Core & Authenticated Access
**Goal**: Admin can securely access and manage their workspace with clear navigation.
**FRs covered**: FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR25.

### Epic 2: Vendor Resource Management
**Goal**: Admin can manage the catalog of services (Catering, Decoration, Documentation) as a single source of truth.
**FRs covered**: FR11.

### Epic 3: Intelligent Booking & Event Scheduling
**Goal**: Admin can book events with confidence using a conflict-guard calendar and real-time validation.
**FRs covered**: FR8, FR10, FR13, FR14, FR15, FR28, FR30.

### Epic 4: Event Planning & Service Selection
**Goal**: Admin can map vendor services to client needs with previews and reliable persistence.
**FRs covered**: FR9, FR12, FR16, FR24, FR29.

### Epic 5: Automated Handover & Payment Tracking
**Goal**: Instantly generate professional documents and monitor client payments through a premium dashboard.
**FRs covered**: FR17, FR18, FR19, FR20, FR21, FR26, FR27.

### Epic 6: Guest Experience & Digital Invitations
**Goal**: Admin can manage event guest lists and provide digital invitation links.
**FRs covered**: FR22, FR23.

## Epic 1: Workspace Core & Authenticated Access

Admin can securely access and manage their workspace with clear navigation.

### Story 1.1: Project Initialization & Starter Template Setup

As a Developer,
I want to initialize the project using the selected MPA starter template (Express + Vite/React),
So that I have a consistent foundation for building features.

**Acceptance Criteria:**
**Given** Dokumen Arsitektur telah disetujui
**When** Saya melakukan inisialisasi project
**Then** Struktur folder Backend (Express) dan Frontend (Vite/React) terbuat sesuai standar
**And** Dependensi utama (Tailwind v4, Shadcn, Drizzle/Prisma) terpasang

### Story 1.2: Admin Registration & Dual Account Setup

As a New Admin,
I want to register for a DreamWO account,
So that I can begin managing my wedding organizer business.

**Acceptance Criteria:**
**Given** Saya berada di halaman registrasi
**When** Saya memasukkan email dan password yang valid
**Then** Sistem membuat akun saya menggunakan enkripsi password (bcrypt)
**And** Sistem membatasi jumlah akun admin maksimal 2 orang (FR2)

### Story 1.3: Secure Admin Login & Session Management

As an Admin,
I want to login securely and have my session managed,
So that I can access internal business data safely.

**Acceptance Criteria:**
**Given** Saya memiliki akun yang terdaftar
**When** Saya memasukkan kredensial yang benar di halaman login
**Then** Sistem menerbitkan JWT yang disimpan di HttpOnly Cookie
**And** Sistem mengarahkan saya ke Dashboard utama (FR1)
**And** Sistem melakukan logout otomatis setelah 30 menit tidak aktif (NFR6)

### Story 1.4: Admin Profile & Identity Management

As an Admin,
I want to manage my profile information,
So that my identity is accurate within the business records.

**Acceptance Criteria:**
**Given** Saya sudah login
**When** Saya menuju ke pengaturan profil
**Then** Saya dapat melihat dan mengubah nama serta kontak saya (FR7)
**And** Perubahan disimpan secara permanen di database pusat (FR16)

### Story 1.5: Workspace Dashboard Shell & Premium Navigation

As an Admin,
I want to see a premium dashboard layout with clear navigation,
So that I can move efficiently between business modules.

**Acceptance Criteria:**
**Given** Saya sudah login
**When** Dashboard dimuat
**Then** Saya melihat Sidebar dengan menu Dashboard, Form, Kalender, dan Paket Vendor (FR25)
**And** UI menggunakan tema "Syariah Grandeur" (Navy #0B2545 & Gold #B89336) (UX-DR8)
**And** Tipografi menggunakan Lora untuk judul dan Inter untuk teks body (UX-DR9)

### Story 1.6: Internal Admin Account Management

As a Master Admin,
I want to add or edit the second admin account,
So that I can collaborate with a partner.

**Acceptance Criteria:**
**Given** Saya sudah login sebagai admin pertama
**When** Saya mengakses menu Manajemen Admin
**Then** Saya dapat menambahkan satu akun admin tambahan atau mengedit yang sudah ada (FR4, FR5)
**And** Total akun admin di sistem tidak pernah melebihi 2 akun (FR2)

## Epic 2: Vendor Resource Management

Admin can manage the catalog of services (Catering, Decoration, Documentation) as a single source of truth.

### Story 2.1: Management of Vendor Category Structure

As an Admin,
I want to classify vendor items into Catering, Decoration, or Documentation,
So that the catalog remains organized.

**Acceptance Criteria:**
**Given** Saya sedang mengelola Katalog Vendor
**When** Saya menambah atau mengedit item
**Then** Saya dapat menentukan kategorinya (Catering, Dekorasi, atau Dokumentasi) (FR11)

### Story 2.2: CRUD Vendor Items/Services

As an Admin,
I want to manage vendor items (add, edit, delete, view),
So that I can maintain an up-to-date catalog.

**Acceptance Criteria:**
**Given** Saya berada di halaman Katalog Vendor
**When** Saya melakukan aksi CRUD pada item
**Then** Sistem memperbarui detail item termasuk Nama, Harga Dasar, dan Deskripsi (FR11)
**And** Data tersimpan secara permanen di database (FR16)

### Story 2.3: Visual Catalog of Vendor Items

As an Admin,
I want to see vendor items in a professional card-based layout,
So that I can quickly scan and identify services.

**Acceptance Criteria:**
**Given** Saya sedang melihat Katalog Vendor
**When** Halaman dimuat
**Then** Setiap item ditampilkan dalam bentuk "Vendor Item Card" (UX-DR2)
**And** Setiap kartu menampilkan label harga berwarna "Premium Gold" (#B89336)

## Epic 3: Intelligent Booking & Event Scheduling

Admin can book events with confidence using a conflict-guard calendar and real-time validation.

### Story 3.1: Interactive Event Calendar View

As an Admin,
I want to see a visual calendar of all scheduled events.

**Acceptance Criteria:**
**Given** Saya berada di halaman Kalender
**When** Halaman dimuat
**Then** Saya melihat tampilan kalender bulanan (FR14)
**And** Tanggal dengan booking yang ada menunjukkan indikator "Navy Stripe" (UX-DR1)
**And** Tanggal yang tersedia menunjukkan indikator "Gold Dot" (UX-DR1)

### Story 3.2: Create New Client Event Booking

As an Admin,
I want to record a new client booking with basic event details.

**Acceptance Criteria:**
**Given** Saya berada di form "Tambah Booking"
**When** Saya memasukkan nama klien, kontak, tanggal acara, lokasi, dan tema
**Then** Sistem memvalidasi bahwa kolom wajib (Tanggal) tidak kosong (FR28)
**And** Record klien dan acara dibuat di database (FR8, FR10, FR16)

### Story 3.3: Real-time Conflict Validation Engine

As an Admin,
I want the system to prevent me from booking events on already-taken dates.

**Acceptance Criteria:**
**Given** Saya sedang memasukkan tanggal untuk booking baru
**When** Saya memasukkan tanggal yang sudah memiliki acara
**Then** Sistem menampilkan peringatan merah dan pesan error yang informatif (FR13, FR30)

### Story 3.4: Event Booking Notifications

As an Admin,
I want to receive real-time feedback when a booking is saved.

**Acceptance Criteria:**
**Given** Saya telah mensubmit form booking
**When** Server memproses permintaan tersebut
**Then** Saya melihat notifikasi status proses secara real-time (FR15, FR27)

## Epic 4: Event Planning & Service Selection

Admin can map vendor services to client needs with previews and reliable persistence.

### Story 4.1: Dynamic Event Planning Form (Service Selection)

As an Admin,
I want to select vendor packages for a client's event.

**Acceptance Criteria:**
**Given** Saya berada di form Perencanaan Acara untuk klien tertentu
**When** Saya mencari layanan vendor
**Then** Sistem menampilkan item dari Katalog Vendor (FR12)
**And** Saya dapat memilih beberapa item sekaligus

### Story 4.2: Real-time Selection Preview with Split-View

As an Admin,
I want to see a live preview of my service selections.

**Acceptance Criteria:**
**Given** Saya sedang mengisi Form Perencanaan (sisi kiri)
**When** Saya menambah atau mengubah pilihan layanan
**Then** Sistem memperbarui pratinjau live di sisi kanan layar (Split-View) (FR29, UX-DR5)

### Story 4.3: Management of Existing Client & Event Records

As an Admin,
I want to edit or delete existing client records.

**Acceptance Criteria:**
**Given** Saya berada di Daftar Klien atau profil klien tertentu
**When** Saya memilih untuk mengedit detail atau menghapus record
**Then** Sistem memperbarui atau menghapus data dari database (FR9)

### Story 4.4: Dashboard Overview of Projects

As an Admin,
I want to see a summary of all client projects.

**Acceptance Criteria:**
**Given** Saya berada di Dashboard utama
**When** Halaman dimuat
**Then** Saya melihat daftar/grid seluruh record klien beserta nama, tanggal acara, dan status perencanaan (FR24)

## Epic 5: Automated Handover & Payment Tracking

Instantly generate professional documents and monitor client payments through a premium dashboard.

### Story 5.1: Automated Professional Invoice Generation

As an Admin,
I want to generate a professional PDF invoice.

**Acceptance Criteria:**
**Given** Saya telah menyelesaikan data perencanaan acara
**When** Saya memicu aksi "Generate Invoice"
**Then** Sistem menghasilkan file PDF (FR17)
**And** PDF mencantumkan Logo dan Nama Wedding Organizer (FR19)
**And** PDF menyertakan rincian item, total harga, status pembayaran, dan instruksi bayar (FR20)
**And** Proses pembuatan PDF selesai dalam waktu kurang dari 3 detik (NFR1)

### Story 5.2: Technical Specs & Field Checklist Generation

As an Admin,
I want to generate a technical specification checklist.

**Acceptance Criteria:**
**Given** Saya telah menyelesaikan data perencanaan acara
**When** Saya memicu aksi "Generate Specs"
**Then** Sistem menghasilkan file PDF checklist operasional (FR18)

### Story 5.3: Payment Status Tracking & Balance Monitoring

As an Admin,
I want to track client payments and see the remaining balance.

**Acceptance Criteria:**
**Given** Saya berada di Detail Klien atau Dashboard
**When** Saya memperbarui status pembayaran (DP, Lunas)
**Then** Sistem menghitung sisa tagihan otomatis (FR21)
**And** Status ditampilkan menggunakan "Payment Status Badge" (UX-DR4)

### Story 5.4: One-Click Handover Action & Premium Experience

As an Admin,
I want a central "One-Click" action to finalize everything.

**Acceptance Criteria:**
**Given** Saya telah meninjau data acara klien
**When** Saya menekan tombol "Selesaikan & Serahkan" (UX-DR6)
**Then** Sistem melakukan validasi akhir, menyimpan data, dan memicu pembuatan dokumen (FR27)
**And** Animasi "Mandala Loading" muncul (UX-DR7)

## Epic 6: Guest Experience & Digital Invitations

Admin can manage event guest lists and provide digital invitation links.

### Story 6.1: Event Guest List Management

As an Admin,
I want to manage the guest list for each event.

**Acceptance Criteria:**
**Given** Saya berada di halaman Manajemen Tamu untuk acara tertentu
**When** Saya menambah atau mengedit tamu
**Then** Sistem menampilkannya dalam "Guest Data Grid" (UX-DR3)
**And** Grid menunjukkan "Gold Badge" untuk status "Undangan Terkirim" (UX-DR3)
**And** Grid menyertakan tombol "Salin Link" untuk setiap tamu (UX-DR3)

### Story 6.2: Digital Invitation Link Generation with Secure Tokens

As an Admin,
I want to generate secure digital invitation links for guests.

**Acceptance Criteria:**
**Given** Saya berada di modul Manajemen Tamu
**When** Saya membuat link untuk seorang tamu
**Then** Sistem menghasilkan URL unik (FR22)
**And** URL tersebut menggunakan token yang terenkripsi/acak (NFR4)
