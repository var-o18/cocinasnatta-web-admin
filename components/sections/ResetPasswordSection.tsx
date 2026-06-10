'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setToken(searchParams.get('token') ?? '');
    setEmail(searchParams.get('email') ?? '');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!token || !email) {
      setError('El enlace de recuperación no es válido. Solicita uno nuevo.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo restablecer la contraseña');
      }

      setSuccess(data.message);
      setTimeout(() => router.replace('/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const invalidLink = !token || !email;

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elige una contraseña segura y repítela para confirmar el cambio."
      backHref="/recuperar-contrasena"
      backLabel="Solicitar un nuevo enlace"
    >
      {invalidLink && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-xl text-left font-medium">
          El enlace no es válido o está incompleto. Solicita uno nuevo desde la pantalla de recuperación.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-left font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-left font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              disabled={invalidLink || !!success}
              className="peer w-full pl-5 pr-12 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300 disabled:opacity-50"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200 cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
            Repetir contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              minLength={8}
              disabled={invalidLink || !!success}
              className="peer w-full pl-5 pr-12 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300 disabled:opacity-50"
              placeholder="Repite la contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-200 cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-white/[0.04]"
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || invalidLink || !!success}
          className="w-full py-4 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[1px] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordSection() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Nueva contraseña" subtitle="Cargando enlace de recuperación...">
          <div className="py-8 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
