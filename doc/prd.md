# Product Requirements Document - Dream Syariah Wedding 

## Executive Summary

Dream-Syariah-Wedding dirancang sebagai **Web App** internal yang merevolusi operasional Wedding Organizer (WO) melalui manajemen siklus acara yang lengkap dan otomatisasi dokumen ujung-ke-ujung. Fokus utamanya adalah memigrasikan proses administrasi manual (Excel/Word/Kertas) terkait data klien, paket vendor, penjadwalan, hingga daftar tamu ke dalam satu sistem terpusat yang berfungsi sebagai *Single Source of Truth*.

Target pengguna utama adalah **Admin WO** yang membutuhkan efisiensi tinggi dalam mengelola kemitraan vendor, validasi ketersediaan jadwal, manajemen tamu, dan dokumen penagihan. Aplikasi ini mengeliminasi redundansi data dan risiko kesalahan input, memungkinkan transisi instan dari fase perencanaan ke eksekusi operasional yang presisi.

### What Makes This Special

Keunggulan utama Dream-Syariah-Wedding terletak pada integrasi hulu ke hilir yang mencakup manajemen vendor, sistem booking otomatis, dan mesin dokumen **"One-Click"**. Sistem ini menggunakan **Dynamic Client Needs Form** yang terhubung dengan katalog paket vendor untuk menghasilkan dua dokumen kritis secara instan: **Professional Invoice** untuk klien dan **Technical Specs Checklist** untuk tim lapangan, sembari memastikan tidak ada jadwal yang bentrok.

Insight intinya adalah dengan mengintegrasikan manajemen tamu dan undangan digital ke dalam alur kerja administrasi, WO tidak hanya meningkatkan produktivitas internal tetapi juga meningkatkan daya saing melalui layanan modern yang lebih cepat dan bebas kesalahan (*zero conflict booking*).

## Innovation Analysis

### Competitive Differentiation

- **Solusi Generik (CRM/ERP)**: Terlalu kompleks, kaku, dan tidak dirancang untuk alur kerja spesifik WO. Memerlukan pelatihan intensif dan biaya lisensi tinggi.
- **Tools Manual (Excel/Word)**: Bebas, namun menghasilkan redundansi data, tidak ada single source of truth, dan rawan kesalahan copy-paste.
- **Dream-Syariah-Wedding**: Satu-satunya solusi yang secara langsung menjembatani gap antara konsultasi klien dan dokumen operasional melalui otomatisasi hulu-ke-hilir untuk segmen WO menengah ke bawah.

### Innovation Levers

- **"One Input → Two Outputs"**: Satu kali data entry menghasilkan dua dokumen berbeda (Invoice klien + Spesifikasi teknis lapangan), mengeliminasi duplikasi kerja.
- **Kustomisasi Tinggi, Kompleksitas Rendah**: Template dokumen yang adaptif terhadap variasi paket dan item tambahan tanpa memerlukan konfigurasi teknis oleh user.
- **Accessibility for SME**: Biaya kepemilikan nol (internal tool) membuat kapabilitas enterprise-grade dapat diakses oleh WO skala kecil.

## Success Criteria

### User Success

- **Aha! Moment**: Admin berhasil menekan tombol "Save" dan sistem secara instan (< 3 detik) menampilkan pratinjau PDF Invoice dan Spesifikasi Teknis yang siap cetak.
- **Relief Moment**: Tim lapangan menerima checklist spesifikasi teknis yang rapi, terstandarisasi, dan mudah dibaca, sehingga tidak ada lagi miskomunikasi terkait item dekorasi/paket.
- **Goal**: 100% dokumen penagihan dan operasional dalam 3 bulan pertama dihasilkan melalui sistem ini tanpa perlu kembali ke Excel/Word.

### Business Success

- **Productivity Leap**: Peningkatan kapasitas penanganan klien sebesar **2x hingga 3x lipat** per admin karena waktu administrasi berkurang drastis (dari harian menjadi menit).
- **Sales Conversion**: Mempercepat waktu kirim draf invoice ke calon klien potensial, meningkatkan peluang penutupan transaksi (*closing*).
- **Service Quality**: Standardisasi output dokumen meningkatkan citra profesionalisme Wedding Organizer di mata klien.

