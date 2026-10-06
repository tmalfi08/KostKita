const { sequelize } = require('../config/database');
const User = require('./User');
const Kamar = require('./Kamar');
const Penghuni = require('./Penghuni');
const Pembayaran = require('./Pembayaran');

// Relasi Kamar - Penghuni (1 to N, though typically 1 room has 1 active resident)
Kamar.hasMany(Penghuni, { foreignKey: 'kamar_id', as: 'penghuniList' });
Penghuni.belongsTo(Kamar, { foreignKey: 'kamar_id', as: 'kamar' });

// Relasi Penghuni - Pembayaran (1 to N)
Penghuni.hasMany(Pembayaran, { foreignKey: 'penghuni_id', as: 'pembayaranList' });
Pembayaran.belongsTo(Penghuni, { foreignKey: 'penghuni_id', as: 'penghuni' });

module.exports = {
  sequelize,
  User,
  Kamar,
  Penghuni,
  Pembayaran,
};
