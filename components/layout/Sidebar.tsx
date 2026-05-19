'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Pedidos', path: '/pedidos', icon: '🛒' },
    { name: 'Clientes', path: '/clientes', icon: '🤝' },
    { name: 'Proveedores', path: '/proveedores', icon: '👥' },
    { name: 'Agenda', path: '/agenda', icon: '🗓️' },
    { name: 'Configurador 3D', path: '/configurador', icon: '🏗️' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-secondary/30 backdrop-blur-xl border-r border-white/[0.05] p-6 flex flex-col justify-between fixed left-0 top-0 z-30">
      <div className="space-y-10">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <Image 
            src="/assets/cocinasnattalogo.png" 
            alt="Natta Logo" 
            width={120} 
            height={50} 
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-black font-semibold shadow-lg shadow-primary/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile section */}
      <div className="border-t border-white/[0.05] pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
          A
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-white">Administrador</p>
          <p className="text-[10px] text-white/40">admin@natta.com</p>
        </div>
      </div>
    </aside>
  );
}