### Technical Success

- **Performance**: Pembuatan file PDF (Invoice & Specs) dilakukan dalam waktu maksimal **3 detik** setelah data disimpan.
- **Data Integrity**: Akurasi data 100% antara form input dengan data yang tertulis di PDF.
- **Security**: Autentikasi Login yang aman untuk memastikan data internal klien hanya dapat diakses oleh Admin WO yang sah.

### Measurable Outcomes

- **Time-to-Document**: Rata-rata waktu sinkronisasi dari input form hingga siap cetak berkurang dari rata-rata **24 jam** menjadi **di bawah 5 menit**.
- **Error Rate**: Target revisi dokumen operasional karena kesalahan input manual turun hingga **0%**.
- **Booking Accuracy**: Tingkat keberhasilan penjadwalan tanpa konflik data (double booking) mencapai **100%**.
- **Client Engagement**: Target penggunaan undangan digital minimal pada **50%** dari total acara yang dikelola.

## Product Scope & Vision

### Phase 1: MVP (Minimum Viable Product)
Fokus pada penyediaan kapabilitas dasar yang memberikan nilai instan bagi tim WO:
- **Secure Admin Login**: Autentikasi dasar untuk akses internal dan manajemen user.
- **Sistem Manajemen Paket & Vendor (CRUD)**: Kelola katalog paket (Catering, Dekorasi, Dokumentasi) secara dinamis.
- **Booking & Penjadwalan**: Validasi tanggal booking (anti-conflict) dan kalender interaktif untuk manajemen jadwal klien.
- **Dynamic Client Needs Form**: Formulir input detail acara yang terhubung dengan katalog paket vendor.
- **Guest Management & Digital Invitation**: Kelola daftar tamu dan generate link undangan digital sederhana.
- **Payment Status Tracking**: Melacak status pembayaran (DP, Lunas) dan sisa tagihan klien.
- **Automated Document Engine**: Pembuatan PDF Invoice dan Spesifikasi Teknis secara instan dengan satu klik.

### Phase 2: Growth (Post-MVP)
- **Advanced Guest RSVP Tracking**: Pelacakan status kehadiran tamu melalui undangan digital secara real-time.
- **Financial Reporting Dashboard**: Dashboard performa bulanan dengan analisis profitabilitas per paket.
- **Client Portal (Self-Service)**: Akses bagi klien untuk mengubah detail daftar tamu atau melihat status pembayaran secara mandiri.

### Phase 3: Expansion (Future Vision)
- **Digital Payment Integration**: Integrasi dengan payment gateway untuk pemrosesan pembayaran otomatis.
- **Inventory & Asset Control**: Pelacakan stok aset dekorasi yang terintegrasi dengan spesifikasi teknis lapangan.
- **AI Guest Analytics**: Prediksi jumlah kehadiran tamu dan rekomendasi optimasi menu katering berdasarkan data historis.

## User Journeys

### 1. Sarah - Sang Dirigen (Admin WO)
**Konteks**: Sarah sedang menangani 5 klien pernikahan sekaligus minggu depan. Dia baru saja selesai konsultasi dengan seorang klien baru.
- **Opening**: Sarah membuka dashboard Dream-Syariah-Wedding, login dengan aman, dan langsung menuju ke menu "Kalender" untuk memastikan tanggal yang diminta klien tidak bentrok (*zero conflict confirmation*).
- **Action**: Setelah konfirmasi ketersediaan, dia mengisi formulir dinamis: detail pengantin, lokasi, dan memilih item dari katalog paket vendor (Catering, Dekorasi, Dokumentasi) yang sudah tersimpan di sistem.
- **Finalization**: Sarah menekan "Save". Dalam hitungan detik, sistem memicu pembuatan nomor invoice unik, menyimpan data ke database, dan menampilkan tombol "Download Dokumen" serta "Generate Digital Invitation".
- **Resolution**: Sarah mendownload PDF Invoice dan Spesifikasi Teknis, serta mengirimkan link undangan digital ke klien. Sarah merasa rileks karena semua aspek (jadwal, vendor, dokumen) sudah tertangani dalam satu alur kerja yang singkat.

