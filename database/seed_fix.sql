-- Seed data compatible with schema.sql
INSERT INTO admins (id, name, email, password, phone, created_at, updated_at) VALUES
(1, 'Owner Utama', 'owner@example.com', '$2b$10$HUGukUlGnGuUB02L5w7RoeYa6QHo9VABPIX7YDZbxj/2o6sGMKA6C', '08123456789', NOW(), NOW());

INSERT INTO clients (id, name, phone, email, address, created_at, updated_at) VALUES
(1, 'Kavleri', '08123456789', 'kavleri@example.com', 'Jl. Contoh No. 123, Jakarta', NOW(), NOW());

INSERT INTO packages (id, name, sub_title, category, icon, description, price, features, is_popular, created_at, updated_at) VALUES
(1, 'Silver Package', 'Econ', 'Full', 'stars', 'Katering 300 porsi, Dekorasi pelaminan standar', 25000000.00, JSON_ARRAY('Katering 300 porsi','Dekorasi standar','MUA'), false, NOW(), NOW()),
(2, 'Gold Package', 'Standard', 'Full', 'diamond', 'Katering 600 porsi, Dekorasi bunga segar', 50000000.00, JSON_ARRAY('Katering 600 porsi','Dekorasi bunga segar','MUA Premium'), true, NOW(), NOW()),
(3, 'Platinum Package', 'Luxury', 'Full', 'workspace_premium', 'Full-hall decor, Live Music', 85000000.00, JSON_ARRAY('Full-hall decor','Live Music','Photo Booth'), false, NOW(), NOW());

INSERT INTO events (id, client_id, groom_name, bride_name, event_date, location, theme, status, created_at) VALUES
(1, 1, 'Andi', 'Rina', '2026-06-15', 'Gedung Serbaguna Depok', 'Dream Syariah', 'confirmed', NOW()),
(2, 1, 'Budi', 'Sari', '2026-07-20', 'Hotel Bumi Wiyata', 'Elegant', 'pending', NOW());

INSERT INTO bookings (id, client_id, event_id, package_id, booking_date, total_amount, status, notes, created_at, updated_at) VALUES
(1, 1, 1, 2, NOW(), 5000000.00, 'confirmed', 'Deposit paid', NOW(), NOW());

INSERT INTO guests (id, event_id, name, phone, email, address, status, invitation_token, created_at) VALUES
(1, 1, 'Budi Santoso', '08987654321', 'budi@example.com', '', 'Pending', 'test-token-123', NOW());

INSERT INTO payments (id, booking_id, amount, payment_method, payment_date, status, invoice_number, created_at) VALUES
(1, 1, 5000000.00, 'Transfer BCA', NOW(), 'pending', 'INV/20260408/0001', NOW());
