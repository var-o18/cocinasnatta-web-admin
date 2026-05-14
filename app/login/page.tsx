'use client';

import React from 'react';

export default function LoginPage() {
  return (
    <main className="natta-gradient" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(212, 163, 115, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
      }} />

      <div className="glass-card animate-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '3.5rem 3rem',
        textAlign: 'center',
        zIndex: 10
      }}>
        {/* Logo Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto' }}>
              <path d="M20 5C20 5 25 10 20 15C15 20 25 25 20 35" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 300, 
            letterSpacing: '8px', 
            margin: '0', 
            color: 'white',
            textTransform: 'uppercase'
          }}>
            NATTA
          </h1>
          <p style={{ 
            fontSize: '0.7rem', 
            letterSpacing: '4px', 
            color: 'rgba(255,255,255,0.4)', 
            marginTop: '0.5rem',
            textTransform: 'uppercase'
          }}>
            ADMIN PANEL
          </p>
        </div>

        {/* Login Form */}
        <form style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="label">Usuario</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="admin@natta.com"
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="label">Contraseña</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '8px' }}>¿Olvidaste la contraseña?</a>
            </div>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
            Iniciar Sesión
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)' }}>
          &copy; {new Date().getFullYear()} Natta Cocinas. Todos los derechos reservados.
        </div>
      </div>
    </main>
  );
}
