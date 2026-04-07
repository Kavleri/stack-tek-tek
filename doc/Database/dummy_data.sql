-- ==========================================
-- DATA DUMMY UNTUK SISTEM WEDDING ORGANIZER
-- ==========================================

USE wedding_organizer;

-- 1. DATA ADMIN
-- Menambahkan satu akun owner dan dua akun admin operasional.
INSERT INTO admins (username, password, full_name, role) VALUES 
('owner_utama', 'password', 'Budi Santoso', 'owner'),
('admin_event1', 'password', 'Siti Aminah', 'admin1'),
('admin_event2', 'password', 'Rina Wijaya', 'admin2');

-- 2. DATA PAKET WEDDING
INSERT INTO wedding_packages (package_name, price, description) VALUES 
('Paket Silver (Econ)', 25000000.00, 'Katering 300 porsi, Dekorasi pelaminan standar, MUA & Attire, Dokumentasi 1 hari.'),
('Paket Gold (Standard)', 50000000.00, 'Katering 600 porsi, Dekorasi bunga segar, MUA Premium, Dokumentasi & Video Cinematic.'),
('Paket Platinum (Luxury)', 85000000.00, 'Katering 1000 porsi, Dekorasi Full-Hall, Live Music, Photo Booth, & Wedding Organizer (5 orang).');

-- 3. DATA PEMESANAN ACARA (EVENTS)
-- Mencakup detail klien, jadwal, lokasi di sekitar Depok/Jakarta, dan catatan untuk tim lapangan.
INSERT INTO events (invoice_number, client_name, client_phone, event_date, event_time, location_name, location_address, package_id, status, notes_for_field_staff) VALUES 
('INV/20260408/0001', 'Andi & Rina', '081234567890', '2026-06-15', '09:00:00', 'Gedung Serbaguna Depok', 'Jl. Margonda Raya No. 10, Depok', 2, 'confirmed', 'Tim lapangan standby jam 05:00. Katering minta tambahan pondokan sate.'),
('INV/20260408/0002', 'Budi & Sari', '085678901234', '2026-07-20', '11:00:00', 'Hotel Bumi Wiyata', 'Jl. Margonda Raya No. 281, Depok', 3, 'pending', 'Belum ada catatan khusus, menunggu konfirmasi layout pelaminan.'),
('INV/20260408/0003', 'Citra & Doni', '081122334455', '2026-05-10', '19:00:00', 'Rumah Klien', 'Jl. Sawangan No. 5, Depok', 1, 'completed', 'Acara selesai. Semua aset dekorasi sudah ditarik kembali ke gudang agensi.'),
('INV/20260408/0004', 'Eko & Maya', '089988776655', '2026-08-05', '08:00:00', 'Masjid Kubah Emas', 'Jl. Raya Meruyung, Limo', 2, 'confirmed', 'Akad nikah di masjid, resepsi di aula samping. Koordinasi ketat dengan keamanan setempat.'),
('INV/20260408/0005', 'Fajar & Gita', '082233445566', '2026-09-12', '10:00:00', 'Aula UI Depok', 'Kampus UI, Beji, Depok', 3, 'cancelled', 'Pembatalan oleh klien. Tidak perlu ada distribusi logistik ke lapangan.');

-- 4. DATA PEMBAYARAN (OPSIONAL)
-- Contoh tracking pembayaran untuk invoice pertama.
INSERT INTO payments (event_id, payment_amount, payment_date, payment_type, payment_method) VALUES 
(1, 5000000.00, '2026-04-01', 'booking_fee', 'Transfer BCA'),
(1, 10000000.00, '2026-04-07', 'down_payment', 'Transfer BCA');