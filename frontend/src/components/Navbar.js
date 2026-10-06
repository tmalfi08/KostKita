'use client';

import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

export default function Navbar({ title }) {
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.username) setUsername(userObj.username);
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      <div className="flex items-center space-x-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
        <div className="bg-blue-600 text-white rounded-full p-1.5">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-semibold text-slate-700 capitalize">{username}</span>
      </div>
    </header>
  );
}
