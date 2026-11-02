export const dynamic = "force-dynamic";
import RecipeOwnerActions from "./RecipeOwnerActions";
import { getRecipe } from "@/lib/api/recipes";
import { getTranslations } from "next-intl/server";
import PortionScaler from "./PortionScaler";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  const t = await getTranslations("recipeDetail");

  return (
    <main className="px-4 py-6 bg-gray-50">
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
        {recipe.cookingTimeMinutes && ` · ${recipe.cookingTimeMinutes} min`}
      </p>
      <h2 className="font-semibold mt-4 mb-1">{t("ingredients")}</h2>
      <PortionScaler
        basePortions={recipe.portions}
        ingredients={recipe.ingredients}
        nutrition={recipe.nutrition}
      />
      <h2 className="font-semibold mt-4 mb-1">{t("steps")}</h2>
      <ol className="text-sm text-gray-700 list-decimal list-inside flex flex-col gap-1">
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </main>
  );
}
