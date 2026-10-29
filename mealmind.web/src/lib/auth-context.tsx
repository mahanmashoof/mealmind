"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { decodeToken } from "./jwt";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "./api";

interface AuthContextType {
  token: string | null;
  email: string | null;
  userId: string | null;
  initialized: boolean;
  login: (token: string) => void;
  logout: () => void;
  authFetch: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialToken = null,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  const initialDecoded = initialToken ? decodeToken(initialToken) : null;
  const [token, setToken] = useState<string | null>(initialToken);
  const [email, setEmail] = useState<string | null>(
    initialDecoded?.email ?? null,
  );
  const [userId, setUserId] = useState<string | null>(
    initialDecoded?.sub ?? null,
  );
  const [initialized, setInitialized] = useState(initialToken !== undefined);
  const router = useRouter();

  useEffect(() => {
    // Only needed as a fallback if no cookie was present but localStorage has a stale one
    if (!initialToken) {
      const stored = localStorage.getItem("mealmind_token");
      if (stored) {
        setToken(stored);
        const decoded = decodeToken(stored);
        setEmail(decoded?.email ?? null);
        setUserId(decoded?.sub ?? null);
      }
    }
    setInitialized(true);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("mealmind_token", newToken);
    document.cookie = `mealmind_token=${newToken}; path=/; max-age=7200; SameSite=Lax`;
    setToken(newToken);
    const decoded = decodeToken(newToken);
    setEmail(decoded?.email ?? null);
    setUserId(decoded?.sub ?? null);
  };

  const logout = () => {
    localStorage.removeItem("mealmind_token");
    document.cookie = "mealmind_token=; path=/; max-age=0";
    setToken(null);
    setEmail(null);
    setUserId(null);
    router.push("/");
  };

  async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      return await apiFetch<T>(path, options, token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        router.push("/");
      }
      throw err; // still lets the calling component show its own message for non-401 errors
    }
  }

  return (
    <AuthContext.Provider
      value={{ token, email, userId, initialized, login, logout, authFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
