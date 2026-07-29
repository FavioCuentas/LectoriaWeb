export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

export type AuthStep = 'credentials' | 'twofactor' | 'success';

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  step: AuthStep;
  loading: boolean;
  error: string | null;
  remember: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  backToCredentials: () => void;
  toggleRemember: () => void;
  logout: () => void;
  setError: (error: string | null) => void;
}
