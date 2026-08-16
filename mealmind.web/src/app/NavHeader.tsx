"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NavHeader() {
  const { token, email, logout } = useAuth();

  return (
    <header className="bg-ink text-parchment px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-display uppercase tracking-wide text-lg">
        MealMind
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/plan">Plan</Link>
        <Link href="/recipes/ai-generate">Ask AI</Link>
        <Link href="/reminders">Reminders</Link>
        {token ? (
          <>
            <span className="text-parchment/60 text-xs">{email}</span>
            <button onClick={logout} className="text-butter">
              Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="text-butter">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
