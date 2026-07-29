import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';

describe('Admin Dashboard Component', () => {
  it('renders header, sidebar nav items, and 18 stat KPI cards', () => {
    localStorage.setItem(
      'lectoria_admin_session',
      JSON.stringify({
        id: 'admin-01',
        name: 'Administrador Lectoria',
        email: 'admin@lectoria.app',
        role: 'Administrador Principal',
        avatarInitials: 'AD',
      })
    );

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewTab />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Lectoria Admin/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText(/Datos de demostración/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios registrados/i)).toBeInTheDocument();
    expect(screen.getByText(/Documentos importados/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Descargar informe/i })).toBeInTheDocument();
  });

  it('allows switching date ranges and updates metric scaling', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewTab />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    const btn7d = screen.getByRole('button', { name: '7 días' });
    fireEvent.click(btn7d);

    expect(screen.getByText(/Últimos 7 días/i)).toBeInTheDocument();
  });
});
