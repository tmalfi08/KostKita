const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Penghuni = sequelize.define('Penghuni', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  no_hp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  kamar_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'kamar',
      key: 'id',
    },
  },
  tanggal_masuk: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'penghuni',
  timestamps: true,
});

module.exports = Penghuni;
