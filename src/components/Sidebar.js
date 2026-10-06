'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Bed, Users, CreditCard, LogOut, Building2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Kamar', href: '/kamar', icon: Bed },
    { name: 'Penghuni', href: '/penghuni', icon: Users },
    { name: 'Pembayaran', href: '/pembayaran', icon: CreditCard },
  ];

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between shadow-lg">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">KostKita</h1>
            <p className="text-xs text-slate-400">Manajemen Kost Simple</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
