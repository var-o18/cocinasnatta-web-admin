'use client';

import React, { useEffect, useState } from 'react';

interface Proveedor {
    id: number;
    nombre_empresa: string;
    nombre_contacto: string;
    correo: string;
    telefono: string;
    direccion: string;
}

export default function ProveedoresSection() {

    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const headers = ['Empresa', 'Contacto', 'Teléfono', 'Email', 'Dirección', 'Acciones'];

    useEffect(() => {
        const obtenerProveedores = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/proveedores');
                const data = await res.json();

                setProveedores(data);
            } catch (error) {
                console.error('Error cargando proveedores:', error);
            }
        };

        obtenerProveedores();
    }, []);

    return (
        <div className="w-full text-white">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        className="bg-zinc-900 text-white border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 w-72"
                    />

                    <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition">
                        Buscar
                    </button>
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg transition font-medium">
                    + Nuevo
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
                        {proveedores.map((proveedor) => (
                            <tr key={proveedor.id} className="hover:bg-zinc-900 transition text-center">

                                <td className="p-4 border-b border-zinc-800">
                                    {proveedor.nombre_empresa}
                                </td>

                                <td className="p-4 border-b border-zinc-800">
                                    {proveedor.nombre_contacto}
                                </td>

                                <td className="p-4 border-b border-zinc-800">
                                    {proveedor.telefono}
                                </td>

                                <td className="p-4 border-b border-zinc-800">
                                    {proveedor.correo}
                                </td>

                                <td className="p-4 border-b border-zinc-800">
                                    {proveedor.direccion}
                                </td>

                                <td className="p-4 border-b border-zinc-800">
                                    <div className="flex gap-2">
                                        <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md text-sm">
                                            Editar
                                        </button>

                                        <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}