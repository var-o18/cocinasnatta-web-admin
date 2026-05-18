'use client';

import React from 'react';

export default function DashboardSection() {
  const stats = [
    { title: 'Ventas del mes', value: '24,850 €', change: '+12.5%', icon: '💰' },
    { title: 'Nuevos Pedidos', value: '18', change: '+4 nuevos', icon: '📥' },
    { title: 'Clientes Activos', value: '96', change: '+8% vs ayer', icon: '👤' },
  ];

  const recentOrders = [
    { id: '#1024', name: 'Carlos Mendoza', product: 'Cocina Moderna Minimalista', total: '8,450 €', status: 'Completado' },
    { id: '#1023', name: 'Laura Gómez', product: 'Cocina Rústica de Roble', total: '12,200 €', status: 'En Proceso' },
    { id: '#1022', name: 'Sofía Romero', product: 'Cocina Integrada Glass', total: '4,200 €', status: 'Pendiente' },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-2xl p-6 shadow-xl flex items-center justify-between"
          >
            <div className="space-y-2">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-xs text-primary font-medium">{stat.change}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Orders & Activity */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Pedidos Recientes</h2>
            <button className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors duration-300 cursor-pointer">
              Ver todos los pedidos
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] text-white/40 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">ID</th>
                  <th className="pb-3 font-semibold">Cliente</th>
                  <th className="pb-3 font-semibold">Cocina / Diseño</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-sm text-white/80">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors duration-300">
                    <td className="py-4 font-semibold text-primary">{order.id}</td>
                    <td className="py-4">{order.name}</td>
                    <td className="py-4 text-white/60">{order.product}</td>
                    <td className="py-4 font-medium">{order.total}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Completado' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : order.status === 'En Proceso' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
