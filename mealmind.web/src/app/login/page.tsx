"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError(t("errorEmail"));
      return;
    }
    try {
      const result = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(result.token);
      router.push("/");
    } catch {
      setError(t("errorLogin"));
    }
  }

  return (
    <main className="flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-surface border border-stone rounded-b-lg shadow-sm p-6 pt-7 w-full max-w-sm flex flex-col gap-3"
        style={{ borderTop: "2px dashed var(--color-stone)" }}
      >
        <span className="absolute -top-2 left-6 w-3 h-3 rounded-full bg-parchment border border-stone" />
        <h1 className="font-display uppercase text-2xl text-ink tracking-wide mb-2">
          {t("loginButton")}
        </h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="email"
          placeholder={`${t("email")} *`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-stone rounded px-3 py-2 bg-surface"
          required
        />
        <input
          type="password"
          placeholder={`${t("password")} *`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-stone rounded px-3 py-2 bg-surface"
          required
        />
        <button type="submit" className={buttonPrimary}>
          {t("loginButton")}
        </button>
        <p className="text-xs text-ink/60 text-center mt-1">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-basil hover:underline">
            {t("registerHere")}
          </Link>
        </p>
      </form>
    </main>
  );
}
