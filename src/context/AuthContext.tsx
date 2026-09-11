import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthError, Session, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { AuthContextType, AuthUser, UserRole } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

const getErrorMessage = (authError: AuthError): string => {
  if (authError.status === 429) {
    return 'Se realizaron demasiados intentos. Espera unos minutos antes de volver a intentarlo.';
  }

  return 'No pudimos enviar el enlace de acceso. Verifica el correo o inténtalo nuevamente.';
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
  const [magicLinkSent, setMagicLinkSent] = useState(false);

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
      if (nextSession) setMagicLinkSent(false);
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

  const signInWithMagicLink = async (email: string): Promise<boolean> => {
    if (!authClient) {
      setError('La autenticación no está configurada. Contacta al administrador de Lectoria.');
      return false;
    }

    setLoading(true);
    setError(null);
    setMagicLinkSent(false);

    const { error: signInError } = await authClient.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        shouldCreateUser: false,
      },
    });

    setLoading(false);

    if (signInError) {
      setError(getErrorMessage(signInError));
      return false;
    }

    setMagicLinkSent(true);
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
    setMagicLinkSent(false);
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
        magicLinkSent,
        signInWithMagicLink,
        logout,
        resetMagicLink: () => {
          setMagicLinkSent(false);
          setError(null);
        },
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
