import { WeeklyPlan } from "@/types/plan";

type Fetcher = <T>(path: string, options?: RequestInit) => Promise<T>;

export function listPlans() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/weeklyplans`).then((r) =>
    r.json(),
  ) as Promise<WeeklyPlan[]>;
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

export function getMyPlan(authFetch: Fetcher) {
  return authFetch<WeeklyPlan>("/weeklyplans/mine");
}

export function setPlanActive(authFetch: Fetcher, isActive: boolean) {
  return authFetch<void>("/weeklyplans/mine/active", {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}
