const { Kamar, Penghuni } = require('../models');

const getAllKamar = async (req, res) => {
  try {
    const kamarList = await Kamar.findAll({
      order: [['id', 'ASC']],
    });
    return res.json(kamarList);
  } catch (error) {
    console.error('Error fetching kamar:', error);
    return res.status(500).json({ message: 'Gagal mengambil data kamar', error: error.message });
  }
};

const createKamar = async (req, res) => {
  try {
    const { nomor_kamar, lantai, harga_bulanan, status } = req.body;

    // Validation
    if (!nomor_kamar || lantai === undefined || lantai === '' || !harga_bulanan) {
      return res.status(400).json({ message: 'Nomor kamar, lantai, dan harga bulanan wajib diisi!' });
    }

    if (isNaN(lantai)) {
      return res.status(400).json({ message: 'Lantai harus berupa angka!' });
    }

    if (isNaN(harga_bulanan)) {
      return res.status(400).json({ message: 'Harga bulanan harus berupa angka!' });
    }

    const newKamar = await Kamar.create({
      nomor_kamar,
      lantai: parseInt(lantai, 10),
      harga_bulanan: parseInt(harga_bulanan, 10),
      status: status || 'Tersedia',
    });

    return res.status(201).json({ message: 'Kamar berhasil ditambahkan', data: newKamar });
  } catch (error) {
    console.error('Error creating kamar:', error);
    return res.status(500).json({ message: 'Gagal menambah kamar', error: error.message });
  }
};

const updateKamar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor_kamar, lantai, harga_bulanan, status } = req.body;

    const kamar = await Kamar.findByPk(id);
    if (!kamar) {
      return res.status(404).json({ message: 'Kamar tidak ditemukan' });
    }

    if (!nomor_kamar || lantai === undefined || lantai === '' || !harga_bulanan) {
      return res.status(400).json({ message: 'Nomor kamar, lantai, dan harga bulanan wajib diisi!' });
    }

    if (isNaN(lantai)) {
      return res.status(400).json({ message: 'Lantai harus berupa angka!' });
    }

    if (isNaN(harga_bulanan)) {
      return res.status(400).json({ message: 'Harga bulanan harus berupa angka!' });
    }

    await kamar.update({
      nomor_kamar,
      lantai: parseInt(lantai, 10),
      harga_bulanan: parseInt(harga_bulanan, 10),
      status: status || kamar.status,
    });

    return res.json({ message: 'Data kamar berhasil diperbarui', data: kamar });
  } catch (error) {
    console.error('Error updating kamar:', error);
    return res.status(500).json({ message: 'Gagal mengubah data kamar', error: error.message });
  }
};

const deleteKamar = async (req, res) => {
  try {
    const { id } = req.params;
    const kamar = await Kamar.findByPk(id);
    if (!kamar) {
      return res.status(404).json({ message: 'Kamar tidak ditemukan' });
    }

    // Check if room has active residents
    const occupied = await Penghuni.findOne({ where: { kamar_id: id } });
    if (occupied) {
      return res.status(400).json({ message: 'Kamar tidak dapat dihapus karena masih ada penghuni!' });
    }

    await kamar.destroy();
    return res.json({ message: 'Kamar berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting kamar:', error);
    return res.status(500).json({ message: 'Gagal menghapus kamar', error: error.message });
  }
};

module.exports = {
  getAllKamar,
  createKamar,
  updateKamar,
  deleteKamar,
};
