# Diagram Interface Lengkap - Dream Syariah Wedding Organizer

## 1. Information Architecture (Sitemap)

```mermaid
flowchart TD
    A[App Shell] --> B[Login]
    A --> C[Dashboard]

    C --> D[Manajemen Booking]
    C --> E[Kalender Konflik]
    C --> F[Manajemen Paket]
    C --> G[Manajemen Payment]
    C --> H[Guest Management]
    C --> I[Dokumen dan Handover]
    C --> J[Admin Management]

    D --> D1[Form Booking]
    D --> D2[Daftar Event]
    D --> D3[Detail Event]

    E --> E1[Kalender Bulanan]
    E --> E2[Detail Bentrok]

    F --> F1[Daftar Paket]
    F --> F2[Tambah Paket]
    F --> F3[Edit Paket]

    G --> G1[Daftar Payment]
    G --> G2[Tambah Payment]
    G --> G3[Update Status Payment]

    H --> H1[Daftar Tamu per Event]
    H --> H2[Tambah Tamu]
    H --> H3[Generate Invitation Link]

    I --> I1[Preview Invoice]
    I --> I2[Preview Spesifikasi Lapangan]
    I --> I3[One Click Handover]

    J --> J1[Daftar Admin]
    J --> J2[Tambah Admin]
```

## 2. User Flow Antarmuka Admin (End to End)

```mermaid
flowchart LR
    A[Login Screen] --> B[Dashboard]
    B --> C[Booking Form]
    C --> D{Tanggal Bentrok?}
    D -->|Ya| E[Modal Warning Merah]
    D -->|Tidak| F[Booking Berhasil]
    F --> G[Detail Event Screen]
    G --> H[Payment Tab]
    H --> I[Tambah Payment]
    I --> J{Status Confirmed?}
    J -->|Tidak| K[Badge Pending atau Rejected]
    J -->|Ya| L[Badge Confirmed]
    G --> M[Guest Tab]
    M --> N[Tambah Daftar Tamu]
    N --> O[Generate Link Undangan]
    O --> P[Preview Undangan]
    P --> Q[Kirim ke Klien atau Tamu]
```

## 3. Screen Map dan Navigasi Sidebar

```mermaid
flowchart TD
    S[Sidebar Navigation] --> S1[Dashboard]
    S --> S2[Booking]
    S --> S3[Kalender]
    S --> S4[Paket]
    S --> S5[Payment]
    S --> S6[Guest]
    S --> S7[Dokumen]
    S --> S8[Admin]

    S2 --> V1[Table Event + Filter]
    S2 --> V2[Create or Edit Event Drawer]

    S3 --> V3[Calendar Heatmap]
    S3 --> V4[Conflict Detail Panel]

    S5 --> V5[Payment Data Grid]
    S5 --> V6[Payment Form Modal]

    S6 --> V7[Guest Data Grid]
    S6 --> V8[Invitation Link Panel]

    S7 --> V9[Preview Invoice]
    S7 --> V10[Preview Work Order]
```

## 4. Wireframe Konseptual - Dashboard Desktop

```mermaid
flowchart TB
    subgraph PAGE[Dashboard Desktop - Split View]
        A[Topbar: Search | Profile | Quick Actions]
        B[Sidebar: Menu Utama]
        C[Main Left: Form Input Booking atau Payment]
        D[Main Right: Live Preview Invoice atau Summary Event]
        E[Bottom Panel: Activity Log dan Notification]
    end

    A --> C
    B --> C
    C --> D
    D --> E
```

## 5. Wireframe Konseptual - Mobile or Tablet

```mermaid
flowchart TB
    subgraph MOBILE[Mobile or Tablet]
        A1[Header: Title + Action]
        A2[Segmented Tabs: Event | Payment | Guest]
        A3[Content Card List]
        A4[Primary CTA Bottom Button]
        A5[Bottom Navigation]
    end

    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
```

## 6. Component Hierarchy Interface

```mermaid
flowchart TD
    APP[App Layout]
    APP --> NAV[Sidebar and Topbar]
    APP --> VIEW[Page View]

    VIEW --> CARD[Info Cards]
    VIEW --> TABLE[Data Grid]
    VIEW --> FORM[Dynamic Form]
    VIEW --> MODAL[Modal Dialog]
    VIEW --> PREVIEW[Document Preview Panel]

    FORM --> FIELD1[Input Text]
    FORM --> FIELD2[Date Picker]
    FORM --> FIELD3[Select Package]
    FORM --> FIELD4[Status Badge Selector]

    TABLE --> ACTIONS[Row Actions: Edit Delete View]
    TABLE --> FILTER[Filter and Search]

    PREVIEW --> PDF1[Invoice Preview]
    PREVIEW --> PDF2[Work Order Preview]
```

## 7. UI State Diagram - Booking Screen

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> typing
    typing --> validatingDate
    validatingDate --> conflict: tanggal bentrok
    validatingDate --> valid: tanggal tersedia
    conflict --> typing
    valid --> submitting
    submitting --> success
    submitting --> error
    success --> [*]
    error --> typing
```

## 8. UI State Diagram - Payment Screen

```mermaid
stateDiagram-v2
    [*] --> listView
    listView --> createForm
    createForm --> validating
    validating --> invalidInput
    validating --> saving
    invalidInput --> createForm
    saving --> saved
    saving --> failed
    saved --> listView
    failed --> createForm
```

## 9. Guest Interface Flow (Input sampai Link)

```mermaid
flowchart TD
    A[Open Guest Module] --> B[Pilih Event]
    B --> C[Input Manual atau Import Data]
    C --> D[Validasi Nama dan Nomor]
    D --> E[Simpan Guest List]
    E --> F[Generate Invitation Slug]
    F --> G[Copy Link]
    G --> H[Share via WhatsApp]
    H --> I[Update Attendance Status]
```

## 10. Design Tokens Interface

- Warna utama:
  - Navy: #0B2545
  - Gold: #B89336
  - White: #FDFDFD
  - Cream Surface: #F8F4E8
- Tipografi:
  - Heading: Lora
  - Body: Inter
- Prinsip visual:
  - Layout berbasis kartu
  - Split view pada desktop
  - Touch target minimum 44px untuk tablet
