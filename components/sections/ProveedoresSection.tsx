'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import FormNuevoProveedor from './FormNuevoProveedor';
import FormEditarProveedor from './FormEditarProveedor';

interface Proveedor {
    id: number;
    nombre_empresa: string;
    nombre_contacto: string;
    correo: string;
    telefono: string;
    direccion: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProveedoresSection() {

    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [proveedorAEditar, setProveedorAEditar] = useState<Proveedor | null>(null);
    const [proveedorAEliminar, setProveedorAEliminar] = useState<Proveedor | null>(null);
    const headers = ['Empresa', 'Contacto', 'Teléfono', 'Email', 'Dirección', 'Acciones'];

    useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                const res = await fetch(`${API_URL}/proveedores`);
                const data = await res.json();

                setProveedores(data);
            } catch (error) {
                console.error('Error cargando proveedores:', error);
            }
        };

        obtenerProveedores();
    }, []);

    const eliminarProveedor = async () => {
        if (!proveedorAEliminar) return;

        try {
            const res = await fetch(`${API_URL}/proveedores/${proveedorAEliminar.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setProveedores((prev) => prev.filter((p) => p.id !== proveedorAEliminar.id));
            } else {
                console.error('Error eliminando proveedor');
            }
        } catch (error) {
            console.error('Error eliminando proveedor:', error);
        } finally {
            setProveedorAEliminar(null);
        }
    };

    // Filtro de proveedores
    const proveedoresFiltrados = proveedores.filter((proveedor) => {
        const query = busqueda.toLowerCase().trim();
        return (
            proveedor.nombre_empresa.toLowerCase().includes(query) ||
            proveedor.nombre_contacto.toLowerCase().includes(query) ||
            proveedor.correo.toLowerCase().includes(query) ||
            proveedor.telefono.toLowerCase().includes(query) ||
            proveedor.direccion.toLowerCase().includes(query)
        );
    });

    return (
        <div className="w-full text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-zinc-900 text-white border border-zinc-700 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-blue-500 w-72 transition-colors placeholder:text-zinc-500"
                    />
                </div>

                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition font-medium cursor-pointer flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo</span>
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-700">
                <table className="w-full text-left border-collapse">

                    <thead className="bg-zinc-800 text-center">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="p-4 border-b border-zinc-800">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {proveedoresFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="p-8 text-center text-zinc-500">
                                    No se encontraron proveedores que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            proveedoresFiltrados.map((proveedor) => (
                                <tr key={proveedor.id} className="hover:bg-zinc-900 transition text-center">

                                    <td className="p-4 border-b border-zinc-800 font-medium">
                                        {proveedor.nombre_empresa}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        {proveedor.nombre_contacto}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        {proveedor.telefono}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300">
                                        {proveedor.correo}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300">
                                        {proveedor.direccion}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => setProveedorAEditar(proveedor)}
                                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm cursor-pointer transition-colors"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => setProveedorAEliminar(proveedor)}
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors cursor-pointer"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Formulario Creacion */}
            {mostrarFormulario && (
                <FormNuevoProveedor
                    onCerrar={() => setMostrarFormulario(false)}
                    onProveedorCreado={(nuevo) => setProveedores((prev) => [nuevo, ...prev])}
                />
            )}

            {/* Formulario Edicion */}
            {proveedorAEditar && (
                <FormEditarProveedor
                    proveedor={proveedorAEditar}
                    onCerrar={() => setProveedorAEditar(null)}
                    onProveedorEditado={(editado) => {
                        setProveedores((prev) => prev.map((p) => (p.id === editado.id ? editado : p)));
                    }}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {proveedorAEliminar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
                        <h3 className="text-lg font-bold mb-2">Eliminar Proveedor</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Estás seguro de que deseas eliminar a <strong className="text-red-400 font-semibold">{proveedorAEliminar.nombre_empresa}</strong>?
                        </p>
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() => setProveedorAEliminar(null)}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarProveedor}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition font-medium cursor-pointer"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}