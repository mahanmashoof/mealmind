export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  imageUrl: string | null;
  nutrition: NutritionInfo;
  steps: string[];
  portions: number;
  ingredients: Ingredient[];
  userId: string;
}
