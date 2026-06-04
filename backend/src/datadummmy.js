// Dataset dummy untuk simulasi tanpa database MySQL
// Digunakan saat mode USE_DATABASE = false di index.js

const admins = [
  { 
    id: 1, 
    username: 'admin', 
    password: '$2b$10$giU4.CmTRGccdt0fdceXpeIE0uNhYatg35zC6fgbhO.b.IQQ3X.u2', // password: admin123
    full_name: 'Admin Utama', 
    role: 'admin', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  },
  { 
    id: 2, 
    username: 'owner', 
    password: '$2b$10$giU4.CmTRGccdt0fdceXpeIE0uNhYatg35zC6fgbhO.b.IQQ3X.u2', 
    full_name: 'Owner WO', 
    role: 'owner', 
    created_at: new Date().toISOString(), 
    updated_at: new Date().toISOString() 
  }
];

const packages = [
  { 
    id: 1, 
    package_name: 'Bronze Package', 
    price: 15000000, 
    description: 'Intimate wedding package for up to 200 guests. Includes standard catering menu, basic flowers, traditional stage decoration, and 1 photographer.', 
    is_active: true 
  },
  { 
    id: 2, 
    package_name: 'Silver Package', 
    price: 30000000, 
    description: 'Elegant wedding package for up to 500 guests. Includes deluxe catering menu, semi-custom decoration, photo & video coverage, and basic sound system.', 
    is_active: true 
  },
  { 
    id: 3, 
    package_name: 'Gold Package', 
    price: 50000000, 
    description: 'Premium wedding package for up to 1000 guests. Includes premium halal buffet catering, full custom floral decoration, cinematic video & photo, master of ceremony, and live music performance.', 
    is_active: true 
  }
];

const events = [
  { 
    id: 1, 
    invoice_number: 'INV/20260604/0001', 
    client_name: 'Kavleri', 
    client_phone: '08123456789', 
    event_date: '2026-06-15', 
    event_time: '08:00', 
    location_name: 'Masjid Al-Husna Grand Ballroom', 
    location_address: 'Jl. Ahmad Yani No. 45, Jakarta', 
    google_maps_link: 'https://maps.google.com/?q=Masjid+Al-Husna', 
    package_id: 2, 
    status: 'confirmed', 
    notes_for_field_staff: 'Dekorasi panggung nuansa putih, katering prasmanan halal, siapkan area photobooth dekat pintu masuk.',
    created_at: new Date().toISOString() 
  },
  { 
    id: 2, 
    invoice_number: 'INV/20260720/0001', 
    client_name: 'Rizky Amalia', 
    client_phone: '085712345678', 
    event_date: '2026-07-20', 
    event_time: '10:00', 
    location_name: 'Aula Serbaguna Komplek BI', 
    location_address: 'Pancoran, Jakarta Selatan', 
    google_maps_link: 'https://maps.google.com/?q=Aula+BI+Pancoran', 
    package_id: 1, 
    status: 'pending', 
    notes_for_field_staff: 'Masih menunggu konfirmasi DP. Persiapan katering untuk 200 porsi.',
    created_at: new Date().toISOString() 
  },
  { 
    id: 3, 
    invoice_number: 'INV/20260805/0001', 
    client_name: 'Dimas Setiawan', 
    client_phone: '082198765432', 
    event_date: '2026-08-05', 
    event_time: '19:00', 
    location_name: 'Hotel Mulia Senayan', 
    location_address: 'Jl. Asia Afrika, Senayan, Jakarta', 
    google_maps_link: 'https://maps.google.com/?q=Hotel+Mulia+Senayan', 
    package_id: 3, 
    status: 'confirmed', 
    notes_for_field_staff: 'Full custom decoration. Live music dengan 5 personil band. Koordinasi dengan vendor bunga eksternal.',
    created_at: new Date().toISOString() 
  },
  { 
    id: 4, 
    invoice_number: 'INV/20260510/0001', 
    client_name: 'Sarah Fauziah', 
    client_phone: '081344556677', 
    event_date: '2026-05-10', 
    event_time: '11:00', 
    location_name: 'Gedung Arsip Nasional', 
    location_address: 'Jl. Gajah Mada No.111, Jakarta Barat', 
    google_maps_link: 'https://maps.google.com/?q=Gedung+Arsip+Nasional', 
    package_id: 2, 
    status: 'completed', 
    notes_for_field_staff: 'Acara sudah selesai. Foto & video sedang proses editing (post-event).',
    created_at: new Date().toISOString() 
  },
  { 
    id: 5, 
    invoice_number: 'INV/20260912/0001', 
    client_name: 'Haryo Wicaksono', 
    client_phone: '087855667788', 
    event_date: '2026-09-12', 
    event_time: '09:00', 
    location_name: 'Taman Mini Indonesia Indah', 
    location_address: 'Cipayung, Jakarta Timur', 
    google_maps_link: 'https://maps.google.com/?q=TMII+Sasana+Kriya', 
    package_id: 1, 
    status: 'cancelled', 
    notes_for_field_staff: 'Dibatalkan oleh klien karena urusan keluarga mendadak.',
    created_at: new Date().toISOString() 
  },
  { 
    id: 6, 
    invoice_number: 'INV/20261025/0001', 
    client_name: 'Ahmad & Aisyah', 
    client_phone: '081122334455', 
    event_date: '2026-10-25', 
    event_time: '08:30', 
    location_name: 'Balai Kartini', 
    location_address: 'Jl. Gatot Subroto No. Kav 37, Jakarta', 
    google_maps_link: 'https://maps.google.com/?q=Balai+Kartini', 
    package_id: 3, 
    status: 'confirmed', 
    notes_for_field_staff: 'Tema Syari. Area tamu pria dan wanita dipisah (Hijab/Tabir). Prasmanan dua jalur.',
    created_at: new Date().toISOString() 
  }
];

