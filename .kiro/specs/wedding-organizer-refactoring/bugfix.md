# Bugfix Requirements Document

## Introduction

Proyek Wedding Organizer (stack-tek-tek) memiliki sejumlah bug kritis yang menyebabkan seluruh fungsionalitas utama tidak dapat digunakan dari UI. Bug-bug ini mencakup: login yang selalu gagal, konflik skema database, endpoint yang dipanggil frontend tidak ada di backend (ghost endpoints), ketidakcocokan field antara frontend dan backend untuk payment dan guest, duplikasi mount route admin yang membuka celah keamanan, file-file tidak terpakai, ketergantungan TypeScript yang tidak relevan di proyek JavaScript, ketiadaan model layer untuk beberapa entitas, dan fallback password plain-text yang berbahaya.

---

## Bug Analysis

### Current Behavior (Defect)

**BUG 1 — Login Selalu Gagal (KRITIS)**

1.1 WHEN pengguna mengirim login dari UI dengan field `{ email, password }` ke `POST /api/auth/login` THEN sistem membaca `req.body.username` yang selalu `undefined`, menyebabkan login tidak pernah berhasil dari antarmuka web

**BUG 2 — Konflik Skema Database (KRITIS)**

1.2 WHEN developer mengikuti petunjuk README yang mengarah ke `database/schema.sql` (skema lama) THEN sistem menggunakan tabel `admins` dengan kolom `name, email` dan tabel `events` dengan kolom `groom_name, bride_name, client_id`, yang tidak kompatibel dengan backend code (`adminModel.js`, `bookingController.js`) yang mengharapkan kolom `username, full_name, role` dan `invoice_number, client_name, client_phone`

1.3 WHEN terdapat tiga versi schema (`database/schema.sql`, `doc/Database/database.sql`, dan kode backend) THEN sistem memiliki ambiguitas sumber kebenaran database yang menyebabkan setup environment baru selalu gagal

**BUG 3 — Ghost Endpoints (KRITIS)**

1.4 WHEN halaman `Clients.tsx`, `Events.tsx`, atau `Bookings.tsx` melakukan request ke `GET /api/clients` THEN sistem mengembalikan 404 karena route tersebut tidak terdaftar di backend

1.5 WHEN halaman `Events.tsx` melakukan request ke `GET /api/events` atau operasi CRUD events lainnya THEN sistem mengembalikan 404 karena backend hanya memiliki `POST /api/booking` dan `GET /api/bookings`

1.6 WHEN halaman `Guests.tsx` memuat daftar tamu untuk sebuah event melalui `GET /api/events/:eventId/guests` THEN sistem mengembalikan 404 karena backend mendaftarkan route tersebut di path `/api/guests/event/:eventId`

1.7 WHEN tamu mengakses undangan digital melalui `GET /api/guests/token/:token` THEN sistem mengembalikan 404 karena route tersebut tidak ada di backend

1.8 WHEN tamu mengirim konfirmasi RSVP melalui `PUT /api/guests/token/:token/rsvp` THEN sistem mengembalikan 404 karena route tersebut tidak ada di backend

**BUG 4 — Field Payment Tidak Match (TINGGI)**

1.9 WHEN pengguna membuat atau mengupdate data payment dari UI dengan field `{ booking_id, amount, payment_method, status }` THEN sistem menolak validasi karena backend mengharapkan field `{ event_id, payment_amount, payment_type, payment_date }`

**BUG 5 — Field Guest Tidak Match (TINGGI)**

1.10 WHEN tabel guest dirender di UI THEN sistem menampilkan kolom kosong karena `Guests.tsx` mengharapkan field `name, phone, email, address, status, invitation_token` sedangkan `guestModel.js` mengembalikan `guest_name, guest_phone, invitation_slug, is_attended`

**BUG 6 — adminRoutes Di-mount Dua Kali (TINGGI)**

1.11 WHEN Express server dijalankan THEN sistem me-mount `adminRoutes` pada dua path sekaligus: `/api/admins` dan `/api/auth`, sehingga seluruh route admin termasuk `DELETE /api/admins/:id` juga tersedia di `/api/auth/:id`

**BUG 7 — File Tidak Terpakai (MEDIUM)**

1.12 WHEN kode di-audit THEN sistem memiliki file-file tidak terpakai: `frontend/src/components/ProtectedRoute.tsx` (tidak pernah diimport), `frontend/src/guest/DigitalInvitation.tsx` (tidak ada route yang menggunakannya), `database/schema.sql`, `database/seed_fix.sql`, `database/dummy_data.sql` (untuk skema lama yang salah)

**BUG 8 — TypeScript devDependencies di Backend JavaScript (MEDIUM)**

