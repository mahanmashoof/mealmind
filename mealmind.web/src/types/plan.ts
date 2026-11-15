export interface MealPlanEntry {
  id: number;
  day: string;
  slot: string;
  recipe: { id: number; name: string } | null;
  portions: number;
}

export interface WeeklyPlan {
  id: number;
  userId: string;
  weekStartDate: string;
  isActive: boolean;
  entries: MealPlanEntry[];
}
