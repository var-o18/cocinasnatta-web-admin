'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import FormNuevoCliente from './FormNuevoCliente';
import FormEditarCliente from './FormEditarCliente';


interface Cliente {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ClientesSection() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [clienteAEditar, setClienteAEditar] = useState<Cliente | null>(null);
    const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null);
    const [pagina, setPagina] = useState(1);

    const CLIENTES_POR_PAGINA = 10;

    const headers = ['Nombre', 'Teléfono', 'Email', 'Dirección', 'Acciones'];

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const res = await fetch(`${API_URL}/clientes`);
                const data = await res.json();

                setClientes(data);
            } catch (error) {
                console.error('Error cargando clientes:', error);
            }
        };

        obtenerClientes();
    }, []);

    const eliminarCliente = async () => {
        if (!clienteAEliminar) return;

        try {
            const res = await fetch(
                `${API_URL}/clientes/${clienteAEliminar.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (res.ok) {
                setClientes((prev) =>
                    prev.filter((c) => c.id !== clienteAEliminar.id)
                );
            } else {
                console.error('Error eliminando cliente');
            }
        } catch (error) {
            console.error('Error eliminando cliente:', error);
        } finally {
            setClienteAEliminar(null);
        }
    };

    const clientesFiltrados = clientes.filter((cliente) => {
        const query = busqueda.toLowerCase().trim();

        return (
            cliente.nombre.toLowerCase().includes(query) ||
            cliente.correo.toLowerCase().includes(query) ||
            cliente.telefono.toLowerCase().includes(query)
        );
    });

    const totalPaginas = Math.max(
        1,
        Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA)
    );

    const clientesPagina = useMemo(() => {
        const inicio = (pagina - 1) * CLIENTES_POR_PAGINA;

        return clientesFiltrados.slice(
            inicio,
            inicio + CLIENTES_POR_PAGINA
        );
    }, [clientesFiltrados, pagina]);

    useEffect(() => {
        setPagina(1);
    }, [busqueda]);

    useEffect(() => {
        if (pagina > totalPaginas) {
            setPagina(totalPaginas);
        }
    }, [pagina, totalPaginas]);

    return (
        <div className="w-full text-white min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="relative sm:w-70">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

                    <input
                        type="text"
                        placeholder="Buscar cliente..."
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
                                <th
                                    key={header}
                                    className="p-4 border-b border-zinc-800 whitespace-normal break-words"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {clientesFiltrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={headers.length}
                                    className="p-8 text-center text-zinc-500"
                                >
                                    No se encontraron clientes que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            clientesPagina.map((cliente) => (
                                <tr
                                    key={cliente.id}
                                    className="hover:bg-zinc-900 transition text-center"
                                >
                                    <td className="p-4 border-b border-zinc-800 font-medium">
                                        {cliente.nombre}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        {cliente.telefono}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300">
                                        {cliente.correo}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300">
                                        {cliente.direccion}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() =>
                                                    setClienteAEditar(cliente)
                                                }
                                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm cursor-pointer transition-colors"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setClienteAEliminar(cliente)
                                                }
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

            {/* Tarjetas móvil */}

            <div className="grid gap-4 lg:hidden">
                {clientesPagina.length === 0
                    ? null
                    : clientesPagina.map((cliente) => (
                        <div
                            key={cliente.id}
                            className="rounded-3xl border border-zinc-700 bg-zinc-950 p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm text-zinc-400">
                                        Cliente
                                    </p>

                                    <p className="font-medium text-white break-words">
                                        {cliente.nombre}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setClienteAEditar(cliente)
                                        }
                                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm transition-colors"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() =>
                                            setClienteAEliminar(cliente)
                                        }
                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm text-zinc-300">

                                <div>
                                    <p className="text-zinc-500">
                                        Teléfono
                                    </p>
                                    <p>{cliente.telefono}</p>
                                </div>

                                <div>
                                    <p className="text-zinc-500">Email</p>
                                    <p className="break-words">
                                        {cliente.correo}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-zinc-500">
                                        Dirección
                                    </p>
                                    <p className="break-words">
                                        {cliente.direccion}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
            </div>

            {/* Paginación */}

            <div className="relative flex items-center justify-center mt-6">
                <div className="flex items-center gap-4">

                    <button
                        onClick={() =>
                            setPagina((p) => Math.max(1, p - 1))
                        }
                        disabled={pagina === 1}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-black font-bold text-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-default"
                    >
                        {'<'}
                    </button>

                    <div className="text-white font-semibold text-lg min-w-7.5 text-center">
                        {pagina}
                    </div>

                    <button
                        onClick={() =>
                            setPagina((p) =>
                                Math.min(totalPaginas, p + 1)
                            )
                        }
                        disabled={pagina === totalPaginas}
                        className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white text-black font-bold text-lg shadow-lg cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-default"
                    >
                        {'>'}
                    </button>

                </div>

                <p className="absolute right-0 text-white/60 text-sm">
                    Mostrando {pagina} de {totalPaginas} páginas
                </p>
            </div>

            {/* Formulario creación */}

            {mostrarFormulario && (
                <FormNuevoCliente
                    onCerrar={() => setMostrarFormulario(false)}
                    onClienteCreado={(nuevo) =>
                        setClientes((prev) => [nuevo, ...prev])
                    }
                />
            )}

            {/* Formulario edición */}

            {clienteAEditar && (
                <FormEditarCliente
                    cliente={clienteAEditar}
                    onCerrar={() => setClienteAEditar(null)}
                    onClienteEditado={(editado) => {
                        setClientes((prev) =>
                            prev.map((c) =>
                                c.id === editado.id ? editado : c
                            )
                        );
                    }}
                />
            )}

            {/* Modal eliminar */}

            {clienteAEliminar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">

                        <h3 className="text-lg font-bold mb-2">
                            Eliminar Cliente
                        </h3>

                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Estás seguro de que deseas eliminar a{' '}
                            <strong className="text-red-400 font-semibold">
                                {clienteAEliminar.nombre}
                            </strong>
                            ?
                        </p>

                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() =>
                                    setClienteAEliminar(null)
                                }
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={eliminarCliente}
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