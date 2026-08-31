export const dynamic = "force-dynamic";

import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";
import { Recipe } from "@/types/recipe";
import Link from "next/link";

export default async function HomePage() {
  const recipes = await apiFetch<Recipe[]>("/recipes");

  return (
    <main className="min-h-screen px-4 py-6">
      {recipes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-ink/60 mb-4">
            No recipes yet — add one to get started.
          </p>
          <Link href="/recipes/new" className={buttonPrimary}>
            Create a recipe
          </Link>
        </div>
      ) : (
        <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
          Recipes
        </h1>
      )}
      <ul className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="relative bg-surface border border-stone rounded-b-lg shadow-sm p-4 pt-5"
            style={{ borderTop: "2px dashed var(--color-stone)" }}
          >
            <Link href={`/recipes/${recipe.id}`} className="block">
              <span className="absolute -top-2 left-4 w-3 h-3 rounded-full bg-parchment border border-stone" />
              <p className="font-display uppercase tracking-wide text-ink">
                {recipe.name}
              </p>
              <p className="font-mono text-xs text-basil mt-1">
                {recipe.nutrition.calories} cal · {recipe.portions} portions
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
