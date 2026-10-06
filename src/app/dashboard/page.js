'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import api from '@/utils/api';
import { Bed, CheckCircle, DoorClosed, Users, DollarSign, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_kamar: 0,
    kamar_tersedia: 0,
    kamar_terisi: 0,
    total_penghuni: 0,
    pembayaran_bulan_ini: 0,
    recent_pembayaran: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Gagal memuat data dashboard. Pastikan backend server berjalan!');
      }
    } finally {
      setLoading(false);
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
        <Navbar title="Dashboard" />

        <main className="p-8 flex-1 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total Kamar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3.5 rounded-xl">
                    <Bed className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kamar</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total_kamar}</h3>
                  </div>
                </div>

                {/* Kamar Tersedia */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className="bg-emerald-100 text-emerald-600 p-3.5 rounded-xl">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kamar Tersedia</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.kamar_tersedia}</h3>
                  </div>
                </div>

                {/* Kamar Terisi */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className="bg-amber-100 text-amber-600 p-3.5 rounded-xl">
                    <DoorClosed className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kamar Terisi</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.kamar_terisi}</h3>
                  </div>
                </div>

                {/* Total Penghuni */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className="bg-purple-100 text-purple-600 p-3.5 rounded-xl">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Penghuni</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total_penghuni}</h3>
                  </div>
                </div>

                {/* Pembayaran Bulan Ini */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center space-x-4">
                  <div className="bg-teal-100 text-teal-600 p-3.5 rounded-xl">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Lunas</p>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">{formatRupiah(stats.pembayaran_bulan_ini)}</h3>
                  </div>
                </div>
              </div>

              {/* Table Pembayaran Terbaru */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Pembayaran Terbaru</h2>
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">5 Data Terakhir</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3.5 px-6">Penghuni</th>
                        <th className="py-3.5 px-6">Kamar</th>
                        <th className="py-3.5 px-6">Bulan</th>
                        <th className="py-3.5 px-6">Jumlah</th>
                        <th className="py-3.5 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {stats.recent_pembayaran && stats.recent_pembayaran.length > 0 ? (
                        stats.recent_pembayaran.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 font-semibold text-slate-800">
                              {item.penghuni ? item.penghuni.nama : '-'}
                            </td>
                            <td className="py-4 px-6 text-slate-600">
                              {item.penghuni && item.penghuni.kamar ? item.penghuni.kamar.nomor_kamar : '-'}
                            </td>
                            <td className="py-4 px-6 text-slate-600">{item.bulan}</td>
                            <td className="py-4 px-6 font-medium text-slate-700">{formatRupiah(item.jumlah)}</td>
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                            Belum ada data pembayaran terbaru
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
