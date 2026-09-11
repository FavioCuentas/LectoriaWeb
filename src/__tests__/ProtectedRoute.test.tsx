import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const renderProtectedRoute = (role: UserRole | null) => {
  const session = role ? createMockSession(role) : null;
  const { client } = createSupabaseMock(session);

  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider client={client}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Contenido administrativo</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Inicio de sesión requerido</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('ProtectedRoute administrativo', () => {
  it('redirige cuando Supabase no tiene sesión', async () => {
    renderProtectedRoute(null);
    expect(await screen.findByText('Inicio de sesión requerido')).toBeInTheDocument();
    expect(screen.queryByText('Contenido administrativo')).not.toBeInTheDocument();
  });

  it('renderiza el panel para una sesión con rol admin', async () => {
    renderProtectedRoute('admin');
    expect(await screen.findByText('Contenido administrativo')).toBeInTheDocument();
  });

  it.each<UserRole>(['student', 'teacher', 'researcher', 'staff'])(
    'deniega el panel al rol %s',
    async (role) => {
      renderProtectedRoute(role);
      expect(await screen.findByRole('heading', { name: /Acceso administrativo denegado/i })).toBeInTheDocument();
      expect(screen.queryByText('Contenido administrativo')).not.toBeInTheDocument();
    }
  );
});
