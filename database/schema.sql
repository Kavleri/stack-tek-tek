-- Skema Database untuk Sistem Manajemen Wedding Organizer (MVP)
-- Stack database final: MySQL.

CREATE DATABASE IF NOT EXISTS wedding_organizer;
USE wedding_organizer;

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

-- 3. Tabel Pemesanan Acara (Events)
CREATE TABLE events (
	id INT AUTO_INCREMENT PRIMARY KEY,
	invoice_number VARCHAR(20) UNIQUE NOT NULL,
	client_name VARCHAR(150) NOT NULL,
	client_phone VARCHAR(20) NOT NULL,
	event_date DATE NOT NULL,
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

-- 4. Tabel Pembayaran
CREATE TABLE payments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	event_id INT NOT NULL,
	payment_amount DECIMAL(15, 2) NOT NULL,
	payment_date DATE NOT NULL,
	payment_type ENUM('booking_fee', 'down_payment', 'installment', 'final_payment') NOT NULL,
	payment_method VARCHAR(50),
	receipt_note TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 5. Tabel Guest Management
CREATE TABLE guests (
	id INT AUTO_INCREMENT PRIMARY KEY,
	event_id INT NOT NULL,
	guest_name VARCHAR(150) NOT NULL,
	guest_phone VARCHAR(20),
	invitation_slug VARCHAR(100) UNIQUE,
	is_attended BOOLEAN DEFAULT FALSE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Index untuk mempercepat cek bentrok jadwal
CREATE INDEX idx_event_date ON events(event_date);
