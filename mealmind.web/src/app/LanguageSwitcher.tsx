"use client";

import { useRouter } from "next/navigation";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "sv", label: "SV" },
  { code: "pt-BR", label: "PT" },
];

export default function LanguageSwitcher() {
  const router = useRouter();

  function setLocale(code: string) {
    document.cookie = `mealmind_locale=${code}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <select
      onChange={(e) => setLocale(e.target.value)}
      className="bg-transparent text-xs border border-parchment/30 rounded px-1"
      defaultValue=""
    >
      <option value="" disabled>
        Lang
      </option>
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