1.13 WHEN backend JavaScript dijalankan THEN `package.json` backend menyertakan `typescript`, `ts-node-dev`, `@types/*` di devDependencies dan `nodemon` di dependencies (bukan devDependencies), sehingga ukuran instalasi tidak perlu membesar dan konfigurasi package.json tidak akurat

**BUG 9 — Tidak Ada Model Layer untuk Booking/Client/Event (MEDIUM)**

1.14 WHEN `bookingController.js` dijalankan THEN sistem langsung melakukan query ke database tanpa melalui model layer, bertentangan dengan pola MVC yang digunakan oleh controller lain (`guestController`, `paymentsController`, `weddingPackageController`)

**BUG 10 — Fallback Password Plain-text (LOW)**

1.15 WHEN `authController.js` menemukan password di database yang tidak berbentuk bcrypt hash THEN sistem membandingkan password secara plain-text dan jika cocok, langsung mengupdate hash — memungkinkan login dengan password yang tidak dienkripsi tersimpan di database

---

### Expected Behavior (Correct)

**BUG 1 — Login**

2.1 WHEN pengguna mengirim login dari UI dengan field `{ email, password }` ke `POST /api/auth/login` THEN sistem SHALL membaca field yang dikirim frontend (yaitu `email`) sebagai identifier login, atau frontend SHALL mengirim field `username` yang sesuai dengan yang dibaca backend, sehingga login berhasil menghasilkan JWT token

**BUG 2 — Skema Database**

2.2 WHEN developer melakukan setup database baru THEN sistem SHALL menggunakan satu sumber kebenaran tunggal yaitu `doc/Database/database.sql` yang kompatibel dengan seluruh backend code, dan README SHALL mengarahkan ke file yang benar

2.3 WHEN terdapat file skema lama (`database/schema.sql`) THEN sistem SHALL menghapus atau mengganti isi file tersebut agar tidak ada ambiguitas

**BUG 3 — Ghost Endpoints**

2.4 WHEN halaman `Clients.tsx` melakukan request ke `GET /api/clients` THEN sistem SHALL mengembalikan daftar client dari database

2.5 WHEN halaman `Events.tsx` melakukan request ke `GET /api/events` dan operasi CRUD events THEN sistem SHALL mengembalikan data events dan mendukung create, read, update, delete

2.6 WHEN halaman `Guests.tsx` memuat daftar tamu melalui `GET /api/events/:eventId/guests` THEN sistem SHALL mengembalikan daftar tamu untuk event tersebut

2.7 WHEN tamu mengakses undangan digital melalui `GET /api/guests/token/:token` THEN sistem SHALL mengembalikan data tamu dan event terkait berdasarkan token undangan

2.8 WHEN tamu mengirim RSVP melalui `PUT /api/guests/token/:token/rsvp` THEN sistem SHALL menyimpan status kehadiran tamu dan mengembalikan konfirmasi sukses

**BUG 4 — Field Payment**

2.9 WHEN pengguna membuat atau mengupdate payment dari UI THEN sistem SHALL menerima dan memproses field yang sama antara frontend dan backend, sehingga operasi create/update payment berhasil

**BUG 5 — Field Guest**

2.10 WHEN tabel guest dirender di UI THEN sistem SHALL menampilkan data yang terisi dengan benar karena nama field antara frontend interface dan backend model response telah diselaraskan

**BUG 6 — Duplikasi Route Mount**

2.11 WHEN Express server dijalankan THEN sistem SHALL hanya me-mount `adminRoutes` pada path `/api/admins` dan route autentikasi (login, me) SHALL tersedia di `/api/auth` sebagai path terpisah atau subset yang terbatas

**BUG 7 — File Tidak Terpakai**

2.12 WHEN kode di-audit THEN sistem SHALL tidak memiliki file-file dead code yang dapat membingungkan developer, dan semua file di repository SHALL memiliki tujuan yang jelas

**BUG 8 — Package.json Backend**

2.13 WHEN backend JavaScript dijalankan THEN `package.json` SHALL hanya memiliki dependensi yang relevan untuk runtime JavaScript: TypeScript dan type definitions SHALL dihapus dari devDependencies, dan `nodemon` SHALL dipindahkan ke devDependencies

**BUG 9 — Model Layer**

2.14 WHEN `bookingController.js` berinteraksi dengan database THEN sistem SHALL menggunakan model layer (`bookingModel.js`, `clientModel.js`, `eventModel.js`) yang konsisten dengan pola MVC yang ada di proyek

**BUG 10 — Security Password**

