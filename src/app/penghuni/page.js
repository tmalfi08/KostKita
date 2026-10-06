'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api from '@/utils/api';
import { Plus, Edit, Trash2, AlertCircle, User, Phone, MapPin, Calendar, Bed } from 'lucide-react';

export default function PenghuniPage() {
  const [penghuniList, setPenghuniList] = useState([]);
  const [kamarList, setKamarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kamarId, setKamarId] = useState('');
  const [tanggalMasuk, setTanggalMasuk] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPenghuni, resKamar] = await Promise.all([
        api.get('/penghuni'),
        api.get('/kamar'),
      ]);
      setPenghuniList(resPenghuni.data);
      setKamarList(resKamar.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data penghuni atau kamar.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setNama('');
    setNoHp('');
    setAlamat('');

    // Default select first available room
    const availableRooms = kamarList.filter((k) => k.status === 'Tersedia');
    setKamarId(availableRooms.length > 0 ? String(availableRooms[0].id) : '');

    // Default today date YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    setTanggalMasuk(today);

    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setNama(item.nama);
    setNoHp(item.no_hp);
    setAlamat(item.alamat || '');
    setKamarId(item.kamar_id ? String(item.kamar_id) : '');
    setTanggalMasuk(item.tanggal_masuk);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nama.trim()) {
      setFormError('Nama penghuni wajib diisi!');
      return;
    }
    if (!noHp.trim()) {
      setFormError('Nomor HP wajib diisi!');
      return;
    }
    if (!kamarId) {
      setFormError('Kamar wajib dipilih!');
      return;
    }
    if (!tanggalMasuk) {
      setFormError('Tanggal masuk wajib diisi!');
      return;
    }

    const payload = {
      nama: nama.trim(),
      no_hp: noHp.trim(),
      alamat: alamat.trim(),
      kamar_id: parseInt(kamarId, 10),
      tanggal_masuk: tanggalMasuk,
    };

    try {
      if (isEditMode) {
        await api.put(`/penghuni/${currentId}`, payload);
      } else {
        await api.post('/penghuni', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving penghuni:', err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan data penghuni.');
    }
  };

  const handleDelete = async (id, namaPenghuni) => {
    if (confirm(`Apakah Anda yakin ingin menghapus penghuni ${namaPenghuni}? Status kamar akan kembali Tersedia.`)) {
      try {
        await api.delete(`/penghuni/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus penghuni.');
      }
    }
  };

  // Available room options for dropdown
  const getSelectableRooms = () => {
    return kamarList.filter((k) => {
      if (k.status === 'Tersedia') return true;
      if (isEditMode && String(k.id) === String(kamarId)) return true;
      return false;
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Kelola Data Penghuni" />

        <main className="p-8 flex-1 space-y-6">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Daftar Penghuni Kost</h2>
              <p className="text-sm text-slate-500">Kelola data penghuni, kamar penempatan, dan tanggal masuk.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Penghuni</span>
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3.5 px-6">No</th>
                      <th className="py-3.5 px-6">Nama Penghuni</th>
                      <th className="py-3.5 px-6">Kamar</th>
                      <th className="py-3.5 px-6">No. HP</th>
                      <th className="py-3.5 px-6">Alamat</th>
                      <th className="py-3.5 px-6">Tgl Masuk</th>
                      <th className="py-3.5 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {penghuniList.length > 0 ? (
                      penghuniList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 text-slate-500 font-medium">{index + 1}</td>
                          <td className="py-4 px-6 font-bold text-slate-800 flex items-center space-x-2">
                            <User className="w-4 h-4 text-purple-600" />
                            <span>{item.nama}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold text-xs">
                              <Bed className="w-3.5 h-3.5 mr-1" />
                              {item.kamar ? item.kamar.nomor_kamar : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-600 flex items-center space-x-1.5 mt-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.no_hp}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600 max-w-xs truncate">{item.alamat || '-'}</td>
                          <td className="py-4 px-6 text-slate-600">{item.tanggal_masuk}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.nama)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                          Belum ada data penghuni
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Penghuni</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Alfi"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor HP</label>
            <input
              type="text"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Kamar (Tersedia)</label>
            <select
              value={kamarId}
              onChange={(e) => setKamarId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">-- Pilih Kamar --</option>
              {getSelectableRooms().map((k) => (
                <option key={k.id} value={k.id}>
                  Kamar {k.nomor_kamar} (Lantai {k.lantai} - Rp {k.harga_bulanan.toLocaleString('id-ID')})
                </option>
              ))}
            </select>
            {getSelectableRooms().length === 0 && (
              <p className="text-xs text-amber-600 mt-1">⚠️ Tidak ada kamar dengan status 'Tersedia'. Tambahkan kamar baru terlebih dahulu.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat asal</label>
            <textarea
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 10"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Masuk</label>
            <input
              type="date"
              value={tanggalMasuk}
              onChange={(e) => setTanggalMasuk(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow"
            >
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Penghuni'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
