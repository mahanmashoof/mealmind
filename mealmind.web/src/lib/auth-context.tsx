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
  login: (token: string) => void;
  logout: () => void;
  authFetch: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mealmind_token");
    setToken(stored);
    if (stored) {
      const decoded = decodeToken(stored);
      setEmail(decoded?.email ?? null);
      setUserId(decoded?.sub ?? null);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("mealmind_token", newToken);
    setToken(newToken);
    const decoded = decodeToken(newToken);
    setEmail(decoded?.email ?? null);
    setUserId(decoded?.sub ?? null);
  };

  const logout = () => {
    localStorage.removeItem("mealmind_token");
    setToken(null);
    setEmail(null);
    setUserId(null);
    router.push("/");
  };

  const router = useRouter();

  async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      return await apiFetch<T>(path, options, token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        router.push("/login");
      }
      throw err; // still lets the calling component show its own message for non-401 errors
    }
  }

  return (
    <AuthContext.Provider
      value={{ token, email, userId, login, logout, authFetch }}
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