2.15 WHEN `authController.js` melakukan verifikasi password THEN sistem SHALL selalu menggunakan bcrypt untuk perbandingan password dan SHALL menolak login jika password di database tidak berbentuk bcrypt hash, menghilangkan fallback plain-text comparison

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN pengguna yang sudah login dengan token JWT valid mengakses halaman admin yang terproteksi THEN sistem SHALL CONTINUE TO memvalidasi token dan mengizinkan akses tanpa memerlukan login ulang

3.2 WHEN `GET /api/wedding-packages` dipanggil THEN sistem SHALL CONTINUE TO mengembalikan daftar paket wedding dengan benar

3.3 WHEN `GET /api/payments` dipanggil dengan token valid THEN sistem SHALL CONTINUE TO mengembalikan daftar payment

3.4 WHEN `GET /api/guests` dipanggil dengan token valid dan role admin THEN sistem SHALL CONTINUE TO mengembalikan daftar semua tamu

3.5 WHEN `GET /api/guests/event/:eventId` dipanggil dengan eventId valid THEN sistem SHALL CONTINUE TO mengembalikan daftar tamu untuk event tersebut (path lama di backend tetap berfungsi)

3.6 WHEN admin dengan role `owner` mengakses endpoint yang dibatasi untuk owner THEN sistem SHALL CONTINUE TO menerapkan otorisasi berbasis role dengan benar

3.7 WHEN `GET /api/status` dipanggil THEN sistem SHALL CONTINUE TO mengembalikan status backend dan koneksi database

3.8 WHEN tamu membuka halaman landing (`/`) THEN sistem SHALL CONTINUE TO menampilkan halaman landing wedding organizer tanpa perlu login

3.9 WHEN `POST /api/booking` dipanggil dengan payload valid dan token admin THEN sistem SHALL CONTINUE TO membuat booking baru di database

3.10 WHEN pengguna logout THEN sistem SHALL CONTINUE TO menghapus token dari localStorage dan mengarahkan ke halaman login

---

## Bug Condition Pseudocode

### BUG 1 — Login Field Mismatch

```pascal
FUNCTION isBugCondition_Bug1(request)
  INPUT: request berisi body { email, password }
  OUTPUT: boolean

  RETURN request.body.email IS NOT UNDEFINED
         AND request.body.username IS UNDEFINED
END FUNCTION

// Property: Fix Checking
FOR ALL request WHERE isBugCondition_Bug1(request) DO
  result ← authController.login'(request)
  ASSERT result.status = 200
         AND result.body.token IS NOT EMPTY
END FOR

// Property: Preservation Checking
FOR ALL request WHERE NOT isBugCondition_Bug1(request) DO
  ASSERT authController.login(request) = authController.login'(request)
END FOR
```

### BUG 3 — Ghost Endpoints

```pascal
FUNCTION isBugCondition_Bug3(request)
  INPUT: request berisi path
  OUTPUT: boolean

  RETURN request.path IN [
    'GET /api/clients',
    'GET /api/events',
    'POST /api/events',
    'PUT /api/events/:id',
    'DELETE /api/events/:id',
    'GET /api/events/:eventId/guests',
    'GET /api/guests/token/:token',
    'PUT /api/guests/token/:token/rsvp'
  ]
END FUNCTION

// Property: Fix Checking
FOR ALL request WHERE isBugCondition_Bug3(request) DO
  result ← expressApp'(request)
  ASSERT result.status != 404
END FOR
```

### BUG 4 — Payment Field Mismatch

```pascal
FUNCTION isBugCondition_Bug4(request)
  INPUT: request POST /api/payments dengan body
  OUTPUT: boolean

  RETURN request.body.booking_id IS NOT UNDEFINED
         AND request.body.event_id IS UNDEFINED
         AND request.body.amount IS NOT UNDEFINED
         AND request.body.payment_amount IS UNDEFINED
END FUNCTION

// Property: Fix Checking
FOR ALL request WHERE isBugCondition_Bug4(request) DO
  result ← paymentValidator.validateCreatePayment'(request)
  ASSERT result.status != 400
END FOR
```

### BUG 6 — Double Route Mount

```pascal
FUNCTION isBugCondition_Bug6(request)
  INPUT: request ke path /api/auth/*
  OUTPUT: boolean

  RETURN request.path MATCHES '/api/auth/(GET|POST|PUT|DELETE)/:id'
         AND request.path NOT IN ['/api/auth/login', '/api/auth/me']
END FUNCTION

// Property: Fix Checking
FOR ALL request WHERE isBugCondition_Bug6(request) DO
  result ← expressApp'(request)
  ASSERT result.status = 404
END FOR

// Property: Preservation Checking
FOR ALL request WHERE NOT isBugCondition_Bug6(request)
                  AND request.path STARTS WITH '/api/admins' DO
  ASSERT expressApp(request) = expressApp'(request)
END FOR
```
