'use client';

import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Proveedor {
    id: number;
    nombre_empresa: string;
    nombre_contacto: string;
    correo: string;
    telefono: string;
    direccion: string;
}

interface FormEditarProveedorProps {
    proveedor: Proveedor;
    onCerrar: () => void;
    onProveedorEditado: (proveedorEditado: Proveedor) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function FormEditarProveedor({ proveedor, onCerrar, onProveedorEditado }: FormEditarProveedorProps) {
    const [nombreEmpresa, setNombreEmpresa] = useState(proveedor.nombre_empresa);
    const [nombreContacto, setNombreContacto] = useState(proveedor.nombre_contacto);
    const [correo, setCorreo] = useState(proveedor.correo);
    const [telefono, setTelefono] = useState(proveedor.telefono);
    const [direccion, setDireccion] = useState(proveedor.direccion);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        setNombreEmpresa(proveedor.nombre_empresa);
        setNombreContacto(proveedor.nombre_contacto);
        setCorreo(proveedor.correo);
        setTelefono(proveedor.telefono);
        setDireccion(proveedor.direccion);
    }, [proveedor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        if (!nombreEmpresa || !nombreContacto || !correo || !telefono || !direccion) {
            setError('Todos los campos son obligatorios.');
            setCargando(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/proveedores/${proveedor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre_empresa: nombreEmpresa,
                    nombre_contacto: nombreContacto,
                    correo: correo,
                    telefono: telefono,
                    direccion: direccion,
                }),
            });

            if (res.ok) {
                const proveedorActualizado = await res.json();
                onProveedorEditado(proveedorActualizado);
                onCerrar();
            }
        } catch (err) {
            console.error('Error al actualizar proveedor:', err);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative text-white">
                <div className="flex justify-between items-center mb-2 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white tracking-wide pb-4">Editar Proveedor</h2>
                    <button
                        onClick={onCerrar}
                        className="text-white/40 hover:text-white/80 transition-colors text-lg cursor-pointer"
                    >
                        <X size={20} className='mb-3' />
                    </button>
                </div>
                <p className="text-sm text-white/60 pb-6 pt-2">Todos los campos son obligatorios</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Nombre de la Empresa
                            </label>
                            <input
                                type="text"
                                value={nombreEmpresa}
                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                                Persona de Contacto
                            </label>
                            <input
                                type="text"
                                value={nombreContacto}
                                onChange={(e) => setNombreContacto(e.target.value)}
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
                            required
                        />
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
