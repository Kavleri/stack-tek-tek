-- Insert Dummy Data for MySQL

-- Insert Admin (password: admin123)
INSERT IGNORE INTO admins (name, email, password, phone) 
VALUES 
('Admin Utama', 'admin@dreamwo.com', '$2b$10$giU4.CmTRGccdt0fdceXpeIE0uNhYatg35zC6fgbhO.b.IQQ3X.u2', '08123456789');

-- Insert Packages
INSERT IGNORE INTO packages (name, sub_title, category, icon, description, price, features, is_popular)
VALUES
('Bronze Package', 'Intimate Sanctuary', 'Full', 'stars', 'Paket pernikahan intim untuk 200 tamu', 15000000, '["Up to 200 Guests", "Syariah Catering Basic", "Standard Decor Theme", "Documentation (1 Photographer)"]', FALSE),
('Gold Package', 'Grand Celebration', 'Full', 'diamond', 'Paket pernikahan mewah untuk 1000 tamu', 50000000, '["Up to 1000 Guests", "Premium Syariah Buffet", "Full Custom Decor & Floral", "Live Cinematic Documentation"]', TRUE),
('Silver Package', 'Elegant Gathering', 'Full', 'workspace_premium', 'Paket pernikahan elegan untuk 500 tamu', 30000000, '["Up to 500 Guests", "Deluxe Syariah Buffet", "Semi-Custom Decor", "Photo & Video Coverage"]', FALSE);

-- Insert Portfolio
INSERT IGNORE INTO portfolio (title, category, image_path)
VALUES
('Al-Husna Grand Wedding', 'The Royal Ballroom', '/images/portfolio-ballroom.jpg'),
('Culinary Excellence', 'Halal Catering', '/images/portfolio-catering.jpg'),
('Outdoor Serenity', 'Garden Wedding', '/images/portfolio-outdoor.jpg');

-- Insert Vendors
INSERT IGNORE INTO vendors (name, category, icon)
VALUES
('Luxe Halal Catering', 'Catering', 'restaurant'),
('Bloom Syariah Floral', 'Floral', 'local_florist'),
('Modest Moments Studio', 'Documentation', 'camera_enhance'),
('Elegance Bridal Wear', 'Attire', 'styler');

-- Insert Dummy Client
INSERT IGNORE INTO clients (name, phone, email, address) 
VALUES 
('Kavleri', '08123456789', 'kavleri@example.com', 'Jl. Contoh No. 123, Jakarta');

-- Insert Dummy Event
INSERT IGNORE INTO events (client_id, groom_name, bride_name, event_date, location, theme, status)
VALUES 
(1, 'Andi', 'Maya', '2026-06-15', 'Masjid Al-Husna Grand Ballroom', 'Modern Syariah', 'Confirmed');

<<<<<<< HEAD
LOCK TABLES `guests` WRITE;
/*!40000 ALTER TABLE `guests` DISABLE KEYS */;
INSERT INTO `guests` VALUES (1,1,'Andi Pratama','081234567890','andi-pratama',0,'2026-04-13 08:00:00'),(2,2,'Siti Rahma','081298765432','siti-rahma',1,'2026-04-13 08:05:00');
/*!40000 ALTER TABLE `guests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,5000000.00,'2026-04-01','booking_fee','Transfer BCA',NULL,NULL,'pending','2026-04-09 12:10:16','2026-04-13 05:25:56'),(2,1,10000000.00,'2026-04-07','down_payment','Transfer BCA',NULL,NULL,'pending','2026-04-09 12:10:16','2026-04-13 05:25:56');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `wedding_packages`
--

LOCK TABLES `wedding_packages` WRITE;
/*!40000 ALTER TABLE `wedding_packages` DISABLE KEYS */;
INSERT INTO `wedding_packages` VALUES (1,'Paket Silver (Econ)',25000000.00,'Katering 300 porsi, Dekorasi pelaminan standar, MUA & Attire, Dokumentasi 1 hari.',1,'2026-04-09 12:10:16'),(2,'Paket Gold (Standard)',50000000.00,'Katering 600 porsi, Dekorasi bunga segar, MUA Premium, Dokumentasi & Video Cinematic.',1,'2026-04-09 12:10:16'),(3,'Paket Platinum (Luxury)',85000000.00,'Katering 1000 porsi, Dekorasi Full-Hall, Live Music, Photo Booth, & Wedding Organizer (5 orang).',1,'2026-04-09 12:10:16');
/*!40000 ALTER TABLE `wedding_packages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 13:10:17
=======
-- Insert Dummy Booking
INSERT IGNORE INTO bookings (client_id, event_id, package_id, total_amount, status)
VALUES 
(1, 1, 2, 50000000, 'Confirmed');
>>>>>>> e206de95c34cb82afbcf946fc1c0c8aa75d013a2

-- Insert Dummy Guest with invitation token
INSERT IGNORE INTO guests (event_id, name, phone, email, status, invitation_token)
VALUES 
(1, 'Budi Santoso', '08987654321', 'budi@example.com', 'Pending', 'test-token-123');
