# Product Brief: Dream Syariah Wedding

## Executive Summary

Aplikasi ini dirancang sebagai solusi internal terintegrasi untuk Wedding Organizer (WO) guna meningkatkan produktivitas melalui otomatisasi dokumen. Dengan sistem "sekali input", admin dapat mengonversi formulir kebutuhan klien langsung menjadi invoice dan spesifikasi teknis cetak. Fokus utama adalah pada kesederhanaan penggunaan yang memungkinkan sinkronisasi instan antara divisi admin dan tim lapangan, serta mempercepat waktu respon kepada calon klien untuk meningkatkan peluang penutupan transaksi (closing).

---

## Core Vision

### Problem Statement

Admin Wedding Organizer saat ini berjuang dengan pengelolaan data yang tersebar di berbagai platform manual (Excel, Word, kertas). Hal ini menyebabkan kebingungan operasional, risiko kesalahan input data yang tinggi, dan membuang waktu yang signifikan karena harus membuat dokumen yang sama berulang kali secara manual.

### Problem Impact

Keterlambatan dalam pengiriman invoice dan detail pesanan membuat calon klien harus menunggu lama, yang seringkali berakibat pada hilangnya peluang *deal*. Di sisi internal, tim lapangan juga terhambat karena harus menunggu konfirmasi daftar item yang perlu disiapkan, menyebabkan operasional perusahaan melambat secara keseluruhan.

### Why Existing Solutions Fall Short

Solusi umum (seperti CRM generatif atau alat manajemen proyek) seringkali terlalu kaku, sulit disesuaikan dengan alur kerja spesifik industri pernikahan, dan sulit dipahami oleh anggota tim baru. Sementara itu, sistem kustom biasanya hanya dimiliki oleh WO skala besar karena biaya pengembangan yang tinggi, meninggalkan celah bagi WO menengah ke bawah yang masih terjebak di proses manual.

### Proposed Solution

Membangun sistem internal terpusat dengan fitur utama "Form Kebutuhan Klien" yang bersifat dinamis. Sistem ini berfungsi sebagai *Single Source of Truth* di mana data yang diinput satu kali akan otomatis diolah menjadi invoice dan file spesifikasi siap cetak untuk tim operasional.

### Key Differentiators

1. **Otomatisasi Hulu ke Hilir**: Integrasi langsung dari form kebutuhan ke dokumen siap pakai (Invoice & Specs).
2. **Extreme Simplicity**: Antarmuka yang sangat ringkas sehingga mudah dipahami oleh pegawai baru maupun pemangku kepentingan tanpa perlu pelatihan intensif.
3. **Internal Synergy**: Fokus pada sinkronisasi instan antara divisi admin dan tim operasional lapangan melalui satu data yang valid.

---

## Target Users

### Primary Users

**Admin Wedding Organizer (The Orchestrator)**
*   **Profil**: Staf operasional yang bertanggung jawab menangani data klien, dari konsultasi awal hingga eksekusi acara. Mereka sangat sibuk dan sering menangani banyak dokumen secara bersamaan.
*   **Motivasi**: Menyelesaikan pekerjaan administrasi dengan cepat, akurat, dan rapi agar bisa fokus pada pelayanan klien.
*   **Pain Points**: Dokumen yang tersebar (Excel/Word), risiko kesalahan input manual, dan waktu yang terbuang untuk memformat ulang invoice atau list spesifikasi.

### Secondary Users

*   **Tim Lapangan (The Executor)**: Penerima file spesifikasi siap cetak. Mereka membutuhkan instruksi yang jelas, terstandarisasi, dan mudah dibaca untuk meminimalkan miskomunikasi saat eksekusi acara.
*   **Klien/Calon Pengantin (The Customer)**: Penerima invoice. Mereka menghargai profesionalisme dan kecepatan respons WO dalam memberikan rincian biaya dan item yang dipesan.

### User Journey

