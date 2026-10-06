const { Pembayaran, Penghuni, Kamar } = require('../models');

const getAllPembayaran = async (req, res) => {
  try {
    const list = await Pembayaran.findAll({
      include: [
        {
          model: Penghuni,
          as: 'penghuni',
          include: [{ model: Kamar, as: 'kamar', attributes: ['nomor_kamar'] }],
        },
      ],
      order: [['id', 'DESC']],
    });
    return res.json(list);
  } catch (error) {
    console.error('Error fetching pembayaran:', error);
    return res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: error.message });
  }
};

const createPembayaran = async (req, res) => {
  try {
    const { penghuni_id, bulan, tanggal_bayar, jumlah, status } = req.body;

    if (!penghuni_id) {
      return res.status(400).json({ message: 'Penghuni wajib dipilih!' });
    }
    if (!bulan || !bulan.trim()) {
      return res.status(400).json({ message: 'Bulan wajib diisi!' });
    }
    if (!tanggal_bayar) {
      return res.status(400).json({ message: 'Tanggal bayar wajib diisi!' });
    }
    if (jumlah === undefined || jumlah === null || jumlah === '') {
      return res.status(400).json({ message: 'Jumlah pembayaran wajib diisi!' });
    }
    if (isNaN(jumlah)) {
      return res.status(400).json({ message: 'Jumlah pembayaran harus berupa angka!' });
    }

    const penghuni = await Penghuni.findByPk(penghuni_id);
    if (!penghuni) {
      return res.status(404).json({ message: 'Penghuni tidak ditemukan!' });
    }

    const newPembayaran = await Pembayaran.create({
      penghuni_id,
      bulan: bulan.trim(),
      tanggal_bayar,
      jumlah: parseInt(jumlah, 10),
      status: status || 'Belum Lunas',
    });

    const result = await Pembayaran.findByPk(newPembayaran.id, {
      include: [
        {
          model: Penghuni,
          as: 'penghuni',
          include: [{ model: Kamar, as: 'kamar', attributes: ['nomor_kamar'] }],
        },
      ],
    });

    return res.status(201).json({ message: 'Pembayaran berhasil ditambahkan', data: result });
  } catch (error) {
    console.error('Error creating pembayaran:', error);
    return res.status(500).json({ message: 'Gagal menambah pembayaran', error: error.message });
  }
};

const updatePembayaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { penghuni_id, bulan, tanggal_bayar, jumlah, status } = req.body;

    const pembayaran = await Pembayaran.findByPk(id);
    if (!pembayaran) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    if (!penghuni_id) {
      return res.status(400).json({ message: 'Penghuni wajib dipilih!' });
    }
    if (!bulan || !bulan.trim()) {
      return res.status(400).json({ message: 'Bulan wajib diisi!' });
    }
    if (!tanggal_bayar) {
      return res.status(400).json({ message: 'Tanggal bayar wajib diisi!' });
    }
    if (jumlah === undefined || jumlah === null || jumlah === '') {
      return res.status(400).json({ message: 'Jumlah pembayaran wajib diisi!' });
    }
    if (isNaN(jumlah)) {
      return res.status(400).json({ message: 'Jumlah pembayaran harus berupa angka!' });
    }

    await pembayaran.update({
      penghuni_id,
      bulan: bulan.trim(),
      tanggal_bayar,
      jumlah: parseInt(jumlah, 10),
      status: status || pembayaran.status,
    });

    const result = await Pembayaran.findByPk(id, {
      include: [
        {
          model: Penghuni,
          as: 'penghuni',
          include: [{ model: Kamar, as: 'kamar', attributes: ['nomor_kamar'] }],
        },
      ],
    });

    return res.json({ message: 'Data pembayaran berhasil diperbarui', data: result });
  } catch (error) {
    console.error('Error updating pembayaran:', error);
    return res.status(500).json({ message: 'Gagal mengubah data pembayaran', error: error.message });
  }
};

const deletePembayaran = async (req, res) => {
  try {
    const { id } = req.params;
    const pembayaran = await Pembayaran.findByPk(id);
    if (!pembayaran) {
      return res.status(404).json({ message: 'Pembayaran tidak ditemukan' });
    }

    await pembayaran.destroy();
    return res.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting pembayaran:', error);
    return res.status(500).json({ message: 'Gagal menghapus pembayaran', error: error.message });
  }
};

module.exports = {
  getAllPembayaran,
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
};
