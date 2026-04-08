-- Skema Database untuk Sistem Manajemen Wedding Organizer (MVP)
-- Fokus: Admin Internal, Paket Tetap, Validasi Jadwal, dan Distribusi Lapangan.

-- buat database dengan nama 'wedding_organizer'
CREATE DATABASE IF NOT EXISTS wedding_organizer;

USE wedding_organizer;

-- 1. Tabel Akun Admin
-- Mengelola akses masuk untuk staf administrasi dan owner.
CREATE TABLE admins (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
full_name VARCHAR(100) NOT NULL,
role ENUM('admin', 'owner') DEFAULT 'admin',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Paket Wedding
-- Menyimpan katalog paket tetap milik agensi.
CREATE TABLE wedding_packages (
id INT AUTO_INCREMENT PRIMARY KEY,
package_name VARCHAR(100) NOT NULL,
price DECIMAL(15, 2) NOT NULL,
description TEXT, -- Detail isi paket (Catering, Dekorasi, Dokumentasi, dll)
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Pemesanan Acara (Events)
-- Inti dari sistem untuk mencatat detail klien dan jadwal.
CREATE TABLE events (
id INT AUTO_INCREMENT PRIMARY KEY,
invoice_number VARCHAR(20) UNIQUE NOT NULL, -- Format: INV/YYYYMMDD/XXXX
client_name VARCHAR(150) NOT NULL,
client_phone VARCHAR(20) NOT NULL,
event_date DATE NOT NULL, -- Kolom krusial untuk validasi double booking
event_time TIME NOT NULL,
location_name VARCHAR(255) NOT NULL,
location_address TEXT,
google_maps_link TEXT,
package_id INT,
status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
notes_for_field_staff TEXT, -- Catatan khusus untuk tim lapangan
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (package_id) REFERENCES wedding_packages(id)
);

-- 4. Tabel Pembayaran
-- Tracking pembayaran termin/bertahap.
CREATE TABLE payments (
id INT AUTO_INCREMENT PRIMARY KEY,
event_id INT NOT NULL,
payment_amount DECIMAL(15, 2) NOT NULL,
payment_date DATE NOT NULL,
payment_type ENUM('booking_fee', 'down_payment', 'installment', 'final_payment') NOT NULL,
payment_method VARCHAR(50), -- e.g., Transfer BCA, Cash
receipt_note TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 5. Tabel Guest Management (Buku Tamu Digital)
-- Fitur tambahan untuk mengelola tamu klien.
CREATE TABLE guests (
id INT AUTO_INCREMENT PRIMARY KEY,
event_id INT NOT NULL,
guest_name VARCHAR(150) NOT NULL,
guest_phone VARCHAR(20),
invitation_slug VARCHAR(100) UNIQUE, -- Untuk generate link unik (e.g., /undangan/ali-budi)
is_attended BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- INDEX & CONSTRAINTS UNTUK OPTIMASI

-- Index pada event_date untuk mempercepat pengecekan ketersediaan jadwal
CREATE INDEX idx_event_date ON events(event_date);

-- Query Contoh: Cek apakah tanggal 2023-12-25 sudah terisi
-- SELECT COUNT(*) FROM events WHERE event_date = '2023-12-25' AND status != 'cancelled';