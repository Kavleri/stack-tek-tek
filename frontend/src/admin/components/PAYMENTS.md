# 💳 Payments & Invoices Module

## Overview

Modul Payments & Invoices adalah sistem manajemen pembayaran dan cicilan terintegrasi untuk Dream Syariah Wedding Organizer. Modul ini memungkinkan admin untuk:

- 📋 Melacak riwayat pembayaran klien
- 📊 Mengelola rencana cicilan
- 💰 Mencatat pembayaran cicilan
- 🏆 Memantau status pembayaran dan jatuh tempo

## Features

### 1. **Ringkasan Pembayaran (Payment Summary)**
Menampilkan dashboard dengan statistik komprehensif:
- Total rencana cicilan aktif
- Cicilan yang jatuh tempo (overdue)
- Cicilan yang sudah selesai
- Total nilai cicilan dan pembayaran

**Komponen**: `PaymentSummary.tsx`

### 2. **Riwayat Pembayaran (Payment History)**
Menampilkan daftar lengkap semua transaksi pembayaran dengan fitur:
- **Filter & Search**:
  - Cari berdasarkan nama klien, nomor invoice, atau nama mempelai
  - Filter berdasarkan status (Selesai, Pending, Gagal)
  - Filter berdasarkan tipe pembayaran (Pembayaran Penuh, Uang Muka, Cicilan)
  
- **Kolom Data**:
  - Nomor Invoice
  - Nama Klien & Mempelai
  - Tipe Pembayaran
  - Jumlah Pembayaran
  - Tanggal Pembayaran
  - Status

- **Summary Footer**: Total pembayaran, transaksi selesai, dan pending

**Komponen**: `PaymentHistory.tsx`

### 3. **Manajemen Cicilan (Installment Manager)**
Sistem komprehensif untuk mengelola rencana cicilan klien:

#### Fitur Utama:
- **Daftar Rencana Cicilan**:
  - Informasi klien dan mempelai
  - Detail cicilan (jumlah cicilan, per cicilan, total)
  - Progress bar visual
  - Status cicilan (Aktif, Selesai, Jatuh Tempo)

- **Filter & Search**:
  - Cari klien atau mempelai
  - Filter berdasarkan status

- **Detail Cicilan**:
  - Tabel jadwal pembayaran cicilan
  - Nomor cicilan, tanggal jatuh tempo, jumlah, status
  - Riwayat pembayaran per cicilan

- **Catat Pembayaran**:
  - Modal form untuk mencatat pembayaran cicilan
  - Pilih cicilan yang akan dibayar
  - Input jumlah pembayaran
  - Input tanggal pembayaran
  - Catatan pembayaran (opsional)

**Komponen**: `InstallmentManager.tsx`

## Database Schema

### Tabel: `payments`
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_type VARCHAR(50) DEFAULT 'Full Payment', -- Full Payment, Down Payment, Installment
  payment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Completed, Failed
  invoice_number VARCHAR(100) UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
