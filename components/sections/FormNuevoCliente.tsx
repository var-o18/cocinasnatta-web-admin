'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';

interface Cliente {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
}

interface FormNuevoClienteProps {
    onCerrar: () => void;
    onClienteCreado: (nuevoCliente: Cliente) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FormNuevoCliente({ onCerrar, onClienteCreado }: FormNuevoClienteProps) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        if (!nombre || !correo || !telefono || !direccion) {
            setError('Todos los campos son obligatorios.');
            setCargando(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre,
                    correo: correo,
                    telefono: telefono,
                    direccion: direccion,
                }),
            });

            if (res.ok) {
                const nuevoCliente = await res.json();
                onClienteCreado(nuevoCliente);
                onCerrar();
            }
        } catch (err) {
            console.error('Error al crear cliente:', err);
        } finally {
            setCargando(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative text-white">
                <div className="flex justify-between items-center mb-2 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white tracking-wide pb-4">Crear Nuevo Cliente</h2>
                    <button
                        onClick={onCerrar}
                        className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
                    >
                        <X size={20} className="mb-3" />
                    </button>
                </div>
                <p className="text-sm text-white/60 pb-6 pt-2">Todos los campos son obligatorios</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
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