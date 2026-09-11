import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../pages/Login';
import { createSupabaseMock } from '../test/supabaseMock';

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

describe('Magic Link login', () => {
  it('renders an email-only access form without simulated credentials', async () => {
    renderLogin();

    expect(await screen.findByRole('button', { name: /Enviar enlace de acceso/i })).toBeEnabled();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument();
  });

  it('requests a Magic Link without creating public users', async () => {
    const { auth } = renderLogin();

    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'Admin@Lectoria.App' },
    });
    fireEvent.click(await screen.findByRole('button', { name: /Enviar enlace de acceso/i }));

    expect(await screen.findByRole('heading', { name: 'Revisa tu correo' })).toBeInTheDocument();
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'admin@lectoria.app',
      options: {
        emailRedirectTo: expect.stringMatching(/\/admin$/),
        shouldCreateUser: false,
      },
    });
  });

  it('shows a clear rate-limit error from Supabase', async () => {
    const { auth } = renderLogin();
    auth.signInWithOtp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { name: 'AuthApiError', message: 'rate limit', status: 429 },
    });

    fireEvent.change(screen.getByLabelText('Correo'), {
      target: { value: 'admin@lectoria.app' },
    });
    fireEvent.click(await screen.findByRole('button', { name: /Enviar enlace de acceso/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/demasiados intentos/i);
    });
  });
});
