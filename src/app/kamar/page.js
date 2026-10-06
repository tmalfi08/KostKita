'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api from '@/utils/api';
import { Plus, Edit, Trash2, AlertCircle, Bed } from 'lucide-react';

export default function KamarPage() {
  const [kamarList, setKamarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [nomorKamar, setNomorKamar] = useState('');
  const [lantai, setLantai] = useState('1');
  const [hargaBulanan, setHargaBulanan] = useState('');
  const [status, setStatus] = useState('Tersedia');

  useEffect(() => {
    fetchKamar();
  }, []);

  const fetchKamar = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kamar');
      setKamarList(res.data);
    } catch (err) {
      console.error('Error fetching kamar:', err);
      setError('Gagal memuat data kamar dari server.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setNomorKamar('');
    setLantai('1');
    setHargaBulanan('');
    setStatus('Tersedia');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setNomorKamar(item.nomor_kamar);
    setLantai(String(item.lantai));
    setHargaBulanan(String(item.harga_bulanan));
    setStatus(item.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!nomorKamar.trim()) {
      setFormError('Nomor kamar wajib diisi!');
      return;
    }
    if (lantai === '' || isNaN(lantai)) {
      setFormError('Lantai harus berupa angka!');
      return;
    }
    if (!hargaBulanan || isNaN(hargaBulanan)) {
      setFormError('Harga bulanan harus berupa angka!');
      return;
    }

    const payload = {
      nomor_kamar: nomorKamar.trim(),
      lantai: parseInt(lantai, 10),
      harga_bulanan: parseInt(hargaBulanan, 10),
      status,
    };

    try {
      if (isEditMode) {
        await api.put(`/kamar/${currentId}`, payload);
      } else {
        await api.post('/kamar', payload);
      }
      setIsModalOpen(false);
      fetchKamar();
    } catch (err) {
      console.error('Error saving kamar:', err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan data kamar.');
    }
  };

  const handleDelete = async (id, nomor) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kamar ${nomor}?`)) {
      try {
        await api.delete(`/kamar/${id}`);
        fetchKamar();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus kamar.');
      }
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Kelola Data Kamar" />

        <main className="p-8 flex-1 space-y-6">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Daftar Kamar Kost</h2>
              <p className="text-sm text-slate-500">Kelola nomor, lantai, harga bulanan, dan status kamar.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kamar</span>
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
                      <th className="py-3.5 px-6">Kamar</th>
                      <th className="py-3.5 px-6">Lantai</th>
                      <th className="py-3.5 px-6">Harga Bulanan</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {kamarList.length > 0 ? (
                      kamarList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 text-slate-500 font-medium">{index + 1}</td>
                          <td className="py-4 px-6 font-bold text-slate-800 flex items-center space-x-2">
                            <Bed className="w-4 h-4 text-blue-600" />
                            <span>{item.nomor_kamar}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600">Lantai {item.lantai}</td>
                          <td className="py-4 px-6 font-semibold text-slate-700">{formatRupiah(item.harga_bulanan)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'Tersedia'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
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
                                onClick={() => handleDelete(item.id, item.nomor_kamar)}
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
                        <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                          Belum ada data kamar
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
        title={isEditMode ? 'Edit Data Kamar' : 'Tambah Kamar Baru'}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Kamar</label>
            <input
              type="text"
              value={nomorKamar}
              onChange={(e) => setNomorKamar(e.target.value)}
              placeholder="Contoh: A01"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lantai</label>
            <input
              type="number"
              value={lantai}
              onChange={(e) => setLantai(e.target.value)}
              placeholder="Contoh: 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Bulanan (Rp)</label>
            <input
              type="number"
              value={hargaBulanan}
              onChange={(e) => setHargaBulanan(e.target.value)}
              placeholder="Contoh: 800000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kamar</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Terisi">Terisi</option>
            </select>
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
              {isEditMode ? 'Simpan Perubahan' : 'Tambah Kamar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
