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
  const [picked, setPicked] = useState<Recipe | null>(null);
  const [portions, setPortions] = useState(4);
  const { authFetch } = useAuth();

  const matches = query.trim()
    ? recipes
        .filter((r) =>
          r.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 6)
    : [];

  function pick(recipe: Recipe) {
    setPicked(recipe);
    setOpen(false);
  }

  async function confirm() {
    if (!picked) return;
    await assignRecipe(authFetch, planId, day, slot, picked.id, portions);
    setQuery("");
    setPicked(null);
    setPortions(4);
    onDone();
  }

  if (picked) {
    return (
      <div className="flex items-center gap-1 bg-surface border border-stone rounded px-1 py-1 flex-wrap">
        <span className="text-xs truncate max-w-20">{picked.name}</span>
        <button
          onClick={() => setPortions(Math.max(1, portions - 1))}
          className="text-basil px-1"
        >
          −
        </button>
        <span className="text-xs font-mono">{portions}</span>
        <button
          onClick={() => setPortions(portions + 1)}
          className="text-basil px-1"
        >
          +
        </button>
        <button onClick={confirm} className="text-basil" aria-label="Confirm">
          ✓
        </button>
        <button
          onClick={() => setPicked(null)}
          className="text-ink/40"
          aria-label="Cancel"
        >
          ✕
        </button>
      </div>
    );
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
                onMouseDown={() => pick(r)}
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