### 2. Budi - Sang Eksekutor (Tim Lapangan)
**Konteks**: Hari Jumat sore, persiapan untuk acara pernikahan besar besok pagi di sebuah gedung.
- **Opening**: Budi menerima dokumen fisik/digital dari Sarah berjudul "Spesifikasi Teknis - Pernikahan Maya & Andi".
- **Action**: Budi membaca checklist yang terstandarisasi. Tidak ada lagi tulisan tangan yang sulit dibaca. Semua item (kursi, dekor, audio) terdaftar dengan rapi beserta jumlahnya.
- **Finalization**: Di gudang, Budi mencentang item satu per satu. Dia merasa sangat yakin karena datanya berasal langsung dari input Sarah (Single Source of Truth).
- **Resolution**: Saat acara eksekusi di gedung, Budi tidak menerima komplain barang kurang. Tim lapangan bekerja dengan efisien dan tanpa miskomunikasi.

### 3. Maya - Sang Pengantin (Klien)
**Konteks**: Maya merasa khawatir tentang bengkaknya biaya pernikahan dan ingin segera melihat rincian harga.
- **Opening**: Maya baru saja pulang dari kantor WO setelah konsultasi sore hari.
- **Action**: Malam harinya, Maya menerima pesan WhatsApp berisi PDF Invoice yang terlihat sangat profesional dengan logo WO dan rincian yang transparan.
- **Finalization**: Maya melihat rincian paketnya sangat jelas. Dia merasa tenang karena WO ini bekerja dengan sangat cepat dan profesional.
- **Resolution**: Maya langsung menyetujui invoice tersebut dan melakukan pembayaran DP. Kecepatan Sarah memberikan "trust" lebih bagi Maya.

### Journey Requirements Summary

Berdasarkan narasi di atas, kita membutuhkan kapabilitas berikut:
- **Authentication**: Login aman untuk admin internal dengan proteksi private route.
- **Vendor Management**: CRUD katalog paket agar admin bisa memilih item secara konsisten.
- **Scheduling Engine**: Validasi tanggal otomatis dan kalender interaktif untuk mencegah double booking.
- **Dynamic Form**: Input detail acara yang terintegrasi dengan data vendor.
- **Guest Engine**: Manajemen daftar tamu dan sistem generator link undangan digital.
- **Payment Tracking**: Sistem pelacakan status bayar (DP/Lunas) dan sisa tagihan di dashboard.
- **PDF Engine**: Konversi data form menjadi template Invoice profesional dan Checklist Lapangan yang terstandarisasi.

## Domain-Specific Requirements

### Compliance & Regulatory
- **Standardisasi Umum**: Mengikuti format invoice umum di Indonesia tanpa kebutuhan NPWP perusahaan atau aturan pajak khusus untuk versi MVP.

### Technical Constraints
- **Security**: Autentikasi dasar (Login) untuk melindungi data pribadi klien (nama, kontak, detail acara).
- **Data Retention**: Data disimpan secara permanen di database internal sesuai kebutuhan operasional Wedding Organizer.

### Integration Requirements
- **PDF Engine**: Mesin pembuat dokumen (PDF generation) yang mendukung template dinamis untuk Invoice dan Checklist Spesifikasi Teknis.

### Risk Mitigations
- **Data Validation**: Validasi input (tanggal, angka harga) untuk meminimalkan kesalahan manusia.
- **Preview Mechanism**: Fitur pratinjau dokumen sebelum penyimpanan final untuk memastikan akurasi konten.


## Web App Specific Requirements

### Project-Type Overview
Dream-Syariah-Wedding akan diimplementasikan sebagai **Multi Page Application (MPA)**. Pendekatan ini dipilih untuk menjaga kesederhanaan arsitektur dan keandalan navigasi antar-halaman yang berbeda (Dashboard, Form Input, Preview Dokumen) tanpa beban kompleksitas manajemen *state* di sisi klien yang berlebihan.

### Technical Architecture Considerations
- **Architecture Style**: Server-side rendering (MPA) untuk memastikan stabilitas akses pada berbagai perangkat internal.
- **Data Flow**: Standar *request-response* tanpa kebutuhan komunikasi *real-time* atau *web sockets*.

