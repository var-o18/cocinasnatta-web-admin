'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginSection() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/pedidos');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/pedidos');
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout backHref="/login" backLabel="">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-left font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
            Usuario
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300"
            placeholder="admin"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px]">
              Contraseña
            </label>
            <Link
              href="/recuperar-contrasena"
              className="text-xs text-primary hover:text-primary-hover transition-colors duration-300"
            >
              ¿Olvidaste la contraseña?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer w-full pl-5 pr-12 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white peer-autofill:text-zinc-800 peer-autofill:hover:text-black transition-colors duration-200 cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-white/[0.04] peer-autofill:hover:bg-black/5"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[1px] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </AuthLayout>
  );
}
