"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { decodeToken, isExpired } from "./jwt";
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
  const initialValid = initialToken && !isExpired(initialDecoded);

  const [token, setToken] = useState<string | null>(
    initialValid ? initialToken : null,
  );
  const [email, setEmail] = useState<string | null>(
    initialValid ? (initialDecoded?.email ?? null) : null,
  );
  const [userId, setUserId] = useState<string | null>(
    initialValid ? (initialDecoded?.sub ?? null) : null,
  );
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  function clearStorage() {
    localStorage.removeItem("mealmind_token");
    document.cookie = "mealmind_token=; path=/; max-age=0";
  }

  useEffect(() => {
    // The cookie-seeded initial state already failed validity above — make sure storage reflects that too
    if (initialToken && !initialValid) {
      clearStorage();
    }

    // Separately, localStorage might hold a different/newer token than the cookie did
    const stored = localStorage.getItem("mealmind_token");
    if (stored) {
      const decoded = decodeToken(stored);
      if (isExpired(decoded)) {
        clearStorage();
      } else if (!initialValid) {
        // cookie was empty/invalid but localStorage has a good token — use it
        setToken(stored);
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
    clearStorage();
    setToken(null);
    setEmail(null);
    setUserId(null);
    router.push("/");
  };

  // ...authFetch unchanged...

  async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
    try {
      return await apiFetch<T>(path, options, token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout(); // logout() already redirects to "/" — no separate router.push("/login") needed
      }
      throw err;
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
