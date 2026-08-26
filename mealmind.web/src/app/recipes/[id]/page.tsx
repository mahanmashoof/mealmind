import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";
import RecipeOwnerActions from "./RecipeOwnerActions";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await apiFetch<Recipe>(`/recipes/${id}`);

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full rounded-lg mb-3 border border-stone"
        />
      )}

      <RecipeOwnerActions recipeId={recipe.id} ownerId={recipe.userId} />
      <p className="text-sm text-gray-500 mb-4">
        {recipe.portions} portions · {recipe.nutrition.calories} cal
      </p>
      <h2 className="font-semibold mt-4 mb-1">Ingredients</h2>
      <ul className="font-mono text-sm flex flex-col gap-1">
        {recipe.ingredients.map((i, idx) => (
          <li key={idx} className="flex items-baseline gap-2">
            <span>{i.name}</span>
            <span className="flex-1 border-b border-dotted border-stone -translate-y-0.75" />
            <span className="text-basil">
              {i.quantity} {i.unit}
            </span>
          </li>
        ))}
      </ul>
      <h2 className="font-semibold mt-4 mb-1">Steps</h2>
      <ol className="text-sm text-gray-700 list-decimal list-inside flex flex-col gap-1">
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </main>
  );
}