const payments = [
  { 
    id: 1, 
    event_id: 1, 
    payment_amount: 15000000, 
    payment_date: '2026-06-04', 
    payment_type: 'down_payment', 
    payment_method: 'Transfer BCA', 
    receipt_note: 'DP Pembayaran Paket Silver untuk pernikahan Kavleri', 
    created_at: new Date().toISOString() 
  },
  { 
    id: 2, 
    event_id: 3, 
    payment_amount: 25000000, 
    payment_date: '2026-06-10', 
    payment_type: 'down_payment', 
    payment_method: 'Transfer Mandiri', 
    receipt_note: 'DP Paket Gold Dimas Setiawan', 
    created_at: new Date().toISOString() 
  },
  { 
    id: 3, 
    event_id: 4, 
    payment_amount: 30000000, 
    payment_date: '2026-05-15', 
    payment_type: 'final_payment', 
    payment_method: 'Transfer BNI', 
    receipt_note: 'Pelunasan Paket Silver Sarah Fauziah', 
    created_at: new Date().toISOString() 
  }
];

const guests = [
  { id: 1, event_id: 1, guest_name: 'Budi Santoso', guest_phone: '08987654321', invitation_slug: 'budi-santoso', is_attended: false, created_at: new Date().toISOString() },
  { id: 2, event_id: 1, guest_name: 'Ani Wijaya', guest_phone: '08987654322', invitation_slug: 'ani-wijaya', is_attended: true, created_at: new Date().toISOString() },
  { id: 3, event_id: 1, guest_name: 'Keluarga Bpk. Herman', guest_phone: '08122334455', invitation_slug: 'keluarga-herman', is_attended: false, created_at: new Date().toISOString() },
  { id: 4, event_id: 1, guest_name: 'Siti Aminah', guest_phone: '08133445566', invitation_slug: 'siti-aminah', is_attended: false, created_at: new Date().toISOString() },
  { id: 5, event_id: 1, guest_name: 'Joko Susilo', guest_phone: '08144556677', invitation_slug: 'joko-susilo', is_attended: true, created_at: new Date().toISOString() },

  { id: 6, event_id: 2, guest_name: 'Andi Pratama', guest_phone: '0857000111', invitation_slug: 'andi-pratama', is_attended: false, created_at: new Date().toISOString() },
  { id: 7, event_id: 2, guest_name: 'Indah Permata', guest_phone: '0857000222', invitation_slug: 'indah-permata', is_attended: false, created_at: new Date().toISOString() },
  { id: 8, event_id: 2, guest_name: 'Keluarga besar Dr. Lukman', guest_phone: '0857000333', invitation_slug: 'keluarga-dr-lukman', is_attended: false, created_at: new Date().toISOString() },
  { id: 9, event_id: 2, guest_name: 'Maya Sari', guest_phone: '0857000444', invitation_slug: 'maya-sari', is_attended: false, created_at: new Date().toISOString() },
  { id: 10, event_id: 2, guest_name: 'Budi Setiadi', guest_phone: '0857000555', invitation_slug: 'budi-setiadi', is_attended: false, created_at: new Date().toISOString() },
  { id: 11, event_id: 2, guest_name: 'Dewi Lestari', guest_phone: '0857000666', invitation_slug: 'dewi-lestari', is_attended: false, created_at: new Date().toISOString() },

  { id: 12, event_id: 3, guest_name: 'Bpk. & Ibu Surya', guest_phone: '08210001', invitation_slug: 'bpk-ibu-surya', is_attended: false, created_at: new Date().toISOString() },
  { id: 13, event_id: 3, guest_name: 'Tono Marpaung', guest_phone: '08210002', invitation_slug: 'tono-marpaung', is_attended: false, created_at: new Date().toISOString() },
  { id: 14, event_id: 3, guest_name: 'Ratna Galih', guest_phone: '08210003', invitation_slug: 'ratna-galih', is_attended: false, created_at: new Date().toISOString() },
  { id: 15, event_id: 3, guest_name: 'Keluarga Bpk. Rahmad', guest_phone: '08210004', invitation_slug: 'keluarga-bpk-rahmad', is_attended: false, created_at: new Date().toISOString() },
  { id: 16, event_id: 3, guest_name: 'Farhan Azis', guest_phone: '08210005', invitation_slug: 'farhan-azis', is_attended: false, created_at: new Date().toISOString() },
  { id: 17, event_id: 3, guest_name: 'Siska Handayani', guest_phone: '08210006', invitation_slug: 'siska-handayani', is_attended: false, created_at: new Date().toISOString() },
  { id: 18, event_id: 3, guest_name: 'Rudi Tabuti', guest_phone: '08210007', invitation_slug: 'rudi-tabuti', is_attended: false, created_at: new Date().toISOString() },
  { id: 19, event_id: 3, guest_name: 'Dinda Kirana', guest_phone: '08210008', invitation_slug: 'dinda-kirana', is_attended: false, created_at: new Date().toISOString() },

  { id: 20, event_id: 4, guest_name: 'Keluarga Bpk. Anto', guest_phone: '08130001', invitation_slug: 'keluarga-bpk-anto', is_attended: true, created_at: new Date().toISOString() },
  { id: 21, event_id: 4, guest_name: 'Hendra Saputra', guest_phone: '08130002', invitation_slug: 'hendra-saputra', is_attended: true, created_at: new Date().toISOString() },
  { id: 22, event_id: 4, guest_name: 'Lilis Karlina', guest_phone: '08130003', invitation_slug: 'lilis-karlina', is_attended: true, created_at: new Date().toISOString() },
  { id: 23, event_id: 4, guest_name: 'Doni Salmanan', guest_phone: '08130004', invitation_slug: 'doni-salmanan', is_attended: true, created_at: new Date().toISOString() },
  { id: 24, event_id: 4, guest_name: 'Keluarga Ibu Fatimah', guest_phone: '08130005', invitation_slug: 'keluarga-ibu-fatimah', is_attended: true, created_at: new Date().toISOString() },

  { id: 25, event_id: 6, guest_name: 'Ustadz Mansyur', guest_phone: '08110001', invitation_slug: 'ustadz-mansyur', is_attended: false, created_at: new Date().toISOString() },
  { id: 26, event_id: 6, guest_name: 'Keluarga Bpk. Kyai Haji', guest_phone: '08110002', invitation_slug: 'keluarga-bpk-kyai-haji', is_attended: false, created_at: new Date().toISOString() },
  { id: 27, event_id: 6, guest_name: 'Hj. Syarifah', guest_phone: '08110003', invitation_slug: 'hj-syarifah', is_attended: false, created_at: new Date().toISOString() },
  { id: 28, event_id: 6, guest_name: 'Habib Ali', guest_phone: '08110004', invitation_slug: 'habib-ali', is_attended: false, created_at: new Date().toISOString() },
  { id: 29, event_id: 6, guest_name: 'Zulham Zamrun', guest_phone: '08110005', invitation_slug: 'zulham-zamrun', is_attended: false, created_at: new Date().toISOString() },
  { id: 30, event_id: 6, guest_name: 'Keluarga Dr. Zaidul Akbar', guest_phone: '08110006', invitation_slug: 'keluarga-dr-zaidul-akbar', is_attended: false, created_at: new Date().toISOString() },
  { id: 31, event_id: 6, guest_name: 'Zaskia Sungkar', guest_phone: '08110007', invitation_slug: 'zaskia-sungkar', is_attended: false, created_at: new Date().toISOString() },
  { id: 32, event_id: 6, guest_name: 'Irwansyah', guest_phone: '08110008', invitation_slug: 'irwansyah', is_attended: false, created_at: new Date().toISOString() },
  { id: 33, event_id: 6, guest_name: 'Teuku Wisnu', guest_phone: '08110009', invitation_slug: 'teuku-wisnu', is_attended: false, created_at: new Date().toISOString() },
  { id: 34, event_id: 6, guest_name: 'Shireen Sungkar', guest_phone: '08110010', invitation_slug: 'shireen-sungkar', is_attended: false, created_at: new Date().toISOString() }
];

module.exports = {
  admins,
  packages,
  events,
  payments,
  guests
};
