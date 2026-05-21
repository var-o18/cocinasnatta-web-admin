'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

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
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-200 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300 ease-out shadow-xs hover:shadow-md hover:shadow-red-500/10 overflow-hidden cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-200 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:scale-105" />
          <span className="relative z-10">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}
