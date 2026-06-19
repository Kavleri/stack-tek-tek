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

-- Insert Dummy Booking
INSERT IGNORE INTO bookings (client_id, event_id, package_id, total_amount, status)
VALUES 
(1, 1, 2, 50000000, 'Confirmed');

-- Insert Dummy Guest with invitation token
INSERT IGNORE INTO guests (event_id, name, phone, email, status, invitation_token)
VALUES 
(1, 'Budi Santoso', '08987654321', 'budi@example.com', 'Pending', 'test-token-123');
