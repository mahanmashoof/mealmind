"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";
import { buttonPrimary } from "@/lib/styles";

export default function AiGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const recipe = await apiFetch<Recipe>(
        "/recipes/ai-generate",
        { method: "POST", body: JSON.stringify(prompt) },
        token,
      );
      router.push(`/recipes/${recipe.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Ask the AI for a recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          placeholder="e.g. chicken fajita bowl with rice"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border rounded px-3 py-2 h-24"
        />
        <button type="submit" className={buttonPrimary}>
          {loading ? "Cooking up ideas..." : "Generate"}
        </button>
      </form>
    </main>
  );
}
