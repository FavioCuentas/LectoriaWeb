import React, { useEffect, useMemo, useState } from 'react';
import type { AuthError, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthUser, UserRole } from '../types/auth';
import { AuthContext } from './auth-context';

const supportedRoles: UserRole[] = ['student', 'teacher', 'researcher', 'staff', 'admin'];

const getRole = (session: Session): UserRole => {
  const role = session.user.app_metadata?.role;
  return supportedRoles.includes(role) ? role : 'student';
};

const getInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'LE';

const toAuthUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) return null;

  const email = session.user.email ?? '';
  const name =
    session.user.user_metadata?.full_name ??
    session.user.user_metadata?.name ??
    email.split('@')[0] ??
    'Usuario Lectoria';

  return {
    id: session.user.id,
    name,
    email,
    role: getRole(session),
    avatarInitials: getInitials(name),
  };
};

const getErrorMessage = (authError: AuthError, action: 'request' | 'verify'): string => {
  if (authError.status === 429) {
    return 'Se realizaron demasiados intentos. Espera unos minutos antes de volver a intentarlo.';
  }

  if (action === 'verify') {
    return 'El código es inválido o venció. Solicita uno nuevo e inténtalo nuevamente.';
  }

  return 'No pudimos enviar el código de acceso. Verifica el correo o inténtalo nuevamente.';
};

interface AuthProviderProps {
  children: React.ReactNode;
  client?: SupabaseClient | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, client }) => {
  const authClient = client === undefined ? supabase : client;
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!authClient) {
      setError('La autenticación no está configurada. Contacta al administrador de Lectoria.');
      setInitializing(false);
      return undefined;
    }

    const {
      data: { subscription },
    } = authClient.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setInitializing(false);
      if (nextSession) {
        setOtpRequested(false);
        setPendingEmail(null);
      }
    });

    void authClient.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;

      if (sessionError) {
        setError('No se pudo restaurar la sesión. Vuelve a iniciar sesión.');
        setSession(null);
      } else {
        setSession(data.session);
      }
      setInitializing(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [authClient]);

  const requestOtp = async (email: string): Promise<boolean> => {
    if (!authClient) {
      setError('La autenticación no está configurada. Contacta al administrador de Lectoria.');
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    setError(null);
    setOtpRequested(false);

    const { error: signInError } = await authClient.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: false,
      },
    });

    setLoading(false);

    if (signInError) {
      setError(getErrorMessage(signInError, 'request'));
      return false;
    }

    setPendingEmail(normalizedEmail);
    setOtpRequested(true);
    return true;
  };

  const verifyOtp = async (token: string): Promise<boolean> => {
    if (!authClient || !pendingEmail) {
      setError('Solicita primero un código de acceso para tu correo.');
      return false;
    }

    setLoading(true);
    setError(null);

    const { data, error: verifyError } = await authClient.auth.verifyOtp({
      email: pendingEmail,
      token: token.trim(),
      type: 'email',
    });

    setLoading(false);

    if (verifyError) {
      setError(getErrorMessage(verifyError, 'verify'));
      return false;
    }

    if (!data.session) {
      setError('Supabase no devolvió una sesión válida. Solicita un código nuevo.');
      return false;
    }

    setSession(data.session);
    setOtpRequested(false);
    setPendingEmail(null);
    return true;
  };

  const logout = async (): Promise<void> => {
    if (!authClient) {
      setSession(null);
      return;
    }

    setLoading(true);
    setError(null);
    const { error: signOutError } = await authClient.auth.signOut();
    setLoading(false);

    if (signOutError) {
      setError('No se pudo cerrar la sesión. Inténtalo nuevamente.');
      return;
    }

    setSession(null);
    setOtpRequested(false);
    setPendingEmail(null);
  };

  const user = useMemo(() => toAuthUser(session), [session]);
  const isAuthenticated = Boolean(session?.access_token && session.user);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated,
        initializing,
        loading,
        error,
        otpRequested,
        pendingEmail,
        requestOtp,
        verifyOtp,
        logout,
        resetOtp: () => {
          setOtpRequested(false);
          setPendingEmail(null);
          setError(null);
        },
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
