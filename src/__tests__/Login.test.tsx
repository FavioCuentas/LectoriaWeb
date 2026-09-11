import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const renderLogin = () => {
  const mock = createSupabaseMock();
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider client={mock.client}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<div>Dashboard Admin</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
  return mock;
};

describe('Inicio de sesión con OTP', () => {
  it('muestra un formulario de correo sin contraseña ni Magic Link', async () => {
    renderLogin();

    expect(await screen.findByRole('button', { name: /Enviar código de acceso/i })).toBeEnabled();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument();
    expect(screen.queryByText(/Magic Link/i)).not.toBeInTheDocument();
  });

  it('solicita un OTP sin crear usuarios públicos', async () => {
    const { auth } = renderLogin();

    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'Admin@Lectoria.App' } });
    fireEvent.click(await screen.findByRole('button', { name: /Enviar código de acceso/i }));

    expect(await screen.findByRole('heading', { name: 'Verifica tu código' })).toBeInTheDocument();
    expect(screen.getByLabelText('Código de acceso')).toBeInTheDocument();
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'admin@lectoria.app',
      options: { shouldCreateUser: false },
    });
  });

  it('verifica el código de seis dígitos y crea una sesión Supabase', async () => {
    const { auth } = renderLogin();
    const session = createMockSession();
    auth.verifyOtp.mockResolvedValueOnce({ data: { user: session.user, session }, error: null });

    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'admin@lectoria.app' } });
    fireEvent.click(await screen.findByRole('button', { name: /Enviar código de acceso/i }));
    fireEvent.change(await screen.findByLabelText('Código de acceso'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar y entrar/i }));

    await waitFor(() => {
      expect(auth.verifyOtp).toHaveBeenCalledWith({
        email: 'admin@lectoria.app',
        token: '123456',
        type: 'email',
      });
    });
    expect(await screen.findByText('Dashboard Admin')).toBeInTheDocument();
  });

  it('muestra un error claro cuando Supabase limita solicitudes', async () => {
    const { auth } = renderLogin();
    auth.signInWithOtp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { name: 'AuthApiError', message: 'rate limit', status: 429 },
    });

    fireEvent.change(screen.getByLabelText('Correo'), { target: { value: 'admin@lectoria.app' } });
    fireEvent.click(await screen.findByRole('button', { name: /Enviar código de acceso/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/demasiados intentos/i));
  });
});
