"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { assignRecipe } from "@/lib/api/plans";
import { Recipe } from "@/types/recipe";

export default function PlanCellInput({
  planId,
  day,
  slot,
  recipes,
  onDone,
}: {
  planId: number;
  day: string;
  slot: string;
  recipes: Recipe[];
  onDone: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { authFetch } = useAuth();

  const matches = query.trim()
    ? recipes
        .filter((r) =>
          r.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 6)
    : [];

  async function select(recipeId: number) {
    await assignRecipe(authFetch, planId, day, slot, recipeId);
    setQuery("");
    setOpen(false);
    onDone();
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="+"
        className="w-full text-xs border border-stone rounded px-1 py-1 bg-surface"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-surface border border-stone rounded shadow-sm mt-1 max-h-40 overflow-y-auto">
          {matches.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onMouseDown={() => select(r.id)}
                className="w-full text-left text-xs px-2 py-1 hover:bg-basil hover:text-parchment"
              >
                {r.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
