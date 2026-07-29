import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";

export default async function HomePage() {
  const recipes = await apiFetch<Recipe[]>("/recipes");

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">MealMind</h1>
      <ul className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="bg-white rounded-lg shadow p-4">
            <p className="font-semibold">{recipe.name}</p>
            <p className="text-sm text-gray-500">
              {recipe.nutrition.calories} cal · {recipe.portions} portions
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
