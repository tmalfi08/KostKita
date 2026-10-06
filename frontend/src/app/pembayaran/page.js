'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import api from '@/utils/api';
import { Plus, Edit, Trash2, AlertCircle, DollarSign, Calendar, User, Bed } from 'lucide-react';

export default function PembayaranPage() {
  const [pembayaranList, setPembayaranList] = useState([]);
  const [penghuniList, setPenghuniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [penghuniId, setPenghuniId] = useState('');
  const [bulan, setBulan] = useState('Oktober');
  const [tanggalBayar, setTanggalBayar] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [status, setStatus] = useState('Lunas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resPembayaran, resPenghuni] = await Promise.all([
        api.get('/pembayaran'),
        api.get('/penghuni'),
      ]);
      setPembayaranList(resPembayaran.data);
      setPenghuniList(resPenghuni.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data pembayaran atau penghuni.');
    } finally {
      setLoading(false);
    }
  };

  const handlePenghuniChange = (selectedId) => {
    setPenghuniId(selectedId);
    const selectedPenghuni = penghuniList.find((p) => String(p.id) === String(selectedId));
    if (selectedPenghuni && selectedPenghuni.kamar) {
      setJumlah(String(selectedPenghuni.kamar.harga_bulanan));
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentId(null);

    const firstPenghuni = penghuniList.length > 0 ? String(penghuniList[0].id) : '';
    setPenghuniId(firstPenghuni);
    if (penghuniList.length > 0 && penghuniList[0].kamar) {
      setJumlah(String(penghuniList[0].kamar.harga_bulanan));
    } else {
      setJumlah('');
    }

    setBulan('Oktober');
    const today = new Date().toISOString().split('T')[0];
    setTanggalBayar(today);
    setStatus('Lunas');

    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id);
    setPenghuniId(item.penghuni_id ? String(item.penghuni_id) : '');
    setBulan(item.bulan);
    setTanggalBayar(item.tanggal_bayar);
    setJumlah(String(item.jumlah));
    setStatus(item.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!penghuniId) {
      setFormError('Penghuni wajib dipilih!');
      return;
    }
    if (!bulan.trim()) {
      setFormError('Bulan pembayaran wajib diisi!');
      return;
    }
    if (!tanggalBayar) {
      setFormError('Tanggal bayar wajib diisi!');
      return;
    }
    if (!jumlah || isNaN(jumlah)) {
      setFormError('Jumlah pembayaran harus berupa angka!');
      return;
    }

    const payload = {
      penghuni_id: parseInt(penghuniId, 10),
      bulan: bulan.trim(),
      tanggal_bayar: tanggalBayar,
      jumlah: parseInt(jumlah, 10),
      status,
    };

    try {
      if (isEditMode) {
        await api.put(`/pembayaran/${currentId}`, payload);
      } else {
        await api.post('/pembayaran', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving pembayaran:', err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan data pembayaran.');
    }
  };

  const handleDelete = async (id, namaPenghuni, bulanBayar) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pembayaran ${namaPenghuni} bulan ${bulanBayar}?`)) {
      try {
        await api.delete(`/pembayaran/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus pembayaran.');
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
        <Navbar title="Kelola Data Pembayaran" />

        <main className="p-8 flex-1 space-y-6">
          {/* Action Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Daftar Transaksi Pembayaran</h2>
              <p className="text-sm text-slate-500">Catat pembayaran sewa bulanan penghuni kost.</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pembayaran</span>
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
                      <th className="py-3.5 px-6">Penghuni</th>
                      <th className="py-3.5 px-6">Kamar</th>
                      <th className="py-3.5 px-6">Bulan</th>
                      <th className="py-3.5 px-6">Tgl Bayar</th>
                      <th className="py-3.5 px-6">Jumlah</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pembayaranList.length > 0 ? (
                      pembayaranList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 text-slate-500 font-medium">{index + 1}</td>
                          <td className="py-4 px-6 font-bold text-slate-800 flex items-center space-x-2">
                            <User className="w-4 h-4 text-purple-600" />
                            <span>{item.penghuni ? item.penghuni.nama : '-'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md font-bold text-xs">
                              <Bed className="w-3.5 h-3.5 mr-1" />
                              {item.penghuni && item.penghuni.kamar ? item.penghuni.kamar.nomor_kamar : '-'}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-700">{item.bulan}</td>
                          <td className="py-4 px-6 text-slate-600">{item.tanggal_bayar}</td>
                          <td className="py-4 px-6 font-bold text-slate-800">{formatRupiah(item.jumlah)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'Lunas'
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
                                onClick={() =>
                                  handleDelete(
                                    item.id,
                                    item.penghuni ? item.penghuni.nama : 'Penghuni',
                                    item.bulan
                                  )
                                }
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
                        <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                          Belum ada data pembayaran
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
        title={isEditMode ? 'Edit Data Pembayaran' : 'Catat Pembayaran Baru'}
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Penghuni</label>
            <select
              value={penghuniId}
              onChange={(e) => handlePenghuniChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">-- Pilih Penghuni --</option>
              {penghuniList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} {p.kamar ? `(Kamar ${p.kamar.nomor_kamar})` : ''}
                </option>
              ))}
            </select>
            {penghuniList.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">⚠️ Belum ada penghuni. Tambahkan penghuni terlebih dahulu.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan Pembayaran</label>
            <input
              type="text"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              placeholder="Contoh: Oktober"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Bayar</label>
            <input
              type="date"
              value={tanggalBayar}
              onChange={(e) => setTanggalBayar(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Pembayaran (Rp)</label>
            <input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="Contoh: 800000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pembayaran</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Lunas">Lunas</option>
              <option value="Belum Lunas">Belum Lunas</option>
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
              {isEditMode ? 'Simpan Perubahan' : 'Catat Pembayaran'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
