"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  Bell,
  LogOut,
  LogIn,
  Moon,
  SunMedium,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

export default function NavHeader() {
  const { token, email, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-parchment px-4 py-3">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display uppercase tracking-wide text-lg"
        >
          MealMind
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
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
          <button onClick={toggle} aria-label="Toggle dark mode">
            {dark ? <SunMedium size={16} /> : <Moon size={16} />}
          </button>
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

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden flex flex-col gap-3 pt-4 pb-1 text-sm animate-fade-in">
          <Link
            href="/plan"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <CalendarDays size={16} /> Plan
          </Link>
          <Link
            href="/recipes/ai-generate"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <Sparkles size={16} /> Ask AI
          </Link>
          {token && (
            <Link
              href="/reminders"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <Bell size={16} /> Reminders
            </Link>
          )}
          <button onClick={toggle} className="flex items-center gap-2">
            {dark ? <SunMedium size={16} /> : <Moon size={16} />}{" "}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          {token ? (
            <>
              <span className="text-parchment/60 text-xs">{email}</span>
              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="text-butter flex items-center gap-2"
              >
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="text-butter flex items-center gap-2"
            >
              <LogIn size={16} /> Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
