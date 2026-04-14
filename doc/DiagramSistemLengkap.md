# Diagram Sistem Wedding Organizer

## 1) ERD Lengkap

```mermaid
erDiagram
    ADMINS {
        INT id PK
        VARCHAR username UK
        VARCHAR password
        VARCHAR full_name
        ENUM role "admin|owner"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    WEDDING_PACKAGES {
        INT id PK
        VARCHAR package_name
        DECIMAL price
        TEXT description
        BOOLEAN is_active
        TIMESTAMP created_at
    }

    EVENTS {
        INT id PK
        VARCHAR invoice_number UK
        VARCHAR client_name
        VARCHAR client_phone
        DATE event_date
        TIME event_time
        VARCHAR location_name
        TEXT location_address
        TEXT google_maps_link
        INT package_id FK
        ENUM status "pending|confirmed|completed|cancelled"
        TEXT notes_for_field_staff
        TIMESTAMP created_at
    }

    GUESTS {
        INT id PK
        INT event_id FK
        VARCHAR guest_name
        VARCHAR guest_phone
        VARCHAR invitation_slug UK
        BOOLEAN is_attended
        TIMESTAMP created_at
    }

    PAYMENTS {
        INT id PK
        INT event_id FK
        DECIMAL payment_amount
        DATE payment_date
        ENUM payment_type "booking_fee|down_payment|installment|final_payment"
        VARCHAR payment_method
        TEXT receipt_note
        VARCHAR proof_of_payment
        ENUM status "pending|confirmed|rejected"
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    WEDDING_PACKAGES ||--o{ EVENTS : package_id
    EVENTS ||--o{ GUESTS : event_id
    EVENTS ||--o{ PAYMENTS : event_id
```

## 2) Alur Bisnis End-to-End

```mermaid
flowchart TD
    A[Admin Login] --> B[Input Booking Event]
    B --> C{Tanggal Bentrok?}
    C -->|Ya| D[Tolak Booking]
    C -->|Tidak| E[Buat Event dan Invoice]
    E --> F[Set Status Event = pending]
    F --> G[Catat Payment Booking Fee]
    G --> H{Payment Dikonfirmasi?}
    H -->|Tidak| I[Status Payment = pending atau rejected]
    H -->|Ya| J[Status Payment = confirmed]
    J --> K[Update Status Event = confirmed]
    K --> L[Input Daftar Tamu]
    L --> M[Generate Invitation Slug]
    M --> N[Tracking Kehadiran Tamu]
    N --> O[Tambah Payment Berikutnya]
    O --> P{Pelunasan Selesai?}
    P -->|Tidak| O
    P -->|Ya| Q[Status Event = completed]
```

## 3) Sequence Operasional Admin

```mermaid
sequenceDiagram
    participant Admin
    participant API
    participant DB

    Admin->>API: POST login
    API->>DB: cek admins by username
    DB-->>API: user data
    API-->>Admin: JWT token

    Admin->>API: POST booking event
    API->>DB: cek bentrok event_date
    DB-->>API: hasil cek
    API->>DB: insert events
    DB-->>API: event_id dan invoice
    API-->>Admin: booking sukses

    Admin->>API: POST payment event_id
    API->>DB: insert payments
    DB-->>API: payment tersimpan
    API-->>Admin: payment created

    Admin->>API: POST guest event_id
    API->>DB: insert guests
    DB-->>API: guest tersimpan
    API-->>Admin: guest created
```

## 4) State Diagram Event

```mermaid
stateDiagram-v2
    [*] --> pending
    pending --> confirmed: booking fee confirmed
    confirmed --> completed: semua proses acara selesai
    pending --> cancelled: dibatalkan klien
    confirmed --> cancelled: batal setelah konfirmasi
```

## 5) State Diagram Payment

```mermaid
stateDiagram-v2
    [*] --> pending
    pending --> confirmed: verifikasi admin
    pending --> rejected: invalid atau gagal verifikasi
    rejected --> pending: upload ulang atau perbaikan data
```

## 6) Peta Modul API

```mermaid
flowchart LR
    A[Auth Module] --> A1[Login Admin]
    B[Event Module] --> B1[Create Booking]
    B --> B2[Get Event]
    B --> B3[Update Event]
    C[Payment Module] --> C1[Create Payment]
    C --> C2[Get Payment]
    C --> C3[Update Payment]
    C --> C4[Delete Payment]
    D[Guest Module] --> D1[Create Guest]
    D --> D2[Get Guest by Event]
    D --> D3[Update Guest]
    D --> D4[Delete Guest]
    E[Package Module] --> E1[CRUD Wedding Package]

    A --> B
    B --> C
    B --> D
    E --> B
```
