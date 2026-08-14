"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError(
        "Couldn't create account. Try a different email or a stronger password.",
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white border border-stone rounded-b-lg shadow-sm p-6 pt-7 w-full max-w-sm flex flex-col gap-3"
        style={{ borderTop: "2px dashed var(--color-stone)" }}
      >
        <span className="absolute -top-2 left-6 w-3 h-3 rounded-full bg-parchment border border-stone" />
        <h1 className="font-display uppercase text-2xl text-ink tracking-wide mb-2">
          Register
        </h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && (
          <p className="text-basil text-sm">
            Account created — redirecting to login...
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-stone rounded px-3 py-2 bg-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-stone rounded px-3 py-2 bg-white"
        />
        <button type="submit" className={buttonPrimary}>
          Create account
        </button>
      </form>
    </main>
  );
}
