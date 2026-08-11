"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";
import { Recipe } from "@/types/recipe";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<Recipe>(`/recipes/${id}`).then(setRecipe);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipe) return;
    setError("");
    try {
      await authFetch(`/recipes/${id}`, {
        method: "PUT",
        body: JSON.stringify(recipe),
      });
      router.push(`/recipes/${id}`);
    } catch {
      setError("Couldn't update this recipe.");
    }
  }

  if (!recipe) return <main className="px-4 py-6">Loading...</main>;

  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="font-display uppercase text-2xl mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <span className="text-red-600">{error}</span>}
        <input
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
          className="border border-stone rounded px-3 py-2 bg-white"
        />
        <label className="text-sm text-ink/60">Portions</label>
        <input
          type="number"
          value={recipe.portions}
          onChange={(e) =>
            setRecipe({ ...recipe, portions: Number(e.target.value) })
          }
          className="border border-stone rounded px-3 py-2 bg-white"
        />
        <button type="submit" className={buttonPrimary}>
          Save
        </button>
      </form>
    </main>
  );
}
