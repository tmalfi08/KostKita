const app = require('./app');
const { sequelize } = require('./models');
const seedData = require('./seeders/seed');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 1. Connect and synchronize models
    await sequelize.authenticate();
    console.log('[Sequelize] Koneksi ke Database berhasil terhubung.');

    await sequelize.sync({ alter: false });
    console.log('[Sequelize] Semua tabel (users, kamar, penghuni, pembayaran) tersinkronisasi.');

    // 2. Seed default data if empty
    await seedData();

    // 3. Start HTTP Server
    const server = app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(`🚀 Server KostKita Backend Berjalan!`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`===========================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} sudah digunakan oleh proses lain. Harap matikan proses pada port ${PORT}.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
      }
    });

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat menyalakan server backend:', error.message);
  }
}

startServer();
