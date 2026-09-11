import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const renderProtectedRoute = (authenticated: boolean) => {
  const session = authenticated ? createMockSession() : null;
  const { client } = createSupabaseMock(session);

  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider client={client}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login required</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('redirects when Supabase has no session', async () => {
    renderProtectedRoute(false);
    expect(await screen.findByText('Login required')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders protected content for a restored session', async () => {
    renderProtectedRoute(true);
    expect(await screen.findByText('Protected content')).toBeInTheDocument();
  });
});
