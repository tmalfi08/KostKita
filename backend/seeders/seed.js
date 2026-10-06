const bcrypt = require('bcryptjs');
const { User, Kamar, Penghuni, Pembayaran, sequelize } = require('../models');

async function seedData() {
  try {
    console.log('[Seeder] Checking existing data...');

    // Check user count
    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('[Seeder] Created default user: admin / admin123');
    }

    // Check kamar count
    const kamarCount = await Kamar.count();
    if (kamarCount === 0) {
      const kamarData = [
        { nomor_kamar: 'A01', lantai: 1, harga_bulanan: 800000, status: 'Terisi' },
        { nomor_kamar: 'A02', lantai: 1, harga_bulanan: 800000, status: 'Terisi' },
        { nomor_kamar: 'A03', lantai: 1, harga_bulanan: 850000, status: 'Tersedia' },
        { nomor_kamar: 'B01', lantai: 2, harga_bulanan: 900000, status: 'Tersedia' },
        { nomor_kamar: 'B02', lantai: 2, harga_bulanan: 900000, status: 'Tersedia' },
      ];
      const createdKamar = await Kamar.bulkCreate(kamarData);
      console.log('[Seeder] Created 5 sample rooms (A01, A02, A03, B01, B02)');

      // Create sample penghuni
      const penghuni1 = await Penghuni.create({
        nama: 'Alfi',
        no_hp: '081234567890',
        alamat: 'Jl. Merdeka No. 10, Jakarta',
        kamar_id: createdKamar[0].id,
        tanggal_masuk: '2026-01-10',
      });

      const penghuni2 = await Penghuni.create({
        nama: 'Budi',
        no_hp: '089876543210',
        alamat: 'Jl. Sudirman No. 45, Bandung',
        kamar_id: createdKamar[1].id,
        tanggal_masuk: '2026-02-01',
      });

      console.log('[Seeder] Created 2 sample residents (Alfi & Budi)');

      // Create sample pembayaran
      await Pembayaran.bulkCreate([
        {
          penghuni_id: penghuni1.id,
          bulan: 'Oktober',
          tanggal_bayar: '2026-10-01',
          jumlah: 800000,
          status: 'Lunas',
        },
        {
          penghuni_id: penghuni2.id,
          bulan: 'Oktober',
          tanggal_bayar: '2026-10-05',
          jumlah: 800000,
          status: 'Belum Lunas',
        },
      ]);
      console.log('[Seeder] Created 2 sample payments for Oktober');
    }
  } catch (error) {
    console.error('[Seeder] Error seeding initial data:', error);
  }
}

module.exports = seedData;
