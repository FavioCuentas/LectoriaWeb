import type { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';
import { vi } from 'vitest';
import type { UserRole } from '../types/auth';

export const createMockSession = (role: UserRole = 'admin'): Session =>
  ({
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: 'user-01',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@lectoria.app',
      app_metadata: { provider: 'email', providers: ['email'], role },
      user_metadata: { full_name: 'Administrador Lectoria' },
      identities: [],
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
  }) as Session;

export const createSupabaseMock = (initialSession: Session | null = null) => {
  let authListener: ((event: AuthChangeEvent, session: Session | null) => void) | undefined;
  const unsubscribe = vi.fn();

  const auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: initialSession }, error: null }),
    onAuthStateChange: vi.fn((listener: (event: AuthChangeEvent, session: Session | null) => void) => {
      authListener = listener;
      return { data: { subscription: { unsubscribe } } };
    }),
    signInWithOtp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    verifyOtp: vi.fn().mockImplementation(async () => ({
      data: { user: initialSession?.user ?? null, session: initialSession },
      error: null,
    })),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  };

  const rpc = vi.fn().mockResolvedValue({ data: null, error: null });

  return {
    client: { auth, rpc } as unknown as SupabaseClient,
    auth,
    rpc,
    unsubscribe,
    emit: (event: AuthChangeEvent, session: Session | null) => authListener?.(event, session),
  };
};