1.  **Discovery & Access**: Admin membuka aplikasi dan melakukan Login untuk masuk ke dashboard internal yang privat dan aman.
2.  **Initiation**: Admin mengklik tombol "Buat Baru" untuk memulai pendataan klien yang baru saja selesai berkonsultasi.
3.  **Data Entry**: Admin mengisi "Form Kebutuhan Klien" yang dinamis (mengisi detail acara, paket yang dipilih, dan item tambahan).
4.  **Integration & Storage**: Setelah data lengkap, Admin menekan tombol "Save". Sistem secara otomatis menyimpan data ke database pusat.
5.  **Value Creation (The "Aha!" Moment)**: Secara instan, sistem men-generate dua dokumen utama: **Invoice** profesional dan **File Spesifikasi Teknis**.
6.  **Fulfillment**: Admin mencetak (print) dokumen tersebut untuk diserahkan kepada klien (Invoice) dan tim lapangan (Specs), menghemat waktu berjam-jam pengerjaan manual.

---

## Success Metrics

Fokus utama kesuksesan adalah pengurangan waktu kerja administratif secara drastis dan peningkatan akurasi dokumen operasional.

### User Success Metrics (Admin WO)
*   **Time-to-Document**: Pengurangan waktu pembuatan invoice dan file spesifikasi dari rata-rata **1 hari** menjadi **di bawah 5 menit** per klien.
*   **Zero-Draft Accuracy**: Mencapai tingkat akurasi data 100% dari form input ke dokumen cetak tanpa perlu koreksi manual di file eksternal (Excel/Word).
*   **Aha! Moment**: Admin berhasil mencetak PDF Invoice dan Spesifikasi pertama kali dalam sekali klik setelah proses "Save".

### Business Objectives
*   **Operational Efficiency**: Meningkatkan kapasitas Admin dalam menangani jumlah klien per bulan (meningkat 2x-3x lipat) tanpa menambah personel.
*   **Sales Conversion**: Mempercepat waktu respons pengiriman invoice ke klien potensial, yang diharapkan meningkatkan rasio *deal/closing*.
*   **Internal Synergy**: Menghilangkan komplain atau miskomunikasi dari Tim Lapangan terkait data item yang tidak sinkron atau sulit dibaca.

### Key Performance Indicators (KPIs)
1.  **Average Generation Time**: Rata-rata waktu sinkronisasi dari input form hingga siap cetak.
2.  **Document Output Volume**: Jumlah Invoice & File Spesifikasi yang dihasilkan sistem per bulan.
3.  **Error Rate**: Persentase dokumen yang perlu direvisi ulang karena kesalahan input atau sistem.

---

## MVP Scope

### Core Features
*   **Secure Admin Login**: Sistem autentikasi dasar untuk memastikan hanya Admin WO yang sah yang dapat mengakses data internal perusahaan.
*   **Dynamic Client Needs Form**: Formulir input terstruktur untuk menangkap semua detail pesanan klien (data diri, pilihan paket, item tambahan, tanggal acara, dll).
*   **Internal Data Persistence (Save)**: Kemampuan untuk menyimpan data form secara permanen ke database internal sehingga data tidak hilang dan terdokumentasi.
*   **Automated Invoice Engine**: Fitur untuk mengubah data input secara instan menjadi dokumen Invoice profesional berformat PDF yang siap dikirim/cetak.
*   **Automated Technical Specs Engine**: Fitur untuk menghasilkan dokumen spesifikasi teknis operasional (checklist item pesanan) siap cetak untuk tim lapangan.

### Out of Scope for MVP
*   **Data Editing & Deletion**: Kemampuan untuk mengubah atau menghapus data yang sudah disimpan (direncanakan untuk versi berikutnya).
*   **Financial Reporting Dashboard**: Laporan laba rugi atau ringkasan keuangan bulanan.
*   **Digital Payment Integration**: Sistem pembayaran langsung/online melalui aplikasi.
*   **Complex Inventory Management**: Pelacakan stok barang secara *real-time* lintas gudang.

### MVP Success Criteria
Aplikasi dinyatakan sukses di tahap MVP apabila fitur **Otomatisasi Dokumen (Invoice & Spesifikasi)** berfungsi 100% tanpa kegagalan teknis, sehingga Admin WO dapat menghasilkan dokumen siap pakai segera setelah menekan tombol "Save".

### Future Vision
*   **Data Management**: Menambahkan fitur Edit dan Update untuk fleksibilitas jika terjadi perubahan pesanan klien.
*   **Financial & Analytics**: Dashboard laporan untuk membantu pemangku kepentingan dalam analisa bisnis.
*   **End-to-End Digitalization**: Integrasi dengan gerbang pembayaran (payment gateway) dan manajemen stok barang yang lebih canggih.