### Browser & UI Requirements
- **Browser Matrix**: Mendukung browser modern versi terbaru (Chrome, Edge, Firefox, Safari). Tidak ada kebutuhan dukungan untuk browser *legacy*.
- **Responsive Design**: Tata letak yang responsif untuk memastikan formulir input dan dashboard tetap nyaman digunakan di perangkat desktop maupun tablet.
- **Accessibility Level**: Mengikuti standar *default* browser tanpa persyaratan kepatuhan aksesibilitas khusus (WCAG).

### Implementation Considerations
- **SEO Strategy**: *Internal-only tool*. Optimasi mesin pencari (SEO) bersifat **Out of Scope**.
- **Performance Targets**: Fokus utama pada performa mesin pembuat dokumen (PDF generation) dengan target respons di bawah 3 detik.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** **Problem-Solving & Premium Experience**. Fokus utama adalah menyelesaikan masalah pembuatan dokumen yang melelahkan dengan solusi otomatis satu-klik, sambil memberikan tampilan antarmuka (UI) yang premium dan profesional untuk meningkatkan kepercayaan diri operasional tim WO yang beranggotakan 2 admin.

**Resource Requirements**: Membutuhkan 1 Full-stack developer dengan kemampuan desain UI yang kuat dan keahlian dalam implementasi *PDF generation engine*.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Sarah (Admin) mengisi form kebutuhan klien dan mengunduh PDF instan.
- Budi (Tim Lapangan) menerima spesifikasi teknis yang rapi dan terstandarisasi.
- Maya (Klien) menerima invoice profesional yang mencerminkan kualitas layanan WO.

**Must-Have Capabilities:**
- **Automated Document Engine**: Core fitur pengolah PDF dari data form.
- **Premium UI Dashboard**: Antarmuka dashboard dan form yang bersih, modern, dan intuitif.
- **Secure Authentication**: Sistem login untuk 2 akun admin beserta UI manajemen akun (tambah & edit admin).
- **Dynamic Form System**: Input data yang fleksibel untuk berbagai kategori item pernikahan.
- **Data Persistence**: Penyimpanan draf dan record klien ke database.
- **Admin Account Management**: UI untuk menambah dan mengedit akun admin tanpa perlu akses langsung ke database.

### Post-MVP Features

**Phase 2 (Growth):**
- **Data Management**: Izin untuk mengedit atau menghapus entitas data yang sudah disimpan.
- **Simple Analytics**: Ringkasan jumlah klien dan total nilai invoice per bulan.

**Phase 3 (Vision):**
- **Integrated Payment**: Pembayaran DP/Pelunasan langsung melalui sistem.
- **Inventory Control**: Pengurangan stok item otomatis setiap kali item tersebut masuk ke spesifikasi teknis klien.

### Risk Mitigation Strategy

- **Technical Risks**: Kompleksitas layout PDF yang dinamis. Mitigasi: Penggunaan library PDF berbasis HTML/CSS agar fleksibilitas desain tetap terjaga.
- **Market Risks**: Kurangnya kepercayaan klien terhadap WO baru. Mitigasi: Output invoice yang sangat profesional bertindak sebagai alat pemasaran dan penambah kredibilitas.
- **Resource Risks**: Dengan hanya 2 admin, sistem tidak boleh memiliki waktu henti (downtime). Mitigasi: Infrastruktur hosting yang stabil dan mekanisme *error handling* yang informatif.

## Functional Requirements

### User Authentication & Management
- **FR1**: Admin dapat melakukan login secara aman ke sistem.
- **FR2**: Sistem mendukung hingga 2 akun admin yang berbeda untuk WO Anda.
- **FR3**: Pengguna yang tidak terautentikasi tidak dapat mengakses dashboard atau data internal.
- **FR4**: Sistem menyediakan fitur untuk menambahkan (add) akun admin baru.
- **FR5**: Sistem menyediakan fitur untuk mengubah (edit) data akun admin yang sudah ada.
- **FR6**: Admin dapat melakukan registrasi akun admin baru (Login/Register).
- **FR7**: Admin dapat mengelola profil mereka sendiri (Profile Management).

