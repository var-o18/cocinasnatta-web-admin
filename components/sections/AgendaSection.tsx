"use client";

import React, { useEffect, useState } from 'react';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X, Loader2 } from "lucide-react";

export default function AgendaSection() {

    const [eventos, setEventos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null);
    const [tituloEditado, setTituloEditado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [color, setColor] = useState("#3788d8");
    const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [proveedoresDB, setProveedoresDB] = useState<any[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const coloresDisponibles = [
        "#3788d8",
        "#16a34a",
        "#dc2626",
        "#ca8a04",
    ];

    useEffect(() => {
        obtenerEventos();
        obtenerProveedores();
    }, []);

    const obtenerProveedores = async () => {
        try {
            const response = await fetch(`${API_URL}/proveedores`, {
                headers: {
                    "Accept": "application/json"
                }
            });
            const data = await response.json();
            setProveedoresDB(data);
        } catch (error) {
            console.error("Error obteniendo proveedores:", error);
        }
    };

    const obtenerEventos = async () => {
        try {
            const response = await fetch(`${API_URL}/eventos`, {
                headers: {
                    "Accept": "application/json"
                }
            });

            const data = await response.json();
            setEventos(data);

        } catch (error) {
            console.error("Error obteniendo eventos:", error);
        }
    };

    const guardarEvento = async () => {
        setIsSaving(true);
        try {
            const startPayload = horaInicio ? `${fechaInicio} ${horaInicio}:00` : fechaInicio;
            const endPayload = (fechaFin && horaFin) ? `${fechaFin} ${horaFin}:00` : (fechaFin || null);

            const payload = {
                title: tituloEditado || "Nuevo Evento",
                start: startPayload,
                end: endPayload,
                color: color,
                proveedor_ids: proveedoresSeleccionados.map((p: any) => p.id),
            };

            const url = eventoSeleccionado ? `${API_URL}/eventos/${eventoSeleccionado.id}` : `${API_URL}/eventos`;
            const method = eventoSeleccionado ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Error guardando evento");

            await obtenerEventos();
            setModalOpen(false);
            setEventoSeleccionado(null);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const eliminarEvento = async () => {
        setIsDeleting(true);
        try {

            const response = await fetch(
                `${API_URL}/eventos/${eventoSeleccionado.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );

            if (!response.ok) throw new Error("Error eliminando evento");

            eventoSeleccionado.remove();

            setModalOpen(false);

        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEventClick = (clickInfo: any) => {

        const event = clickInfo.event;

        setEventoSeleccionado(event);
        setTituloEditado(event.title);

        const startStr = event.startStr || new Date().toISOString();
        setFechaInicio(startStr.slice(0, 10));
        setHoraInicio(startStr.includes('T') ? startStr.slice(11, 16) : "");

        const endStr = event.endStr || startStr;
        setFechaFin(endStr.slice(0, 10));
        setHoraFin(event.endStr && event.endStr.includes('T') ? event.endStr.slice(11, 16) : "");

        setColor(event.backgroundColor || "#3788d8");

        setProveedoresSeleccionados(event.extendedProps?.proveedores || []);

        setModalOpen(true);
    };

    const handleDateSelect = (selectInfo: any) => {
        setEventoSeleccionado(null);
        setTituloEditado("");

        const startStr = selectInfo.startStr;
        setFechaInicio(startStr.slice(0, 10));
        setHoraInicio(startStr.includes('T') ? startStr.slice(11, 16) : "");

        const endStr = selectInfo.endStr;
        let endDateDisplay = endStr.slice(0, 10);
        if (!endStr.includes('T')) {
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            if ((endDate.getTime() - startDate.getTime()) === 86400000) {
                endDateDisplay = startStr.slice(0, 10);
            } else {
                endDate.setDate(endDate.getDate() - 1);
                endDateDisplay = endDate.toISOString().slice(0, 10);
            }
        }

        setFechaFin(endDateDisplay);
        setHoraFin(endStr.includes('T') ? endStr.slice(11, 16) : "");

        setColor("#3788d8");
        setProveedoresSeleccionados([]);

        selectInfo.view.calendar.unselect();
        setModalOpen(true);
    };

    return (
        <div className="p-5">
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin
                ]}

                initialView="dayGridMonth"

                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                locale="es"
                editable={true}
                allDaySlot={false}
                firstDay={1}

                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día'
                }}

                events={eventos}

                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}

                slotEventOverlap={false}
                dayMaxEvents={true}

                height="80vh"
            />

            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => { setModalOpen(false); setEventoSeleccionado(null); }}
                >
                    <div
                        className="relative bg-black/60 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl w-full max-w-md p-6 mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setModalOpen(false);
                                setEventoSeleccionado(null);
                            }}
                            className="absolute top-4 right-4 p-1 rounded-full cursor-pointer hover:bg-white/20 transition z-10"
                        >
                            <X size={22} className="text-gray-500 hover:text-white" />
                        </button>


                        <input
                            className="w-full p-3 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5 mt-8"
                            value={tituloEditado}
                            onChange={(e) => setTituloEditado(e.target.value)}
                            placeholder="Añade un título"
                        />

                        {/* Proveedores seleccionados */}
                        {proveedoresSeleccionados.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {proveedoresSeleccionados.map((prov) => (
                                    <div key={prov.id} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full text-sm">
                                        <span>{prov.nombre || prov.nombre_empresa}</span>
                                        <button
                                            type="button"
                                            onClick={() => setProveedoresSeleccionados(proveedoresSeleccionados.filter(p => p.id !== prov.id))}
                                            className="hover:text-white transition ml-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 mb-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Inicio</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                        value={horaInicio}
                                        onChange={(e) => setHoraInicio(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fin</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                    <input
                                        type="time"
                                        className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                        value={horaFin}
                                        onChange={(e) => setHoraFin(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex gap-3">
                                {coloresDisponibles.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border-4 transition cursor-pointer ${color === c ? "border-white scale-110" : "border-transparent"}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Añadir Proveedor</p>

                        <select
                            className="w-full p-3 border border-gray-700 bg-black text-white rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                            value=""
                            onChange={(e) => {
                                if (!e.target.value) return;
                                const provId = Number(e.target.value);
                                const isAlreadySelected = proveedoresSeleccionados.some(p => p.id === provId);

                                if (!isAlreadySelected) {
                                    const provName = e.target.options[e.target.selectedIndex].text;
                                    const cleanName = provName.replace(" (Ya añadido)", "");
                                    setProveedoresSeleccionados([...proveedoresSeleccionados, { id: provId, nombre: cleanName }]);
                                }
                            }}
                        >
                            <option value="">Selecciona un proveedor...</option>
                            {proveedoresDB.map(proveedor => {
                                const isAlreadySelected = proveedoresSeleccionados.some(p => p.id === proveedor.id);
                                return (
                                    <option
                                        key={proveedor.id}
                                        value={proveedor.id}
                                        disabled={isAlreadySelected}
                                        className={isAlreadySelected ? "text-gray-500" : "text-white"}
                                    >
                                        {proveedor.nombre_empresa} {isAlreadySelected ? "(Ya añadido)" : ""}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="w-full flex gap-2">
                            {eventoSeleccionado && (
                                <button
                                    onClick={eliminarEvento}
                                    disabled={isDeleting || isSaving}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting && <Loader2 size={18} className="animate-spin" />}
                                    Eliminar
                                </button>
                            )}

                            <button
                                onClick={guardarEvento}
                                disabled={isSaving || isDeleting}
                                className="flex-1 bg-[#c99a6b] hover:bg-[#c99a6b]/80 text-black py-2 rounded-xl transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold cursor-pointer"
                            >
                                {isSaving && <Loader2 size={18} className="animate-spin" />}
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}