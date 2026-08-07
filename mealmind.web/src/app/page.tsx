import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";

export default async function HomePage() {
  const recipes = await apiFetch<Recipe[]>("/recipes");

  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
        Recipes
      </h1>
      <ul className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="relative bg-white border border-stone rounded-b-lg shadow-sm p-4 pt-5"
            style={{ borderTop: "2px dashed var(--color-stone)" }}
          >
            <span className="absolute -top-2 left-4 w-3 h-3 rounded-full bg-parchment border border-stone" />
            <p className="font-display uppercase tracking-wide text-ink">
              {recipe.name}
            </p>
            <p className="font-mono text-xs text-basil mt-1">
              {recipe.nutrition.calories} cal · {recipe.portions} portions
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
