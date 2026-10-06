# KostKita - Sistem Manajemen Kost Berbasis Web (UTS)

**KostKita** adalah aplikasi manajemen kost berbasis web yang sederhana, bersih, dan mudah dipahami. Aplikasi ini dibuat khusus untuk memudahkan pemilik kost dalam mengelola data kamar, data penghuni, data pembayaran, serta memantau ringkasan statistik kost secara real-time.

---

## 1. Struktur Folder Project

```text
KostKita/
├── backend/
│   ├── config/
│   │   └── database.js         # Konfigurasi PostgreSQL & Sequelize
│   ├── controllers/
│   │   ├── authController.js   # Kontroller Login & Verifikasi
│   │   ├── kamarController.js  # CRUD Data Kamar
│   │   ├── penghuniController.js # CRUD Data Penghuni & Auto-Status Kamar
│   │   ├── pembayaranController.js # CRUD Data Pembayaran
│   │   └── dashboardController.js  # API Summary Card & Pembayaran Terbaru
│   ├── middleware/
│   │   └── authMiddleware.js   # Verifikasi Token JWT
│   ├── models/
│   │   ├── index.js            # Definisasi Relasi Antar Tabel
│   │   ├── User.js             # Model Tabel users
│   │   ├── Kamar.js            # Model Tabel kamar
│   │   ├── Penghuni.js         # Model Tabel penghuni
│   │   └── Pembayaran.js       # Model Tabel pembayaran
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── kamarRoutes.js
│   │   ├── penghuniRoutes.js
│   │   ├── pembayaranRoutes.js
│   │   └── dashboardRoutes.js
│   ├── seeders/
│   │   └── seed.js             # Seeder Otomatis User & Sample Data
│   ├── database.sql            # Script SQL untuk PostgreSQL / pgAdmin 4
│   ├── .env                    # Variabel Lingkungan (Port & DB Config)
│   ├── app.js                  # Konfigurasi Express Application
│   ├── server.js               # Entry Point Server Backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.js       # Root Layout Next.js
    │   │   ├── page.js         # Halaman Utama (Redirect Ke Dashboard/Login)
    │   │   ├── login/
    │   │   │   └── page.js     # Halaman Login Admin
    │   │   ├── dashboard/
    │   │   │   └── page.js     # Halaman Dashboard (Card Ringkasan & Tabel)
    │   │   ├── kamar/
    │   │   │   └── page.js     # Halaman Manajemen Kamar
    │   │   ├── penghuni/
    │   │   │   └── page.js     # Halaman Manajemen Penghuni
    │   │   └── pembayaran/
    │   │       └── page.js     # Halaman Manajemen Pembayaran
    │   ├── components/
    │   │   ├── Sidebar.js      # Component Navigation Sidebar
    │   │   ├── Navbar.js       # Component Topbar Header
    │   │   └── Modal.js        # Component Popup Form Modal (Tambah/Edit)
    │   └── utils/
    │       └── api.js          # Instance Axios (http://localhost:5000/api)
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── next.config.js
    └── package.json
```

---

## 2. Struktur Database PostgreSQL

Database yang digunakan bernama `kostkita` dengan 4 buah tabel berikut:

### 1. `users`
* `id` (SERIAL PRIMARY KEY)
* `username` (VARCHAR(255), UNIQUE, NOT NULL)
* `password` (VARCHAR(255), NOT NULL - Bcrypt Hashed)
* `createdAt`, `updatedAt`

### 2. `kamar`
* `id` (SERIAL PRIMARY KEY)
* `nomor_kamar` (VARCHAR(255), NOT NULL)
* `lantai` (INT, NOT NULL)
* `harga_bulanan` (INT, NOT NULL)
* `status` (VARCHAR(50), Default: 'Tersedia')
* `createdAt`, `updatedAt`

### 3. `penghuni`
* `id` (SERIAL PRIMARY KEY)
* `nama` (VARCHAR(255), NOT NULL)
* `no_hp` (VARCHAR(255), NOT NULL)
* `alamat` (TEXT, Nullable)
* `kamar_id` (INT, Foreign Key -> `kamar.id`)
* `tanggal_masuk` (DATE, NOT NULL)
* `createdAt`, `updatedAt`

### 4. `pembayaran`
* `id` (SERIAL PRIMARY KEY)
* `penghuni_id` (INT, Foreign Key -> `penghuni.id`)
* `bulan` (VARCHAR(255), NOT NULL)
* `tanggal_bayar` (DATE, NOT NULL)
* `jumlah` (INT, NOT NULL)
* `status` (VARCHAR(50), Default: 'Belum Lunas')
* `createdAt`, `updatedAt`

---

## 3. Cara Menjalankan Project

### Cara 1: Menggunakan PostgreSQL (Default)
1. Pastikan service **PostgreSQL** aktif di `localhost:5432` (Username default: `postgres`, Password default: `postgres`).
2. Jalankan Backend:
   ```bash
   npm run dev:backend
   ```
   *(Backend Express.js akan otomatis membuatkan database `kostkita` & tabel-tabelnya)*.
3. Jalankan Frontend (di terminal kedua):
   ```bash
   npm run dev:frontend
   ```

---

### Cara 2: Pengujian Tanpa Instalasi PostgreSQL (Auto SQLite Fallback)
Jika service PostgreSQL sedang tidak di-start, backend **secara otomatis berpindah ke SQLite** (`database.sqlite`) sehingga Anda bisa langsung menjalankan aplikasi dan mendemokannya tanpa harus install/start database terlebih dahulu!

---

## 4. Akses Aplikasi & Akun Login Default
* **URL App**: `http://localhost:3000`
* **Username**: `admin`
* **Password**: `admin123`
