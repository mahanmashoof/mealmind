"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { buttonPrimary } from "@/lib/styles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ImportRecipePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("import");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      let endpoint: string;

      files.forEach((f) => formData.append("images", f));
      endpoint = "import-images";

      const res = await fetch(`${API_URL}/recipes/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.status === 401) {
        logout();
        router.push("/login");
        return;
      }
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
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((f, i) => (
              <img
                key={i}
                src={URL.createObjectURL(f)}
                alt=""
                className="w-20 h-20 object-cover rounded border border-stone"
              />
            ))}
          </div>
        )}
        <button
          type="submit"
          disabled={files.length === 0 || loading}
          className={`${buttonPrimary} ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? t("importing") : t("importButton")}
        </button>
      </form>
    </main>
  );
}
