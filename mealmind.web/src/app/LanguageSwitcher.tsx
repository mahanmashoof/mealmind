"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "sv", label: "SV" },
  { code: "pt-BR", label: "PT" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();

  function setLocale(code: string) {
    document.cookie = `mealmind_locale=${code}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value)}
      className="bg-ink text-parchment text-xs border border-parchment/40 rounded px-1 py-0.5"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
