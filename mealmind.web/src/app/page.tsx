export const dynamic = "force-dynamic";

import { listRecipes } from "@/lib/api/recipes";
import { buttonPrimary } from "@/lib/styles";
import Link from "next/link";
import RecipeBrowser from "./RecipeBrowser";

export default async function HomePage() {
  const recipes = await listRecipes();

  return (
    <main className="px-4 py-6">
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
        <>
          <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
            Recipes
          </h1>
          <RecipeBrowser recipes={recipes} />
        </>
      )}
    </main>
  );
}
