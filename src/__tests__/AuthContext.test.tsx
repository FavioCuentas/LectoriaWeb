import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const AuthProbe = () => {
  const { user, isAuthenticated, initializing, logout } = useAuth();
  return (
    <div>
      <span>{initializing ? 'loading' : 'ready'}</span>
      <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>
      <span>{user?.email ?? 'no-email'}</span>
      <span>{user?.role ?? 'no-role'}</span>
      <button type="button" onClick={() => void logout()}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('restores a Supabase session and maps its trusted role metadata', async () => {
    const session = createMockSession();
    const { client } = createSupabaseMock(session);

    render(
      <AuthProvider client={client}>
        <AuthProbe />
      </AuthProvider>
    );

    expect(await screen.findByText('authenticated')).toBeInTheDocument();
    expect(screen.getByText('admin@lectoria.app')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('ready')).toBeInTheDocument();
  });

  it('uses student as the safe default when no trusted role is assigned', async () => {
    const session = createMockSession();
    session.user.app_metadata = { provider: 'email', providers: ['email'] };
    const { client } = createSupabaseMock(session);

    render(
      <AuthProvider client={client}>
        <AuthProbe />
      </AuthProvider>
    );

    expect(await screen.findByText('student')).toBeInTheDocument();
  });

  it('reacts to auth events and performs a real Supabase sign-out', async () => {
    const session = createMockSession();
    const mock = createSupabaseMock();

    render(
      <AuthProvider client={mock.client}>
        <AuthProbe />
      </AuthProvider>
    );

    expect(await screen.findByText('anonymous')).toBeInTheDocument();

    act(() => mock.emit('SIGNED_IN', session));
    expect(await screen.findByText('authenticated')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
    expect(await screen.findByText('anonymous')).toBeInTheDocument();
    expect(mock.auth.signOut).toHaveBeenCalledOnce();
  });
});
