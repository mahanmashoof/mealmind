export const dynamic = "force-dynamic";

import { apiFetch } from "@/lib/api";
import PlanBoard from "./PlanBoard";
import { Recipe } from "@/types/recipe";

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
  const [plans, recipes] = await Promise.all([
    apiFetch<WeeklyPlan[]>("/weeklyplans"),
    apiFetch<Recipe[]>("/recipes"),
  ]);

  return <PlanBoard plans={plans} recipes={recipes} />;
}
