export interface MealPlanEntry {
  id: number;
  day: string;
  slot: string;
  recipe: { id: number; name: string } | null;
}

export interface WeeklyPlan {
  id: number;
  userId: string;
  weekStartDate: string;
  entries: MealPlanEntry[];
}
