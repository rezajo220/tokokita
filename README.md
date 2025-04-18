# Sistem Manajemen Inventaris TokoKita

Sistem API REST untuk bisnis retail TokoKita yang menangani manajemen inventaris dengan metode akuntansi FIFO (First-In, First-Out). Aplikasi ini memungkinkan pelacakan pembelian stok, pemrosesan penjualan dengan perhitungan FIFO, dan pembuatan laporan laba.

## Fitur

- **Manajemen Inventaris**:
  - Mencatat pembelian stok dengan pelacakan batch
  - Melacak harga pembelian berbeda per batch
  - Opsional tanggal kadaluarsa dan nomor batch
  
- **Pemrosesan Penjualan FIFO**:
  - Alokasi stok otomatis berdasarkan prinsip FIFO (barang yang masuk lebih dulu, keluar lebih dulu)
  - Pelacakan detail batch mana yang digunakan untuk setiap penjualan
  - Perhitungan HPP (Harga Pokok Penjualan) yang akurat

- **Pelaporan Laba**:
  - Laporan laba bulanan dengan rincian harian
  - Analisis item terlaris berdasarkan laba
  - Caching laporan untuk performa lebih baik

## Arsitektur Sistem

### Skema Database

Sistem menggunakan PostgreSQL dengan tabel-tabel utama berikut:
- `items`: Informasi produk
- `stock_batches`: Catatan pembelian stok dengan harga beli
- `sales`: Catatan transaksi penjualan
- `sale_items`: Item baris dalam setiap penjualan
- `sales_details`: Pelacakan FIFO batch mana yang digunakan untuk penjualan
- `profit_reports`: Laporan bulanan yang di-cache

### Teknologi

- **Backend**: NestJS (framework Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Dokumentasi API**: Swagger/OpenAPI
- **Validasi**: class-validator

## Memulai

### Prasyarat

- Node.js (v16+)
- PostgreSQL (v16)
- npm atau yarn

### Instalasi

1. Clone repositori:
   ```bash
   git clone https://github.com/rezajo220/tokokita.git
   cd tokokita
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi variabel lingkungan dengan membuat file `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/tokokita?schema=public"
   ```

4. Inisialisasi database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Jalankan aplikasi:
   ```bash
   npm run start:dev
   ```

6. API akan tersedia di `http://localhost:3000` dan dokumentasi Swagger di `http://localhost:3000/api`.

## Endpoint API

### Manajemen Inventaris

- **POST /purchase**
  - Mencatat pembelian stok baru
  - Memerlukan itemId, quantity, dan purchase price (harga beli)

### Penjualan

- **POST /sale**
  - Mencatat transaksi penjualan baru dengan perhitungan FIFO
  - Secara otomatis mengurangi stok dari batch paling lama
  - Mengembalikan informasi biaya dan laba secara rinci

### Pelaporan

- **GET /report?year=2023&month=5**
  - Menghasilkan laporan laba bulanan
  - Termasuk rincian harian dan analisis item teratas

## Pengujian dengan cURL

### Mencatat Pembelian

```bash
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 100,
    "purchasePrice": 15.50,
    "batchNumber": "BATCH-2023-05-001"
  }'
```

### Mencatat Penjualan

```bash
curl -X POST http://localhost:3000/sale \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": 1,
        "quantity": 5,
        "sellingPrice": 25.99
      }
    ],
    "reference": "INV-2023-0001"
  }'
```

### Mendapatkan Laporan Bulanan

```bash
curl -X GET "http://localhost:3000/report?year=2023&month=5"
```

## Aliran Proses FIFO

Proses inventaris FIFO memastikan bahwa stok paling lama terjual lebih dulu:

1. Saat pembelian dicatat, setiap batch dilacak dengan tanggal dan harga pembelian
2. Saat penjualan terjadi:
   - Sistem mencari batch tersedia paling lama dari item tersebut
   - Sistem mengalokasikan stok dari batch tersebut secara kronologis
   - Sistem melacak batch mana yang digunakan untuk setiap item penjualan
   - Sistem menghitung HPP berdasarkan harga pembelian asli dari batch tersebut

Pendekatan ini memastikan penilaian inventaris dan perhitungan laba yang akurat.

## Penanganan Error

Sistem melakukan validasi komprehensif termasuk:
- Tidak ada jumlah atau harga negatif
- Pencegahan penjualan stok lebih dari yang tersedia
- Validasi keberadaan item

## Potensi Optimasi

- Mengelompokkan query database untuk performa lebih baik selama puncak penjualan
- Menerapkan strategi caching lebih canggih untuk laporan
- Menambahkan indeks database untuk bidang yang sering diquery
- Menerapkan soft deletion untuk preservasi data historis
