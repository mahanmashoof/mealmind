"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function assign(recipeId: number) {
    setError("");
    try {
      await authFetch(`/weeklyplans/${planId}/entries`, {
        method: "POST",
        body: JSON.stringify({ day, slot, recipeId }),
      });
    } catch {
      setError("Couldn't assign a recipe. Try logging in again.");
    } finally {
      setOpen(false);
      router.refresh(); // re-fetches the Server Component's data
    }
  }

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button onClick={() => setOpen(true)} className="text-blue-600 text-sm">
          + assign
        </button>
        {error && <p className="text-red-600 text-xs">{error}</p>}
      </div>
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
