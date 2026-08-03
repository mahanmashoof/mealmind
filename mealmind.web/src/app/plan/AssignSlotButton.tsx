"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";

export default function AssignSlotButton({
  planId,
  day,
  slot,
  recipes,
}: {
  planId: number;
  day: string;
  slot: string;
  recipes: Recipe[];
}) {
  const [open, setOpen] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  async function assign(recipeId: number) {
    await apiFetch(
      `/weeklyplans/${planId}/entries`,
      { method: "POST", body: JSON.stringify({ day, slot, recipeId }) },
      token,
    );
    setOpen(false);
    router.refresh(); // re-fetches the Server Component's data
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-blue-600 text-sm">
        + assign
      </button>
    );
  }

  return (
    <select
      autoFocus
      onChange={(e) => assign(Number(e.target.value))}
      onBlur={() => setOpen(false)}
      className="text-sm border rounded px-2 py-1"
    >
      <option value="">Choose a recipe...</option>
      {recipes.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  );
}
