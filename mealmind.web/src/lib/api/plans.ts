import { WeeklyPlan } from "@/types/plan";

type Fetcher = <T>(path: string, options?: RequestInit) => Promise<T>;

export function listPlans() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/weeklyplans`).then((r) =>
    r.json(),
  ) as Promise<WeeklyPlan[]>;
}

export function createPlan(authFetch: Fetcher, weekStartDate: string) {
  return authFetch<WeeklyPlan>("/weeklyplans", {
    method: "POST",
    body: JSON.stringify({ weekStartDate }),
  });
}

export function deletePlan(authFetch: Fetcher, planId: number) {
  return authFetch<void>(`/weeklyplans/${planId}`, { method: "DELETE" });
}

export function assignRecipe(
  authFetch: Fetcher,
  planId: number,
  day: string,
  slot: string,
  recipeId: number,
) {
  return authFetch<void>(`/weeklyplans/${planId}/entries`, {
    method: "POST",
    body: JSON.stringify({ day, slot, recipeId }),
  });
}

export function removeEntry(
  authFetch: Fetcher,
  planId: number,
  entryId: number,
) {
  return authFetch<void>(`/weeklyplans/${planId}/entries/${entryId}`, {
    method: "DELETE",
  });
}

export function getPrepPlan(authFetch: Fetcher, planId: number) {
  return authFetch<{ tasks: string[] }>(`/weeklyplans/${planId}/prep-plan`, {
    method: "GET",
  });
}
