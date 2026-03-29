-- -----------------------------------------------------------------------------
-- Dream Syariah Wedding - Database Schema Initialization
-- Engine: PostgreSQL (Supabase)
-- -----------------------------------------------------------------------------

-- [CATATAN UNTUK TIM DEVELOPER]
-- File ini digunakan sebagai 'Single Source of Truth' rancangan tabel mentah.
-- Eksekusi file ini jika ingin melakukan migrasi manual tanpa memakai ORM.
-- Atau jadikan ini patokan arsitektur data.

-- [DRAFT AWAL]
-- 1. Tabel users (Admin Login)
-- 2. Tabel clients (Data Pelanggan)
-- 3. Tabel vendors (Katalog Catering & Dekorasi)
-- 4. Tabel bookings (Penjualan / Penjadwalan Acara)

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Silakan kembangkan tabel selanjutnya di sini...)
