'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  backHref = '/login',
  backLabel = 'Volver al inicio de sesión',
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-b from-secondary to-black">
      <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-10 md:p-12 shadow-2xl animate-in text-center">
        <div className="mb-10 flex flex-col items-center">
          <Image
            src="/assets/cocinasnattalogo.png"
            alt="Natta Cocinas Logo"
            width={180}
            height={80}
            className="object-contain mx-auto"
            priority
          />
          <p className="text-[10px] tracking-[4px] text-white/40 uppercase mt-6">
            ADMIN PANEL
          </p>
        </div>

        {(title || subtitle) && (
          <div className="mb-8 text-left">
            {title && (
              <h1 className="text-lg font-bold text-white tracking-wide">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-white/50 mt-2 leading-relaxed">{subtitle}</p>
            )}
          </div>
        )}

        {children}

        {backLabel ? (
          <div className="mt-8">
            <Link
              href={backHref}
              className="text-xs text-primary hover:text-primary-hover transition-colors duration-300"
            >
              {backLabel}
            </Link>
          </div>
        ) : null}

        <div className="mt-10 text-xs text-white/20">
          &copy; {new Date().getFullYear()} Natta Cocinas. Todos los derechos reservados.
        </div>
      </div>
    </main>
  );
}
