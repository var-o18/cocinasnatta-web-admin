'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="w-full flex items-center justify-between py-6 border-b border-white/[0.05] mb-10">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">{title}</h1>
        {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          className="px-4 py-2 border border-white/[0.08] hover:border-white/20 text-white/80 hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
