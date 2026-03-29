# Database Module

Folder ini didedikasikan sepenuhnya untuk mengelola segala keperluan arsitektur database, skema (schema), migrasi, dan *seeding* data awal. 

Karena *Dream Syariah Wedding* menggunakan **PostgreSQL (via Supabase)** sebagai *Single Source of Truth*, di sinilah kita nantinya meletakkan:
- Script `schema.sql` untuk deklarasi struktur tabel secara raw.
- Script *Seed* (Data contoh/palsu untuk testing).
- `docker-compose.yml` (Jika sewaktu-waktu kita ingin *testing* database lokal tanpa internet).

Dengan folder ini *terpisah* dari backend, kita bisa mengelola versi tabel secara lebih rapi tanpa mengotori kode API!