### Client & Event Management
- **FR8**: Admin dapat membuat record klien baru (Nama, Kontak, dll).
- **FR9**: Admin dapat mengelola record klien (Edit/Delete).
- **FR10**: Admin dapat menginput detail acara (Tanggal, Lokasi, Tema).
- **FR11**: Admin dapat mengelola katalog paket vendor (CRUD Catering, Dekorasi, Dokumentasi).
- **FR12**: Admin dapat memilih paket/item vendor secara dinamis untuk kebutuhan klien.
- **FR13**: Sistem melakukan validasi tanggal acara secara otomatis untuk mencegah bentrok (*anti-double booking*).
- **FR14**: Admin dapat melihat semua jadwal acara melalui kalender interaktif.
- **FR15**: Sistem memberikan notifikasi otomatis terkait jadwal booking.
- **FR16**: Sistem menyimpan seluruh data secara permanen di database pusat (*Persistence*).

### Automated Document & Guest Engine
- **FR17**: Sistem dapat menghasilkan file PDF **Invoice** otomatis berdasarkan data yang diinput.
- **FR18**: Sistem dapat menghasilkan file PDF **Spesifikasi Teknis** (Checklist Lapangan) secara otomatis.
- **FR19**: Dokumen PDF menyertakan branding (Logo & Nama WO) di setiap halaman.
- **FR20**: Invoice mencakup rincian item, status pembayaran (DP/Lunas), dan instruksi pembayaran.
- **FR21**: Admin dapat melacak sisa tagihan klien melalui dashboard.
- **FR22**: Sistem dapat menghasilkan link unik untuk **Undangan Digital** sederhana.
- **FR23**: Admin dapat mengelola daftar tamu (*Guest Management*) untuk setiap acara.

### Dashboard & UI Experience (Premium)
- **FR24**: Admin dapat melihat daftar seluruh record klien dan status proyek di Dashboard utama.
- **FR25**: Admin dapat bernavigasi antar-halaman (Dashboard, Form, Kalender, Paket Vendor) dengan menu yang jelas.
- **FR26**: Antarmuka mengikuti panduan visual yang konsisten dan responsif (Dashboard & Form ramah tablet/mobil).
- **FR27**: Sistem memberikan notifikasi status proses secara real-time.

### Validation & Risk Mitigation
- **FR28**: Sistem memvalidasi kolom wajib (seperti Tanggal Acara) agar tidak kosong saat disimpan.
- **FR29**: Admin dapat melihat ringkasan/preview data sebelum melakukan penyimpanan final.
- **FR30**: Sistem memberikan pesan error yang informatif jika input tidak valid (misal: format tanggal salah).

## Non-Functional Requirements

### Performance
- **Document Generation**: Proses pembuatan PDF (Invoice & Spesifikasi Teknis) harus selesai dalam waktu **maksimal 3 detik** setelah dipicu, diukur dari sisi server.
- **Page Load Time**: Halaman dashboard dan formulir input harus dimuat dalam waktu **di bawah 1 detik** pada koneksi internet dengan bandwidth minimum **10 Mbps**.

### Security
- **OWASP Compliance**: Pengembangan aplikasi mengikuti panduan **OWASP Top 10** (SQL Injection, XSS, Broken Auth).
- **Digital Invitation Security**: Link undangan digital harus menggunakan token unik/obfuscated agar tidak mudah ditebak oleh pihak tidak berwenang.
- **Data Encryption**: Enkripsi data sensitif klien dan kata sandi admin saat disimpan.
- **Session Management**: Timeout otomatis setelah **30 menit** tidak aktif.

### Reliability & Availability
- **Uptime Target**: Target ketersediaan sistem adalah **99.5%** pada jam operasional bisnis (08:00 - 20:00).
- **Manual Failover**: Karena sistem memungkinkan operasional manual jika terjadi *downtime*, prosedur ekspor data cadangan mingguan akan disediakan untuk admin.
- **Daily Backups**: Backup database otomatis dilakukan setiap 24 jam untuk meminimalkan risiko kehilangan data.

### Maintainability
- **Code Standards**: Setiap fungsi/modul kunci harus dilengkapi komentar inline yang menjelaskan tujuan dan parameter-nya; repository harus menyertakan `README.md` dengan instruksi setup environment dan deployment agar developer baru dapat menjalankan aplikasi dalam waktu di bawah 30 menit.
