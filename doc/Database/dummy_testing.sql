-- =====================================================================
-- DATA DUMMY UNTUK TESTING SELURUH FITUR (DB MODE: USE_DATABASE=true)
-- Sistem Manajemen Wedding Organizer — Dream Syariah
-- =====================================================================
-- Tujuan      : Import LANGSUNG ke phpMyAdmin (satu file, langsung jalan).
-- Kompatibel  : Backend terkini (authController, bookingController,
--               paymentsPackageModels, guestModel, weddingPackageModel).
--
-- File ini SELF-CONTAINED:
--   - Membuat database, DROP & CREATE ulang seluruh tabel, lalu mengisi data.
--   - Bisa di-import BERKALI-KALI (setiap import mereset data ke kondisi awal).
--   - Tidak perlu import database.sql terpisah.
--
-- Catatan teknis: pakai DROP + CREATE (bukan TRUNCATE) karena phpMyAdmin
-- sering tidak mempertahankan SET FOREIGN_KEY_CHECKS=0 antar-query saat
-- import, sehingga TRUNCATE pada tabel yang direferensi FK gagal (#1701).
-- DROP dilakukan urutan CHILD-DULU (guests/payments -> events -> packages
-- -> admins) sehingga FK tidak pernah menghalangi.
--
-- CATATAN PENTING (perbedaan vs database.sql yang asli):
-- 1. Tabel `payments` sudah memuat 2 kolom yang DIBUTUHKAN backend
--    (`proof_of_payment` & `status`) — tanpa ini POST/PUT /api/payments
--    akan error "Unknown column" saat mode DB aktif.
--    Lihat: backend/models/paymentsPackageModels.js (INSERT/UPDATE 8 kolom).
-- 2. Password admin sudah di-hash bcrypt (cost 10) supaya login langsung
--    jalan tanpa andalkan path plaintext-migration di authController.
--       Username : owner_utama / admin_giya / admin_rava
--       Password : password123  (untuk SEMUA akun)
-- 3. 10 client dengan nama gaya Gen-Z, masing-masing dapat 1 event.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS wedding_organizer;
USE wedding_organizer;

-- =====================================================================
-- (A) DROP TABEL LAMA — urutan CHILD-DULU (yang punya FK dulu).
--     Tidak butuh FOREIGN_KEY_CHECKS karena tabel child di-drop sebelum
--     parent-nya direferensi hilang. IF EXISTS agar aman saat import pertama.
-- =====================================================================
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS wedding_packages;
DROP TABLE IF EXISTS admins;

-- =====================================================================
-- (B) BUAT TABEL — urutan PARENT-DULU (sesuai arah FK).
--     payments sudah memuat proof_of_payment & status yang dipakai backend.
-- =====================================================================

-- 1. Tabel Akun Admin
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
CREATE TABLE wedding_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_name VARCHAR(100) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Events
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(20) UNIQUE NOT NULL,            -- Format: INV/YYYYMMDD/XXXX
  client_name VARCHAR(150) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  event_date DATE NOT NULL,                              -- krusial untuk anti-double-booking
  event_time TIME NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  location_address TEXT,
  google_maps_link TEXT,
  package_id INT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes_for_field_staff TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES wedding_packages(id)
);

