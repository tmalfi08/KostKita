-- SQL Script for KostKita Database Setup (PostgreSQL)
-- Run this script in pgAdmin 4 or psql if manual setup is needed

-- 1. Create Database
CREATE DATABASE kostkita;

-- Connect to kostkita database
\c kostkita;

-- 2. Create Enum Types (if needed) or Tables directly

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kamar (
    id SERIAL PRIMARY KEY,
    nomor_kamar VARCHAR(255) NOT NULL,
    lantai INT NOT NULL,
    harga_bulanan INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Terisi')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS penghuni (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    no_hp VARCHAR(255) NOT NULL,
    alamat TEXT,
    kamar_id INT REFERENCES kamar(id) ON DELETE SET NULL ON UPDATE CASCADE,
    tanggal_masuk DATE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pembayaran (
    id SERIAL PRIMARY KEY,
    penghuni_id INT NOT NULL REFERENCES penghuni(id) ON DELETE CASCADE ON UPDATE CASCADE,
    bulan VARCHAR(255) NOT NULL,
    tanggal_bayar DATE NOT NULL,
    jumlah INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Belum Lunas' CHECK (status IN ('Lunas', 'Belum Lunas')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Initial Admin User (admin / admin123)
INSERT INTO users (username, password) VALUES
('admin', '$2a$10$w8gZz2E53d2r9rO0h1jM9.YqF/tH8yv8.O/eA4aLg3wz1u3t2e5K6')
ON CONFLICT (username) DO NOTHING;

-- Insert Sample Kamar
INSERT INTO kamar (nomor_kamar, lantai, harga_bulanan, status) VALUES
('A01', 1, 800000, 'Terisi'),
('A02', 1, 800000, 'Terisi'),
('A03', 1, 850000, 'Tersedia'),
('B01', 2, 900000, 'Tersedia'),
('B02', 2, 900000, 'Tersedia');

-- Insert Sample Penghuni
INSERT INTO penghuni (nama, no_hp, alamat, kamar_id, tanggal_masuk) VALUES
('Alfi', '081234567890', 'Jl. Merdeka No. 10, Jakarta', 1, '2026-01-10'),
('Budi', '089876543210', 'Jl. Sudirman No. 45, Bandung', 2, '2026-02-01');

-- Insert Sample Pembayaran
INSERT INTO pembayaran (penghuni_id, bulan, tanggal_bayar, jumlah, status) VALUES
(1, 'Oktober', '2026-10-01', 800000, 'Lunas'),
(2, 'Oktober', '2026-10-05', 800000, 'Belum Lunas');
