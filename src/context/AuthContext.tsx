import React, { createContext, useContext, useState } from 'react';
import { AdminUser, AuthStep, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'lectoria_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [step, setStep] = useState<AuthStep>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const isAuthenticated = !!user;

  const toggleRemember = () => setRemember((prev) => !prev);

  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    await new Promise((res) => setTimeout(res, 600));

    if (!email || !password) {
      setError('Introduce tu correo y tu contraseña.');
      setLoading(false);
      return false;
    }

    const authenticatedUser: AdminUser = {
      id: 'admin-01',
      name: 'Administrador Lectoria',
      email: email.includes('@') ? email : 'admin@lectoria.app',
      role: 'Administrador Principal',
      avatarInitials: 'AD',
    };

    setUser(authenticatedUser);
    setLoading(false);
    setStep('success');

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

    return true;
  };

  const verifyTwoFactor = async (_code: string): Promise<boolean> => {
    return true;
  };

  const backToCredentials = () => {
    setStep('credentials');
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setStep('credentials');
    setError(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        step,
        loading,
        error,
        remember,
        loginWithCredentials,
        verifyTwoFactor,
        backToCredentials,
        toggleRemember,
        logout,
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
