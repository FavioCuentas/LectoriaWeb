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
  otpRequested: boolean;
  pendingEmail: string | null;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetOtp: () => void;
  setError: (error: string | null) => void;
}
