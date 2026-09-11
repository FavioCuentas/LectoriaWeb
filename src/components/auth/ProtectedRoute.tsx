import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldX } from 'lucide-react';
import { useAuth } from '../../context/auth-context';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, initializing, loading, logout, user } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div role="status" style={{ minHeight: '100vh', display: 'grid', placeContent: 'center' }}>
        Comprobando sesión…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeContent: 'center',
          padding: '24px',
          background: 'var(--color-neutral-900)',
        }}
      >
        <section
          role="alert"
          className="card elev-lg"
          style={{
            width: 'min(440px, calc(100vw - 48px))',
            padding: '32px',
            alignItems: 'center',
            textAlign: 'center',
            background: 'var(--color-bg)',
          }}
        >
          <ShieldX size={40} color="var(--color-accent-700)" />
          <h1 style={{ fontSize: '22px', margin: 0 }}>Acceso administrativo denegado</h1>
          <p style={{ margin: 0, color: 'var(--color-neutral-700)' }}>
            Tu cuenta está autenticada, pero no tiene el rol de administrador requerido para entrar a este panel.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => void logout()} disabled={loading}>
            <LogOut size={16} />
            {loading ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </section>
      </main>
    );
  }

  return <>{children}</>;
};
