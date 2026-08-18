"use client";

import Link from "next/link";
import { CalendarDays, Sparkles, Bell, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function NavHeader() {
  const { token, email, logout } = useAuth();

  return (
    <header className="bg-ink text-parchment px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-display uppercase tracking-wide text-lg">
        MealMind
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/plan" className="flex items-center gap-1">
          <CalendarDays size={16} /> Plan
        </Link>
        <Link href="/recipes/ai-generate" className="flex items-center gap-1">
          <Sparkles size={16} /> Ask AI
        </Link>
        {token && (
          <Link href="/reminders" className="flex items-center gap-1">
            <Bell size={16} /> Reminders
          </Link>
        )}
        {token ? (
          <>
            <span className="text-parchment/60 text-xs">{email}</span>
            <button
              onClick={logout}
              className="text-butter flex items-center gap-1"
            >
              <LogOut size={16} /> Log out
            </button>
          </>
        ) : (
          <Link href="/login" className="text-butter flex items-center gap-1">
            <LogIn size={16} /> Log in
          </Link>
        )}
      </nav>
    </header>
  );
}
