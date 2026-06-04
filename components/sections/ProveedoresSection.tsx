'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
    const [pagina, setPagina] = useState(1);
    const PROVEEDORES_POR_PAGINA = 10
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

    const totalPaginas = Math.max(1, Math.ceil(proveedoresFiltrados.length / PROVEEDORES_POR_PAGINA));
    const proveedoresPagina = useMemo(() => {
        const inicio = (pagina - 1) * PROVEEDORES_POR_PAGINA;
        return proveedoresFiltrados.slice(inicio, inicio + PROVEEDORES_POR_PAGINA);
    }, [proveedoresFiltrados, pagina]);

    useEffect(() => {
        setPagina(1);
    }, [busqueda]);

    useEffect(() => {
        if (pagina > totalPaginas) setPagina(totalPaginas);
    }, [pagina, totalPaginas]);

    return (
        <div className="w-full text-white min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="relative sm:w-70">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-zinc-900 text-white border border-zinc-700 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-blue-500 w-full max-w-full transition-colors placeholder:text-zinc-500"
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

            <div className="overflow-x-auto rounded-xl border border-zinc-700 min-w-0 hidden lg:block">
                <table className="w-full table-fixed text-left border-collapse">

                    <thead className="bg-zinc-800 text-center">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} className="p-4 border-b border-zinc-800 whitespace-normal wrap-break-word">
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
                            proveedoresPagina.map((proveedor) => (
                                <tr key={proveedor.id} className="hover:bg-zinc-900 transition text-center">

                                    <td className="p-4 border-b border-zinc-800 font-medium whitespace-normal wrap-break-word">
                                        {proveedor.nombre_empresa}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 whitespace-normal wrap-break-word">
                                        {proveedor.nombre_contacto}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 whitespace-normal wrap-break-word">
                                        {proveedor.telefono}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300 whitespace-normal wrap-break-word">
                                        {proveedor.correo}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300 whitespace-normal wrap-break-word">
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

            <div className="grid gap-4 lg:hidden">
                {proveedoresPagina.length === 0 ? null : proveedoresPagina.map((proveedor) => (
                    <div key={proveedor.id} className="rounded-3xl border border-zinc-700 bg-zinc-950 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm text-zinc-400">Empresa</p>
                                <p className="font-medium text-white break-words">{proveedor.nombre_empresa}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setProveedorAEditar(proveedor)}
                                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => setProveedorAEliminar(proveedor)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 text-sm text-zinc-300">
                            <div>
                                <p className="text-zinc-500">Contacto</p>
                                <p>{proveedor.nombre_contacto}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Teléfono</p>
                                <p>{proveedor.telefono}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Email</p>
                                <p className="break-words">{proveedor.correo}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Dirección</p>
                                <p className="break-words">{proveedor.direccion}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <div className="relative flex items-center justify-center mt-6">
                <div className="flex items-center gap-4">

                    <button
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                        disabled={pagina === 1}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-black font-bold text-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100"
                    >
                        {"<"}
                    </button>

                    <div className="text-white font-semibold text-lg min-w-7.5 text-center">
                        {pagina}
                    </div>

                    <button
                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                        disabled={pagina === totalPaginas}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-black font-bold text-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100"
                    >
                        {">"}
                    </button>

                </div>
                <p className="absolute right-0 text-white/60 text-sm">
                    Mostrando {pagina} de {totalPaginas} páginas
                </p>

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