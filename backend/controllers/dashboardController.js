const { Kamar, Penghuni, Pembayaran } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalKamar = await Kamar.count();
    const kamarTersedia = await Kamar.count({ where: { status: 'Tersedia' } });
    const kamarTerisi = await Kamar.count({ where: { status: 'Terisi' } });
    const totalPenghuni = await Penghuni.count();

    // Calculate total payments status Lunas for the current month or overall total paid
    const now = new Date();
    const currentMonthName = now.toLocaleString('id-ID', { month: 'long' });
    const currentYear = now.getFullYear();

    // Sum of paid amounts (status = 'Lunas')
    const totalLunasSum = await Pembayaran.sum('jumlah', {
      where: { status: 'Lunas' },
    });

    // Recent payments for table display
    const recentPembayaran = await Pembayaran.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Penghuni,
          as: 'penghuni',
          include: [{ model: Kamar, as: 'kamar', attributes: ['nomor_kamar'] }],
        },
      ],
    });

    return res.json({
      total_kamar: totalKamar,
      kamar_tersedia: kamarTersedia,
      kamar_terisi: kamarTerisi,
      total_penghuni: totalPenghuni,
      pembayaran_bulan_ini: totalLunasSum || 0,
      recent_pembayaran: recentPembayaran,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ message: 'Gagal mengambil data dashboard', error: error.message });
  }
};

module.exports = { getDashboardStats };