-- 4. Tabel Payments (SUDAH TERMASUK proof_of_payment & status sesuai backend)
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  payment_amount DECIMAL(15, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_type ENUM('booking_fee', 'down_payment', 'installment', 'final_payment') NOT NULL,
  payment_method VARCHAR(50),
  receipt_note TEXT,
  proof_of_payment TEXT,                                 -- ditulis oleh paymentsPackageModels.js
  status ENUM('pending', 'confirmed', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 5. Tabel Guests
CREATE TABLE guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  guest_name VARCHAR(150) NOT NULL,
  guest_phone VARCHAR(20),
  invitation_slug VARCHAR(100) UNIQUE,                   -- untuk link /invitation/:slug
  is_attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Index pada event_date untuk mempercepat pengecekan ketersediaan jadwal
CREATE INDEX idx_event_date ON events(event_date);

-- =====================================================================
-- (1) ADMINS — 3 akun (1 owner + 2 admin operasional)
--     Password semua: password123  (bcrypt cost 10)
-- =====================================================================
INSERT INTO admins (username, password, full_name, role) VALUES
('owner_utama', '$2b$10$hxZVSgmmYQqMBqNglTDVFu7BJPeh5TC4H6qkk7uJghLPKtvRZKogG', 'Jibril', 'owner'),
('admin',  '$2b$10$3mkDds6OTcdRE7aJ8m8FnuwEq1o9ol1.jXeThxv5RfdENooFZbkXq', 'Hisyam', 'admin'),
('admin2',  '$2b$10$0mMPiAWV05YB5NSRbJdpP.nTtios9sZRZx.xrEPu96Ct9WaAdJ982', 'Aila', 'admin');

-- =====================================================================
-- (2) WEDDING PACKAGES — 5 paket (untuk variasi harga)
-- =====================================================================
INSERT INTO wedding_packages (package_name, price, description, is_active) VALUES
('Paket Silver (Econ)',     25000000.00, 'Katering 300 porsi, Dekorasi pelaminan standar, MUA & Attire, Dokumentasi 1 hari.', TRUE),
('Paket Gold (Standard)',   50000000.00, 'Katering 600 porsi, Dekorasi bunga segar, MUA Premium, Dokumentasi & Video Cinematic.', TRUE),
('Paket Platinum (Luxury)', 85000000.00, 'Katering 1000 porsi, Dekorasi Full-Hall, Live Music, Photo Booth, & Wedding Organizer (5 orang).', TRUE),
('Paket Diamond (VIP)',    125000000.00, 'Semua isi Platinum + Entertainment Full, Choreographer, dan Koordinator Harian eksklusif.', TRUE),
('Paket Bronze (Promo)',   15000000.00,  'Paket terbatas: Katering 150 porsi, dekorasi minimalis, dokumentasi 4 jam. Promo musiman.', FALSE);

-- =====================================================================
-- (3) EVENTS — 10 client gaya Gen-Z
--     Setiap event 1 tanggal unik (sesuai aturan anti-double-booking
--     untuk status != 'cancelled').
--
--     Status distribusi:
--       4 confirmed  (muncul di /calendar & validasi double-booking)
--       3 pending
--       2 completed
--       1 cancelled
-- =====================================================================
INSERT INTO events
  (invoice_number, client_name, client_phone, event_date, event_time,
   location_name, location_address, google_maps_link,
   package_id, status, notes_for_field_staff)
VALUES
('INV/20260701/0001', 'Aqila',     '081200110001', '2026-07-15', '09:00:00',
 'Aula Skibidi Depok', 'Jl. Margonda No. 1, Depok',
 'https://maps.google.com/?q=Aula+Depok',
 2, 'confirmed',
 'Bride request playlist Spotify "rizz academy". Standby tim 06:00.'),

('INV/20260701/0002', 'Bima',       '081200110002', '2026-07-22', '11:00:00',
 'Ballroom The Rizz', 'Jl. Raya Bogor KM 30, Depok',
 'https://maps.google.com/?q=Ballroom+The+Rizz',
 3, 'confirmed',
 'No-cap policy: tamu dilarang bawa kacamata hitam di dalam ballroom.'),

('INV/20260701/0003', 'Cinta',       '081200110003', '2026-08-03', '08:00:00',
 'Masjid Kubah Emas', 'Jl. Raya Meruyung, Limo, Depok',
 'https://maps.google.com/?q=Masjid+Kubah+Emas+Limo',
 1, 'pending',
 'Akad nikah pukul 08:00, resepsi terpisah. Menunggu konfirmasi layout.'),

('INV/20260701/0004', 'Daffa',     '081200110004', '2026-08-12', '19:00:00',
 'Hotel Bumi Wiyata', 'Jl. Margonda Raya No. 281, Depok',
 'https://maps.google.com/?q=Hotel+Bumi+Wiyata',
 2, 'confirmed',
 'Tema "Glow-Up Garden". Tambahan 2 photographer untuk konten reels.'),

('INV/20260701/0005', 'Erika',      '081200110005', '2026-08-25', '10:00:00',
 'Gedung Mewing Hall', 'Jl. Sawangan No. 5, Depok',
 'https://maps.google.com/?q=Gedung+Mewing+Hall',
 4, 'pending',
 'Klien minta area VIP terpisah untuk keluarga inti. Belum DP.'),

('INV/20260701/0006', 'Farhan',  '081200110006', '2026-09-05', '13:00:00',
 'Convention Center', 'Jl. Raya Condet, Jakarta Timur',
 'https://maps.google.com/?q=Convention+Center+Fanum',
 3, 'confirmed',
 'Tiket masuk digital via QR. Koordinasi ketat dengan keamanan.'),

('INV/20260701/0007', 'Ghea',        '081200110007', '2026-09-18', '16:00:00',
 'Aula Universitas', 'Kampus UI, Beji, Depok',
 'https://maps.google.com/?q=Aula+Universitas+Indonesia',
 2, 'pending',
 'Mahasiswa UI — perlu surat izin pemakaian aula. Menunggu dokumen.'),

('INV/20260701/0008', 'Hana',          '081200110008', '2026-05-20', '18:00:00',
 'Rumah Klien Hana', 'Jl. Melati No. 12, Depok',
 'https://maps.google.com/?q=Jl+Melati+No+12+Depok',
 1, 'completed',
 'Acara selesai. Aset dekorasi sudah ditarik kembali ke gudang agensi.'),

('INV/20260701/0009', 'Iqbal',        '081200110009', '2026-06-08', '20:00:00',
 'Ballroom Palace', 'Jl. MH Thamrin No. 1, Jakarta Pusat',
 'https://maps.google.com/?q=Ballroom+Palace',
 4, 'completed',
 'After-party selesai pukul 23:30. Invoice final sudah lunas.'),

('INV/20260701/0010', 'Jihan',      '081200110010', '2026-10-10', '14:00:00',
 'Ruang "Delulu is the Solulu"', 'Jl. Kenanga No. 9, Depok',
 'https://maps.google.com/?q=Jl+Kenanga+No+9+Depok',
 3, 'cancelled',
 'Pembatalan oleh klien (pindah tanggal). Tidak perlu distribusi logistik.');

-- =====================================================================
-- (4) PAYMENTS — beberapa termin per event untuk menguji filter & status
--     Kolom proof_of_payment & status wajib diisi agar sinkron dengan model.
-- =====================================================================
INSERT INTO payments
  (event_id, payment_amount, payment_date, payment_type, payment_method,
   receipt_note, proof_of_payment, status)
VALUES
-- Aqila (event 1, confirmed): DP + installment, confirmed
(1,  5000000.00,  '2026-06-10', 'booking_fee',  'Transfer BCA',     'Bukti transfer DP',            '/uploads/receipt/ev1-dp.jpg',     'confirmed'),
(1, 15000000.00,  '2026-06-25', 'installment',  'Transfer Mandiri', 'Cicilan ke-1',                 '/uploads/receipt/ev1-cicil1.jpg', 'confirmed'),

-- Bima (event 2, confirmed): booking + final, confirmed
(2,  8500000.00,  '2026-06-12', 'booking_fee',  'Transfer BCA',     'Booking fee Bima',             '/uploads/receipt/ev2-booking.jpg','confirmed'),
(2, 41500000.00,  '2026-07-01', 'final_payment','Cash',             'Pelunasan tunai di kantor',    '/uploads/receipt/ev2-final.jpg',  'confirmed'),

-- Cinta (event 3, pending): booking fee saja, status pending (belum diverifikasi)
(3,  2500000.00,  '2026-07-02', 'booking_fee',  'Transfer BRI',     'Menunggu verifikasi kasir',    '/uploads/receipt/ev3-booking.jpg','pending'),

-- Daffa (event 4, confirmed): DP confirmed + 1 installment pending
(4, 10000000.00,  '2026-06-20', 'down_payment', 'Transfer BCA',     'DP Daffa',                     '/uploads/receipt/ev4-dp.jpg',     'confirmed'),
(4, 20000000.00,  '2026-07-03', 'installment',  'Transfer Mandiri', 'Cicilan belum diverifikasi',   '/uploads/receipt/ev4-cicil1.jpg', 'pending'),

-- Farhan (event 5, pending): belum ada DP → 1 payment pending
(5, 12500000.00,  '2026-07-04', 'booking_fee',  'Transfer BCA',     'Booking Farhan, verifikasi',   '/uploads/receipt/ev5-booking.jpg','pending'),

-- Farhan (event 6, confirmed): DP + installment + final
(6,  8500000.00,  '2026-06-15', 'booking_fee',  'Transfer BCA',     'Booking Fanum',                '/uploads/receipt/ev6-booking.jpg','confirmed'),
(6, 25000000.00,  '2026-07-05', 'installment',  'Transfer Mandiri', 'Cicilan ke-1',                 '/uploads/receipt/ev6-cicil1.jpg', 'confirmed'),
(6, 51500000.00,  '2026-07-10', 'final_payment','Transfer BCA',     'Pelunasan',                    '/uploads/receipt/ev6-final.jpg',  'confirmed'),

-- Ghea (event 7, pending): 1 booking pending
(7,  5000000.00,  '2026-07-06', 'booking_fee',  'Transfer BRI',     'Booking Ghea',                 '/uploads/receipt/ev7-booking.jpg','pending'),

-- Hana (event 8, completed): pelunasan penuh (booking + final confirmed)
(8,  2500000.00,  '2026-04-01', 'booking_fee',  'Transfer BCA',     'Booking Hana (lunas)',         '/uploads/receipt/ev8-booking.jpg','confirmed'),
(8, 22500000.00,  '2026-05-15', 'final_payment','Cash',             'Pelunasan tunai',              '/uploads/receipt/ev8-final.jpg',  'confirmed'),

-- Iqbal (event 9, completed): pelunasan
(9, 12500000.00,  '2026-05-01', 'booking_fee',  'Transfer Mandiri', 'Booking Iqbal',                '/uploads/receipt/ev9-booking.jpg','confirmed'),
(9,112500000.00,  '2026-06-05', 'final_payment','Transfer BCA',     'Pelunasan Diamond',            '/uploads/receipt/ev9-final.jpg',  'confirmed'),

-- Jihan (event 10, cancelled): 1 payment yang ditolak (rejected) → test filter status
(10, 3000000.00,  '2026-07-07', 'booking_fee',  'Transfer BRI',     'Refund setelah pembatalan',    '/uploads/receipt/ev10-reject.jpg','rejected');

-- =====================================================================
-- (5) GUESTS — buku tamu digital (beberapa tamu per event)
--     invitation_slug dipakai untuk link undangan publik /invitation/:slug
-- =====================================================================
INSERT INTO guests (event_id, guest_name, guest_phone, invitation_slug, is_attended) VALUES
-- Event 1 (Aqila Skibidi)
(1, 'Kayla Bestie',    '081300110011', 'kayla-bestie',      1),
(1, 'Luna Slay',       '081300110012', 'luna-slay',         0),
(1, 'Mawar Tita',      '081300110013', 'mawar-tita',        1),
(1, 'Nadia Pov',       '081300110014', 'nadia-pov',         0),

-- Event 2 (Bima No-Cap)
(2, 'Omar Goated',     '081300110015', 'omar-goated',       1),
(2, 'Puan Slay',       '081300110016', 'puan-slay',         1),
(2, 'Qori Vibe',       '081300110017', 'qori-vibe',         0),

-- Event 3 (Cinta Sigma)
(3, 'Rama Sigma',      '081300110018', 'rama-sigma',        0),
(3, 'Sasa Soft',       '081300110019', 'sasa-soft',         0),
(3, 'Tono NPC',        '081300110020', 'tono-npc',          0),
(3, 'Umi Glow',        '081300110021', 'umi-glow',          0),

-- Event 4 (Daffa Glow-Up)
(4, 'Vino Mid',        '081300110022', 'vino-mid',          1),
(4, 'Wira Chad',       '081300110023', 'wira-chad',         1),
(4, 'Xena Icon',       '081300110024', 'xena-icon',         0),
(4, 'Yusuf Based',     '081300110025', 'yusuf-based',       1),

-- Event 5 (Erika Mewing)
(5, 'Zahra Mew',       '081300110026', 'zahra-mew',         0),
(5, 'Aldi Jawline',    '081300110027', 'aldi-jawline',      0),

-- Event 6 (Farhan Fanum-Tax)
(6, 'Bella Looksmax',  '081300110028', 'bella-looksmax',    1),
(6, 'Caca Aura',       '081300110029', 'caca-aura',         1),
(6, 'Dimas Mog',       '081300110030', 'dimas-mog',         0),

-- Event 7 (Ghea GYATT)
(7, 'Elsa Brainrot',   '081300110031', 'elsa-brainrot',     0),
(7, 'Fajar Low-Taper', '081300110032', 'fajar-low-taper',   0),

-- Event 8 (Hana Sus) — completed
(8, 'Gita Nostalgia',  '081300110033', 'gita-nostalgia',    1),
(8, 'Hendra Reuni',    '081300110034', 'hendra-reuni',      1),

-- Event 9 (Iqbal Ohio) — completed
(9, 'Ina Premium',     '081300110035', 'ina-premium',       1),
(9, 'Joko VIP',        '081300110036', 'joko-vip',          1),

-- Event 10 (Jihan Delulu) — cancelled, tamu di-set hadir=0 semua
(10,'Kiki Delulu',     '081300110037', 'kiki-delulu',       0),
(10,'Lala Solulu',     '081300110038', 'lala-solulu',       0);

-- =====================================================================
-- SELESAI. Ringkasan data untuk testing:
--   - 3 admin   : owner_utama / admin_giya / admin_rava  (pw: password123)
--   - 5 paket   : Silver, Gold, Platinum, Diamond (aktif) + Bronze (nonaktif)
--   - 10 events : 4 confirmed, 3 pending, 2 completed, 1 cancelled
--   - 17 payments (mencakup semua payment_type & 3 status)
--   - 28 guests (test buku tamu + RSVP publik via invitation_slug)
-- =====================================================================
