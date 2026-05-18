'use client';

import React from 'react';
import Image from 'next/image';

export default function LoginSection() {
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

        <form className="space-y-6 text-left">
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px] mb-2">
              Usuario
            </label>
            <input 
              type="text" 
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300"
              placeholder="admin@natta.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-[1px]">
                Contraseña
              </label>
              <a 
                href="#" 
                className="text-xs text-primary hover:text-primary-hover transition-colors duration-300"
              >
                ¿Olvidaste la contraseña?
              </a>
            </div>
            <input 
              type="password" 
              className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary focus:bg-white/[0.08] transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-primary text-black rounded-xl font-bold text-xs uppercase tracking-[1px] hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-10 text-xs text-white/20">
          &copy; {new Date().getFullYear()} Natta Cocinas. Todos los derechos reservados.
        </div>
      </div>
    </main>
  );
}
