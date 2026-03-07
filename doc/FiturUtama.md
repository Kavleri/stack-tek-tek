# Fitur Utama System Management WO

1. **Sistem Manajemen Paket & Vendor**
Ini buat kelola paket wedding-nya.
    - **Backend**: CRUD Paket (Catering, Dekorasi, Dokumentasi).
    - **Frontend**: Katalog paket yang rapi pakai React.
    - **Role**: Cocok buat yang suka mainin logika database.

2. **Autentikasi & Profile Management**
Sesuai syarat dosen tentang keamanan (OWASP).
    - **Backend**: Login/Register pakai JWT (JSON Web Token).
    - **Frontend**: Halaman profile user dan proteksi private route.
    - **Fitur**: Pencegahan SQL Injection di input form.

3. **Booking & Penjadwalan**
Biar nggak ada jadwal yang bentrok antar klien.
    - **Backend**: Validasi tanggal booking (biar nggak double booking).
    - **Frontend**: Kalender interaktif atau form pemesanan yang user-friendly.
    - **Fitur**: Notifikasi otomatis tentang jadwal booking.

4. **Sistem Pembayaran & Invoice**
Untuk ngelacak pembayaran klien.
    - **Backend**: Tracking status bayar (DP, Lunas) dan generate nomor invoice.
    - **Frontend**: Dashboard buat klien liat sisa tagihan mereka.

5. **Guest Management & Digital Invitation**
Untuk ngelola tamu undangan dan buat undangan digital.
    - **Backend**: Kelola daftar tamu klien.
    - **Frontend**: Fitur buat generate link undangan digital sederhana.