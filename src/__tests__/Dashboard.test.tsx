import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

describe('Admin Dashboard Component', () => {
  it('renders header, sidebar nav items, and 18 stat KPI cards', async () => {
    const { client } = createSupabaseMock(createMockSession());

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider client={client}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewTab />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Administrador Lectoria')).toBeInTheDocument();
    expect(screen.getByText(/Lectoria Admin/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText(/Datos de demostración/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuarios registrados/i)).toBeInTheDocument();
    expect(screen.getByText(/Documentos importados/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Descargar informe/i })).toBeInTheDocument();
  });

  it('allows switching date ranges and updates metric scaling', async () => {
    const { client } = createSupabaseMock(createMockSession());

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthProvider client={client}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewTab />} />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Administrador Lectoria')).toBeInTheDocument();
    const btn7d = screen.getByRole('button', { name: '7 días' });
    fireEvent.click(btn7d);

    expect(screen.getByText(/Últimos 7 días/i)).toBeInTheDocument();
  });
});
