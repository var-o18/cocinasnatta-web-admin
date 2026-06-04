'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import FormEditarPedido from './FormEditarPedido';
import FormNuevoPedido from './FormNuevoPedido';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ESTADO_LABELS: Record<string, string> = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    completado: 'Completado',
    cancelado: 'Cancelado',
};

const ESTADO_COLORS: Record<string, string> = {
    pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    en_proceso: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completado: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelado: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const formatearFecha = (fecha: string) => {
    if (!fecha) return '';
    const partes = fecha.split('T')[0].split('-');
    if (partes.length === 3) {
        return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return fecha;
};

export default function PedidoSection() {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [pedidoAEditar, setPedidoAEditar] = useState<Pedido | null>(null);
    const [pedidoAEliminar, setPedidoAEliminar] = useState<Pedido | null>(null);
    const [pagina, setPagina] = useState(1);
    const PEDIDOS_POR_PAGINA = 10
    const headers = ['Cliente', 'Cocina', 'Precio', 'Estado', 'Fecha', 'Acciones'];

    useEffect(() => {
        const obtenerPedidos = async () => {
            try {
                const res = await fetch(`${API_URL}/pedidos`);
                const data = await res.json();

                setPedidos(data);
            } catch (error) {
                console.error('Error cargando pedidos:', error);
            }
        };

        obtenerPedidos();
    }, []);

    const eliminarPedido = async () => {
        if (!pedidoAEliminar) return;

        try {
            const res = await fetch(`${API_URL}/pedidos/${pedidoAEliminar.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPedidos((prev) => prev.filter((p) => p.id !== pedidoAEliminar.id));
            } else {
                console.error('Error eliminando pedido');
            }
        } catch (error) {
            console.error('Error eliminando pedido:', error);
        } finally {
            setPedidoAEliminar(null);
        }
    };

    const pedidosFiltrados = pedidos.filter((pedido) => {
        const query = busqueda.toLowerCase().trim();
        const nombreCliente = pedido.cliente?.nombre ?? '';

        const cumpleBusqueda =
            nombreCliente.toLowerCase().includes(query) ||
            pedido.nombre_cocina.toLowerCase().includes(query) ||
            pedido.precio.toString().toLowerCase().includes(query) ||
            pedido.fecha_pedido.toLowerCase().includes(query);

        const cumpleEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;

        return cumpleBusqueda && cumpleEstado;
    });

    const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / PEDIDOS_POR_PAGINA));
    const pedidosPagina = useMemo(() => {
        const inicio = (pagina - 1) * PEDIDOS_POR_PAGINA;
        return pedidosFiltrados.slice(inicio, inicio + PEDIDOS_POR_PAGINA);
    }, [pedidosFiltrados, pagina]);

    useEffect(() => {
        setPagina(1);
    }, [busqueda, filtroEstado]);

    useEffect(() => {
        if (pagina > totalPaginas) setPagina(totalPaginas);
    }, [pagina, totalPaginas]);

    return (
        <div className="w-full text-white min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:w-120">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar pedido..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="bg-zinc-900 text-white border border-zinc-700 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-blue-500 w-full max-w-full transition-colors placeholder:text-zinc-500"
                        />
                    </div>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors sm:w-48 cursor-pointer"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="completado">Completado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
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
                                <th key={header} className="p-4 border-b border-zinc-800 whitespace-normal break-words">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {pedidosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="p-8 text-center text-zinc-500">
                                    No se encontraron pedidos que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            pedidosPagina.map((pedido) => (
                                <tr key={pedido.id} className="hover:bg-zinc-900 transition text-center">

                                    <td className="p-4 border-b border-zinc-800 font-medium whitespace-normal break-words">
                                        {pedido.cliente?.nombre ?? 'Sin cliente'}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 whitespace-normal break-words">
                                        {pedido.nombre_cocina}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 whitespace-normal break-words">
                                        {Number(pedido.precio).toFixed(2)} €
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${ESTADO_COLORS[pedido.estado] ?? ''}`}>
                                            {ESTADO_LABELS[pedido.estado] ?? pedido.estado}
                                        </span>
                                    </td>

                                    <td className="p-4 border-b border-zinc-800 text-zinc-300 whitespace-normal break-words">
                                        {formatearFecha(pedido.fecha_pedido)}
                                    </td>

                                    <td className="p-4 border-b border-zinc-800">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => setPedidoAEditar(pedido)}
                                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm cursor-pointer transition-colors"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => setPedidoAEliminar(pedido)}
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
                {pedidosPagina.length === 0 ? null : pedidosPagina.map((pedido) => (
                    <div key={pedido.id} className="rounded-3xl border border-zinc-700 bg-zinc-950 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm text-zinc-400">Cliente</p>
                                <p className="font-medium text-white break-words">{pedido.cliente?.nombre ?? 'Sin cliente'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPedidoAEditar(pedido)}
                                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => setPedidoAEliminar(pedido)}
                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 text-sm text-zinc-300">
                            <div>
                                <p className="text-zinc-500">Cocina</p>
                                <p>{pedido.nombre_cocina}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Precio</p>
                                <p>{Number(pedido.precio).toFixed(2)} €</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Estado</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${ESTADO_COLORS[pedido.estado] ?? ''}`}>
                                    {ESTADO_LABELS[pedido.estado] ?? pedido.estado}
                                </span>
                            </div>
                            <div>
                                <p className="text-zinc-500">Fecha</p>
                                <p>{formatearFecha(pedido.fecha_pedido)}</p>
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
                <FormNuevoPedido
                    onCerrar={() => setMostrarFormulario(false)}
                    onPedidoCreado={(nuevo) => setPedidos((prev) => [nuevo, ...prev])}

                />
            )}

            {/* Formulario Edicion */}
            {pedidoAEditar && (
                <FormEditarPedido
                    pedido={pedidoAEditar}
                    onCerrar={() => setPedidoAEditar(null)}
                    onPedidoEditado={(editado) => {
                        setPedidos((prev) => prev.map((p) => (p.id === editado.id ? editado : p)));
                        setPedidoAEditar(null);
                    }}
                />
            )}

            {/* Modal de Confirmación de Eliminación */}
            {pedidoAEliminar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
                        <h3 className="text-lg font-bold mb-2">Eliminar Pedido</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Estás seguro de que deseas eliminar el pedido de <strong className="text-red-400 font-semibold">{pedidoAEliminar.cliente?.nombre ?? 'Sin cliente'}</strong>?
                        </p>
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() => setPedidoAEliminar(null)}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarPedido}
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