```

### Tabel: `installment_plans`
```sql
CREATE TABLE installment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  total_installments INT NOT NULL, -- Jumlah cicilan
  installment_amount DECIMAL(15, 2) NOT NULL, -- Jumlah per cicilan
  paid_installments INT DEFAULT 0, -- Cicilan yang sudah dibayar
  next_due_date DATE, -- Tanggal jatuh tempo cicilan berikutnya
  status VARCHAR(50) DEFAULT 'Active', -- Active, Completed, Overdue
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
```

### Tabel: `installment_schedules`
```sql
CREATE TABLE installment_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  installment_plan_id INT NOT NULL,
  installment_number INT NOT NULL, -- Nomor cicilan (1, 2, 3, dst)
  due_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  paid_amount DECIMAL(15, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Overdue, Failed
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (installment_plan_id) REFERENCES installment_plans(id) ON DELETE CASCADE
);
```

## API Endpoints

### Installment Plans
```
GET    /api/installments                      - Get semua rencana cicilan
GET    /api/installments/:id                  - Get detail rencana cicilan
GET    /api/installments/booking/:bookingId   - Get cicilan per booking
GET    /api/installments/history/:bookingId   - Get riwayat pembayaran
GET    /api/installments/summary/dashboard    - Get summary untuk dashboard
POST   /api/installments                      - Buat rencana cicilan baru
PUT    /api/installments/:id                  - Update rencana cicilan
POST   /api/installments/:scheduleId/payment  - Catat pembayaran cicilan
DELETE /api/installments/:id                  - Hapus rencana cicilan
```

### Payments
```
GET    /api/payments                    - Get semua pembayaran
GET    /api/payments/:id                - Get detail pembayaran
POST   /api/payments                    - Buat pembayaran baru
PUT    /api/payments/:id                - Update pembayaran
DELETE /api/payments/:id                - Hapus pembayaran
```

## Usage

### Membuat Rencana Cicilan Baru

```javascript
const response = await fetch('/api/installments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    booking_id: 1,
    total_installments: 3,        // 3 cicilan
    installment_amount: 5000000,   // Rp 5.000.000 per cicilan
    first_due_date: '2024-07-01',
    notes: 'Cicilan untuk paket Silver',
  }),
});
```

**Response**:
```json
{
  "message": "Rencana cicilan berhasil dibuat",
  "data": {
    "plan_id": 1,
    "total_installments": 3,
    "installment_amount": 5000000,
    "schedules": [
      { "id": 1, "installment_number": 1, "due_date": "2024-07-01", "amount": 5000000 },
      { "id": 2, "installment_number": 2, "due_date": "2024-08-01", "amount": 5000000 },
      { "id": 3, "installment_number": 3, "due_date": "2024-09-01", "amount": 5000000 }
    ]
  }
}
```

### Mencatat Pembayaran Cicilan

```javascript
const response = await fetch('/api/installments/1/payment', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 5000000,
    payment_date: '2024-07-01',
    status: 'Paid',
    notes: 'Pembayaran cicilan 1 via transfer bank',
  }),
});
```

## Design System Compliance

Module ini mengikuti design system Dream Syariah Wedding yang telah didefinisikan:

### Typography
- **Headlines**: Noto Serif untuk judul-judul utama
- **Body Text**: Manrope untuk teks fungsional
- **Labels**: Manrope dengan letter-spacing 0.1rem

### Colors
- **Primary**: #000613 (Navy Blue) untuk elemen utama
- **Secondary**: #C5A059 (Gold) untuk aksen
- **Surface**: #f8f9fa (Off-white) untuk background utama
- **Surface Container**: Untuk hierarchy visual

### Components
- **Cards**: Menggunakan surface-container-lowest dengan subtle shadow
- **Buttons**: Primary dengan gradient, Secondary dengan ghost border
- **Tables**: No-line rule, boundaries defined by color shift
- **Input Fields**: Underline only atau ghost border
- **Spacing**: Generous whitespace (80px-120px antar section)

### Icons & Visual Cues
- Status badges dengan warna berbeda
- Progress bars untuk tracking cicilan
- Icon emoji untuk quick visual reference
- Soft shadows untuk elevated elements

## File Structure

```
frontend/src/admin/
├── components/
│   ├── PaymentSummary.tsx        # Dashboard summary
│   ├── PaymentHistory.tsx         # Payment history table
│   ├── InstallmentManager.tsx     # Installment management
│   └── ...
├── Payments.tsx                   # Main page
└── ...

backend/
├── controllers/
│   ├── paymentsController.js
│   └── installmentController.js
├── models/
│   ├── paymentsPackageModels.js
│   └── installmentPlanModel.js
├── routes/
│   ├── paymentRoutes.js
│   └── installmentRoutes.js
└── utils/
    ├── paymentValidator.js
    └── paymentErrorHandler.js
```

## Future Enhancements

1. **Invoice Generation**: Generate PDF invoice untuk setiap pembayaran
2. **Reminder System**: Otomatis mengirim reminder kepada klien sebelum jatuh tempo
3. **Payment Gateway Integration**: Integrasi dengan Midtrans, Stripe, dll
4. **Report & Analytics**: Laporan pembayaran per periode
5. **Email Notification**: Notifikasi email untuk pembayaran dan jatuh tempo
6. **Multiple Installment Plans**: Support berbagai pola cicilan (2x, 3x, 12x, dll)
7. **Partial Payment**: Support pembayaran sebagian dari cicilan
8. **Export to Excel**: Export data pembayaran ke Excel

## Notes

- Semua waktu menggunakan zona waktu lokal Indonesia (Asia/Jakarta)
- Format tanggal: DD MMMM YYYY (e.g., "01 Juli 2024")
- Format mata uang: IDR dengan pemisah ribuan (e.g., "Rp 5.000.000")
- Token authentication diperlukan untuk semua endpoint API
- Hanya admin yang dapat mengakses modul ini
