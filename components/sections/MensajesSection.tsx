'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type EstadoMensaje = 'pendiente' | 'procesado' | 'finalizado' | string;

interface MensajeContacto {
  id: number;
  nombre: string;
  correo: string;
  mensaje: string;
  estado: EstadoMensaje;
  created_at: string;
}

const formatearFechaHora = (iso: string) =>
  new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const construirCita = (msg: MensajeContacto) => {
  const cabecera = `El ${formatearFechaHora(msg.created_at)}, ${msg.nombre} <${msg.correo}> escribió:`;
  const citado = msg.mensaje
    .split('\n')
    .map((linea) => `> ${linea}`)
    .join('\n');
  return `${cabecera}\n${citado}`;
};

const claseEstado = (estado: EstadoMensaje) => {
  switch (estado) {
    case 'procesado':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'finalizado':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pendiente':
    default:
      return 'bg-white/5 text-white/60 border-white/10';
  }
};

function PanelResponder(props: {
  montado: boolean;
  mensaje: MensajeContacto | null;
  asunto: string;
  setAsunto: (v: string) => void;
  cuerpo: string;
  setCuerpo: (v: string) => void;
  cerrar: () => void;
  enviar: () => void;
}) {
  const { montado, mensaje, asunto, setAsunto, cuerpo, setCuerpo, cerrar, enviar } = props;
  if (!montado || !mensaje) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Responder mensaje"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
    >
      <div className="absolute inset-0 bg-transparent" />

      <div className="fixed bottom-4 right-4 w-[min(560px,calc(100vw-2rem))] max-h-[45vh] bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold tracking-wide">Responder</h3>
            <p className="text-xs text-white/40 mt-1">
              Para: <span className="text-white/70 font-medium">{mensaje.nombre}</span>{' '}
              <span className="text-white/50">&lt;{mensaje.correo}&gt;</span>
            </p>
          </div>
          <button
            onClick={cerrar}
            className="px-3 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Cerrar
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-auto">
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
              Asunto
            </label>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300"
              placeholder="Asunto"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
              Mensaje
            </label>
            <textarea
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300 resize-y"
              placeholder="Escribe tu respuesta..."
            />
            <p className="mt-2 text-[11px] text-white/35">
              Al enviar se abrirá tu cliente de correo (tipo Gmail) con el contenido listo.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={cerrar}
            className="px-4 py-3 rounded-xl text-xs font-bold border border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={enviar}
            className="px-5 py-3 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[1px] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function MensajesSection() {
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [menuEstadoAbiertoId, setMenuEstadoAbiertoId] = useState<number | null>(null);

  const [montado, setMontado] = useState(false);
  const [mensajeAResponder, setMensajeAResponder] = useState<MensajeContacto | null>(null);
  const [asunto, setAsunto] = useState('');
  const [cuerpo, setCuerpo] = useState('');

  useEffect(() => {
    setMontado(true);
  }, []);

  const cargarMensajes = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los mensajes');
      }

      const data: MensajeContacto[] = await response.json();
      const ordenados = [...data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setMensajes(ordenados);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  const cambiarEstado = async (id: number, nuevoEstado: EstadoMensaje) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        cargarMensajes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const abrirResponder = (msg: MensajeContacto) => {
    setMensajeAResponder(msg);
    setAsunto(`Re: Mensaje de contacto (#${msg.id})`);
    setCuerpo(`\n\n${construirCita(msg)}`);
    setMenuEstadoAbiertoId(null);
  };

  const cerrarResponder = () => {
    setMensajeAResponder(null);
    setAsunto('');
    setCuerpo('');
  };

  const enviarMailto = (msg: MensajeContacto) => {
    const asuntoUrl = encodeURIComponent(asunto.trim());
    const cuerpoUrl = encodeURIComponent(cuerpo.trimStart());
    window.location.href = `mailto:${msg.correo}?subject=${asuntoUrl}&body=${cuerpoUrl}`;
  };

  const enviarRespuesta = async () => {
    if (!mensajeAResponder) return;
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: mensajeAResponder.correo,
          subject: asunto,
          text: cuerpo,
          replyTo: mensajeAResponder.correo,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error();
      cerrarResponder();
    } catch {
      enviarMailto(mensajeAResponder);
    }
  };

  if (cargando) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="text-white/60 animate-pulse text-sm font-medium uppercase tracking-widest">
          Cargando mensajes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
        <p className="text-red-400 text-sm font-medium">{error}</p>
        <button onClick={cargarMensajes} className="mt-4 text-xs font-bold text-red-400 hover:text-red-300 uppercase">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-wide">Mensajes de Contacto</h2>
        <div className="text-xs font-semibold text-white/40 bg-white/5 px-4 py-2 rounded-full">
          Total: {mensajes.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mensajes.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-2xl p-12 text-center text-white/40 text-sm">
            No hay mensajes en la bandeja.
          </div>
        ) : (
          mensajes.map((msg) => (
            <div key={msg.id} className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-md rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/[0.04]">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-white/[0.05]">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{msg.nombre}</h3>
                  <a href={`mailto:${msg.correo}`} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                    {msg.correo}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-white/40">
                    {formatearFechaHora(msg.created_at)}
                  </span>
                  
                  <button
                    onClick={() => abrirResponder(msg)}
                    className="px-4 py-2 rounded-full text-xs font-bold border border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white transition-all cursor-pointer"
                  >
                    Responder
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setMenuEstadoAbiertoId(menuEstadoAbiertoId === msg.id ? null : msg.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border focus:outline-none cursor-pointer flex items-center gap-2 transition-all ${claseEstado(msg.estado || 'pendiente')}`}
                    >
                      {msg.estado ? msg.estado.charAt(0).toUpperCase() + msg.estado.slice(1) : 'Pendiente'}
                      <svg className={`w-3 h-3 transition-transform duration-200 ${menuEstadoAbiertoId === msg.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    
                    {menuEstadoAbiertoId === msg.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40"
                          onClick={() => setMenuEstadoAbiertoId(null)}
                        />
                        <div className="absolute top-full mt-2 right-0 bg-neutral-900 border border-white/10 rounded-xl py-1 shadow-2xl z-50 min-w-[130px] animate-in fade-in slide-in-from-top-2">
                          <div 
                            onClick={() => { cambiarEstado(msg.id, 'pendiente'); setMenuEstadoAbiertoId(null); }}
                            className="px-4 py-2.5 text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white cursor-pointer transition-colors"
                          >
                            Pendiente
                          </div>
                          <div 
                            onClick={() => { cambiarEstado(msg.id, 'procesado'); setMenuEstadoAbiertoId(null); }}
                            className="px-4 py-2.5 text-xs font-bold text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-400 cursor-pointer transition-colors"
                          >
                            Procesado
                          </div>
                          <div 
                            onClick={() => { cambiarEstado(msg.id, 'finalizado'); setMenuEstadoAbiertoId(null); }}
                            className="px-4 py-2.5 text-xs font-bold text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-colors"
                          >
                            Finalizado
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-light">
                {msg.mensaje}
              </div>
            </div>
          ))
        )}
      </div>

      <PanelResponder
        montado={montado}
        mensaje={mensajeAResponder}
        asunto={asunto}
        setAsunto={setAsunto}
        cuerpo={cuerpo}
        setCuerpo={setCuerpo}
        cerrar={cerrarResponder}
        enviar={enviarRespuesta}
      />
    </div>
  );
}
