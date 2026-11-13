export const dynamic = "force-dynamic";

import { listRecipes } from "@/lib/api/recipes";
import PlanBoard from "./PlanBoard";

export default async function PlanPage() {
  const recipes = await listRecipes();
  return <PlanBoard recipes={recipes} />;
}
