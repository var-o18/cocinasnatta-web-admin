'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Trash2, FileText, UserPlus, Search, Mail, Phone } from 'lucide-react';

interface Propuesta {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    descripcion: string;
    estado: string;
    created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ESTADO_LABELS: Record<string, string> = {
    pendiente: 'Pendiente',
    en_curso: 'En Curso',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado',
};

const ESTADO_COLORS: Record<string, string> = {
    pendiente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    en_curso: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    finalizado: 'bg-green-500/20 text-green-400 border-green-500/30',
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


export default function PropuestasSection() {

    const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [pagina, setPagina] = useState(1);
    const [propuestaAEliminar, setPropuestaAEliminar] = useState<Propuesta | null>(null);
    const [cambioEstadoPendiente, setCambioEstadoPendiente] = useState<{ propuesta: Propuesta, nuevoEstado: string } | null>(null);
    const [cargando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [actualizandoEstado, setActualizandoEstado] = useState(false);
    const [clientesExistentes, setClientesExistentes] = useState<string[]>([]);
    const [propuestaACrearCliente, setPropuestaACrearCliente] = useState<Propuesta | null>(null);
    const [cargandoCliente, setCargandoCliente] = useState(false);
    const [mensajeClienteExistente, setMensajeClienteExistente] = useState('');
    const PEDIDOS_POR_PAGINA = 10;

    useEffect(() => {
        const obtenerPropuestas = async () => {
            try {
                const res = await fetch(`${API_URL}/propuestas`);
                const data = await res.json();

                setPropuestas(data);
            } catch (error) {
                console.error('Error cargando propuestas:', error);
            }
        };

        const obtenerClientes = async () => {
            try {
                const res = await fetch(`${API_URL}/clientes`);
                const data = await res.json();
                setClientesExistentes(data.map((cliente: any) => cliente.correo.toLowerCase()));
            } catch (error) {
                console.error('Error cargando clientes existentes:', error);
            }
        };

        obtenerPropuestas();
        obtenerClientes();
    }, []);

    const eliminarPropuesta = async () => {
        if (!propuestaAEliminar) return;

        setEliminando(true);

        try {
            const res = await fetch(`${API_URL}/propuestas/${propuestaAEliminar.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPropuestas((prev) => prev.filter((p) => p.id !== propuestaAEliminar.id));
                setPropuestaAEliminar(null);
            } else {
                console.error('Error eliminando propuesta');
            }
        } catch (error) {
            console.error('Error eliminando propuesta:', error);
        } finally {
            setEliminando(false);
        }
    };

    const confirmarCambioEstado = async () => {
        if (!cambioEstadoPendiente) return;
        setActualizandoEstado(true);
        try {
            const { propuesta, nuevoEstado } = cambioEstadoPendiente;
            const res = await fetch(`${API_URL}/propuestas/${propuesta.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...propuesta,
                    estado: nuevoEstado,
                }),
            });

            if (res.ok) {
                const actualizada = await res.json();
                setPropuestas((prev) => prev.map((p) => (p.id === propuesta.id ? actualizada : p)));
                setCambioEstadoPendiente(null);
            } else {
                console.error('Error al actualizar estado');
            }
        } catch (error) {
            console.error('Error de conexión al actualizar estado:', error);
        } finally {
            setActualizandoEstado(false);
        }
    };

    const ClienteCreado = async (propuesta: Propuesta) => {
        setMensajeClienteExistente('');
        setPropuestaACrearCliente(propuesta);

        const clienteExistente = clientesExistentes.includes(propuesta.email.toLowerCase());
        if (clienteExistente) {
            setMensajeClienteExistente('Este cliente ya ha sido creado anteriormente.');
        }
    };

    const crearCliente = async () => {
        if (!propuestaACrearCliente || mensajeClienteExistente) return;
        setCargandoCliente(true);
        try {
            const res = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: propuestaACrearCliente.nombre,
                    correo: propuestaACrearCliente.email,
                    telefono: propuestaACrearCliente.telefono,
                }),
            });

            if (res.ok) {
                setPropuestaACrearCliente(null);
                setClientesExistentes((prev) => [...prev, propuestaACrearCliente.email.toLowerCase()]);
            } else {
                console.error('Error al crear cliente');
            }
        } catch (error) {
            console.error('Error al crear cliente:', error);
        } finally {
            setCargandoCliente(false);
        }
    };

    const propuestasFiltradas = useMemo(() => {
        return propuestas.filter((propuesta) => {
            const matchesSearch =
                propuesta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                propuesta.email.toLowerCase().includes(busqueda.toLowerCase()) ||
                (propuesta.telefono && propuesta.telefono.includes(busqueda));

            const matchesEstado = filtroEstado === 'todos' || propuesta.estado === filtroEstado;
            return matchesSearch && matchesEstado;
        });
    }, [propuestas, busqueda, filtroEstado]);

    const totalPaginas = Math.max(1, Math.ceil(propuestasFiltradas.length / PEDIDOS_POR_PAGINA));
    const propuestasPagina = useMemo(() => {
        const inicio = (pagina - 1) * PEDIDOS_POR_PAGINA;
        return propuestasFiltradas.slice(inicio, inicio + PEDIDOS_POR_PAGINA);
    }, [propuestasFiltradas, pagina]);

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
                        <option value="en_curso">En Curso</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {propuestasPagina.map((propuesta) => (
                    <div
                        key={propuesta.id}
                        className="relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 hover:bg-zinc-900 hover:border-zinc-700/80 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col gap-4 group w-full overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

                        <div className="relative flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            <div className="md:col-span-3 flex flex-col min-w-0">
                                <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors truncate">
                                    {propuesta.nombre}
                                </h3>
                                <p className="text-xs font-medium text-zinc-500">{formatearFecha(propuesta.created_at)}</p>
                            </div>

                            <div className="md:col-span-3 flex flex-col gap-2 border-l-0 md:border-l border-zinc-800/50 md:pl-6">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <Mail size={14} className="text-zinc-500 shrink-0" />
                                    <span className="text-zinc-300 truncate" title={propuesta.email}>{propuesta.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <Phone size={14} className="text-zinc-500 shrink-0" />
                                    <span className="text-zinc-300 truncate">{propuesta.telefono || 'No especificado'}</span>
                                </div>
                            </div>

                            <div className="md:col-span-3 text-sm text-zinc-400 border-l-0 md:border-l border-zinc-800/50 md:pl-6">
                                <p className="leading-relaxed break-words whitespace-pre-wrap">
                                    {propuesta.descripcion || 'Sin descripción'}
                                </p>
                            </div>

                            <div className="md:col-span-3 flex flex-col items-start md:items-end gap-4 justify-start border-l-0 md:border-l border-zinc-800/50 md:pl-6">
                                <select
                                    value={propuesta.estado}
                                    onChange={(e) => setCambioEstadoPendiente({ propuesta, nuevoEstado: e.target.value })}
                                    className={`appearance-none px-3 py-1 text-xs font-bold tracking-wide rounded-full border shadow-sm whitespace-nowrap cursor-pointer outline-none transition-colors focus:ring-2 focus:ring-blue-500/50 ${ESTADO_COLORS[propuesta.estado] || 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50'}`}
                                >
                                    <option value="pendiente" className="bg-zinc-900 text-white font-medium">Pendiente</option>
                                    <option value="en_curso" className="bg-zinc-900 text-white font-medium">En Curso</option>
                                    <option value="finalizado" className="bg-zinc-900 text-white font-medium">Finalizado</option>
                                    <option value="cancelado" className="bg-zinc-900 text-white font-medium">Cancelado</option>
                                </select>

                                <div className="flex items-center gap-1">
                                    <a
                                        href={`${API_URL}/propuestas/${propuesta.id}/pdf`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="Ver PDF"
                                        className="p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all duration-200"
                                    >
                                        <FileText size={18} />
                                    </a>

                                    <button
                                        onClick={() => ClienteCreado(propuesta)}
                                        title={clientesExistentes.includes(propuesta.email.toLowerCase()) ? 'Cliente creado' : 'Crear cliente'}
                                        className={`p-2 rounded-full bg-zinc-800/50 hover:bg-zinc-700 transition-all duration-200 cursor-pointer ${clientesExistentes.includes(propuesta.email.toLowerCase()) ? 'text-emerald-400 hover:text-emerald-200' : 'text-zinc-300 hover:text-white'}`}
                                    >
                                        <UserPlus size={18} />
                                    </button>

                                    <button
                                        onClick={() => setPropuestaAEliminar(propuesta)}
                                        title="Eliminar propuesta"
                                        className="p-2 rounded-full bg-red-500/5 hover:bg-red-500/20 text-red-500 transition-all duration-200 cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {propuestasFiltradas.length === 0 && !cargando && (
                    <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl">
                        No se encontraron propuestas que coincidan con la búsqueda.
                    </div>
                )}
            </div>

            {/* Paginación */}
            {propuestasFiltradas.length > 0 && (
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
                    <p className="absolute right-0 text-white/60 text-sm hidden sm:block">
                        Mostrando {pagina} de {totalPaginas} páginas
                    </p>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {propuestaAEliminar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
                        <h3 className="text-lg font-bold mb-2">Eliminar Propuesta</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Estás seguro de que deseas eliminar la propuesta de <strong className="text-red-400 font-semibold">{propuestaAEliminar.email}</strong>?
                        </p>
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() => setPropuestaAEliminar(null)}
                                disabled={eliminando}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarPropuesta}
                                disabled={eliminando}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {eliminando ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Eliminando...</span>
                                    </>
                                ) : (
                                    'Eliminar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Estado */}
            {cambioEstadoPendiente && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
                        <h3 className="text-lg font-bold mb-2">Cambiar Estado</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Estás seguro de que deseas cambiar el estado de esta propuesta a <strong className="text-blue-400 font-semibold">{ESTADO_LABELS[cambioEstadoPendiente.nuevoEstado] || cambioEstadoPendiente.nuevoEstado}</strong>?
                        </p>
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() => setCambioEstadoPendiente(null)}
                                disabled={actualizandoEstado}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarCambioEstado}
                                disabled={actualizandoEstado}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actualizandoEstado ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Guardando...</span>
                                    </>
                                ) : (
                                    'Confirmar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Creación de Cliente */}
            {propuestaACrearCliente && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-white">
                        <h3 className="text-lg font-bold mb-2">Crear Cliente</h3>
                        <p className="text-sm text-zinc-400 mb-6">
                            ¿Deseas crear un nuevo cliente con los siguientes datos?
                        </p>
                        <div className="bg-zinc-900/50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                            <p><span className="text-zinc-400">Nombre:</span> <span className="text-white font-medium">{propuestaACrearCliente.nombre}</span></p>
                            <p><span className="text-zinc-400">Correo:</span> <span className="text-white font-medium">{propuestaACrearCliente.email}</span></p>
                            <p><span className="text-zinc-400">Teléfono:</span> <span className="text-white font-medium">{propuestaACrearCliente.telefono}</span></p>
                        </div>
                        {mensajeClienteExistente && (
                            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                                {mensajeClienteExistente}
                            </div>
                        )}
                        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                            <button
                                onClick={() => {
                                    setPropuestaACrearCliente(null);
                                    setMensajeClienteExistente('');
                                }}
                                disabled={cargandoCliente}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl text-sm transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={crearCliente}
                                disabled={cargandoCliente || Boolean(mensajeClienteExistente)}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm transition font-medium cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cargandoCliente ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    'Crear Cliente'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}