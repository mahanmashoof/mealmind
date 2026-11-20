"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { assignRecipe } from "@/lib/api/plans";
import RemoveEntryButton from "./RemoveEntryButton";

interface Entry {
  id: number;
  day: string;
  slot: string;
  portions: number;
  recipe: { id: number; name: string } | null;
}

export default function AssignedEntryRow({
  planId,
  entry,
  onDone,
}: {
  planId: number;
  entry: Entry;
  onDone: () => void;
}) {
  const [portions, setPortions] = useState(entry.portions);
  const { authFetch } = useAuth();

  async function updatePortions(newValue: number) {
    const clamped = Math.max(1, newValue);
    setPortions(clamped);
    if (!entry.recipe) return;
    await assignRecipe(
      authFetch,
      planId,
      entry.day,
      entry.slot,
      entry.recipe.id,
      clamped,
    );
    onDone();
  }

  return (
    <div className="flex items-center gap-1 bg-surface border border-stone rounded px-1 py-1 max-w-full">
      <span className="text-sm truncate min-w-0 flex-1">
        {entry.recipe?.name}
      </span>
      <button
        onClick={() => updatePortions(portions - 1)}
        className="text-basil px-1 shrink-0"
      >
        −
      </button>
      <span className="text-xs font-mono shrink-0">{portions}</span>
      <button
        onClick={() => updatePortions(portions + 1)}
        className="text-basil px-1 shrink-0"
      >
        +
      </button>
      <RemoveEntryButton planId={planId} entryId={entry.id} onDone={onDone} />
    </div>
  );
}
