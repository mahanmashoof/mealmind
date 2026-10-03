import { Recipe } from "@/types/recipe";

type Fetcher = <T>(path: string, options?: RequestInit) => Promise<T>;

export function listRecipes() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`).then((r) =>
    r.json(),
  ) as Promise<Recipe[]>;
}

export function getRecipe(id: number | string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${id}`).then((r) =>
    r.json(),
  ) as Promise<Recipe>;
}

export function createRecipe(authFetch: Fetcher, data: Partial<Recipe>) {
  return authFetch<Recipe>("/recipes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateRecipe(
  authFetch: Fetcher,
  id: number | string,
  data: Partial<Recipe>,
) {
  return authFetch<void>(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRecipe(authFetch: Fetcher, id: number | string) {
  return authFetch<void>(`/recipes/${id}`, { method: "DELETE" });
}

export function generateRecipeFromAi(authFetch: Fetcher, prompt: string) {
  return authFetch<Recipe>("/recipes/ai-generate", {
    method: "POST",
    body: JSON.stringify(prompt),
  });
}
