import type { Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'teacher' | 'researcher' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  magicLinkSent: boolean;
  signInWithMagicLink: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetMagicLink: () => void;
  setError: (error: string | null) => void;
}
