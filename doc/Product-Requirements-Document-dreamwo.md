# Product Requirements Document - Dream-WO

**Author:** BRIEL
**Date:** 2026-03-16 14:07

## Executive Summary

Dream-WO dirancang sebagai **Web App** internal yang merevolusi operasional Wedding Organizer (WO) melalui otomatisasi dokumen ujung-ke-ujung. Fokus utamanya adalah memigrasikan proses administrasi yang saat ini masih manual dan terfragmentasi (Excel/Word/Kertas) ke dalam satu sistem terpusat yang berfungsi sebagai *Single Source of Truth*.

Target pengguna utama adalah **Admin WO** yang membutuhkan efisiensi tinggi dalam mengelola data klien dan dokumen penagihan. Aplikasi ini memecahkan masalah redundansi data dan risiko kesalahan input, memungkinkan transisi instan dari fase konsultasi klien ke fase eksekusi dokumen operasional.

### What Makes This Special

Keunggulan utama Dream-WO terletak pada mesin otomatisasi **"One-Click"** yang terintegrasi secara hulu ke hilir. Berbeda dengan solusi umum yang kaku, sistem ini menggunakan **Dynamic Client Needs Form** yang secara otomatis melakukan pemetaan data untuk menghasilkan dua dokumen kritis secara instan: **Professional Invoice** untuk klien dan **Technical Specs Checklist** untuk tim lapangan. 

Insight intinya adalah dengan memangkas waktu operasional administratif dari skala harian menjadi hitungan menit, WO tidak hanya meningkatkan produktivitas internal tetapi juga secara dramatis meningkatkan daya saing melalui waktu respon yang lebih cepat kepada calon klien (*faster closing*).

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

## Product Scope & Vision

### Phase 1: MVP (Minimum Viable Product)
Fokus pada penyediaan kapabilitas dasar yang memberikan nilai instan bagi tim WO:
- **Secure Admin Login**: Autentikasi dasar untuk akses internal dan manajemen user.
- **Dynamic Client Needs Form**: Formulir input detail acara, paket, dan item tambahan yang fleksibel.
- **Internal Data Persistence**: Penyimpanan data ke database pusat sebagai *Single Source of Truth*.
- **Automated Document Engine**: Pembuatan PDF Invoice dan Spesifikasi Teknis secara instan dengan satu klik.

### Phase 2: Growth (Post-MVP)
- **Data Management (Edit/Delete)**: Kemampuan mengoreksi dan menghapus record data klien yang sudah tersimpan.
- **Financial Reporting Dashboard**: Ringkasan keuangan sederhana dan dashboard performa bulanan.
- **Client Portal (View Only)**: Akses terbatas bagi klien untuk meninjau status invoice mereka secara mandiri.

### Phase 3: Expansion (Future Vision)
- **Digital Payment Integration**: Integrasi dengan payment gateway untuk memproses pembayaran DP/Pelunasan.
- **Inventory Management**: Pelacakan stok aset/barang dekorasi secara real-time.
- **AI Asset Suggestion**: Rekomendasi paket atau item tambahan berdasarkan preferensi dan budget klien.

## User Journeys

### 1. Sarah - Sang Dirigen (Admin WO)
**Konteks**: Sarah sedang menangani 5 klien pernikahan sekaligus minggu depan. Dia baru saja selesai konsultasi dengan seorang klien baru.
- **Opening**: Sarah membuka dashboard Dream-WO, login dengan aman, dan memilih "Buat Baru".
- **Action**: Dia mengisi formulir dinamis: detail pengantin, tanggal acara, pilihan Paket Mewah, dan 10 item tambahan (lighting extra, kursi Tiffany, dll).
- **Climax**: Sarah menekan "Save". Dalam hitungan detik, layar menampilkan notifikasi sukses dan tombol "Download Dokumen".
- **Resolution**: Sarah mendownload PDF Invoice dan Spesifikasi Teknis. Dia langsung mengirimkan invoice ke klien via WhatsApp. Waktu yang dia habiskan hanya 5 menit, bukan 4 jam seperti biasanya. Sarah merasa rileks dan siap untuk klien berikutnya.

### 2. Budi - Sang Eksekutor (Tim Lapangan)
**Konteks**: Hari Jumat sore, persiapan untuk acara pernikahan besar besok pagi di sebuah gedung.
- **Opening**: Budi menerima dokumen fisik/digital dari Sarah berjudul "Spesifikasi Teknis - Pernikahan Maya & Andi".
- **Action**: Budi membaca checklist yang terstandarisasi. Tidak ada lagi tulisan tangan yang sulit dibaca. Semua item (kursi, dekor, audio) terdaftar dengan rapi beserta jumlahnya.
- **Climax**: Di gudang, Budi mencentang item satu per satu. Dia merasa sangat yakin karena datanya berasal langsung dari input Sarah (Single Source of Truth).
- **Resolution**: Saat acara eksekusi di gedung, Budi tidak menerima komplain barang kurang. Tim lapangan bekerja dengan efisien dan tanpa miskomunikasi.

