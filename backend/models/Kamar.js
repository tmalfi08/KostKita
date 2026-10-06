const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Kamar = sequelize.define('Kamar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nomor_kamar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lantai: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  harga_bulanan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Tersedia', 'Terisi'),
    defaultValue: 'Tersedia',
    allowNull: false,
  },
}, {
  tableName: 'kamar',
  timestamps: true,
});

module.exports = Kamar;
