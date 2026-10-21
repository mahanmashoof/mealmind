"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { buttonPrimary } from "@/lib/styles";
import { generateRecipeFromAi } from "@/lib/api/recipes";
import { useTranslations } from "next-intl";

export default function AiGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const t = useTranslations("aiGenerate");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const recipe = await generateRecipeFromAi(authFetch, prompt);
      router.push(`/recipes/${recipe.id}`);
    } catch {
      setError("Couldn't generate a recipe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4 py-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">{t("title")}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <textarea
          placeholder={t("placeholder")}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border rounded px-3 py-2 h-24"
        />
        <button
          type="submit"
          disabled={loading}
          className={`${buttonPrimary} ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? t("generating") : t("generate")}
        </button>
      </form>
    </main>
  );
}
