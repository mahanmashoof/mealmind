export const dynamic = "force-dynamic";

import { listRecipes } from "@/lib/api/recipes";
import { buttonPrimary } from "@/lib/styles";
import Link from "next/link";
import RecipeBrowser from "./RecipeBrowser";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const recipes = await listRecipes();
  const t = await getTranslations("home");

  return (
    <main className="px-4 py-6">
      {recipes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-ink/60 mb-4">{t("emptyTitle")}</p>
          <Link href="/recipes/new" className={buttonPrimary}>
            {t("createButton")}
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
            {t("title")}
          </h1>
          <RecipeBrowser recipes={recipes} />
        </>
      )}
    </main>
  );
}