### 3. Maya - Sang Pengantin (Klien)
**Konteks**: Maya merasa khawatir tentang bengkaknya biaya pernikahan dan ingin segera melihat rincian harga.
- **Opening**: Maya baru saja pulang dari kantor WO setelah konsultasi sore hari.
- **Action**: Malam harinya, Maya menerima pesan WhatsApp berisi PDF Invoice yang terlihat sangat profesional dengan logo WO dan rincian yang transparan.
- **Climax**: Maya melihat rincian paketnya sangat jelas. Dia merasa tenang karena WO ini bekerja dengan sangat cepat dan profesional.
- **Resolution**: Maya langsung menyetujui invoice tersebut dan melakukan pembayaran DP. Kecepatan Sarah memberikan "trust" lebih bagi Maya.

### Journey Requirements Summary

Berdasarkan narasi di atas, kita membutuhkan kapabilitas berikut:
- **Authentication**: Login aman untuk Sarah sebagai admin internal.
- **Dynamic Form**: Input data yang fleksibel untuk menangkap detail unik tiap acara.
- **PDF Engine**: Kemampuan mengubah data form menjadi dua template berbeda (Invoice vs Specs).
- **Dashboard/Storage**: Tempat Sarah melihat daftar klien yang sudah diinput (meskipun di MVP belum bisa edit/delete).

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
Dream-WO akan diimplementasikan sebagai **Multi Page Application (MPA)**. Pendekatan ini dipilih untuk menjaga kesederhanaan arsitektur dan keandalan navigasi antar-halaman yang berbeda (Dashboard, Form Input, Preview Dokumen) tanpa beban kompleksitas manajemen *state* di sisi klien yang berlebihan.

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
- **Secure Authentication**: Sistem login untuk 2 akun admin.
- **Dynamic Form System**: Input data yang fleksibel untuk berbagai kategori item pernikahan.
- **Data Persistence**: Penyimpanan draf dan record klien ke database.

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
- **FR21**: Sistem menyediakan fitur untuk menambahkan (add) akun admin baru.
- **FR22**: Sistem menyediakan fitur untuk mengubah (edit) data akun admin yang sudah ada.

### Client & Event Management
- **FR4**: Admin dapat membuat record klien baru (Nama, Kontak, dll).
- **FR5**: Admin dapat menginput detail acara (Tanggal, Lokasi, Tema).
- **FR6**: Admin dapat memilih paket pernikahan dari daftar yang tersedia.
- **FR7**: Admin dapat menambah item tambahan secara dinamis ke kebutuhan klien.
- **FR8**: Sistem menyimpan seluruh data klien dan acara ke database pusat secara permanen (Persistence).

### Automated Document Engine
- **FR9**: Sistem dapat menghasilkan file PDF **Invoice** otomatis berdasarkan data yang diinput.
- **FR10**: Sistem dapat menghasilkan file PDF **Spesifikasi Teknis** (Checklist Lapangan) secara otomatis.
- **FR11**: Dokumen PDF harus menyertakan branding (Logo & Nama WO) secara otomatis.
- **FR12**: Invoice mencakup rincian item, total biaya, dan instruksi pembayaran.
- **FR13**: Spesifikasi Teknis mencakup checklist item operasional dan logistik acara.

### Dashboard & UI Experience (Premium)
- **FR14**: Admin dapat melihat daftar seluruh record klien yang sudah tersimpan di Dashboard.
- **FR15**: Admin dapat bernavigasi antar-halaman (Dashboard, Input Form, Preview) dengan menu yang jelas (MPA).
- **FR16**: Antarmuka memberikan estetika desain premium dan modern di seluruh halaman.
- **FR17**: Sistem memberikan notifikasi status proses (misal: "PDF sedang dibuat...").

### Validation & Risk Mitigation
- **FR18**: Sistem memvalidasi kolom wajib (seperti Tanggal Acara) agar tidak kosong saat disimpan.
- **FR19**: Admin dapat melihat ringkasan/preview data sebelum melakukan penyimpanan final.
- **FR20**: Sistem memberikan pesan error yang informatif jika input tidak valid (misal: format tanggal salah).

## Non-Functional Requirements

### Performance
- **Document Generation**: Proses pembuatan PDF (Invoice & Spesifikasi Teknis) harus selesai dalam waktu **maksimal 3 detik** setelah dipicu.
- **Page Load Time**: Halaman dashboard dan formulir input harus dimuat dalam waktu **di bawah 1 detik** pada koneksi internet standar.

### Security
- **OWASP Compliance**: Pengembangan aplikasi mengikuti panduan **OWASP Top 10** untuk mencegah celah keamanan umum (seperti SQL Injection, XSS, dan Broken Authentication).
- **Data Encryption**: Seluruh data sensitif klien dan kata sandi admin harus dienkripsi saat disimpan di database (Encryption at Rest).
- **Session Management**: Sesi login admin akan berakhir secara otomatis (timeout) setelah periode tidak aktif untuk menjaga keamanan akses.

### Reliability & Availability
- **Uptime Target**: Target ketersediaan sistem adalah **99.5%** pada jam operasional bisnis (08:00 - 20:00).
- **Manual Failover**: Karena sistem memungkinkan operasional manual jika terjadi *downtime*, prosedur ekspor data cadangan mingguan akan disediakan untuk admin.
- **Daily Backups**: Backup database otomatis dilakukan setiap 24 jam untuk meminimalkan risiko kehilangan data.

### Maintainability
- **Code Standards**: Kode harus terdokumentasi dengan baik agar memudahkan perbaikan bug atau penambahan fitur di Phase 2 (Growth) oleh developer.
