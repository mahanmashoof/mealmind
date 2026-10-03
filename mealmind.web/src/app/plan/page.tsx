export const dynamic = "force-dynamic";

import PlanBoard from "./PlanBoard";
import { listPlans } from "@/lib/api/plans";
import { listRecipes } from "@/lib/api/recipes";

interface MealPlanEntry {
  id: number;
  day: string;
  slot: string;
  recipe: { id: number; name: string } | null;
}
interface WeeklyPlan {
  id: number;
  userId: string;
  weekStartDate: string;
  entries: MealPlanEntry[];
}

export default async function PlanPage() {
  const [plans, recipes] = await Promise.all([listPlans(), listRecipes()]);

  return <PlanBoard plans={plans} recipes={recipes} />;
}
