"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Recipe } from "@/types/recipe";
import { buttonPrimary } from "@/lib/styles";

export default function AiGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const recipe = await authFetch<Recipe>("/recipes/ai-generate", {
        method: "POST",
        body: JSON.stringify(prompt),
      });
      router.push(`/recipes/${recipe.id}`);
    } catch {
      setError("Couldn't generate a recipe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-4 py-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Ask the AI for a recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-red-600 text-xs">{error}</p>}
        <textarea
          placeholder="e.g. chicken fajita bowl with rice"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border rounded px-3 py-2 h-24"
        />
        <button
          type="submit"
          disabled={loading}
          className={`${buttonPrimary} ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? "Cooking up ideas..." : "Generate"}
        </button>
      </form>
    </main>
  );
}
