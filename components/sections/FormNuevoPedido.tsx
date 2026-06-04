'use client';

import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Cliente {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
}

interface Pedido {
    id: number;
    cliente_id: number;
    nombre_cocina: string;
    precio: string;
    estado: string;
    fecha_pedido: string;
    cliente: Cliente;
}

interface FormNuevoPedidoProps {
    onCerrar: () => void;
    onPedidoCreado: (nuevoPedido: Pedido) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FormNuevoPedido({ onCerrar, onPedidoCreado }: FormNuevoPedidoProps) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteId, setClienteId] = useState('');
    const [nombreCocina, setNombreCocina] = useState('');
    const [precio, setPrecio] = useState('');
    const [estado, setEstado] = useState('pendiente');
    const fechaEspaña = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Europe/Madrid',
    });

    const [fechaPedido, setFechaPedido] = useState(fechaEspaña);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const cargarClientes = async () => {
            try {
                const res = await fetch(`${API_URL}/clientes`);
                const data = await res.json();
                setClientes(data);
            } catch (err) {
                console.error('Error cargando clientes:', err);
            }
        };
        cargarClientes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        if (!clienteId || !nombreCocina || !precio || !estado || !fechaPedido) {
            setError('Todos los campos son obligatorios.');
            setCargando(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    cliente_id: Number(clienteId),
                    nombre_cocina: nombreCocina,
                    precio: Number(precio),
                    estado: estado,
                    fecha_pedido: fechaPedido,
                }),
            });

            if (res.ok) {
                const nuevoPedido = await res.json();
                onPedidoCreado(nuevoPedido);
                onCerrar();
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Error al crear el pedido.');
            }
        } catch (err) {
            console.error('Error al crear pedido:', err);
            setError('Error de conexión.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative text-white">
                <div className="flex justify-between items-center mb-2 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white tracking-wide pb-4">Crear Nuevo Pedido</h2>
                    <button
                        onClick={onCerrar}
                        className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
                    >
                        <X size={20} className="mb-3" />
                    </button>
                </div>
                <p className="text-sm text-white/60 pb-6 pt-2">Todos los campos son obligatorios</p>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Cliente
                            </label>
                            <select
                                value={clienteId}
                                onChange={(e) => setClienteId(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            >
                                <option value="">Seleccionar cliente...</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Cocina
                            </label>
                            <input
                                type="text"
                                value={nombreCocina}
                                onChange={(e) => setNombreCocina(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Precio
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Estado
                            </label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="en_proceso">En Proceso</option>
                                <option value="completado">Completado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Fecha del Pedido
                            </label>
                            <input
                                type="date"
                                value={fechaPedido}
                                onChange={(e) => setFechaPedido(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onCerrar}
                            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 rounded-xl transition text-white/80 font-medium text-sm cursor-pointer"
                            disabled={cargando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl transition text-white font-medium text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer disabled:opacity-50"
                            disabled={cargando}
                        >
                            {cargando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}