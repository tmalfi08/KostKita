const { Penghuni, Kamar } = require('../models');

const getAllPenghuni = async (req, res) => {
  try {
    const list = await Penghuni.findAll({
      include: [{ model: Kamar, as: 'kamar', attributes: ['id', 'nomor_kamar', 'lantai', 'harga_bulanan', 'status'] }],
      order: [['id', 'ASC']],
    });
    return res.json(list);
  } catch (error) {
    console.error('Error fetching penghuni:', error);
    return res.status(500).json({ message: 'Gagal mengambil data penghuni', error: error.message });
  }
};

const createPenghuni = async (req, res) => {
  try {
    const { nama, no_hp, alamat, kamar_id, tanggal_masuk } = req.body;

    // Validations
    if (!nama || !nama.trim()) {
      return res.status(400).json({ message: 'Nama penghuni wajib diisi!' });
    }
    if (!no_hp || !no_hp.trim()) {
      return res.status(400).json({ message: 'Nomor HP wajib diisi!' });
    }
    if (!kamar_id) {
      return res.status(400).json({ message: 'Kamar wajib dipilih!' });
    }
    if (!tanggal_masuk) {
      return res.status(400).json({ message: 'Tanggal masuk wajib diisi!' });
    }

    // Check target room
    const targetKamar = await Kamar.findByPk(kamar_id);
    if (!targetKamar) {
      return res.status(404).json({ message: 'Kamar tidak ditemukan!' });
    }

    if (targetKamar.status === 'Terisi') {
      return res.status(400).json({ message: 'Kamar ini sudah terisi!' });
    }

    // Create Penghuni
    const newPenghuni = await Penghuni.create({
      nama: nama.trim(),
      no_hp: no_hp.trim(),
      alamat: alamat ? alamat.trim() : '',
      kamar_id,
      tanggal_masuk,
    });

    // Update room status to Terisi
    await targetKamar.update({ status: 'Terisi' });

    // Fetch full data with room detail
    const result = await Penghuni.findByPk(newPenghuni.id, {
      include: [{ model: Kamar, as: 'kamar' }],
    });

    return res.status(201).json({ message: 'Penghuni berhasil ditambahkan', data: result });
  } catch (error) {
    console.error('Error creating penghuni:', error);
    return res.status(500).json({ message: 'Gagal menambah penghuni', error: error.message });
  }
};

const updatePenghuni = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, no_hp, alamat, kamar_id, tanggal_masuk } = req.body;

    const penghuni = await Penghuni.findByPk(id);
    if (!penghuni) {
      return res.status(404).json({ message: 'Penghuni tidak ditemukan' });
    }

    // Validations
    if (!nama || !nama.trim()) {
      return res.status(400).json({ message: 'Nama penghuni wajib diisi!' });
    }
    if (!no_hp || !no_hp.trim()) {
      return res.status(400).json({ message: 'Nomor HP wajib diisi!' });
    }
    if (!kamar_id) {
      return res.status(400).json({ message: 'Kamar wajib dipilih!' });
    }
    if (!tanggal_masuk) {
      return res.status(400).json({ message: 'Tanggal masuk wajib diisi!' });
    }

    const oldKamarId = penghuni.kamar_id;
    const newKamarId = parseInt(kamar_id, 10);

    if (oldKamarId !== newKamarId) {
      // Check if new room is available
      const newKamar = await Kamar.findByPk(newKamarId);
      if (!newKamar) {
        return res.status(404).json({ message: 'Kamar baru tidak ditemukan!' });
      }
      if (newKamar.status === 'Terisi') {
        return res.status(400).json({ message: 'Kamar baru yang dipilih sudah terisi!' });
      }

      // Free old room
      if (oldKamarId) {
        const oldKamar = await Kamar.findByPk(oldKamarId);
        if (oldKamar) {
          await oldKamar.update({ status: 'Tersedia' });
        }
      }

      // Occupy new room
      await newKamar.update({ status: 'Terisi' });
    }

    await penghuni.update({
      nama: nama.trim(),
      no_hp: no_hp.trim(),
      alamat: alamat ? alamat.trim() : '',
      kamar_id: newKamarId,
      tanggal_masuk,
    });

    const result = await Penghuni.findByPk(id, {
      include: [{ model: Kamar, as: 'kamar' }],
    });

    return res.json({ message: 'Data penghuni berhasil diperbarui', data: result });
  } catch (error) {
    console.error('Error updating penghuni:', error);
    return res.status(500).json({ message: 'Gagal mengubah data penghuni', error: error.message });
  }
};

const deletePenghuni = async (req, res) => {
  try {
    const { id } = req.params;
    const penghuni = await Penghuni.findByPk(id);
    if (!penghuni) {
      return res.status(404).json({ message: 'Penghuni tidak ditemukan' });
    }

    const kamarId = penghuni.kamar_id;

    // Delete penghuni
    await penghuni.destroy();

    // Free up room
    if (kamarId) {
      const kamar = await Kamar.findByPk(kamarId);
      if (kamar) {
        await kamar.update({ status: 'Tersedia' });
      }
    }

    return res.json({ message: 'Penghuni berhasil dihapus dan status kamar kembali Tersedia' });
  } catch (error) {
    console.error('Error deleting penghuni:', error);
    return res.status(500).json({ message: 'Gagal menghapus penghuni', error: error.message });
  }
};

module.exports = {
  getAllPenghuni,
  createPenghuni,
  updatePenghuni,
  deletePenghuni,
};
