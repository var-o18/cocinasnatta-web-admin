'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Users, Truck, Calendar, Mail, Cuboid, } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  [key: string]: any;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const menuItems = [
    { name: 'Pedidos', path: '/pedidos', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Clientes', path: '/clientes', icon: <Users className="w-5 h-5" /> },
    { name: 'Proveedores', path: '/proveedores', icon: <Truck className="w-5 h-5" /> },
    { name: 'Agenda', path: '/agenda', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Mensajes', path: '/mensajes', icon: <Mail className="w-5 h-5" /> },
    { name: 'Configurador 3D', path: '/configurador', icon: <Cuboid className="w-5 h-5" /> },
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
            const isActive = pathname === item.path || (item.path !== '/pedidos' && pathname.startsWith(item.path));
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${isActive
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
      {mounted && user && (
        <div className="border-t border-white/[0.05] pt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-white">{user.name || 'Usuario'}</p>
            <p className="text-[10px] text-white/40">{user.email || 'Sin email'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
