import './globals.css';

export const metadata = {
  title: 'KostKita - Sistem Manajemen Kost',
  description: 'Sistem Manajemen Kost Sederhana Berbasis Web untuk UTS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
