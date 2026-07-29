import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';

describe('Login Flow Component', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders login form with initial security notice and input fields', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Administración de Lectoria/i)).toBeInTheDocument();
    expect(screen.getByText(/Acceso restringido al personal autorizado/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('toggles password visibility when toggle button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i });

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: /Ocultar contraseña/i }));
    expect(passwordInput.type).toBe('password');
  });

  it('logs in directly and navigates after valid credentials submission', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<div>Dashboard Admin</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Correo');
    const passwordInput = screen.getByLabelText('Contraseña');

    fireEvent.change(emailInput, { target: { value: 'admin@lectoria.app' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });

    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/Acceso verificado|Dashboard Admin/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
