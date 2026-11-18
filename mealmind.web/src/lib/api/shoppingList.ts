import { ApiError } from "../api";
import { ShoppingList } from "@/types/shoppingList";

type Fetcher = <T>(path: string, options?: RequestInit) => Promise<T>;

export async function getMyShoppingList(
  authFetch: Fetcher,
): Promise<ShoppingList | null> {
  try {
    return await authFetch<ShoppingList>("/shoppinglist/mine");
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export function generateShoppingList(authFetch: Fetcher) {
  return authFetch<ShoppingList>("/shoppinglist/generate", { method: "POST" });
}

export function updateShoppingListItem(
  authFetch: Fetcher,
  itemId: number,
  data: { quantity?: number; isChecked?: boolean },
) {
  return authFetch<void>(`/shoppinglist/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
