# Rencana Pengembangan Sistem Manajemen Wedding Organizer (MVP)

Dokumen ini berisi spesifikasi fitur final untuk platform internal pengelolaan agensi pernikahan. Sistem ini dirancang khusus untuk penggunaan oleh Admin Administrasi guna mengelola paket internal, jadwal, dan distribusi informasi ke Tim Lapangan.

### 1. Modul Profil & Manajemen Akun admin (Auth)

Fokus pada keamanan internal dan pembatasan akses.

* Login Admin: Akses masuk khusus staf administrasi.
* Manajemen Akun: Tambah, edit, dan hapus akun admin (Owner/Staf).
* Security Policy: Penambahan akun atau reset password hanya bisa dilakukan oleh akun admin yang sedang login.
* Tidak ada registrasi publik (sistem tertutup).

### 2. Modul Manajemen Paket Wedding (Inventory)

Mengelola katalog layanan yang disediakan sepenuhnya oleh agensi (Internal).

* Katalog Paket (CRUD): Kelola nama paket (e.g., Paket Bronze, Silver, Gold).
* Detail Item Paket: Deskripsi statis mengenai layanan yang didapat (Menu Katering, Dekorasi, Dokumentasi).
* Frontend Katalog: Tampilan katalog yang bersih dan rapi untuk referensi admin saat konsultasi dengan klien.

### 3. Modul Manajemen Event & Penjadwalan (Core)

Fitur utama untuk menghindari kesalahan jadwal (double booking).

* Form Pemesanan Acara:

  * Input data klien (Nama, HP, Alamat).
  * Pilih Paket (Dropdown dari Modul Paket).
  * Input Tanggal \& Lokasi (Link Google Maps).
* Validasi Tanggal Otomatis: Sistem akan menolak input jika tanggal tersebut sudah terisi oleh event lain yang berstatus "Confirmed".
* Kalender Interaktif: Tampilan visual kalender bulanan yang menandai tanggal-tanggal yang sudah ter-booking.

### 4. Modul Pembayaran & Invoicing

Pelacakan finansial sederhana untuk setiap pesanan.

* Tracking Status Bayar: Input manual status pembayaran (Booking Fee, DP, Termin 1, Lunas).
* Automatic Invoice Number: Generate nomor invoice unik setiap kali pesanan dibuat (Format: INV/YYYYMMDD/XXXX).
* Daftar Piutang: Filter khusus untuk melihat pesanan mana saja yang belum mencapai status "Lunas".

### 5.  Modul Guest Management (Client Service)

Layanan tambahan untuk meningkatkan nilai jual agensi ke klien.

* Buku Tamu Digital: CRUD daftar tamu untuk masing-masing event/klien.
* Digital Invitation Link: Generator link sederhana untuk undangan digital yang bisa dibagikan klien ke tamu mereka via WhatsApp.

### 6.  Modul Distribusi Informasi (Admin ke Lapangan)

Mekanisme serah terima data operasional agar tim lapangan tahu apa yang harus dikerjakan.

* Export Work Order (PDF): Tombol sekali klik untuk menghasilkan file PDF berisi ringkasan acara:

  * Nama Klien \& Kontak.
  * Lokasi \& Waktu (Akad/Resepsi).
  * Checklist Detail Paket (Apa saja yang harus disiapkan tim dekorasi, katering, dll).
  
#### Alur Kerja Sistem (Workflow)

1. Pemesanan: Admin mengisi form pesanan berdasarkan konsultasi klien.
2. Validasi: Sistem memastikan tanggal tersedia.
3. Pembayaran: Admin mencatat pembayaran DP; status event berubah menjadi "Confirmed".
4. Penugasan: Admin men-generate Work Order (PDF) atau membagikan Link Detail kepada Pengurus Lapangan.

* Penyimpanan data menggunakan database relasional untuk menjaga integritas jadwal (mencegah duplikasi data tanggal).