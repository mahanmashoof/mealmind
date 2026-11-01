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
  CirclePlus,
  ImageUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { useGoogleLogin } from "@/lib/useGoogleLogin";

export default function NavHeader() {
  const t = useTranslations("nav");
  const { token, email, logout, initialized } = useAuth();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { signIn, error } = useGoogleLogin();

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-parchment px-4 py-3">
      {error && <p className="text-red-400 text-xs pt-2">{error}</p>}
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
          {token && (
            <Link
              href="/recipes/new"
              onClick={closeMenu}
              className="flex items-center gap-1"
            >
              <CirclePlus size={16} /> {t("newRecipe")}
            </Link>
          )}
          {token && (
            <Link href="/recipes/import" className="flex items-center gap-1">
              <ImageUp size={16} /> {t("importPhoto")}
            </Link>
          )}
          <Link href="/plan" className="flex items-center gap-1">
            <CalendarDays size={16} /> {t("plan")}
          </Link>
          <Link href="/recipes/ai-generate" className="flex items-center gap-1">
            <Sparkles size={16} /> {t("askAi")}
          </Link>
          {token && (
            <Link href="/reminders" className="flex items-center gap-1">
              <Bell size={16} /> {t("reminders")}
            </Link>
          )}
          <button onClick={toggle} aria-label="Toggle dark mode">
            {dark ? <SunMedium size={16} /> : <Moon size={16} />}
          </button>
          <LanguageSwitcher />
          {!initialized ? (
            <span className="w-16" />
          ) : token ? (
            <>
              <span className="text-parchment/60 text-xs">{email}</span>
              <button
                onClick={logout}
                className="text-butter flex items-center gap-1"
              >
                <LogOut size={16} /> {t("logOut")}
              </button>
            </>
          ) : (
            <button
              onClick={signIn}
              className="text-butter flex items-center gap-1"
            >
              <LogIn size={16} /> {t("logIn")}
            </button>
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
          {token && (
            <Link
              href="/recipes/new"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <CirclePlus size={16} /> {t("newRecipe")}
            </Link>
          )}
          {token && (
            <Link
              href="/recipes/import"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <ImageUp size={16} /> {t("importPhoto")}
            </Link>
          )}
          <Link
            href="/plan"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <CalendarDays size={16} /> {t("plan")}
          </Link>
          <Link
            href="/recipes/ai-generate"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <Sparkles size={16} /> {t("askAi")}
          </Link>
          {token && (
            <Link
              href="/reminders"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <Bell size={16} /> {t("reminders")}
            </Link>
          )}
          <button onClick={toggle} className="flex items-center gap-2">
            {dark ? <SunMedium size={16} /> : <Moon size={16} />}{" "}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <LanguageSwitcher />
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
                <LogOut size={16} /> {t("logOut")}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signIn();
                closeMenu();
              }}
              className="text-butter flex items-center gap-2"
            >
              <LogIn size={16} /> {t("logIn")}
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
