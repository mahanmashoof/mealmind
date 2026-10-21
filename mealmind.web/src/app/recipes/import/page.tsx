"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { buttonPrimary } from "@/lib/styles";
import { useTranslations } from "next-intl";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ImportRecipePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();
  const t = useTranslations("import");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/recipes/import-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error();
      const recipe = await res.json();
      router.push(`/recipes/${recipe.id}`);
    } catch {
      setError(t("errorImport"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-xl mb-4">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full rounded-lg border border-stone object-contain"
          />
        )}
        <button
          type="submit"
          disabled={!file || loading}
          className={`${buttonPrimary} ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? t("importing") : t("importButton")}
        </button>
      </form>
    </main>
  );
}
