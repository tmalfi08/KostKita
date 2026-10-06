const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pembayaran = sequelize.define('Pembayaran', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  penghuni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'penghuni',
      key: 'id',
    },
  },
  bulan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggal_bayar: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  jumlah: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Lunas', 'Belum Lunas'),
    defaultValue: 'Belum Lunas',
    allowNull: false,
  },
}, {
  tableName: 'pembayaran',
  timestamps: true,
});

module.exports = Pembayaran;
