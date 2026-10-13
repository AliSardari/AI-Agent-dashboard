import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type SessionUser } from "./auth-context";

const STORAGE_KEY = "aud.session";

function readSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionUser>;
    if (typeof parsed.email !== "string" || typeof parsed.name !== "string") {
      return null;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      ...(typeof parsed.createdAt === "number"
        ? { createdAt: parsed.createdAt }
        : {}),
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(readSession);

  const signIn = useCallback((next: Omit<SessionUser, "createdAt">) => {
    const full: SessionUser = { ...next, createdAt: Date.now() };
    setUser(full);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
