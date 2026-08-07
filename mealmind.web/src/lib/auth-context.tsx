"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { decodeToken } from "./jwt";

interface AuthContextType {
  token: string | null;
  email: string | null;
  userId: string | null;
  login: (token: string) => void;
  logout: () => void;
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
  };

  return (
    <AuthContext.Provider value={{ token, email, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
