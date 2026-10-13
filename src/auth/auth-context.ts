import { createContext, useContext } from "react";

export interface SessionUser {
  name: string;
  email: string;
  /** Set when signing in through this app; absent on sessions created before. */
  createdAt?: number;
}

export interface AuthValue {
  user: SessionUser | null;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
