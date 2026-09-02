"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, CalendarPlus, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Recipe } from "@/types/recipe";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const SLOTS = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { userId, authFetch } = useAuth();
  const [adding, setAdding] = useState(false);
  const [day, setDay] = useState(DAYS[0]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );

  const isOwner = userId === recipe.userId;

  async function handleAdd() {
    setStatus("saving");
    try {
      const plans =
        await authFetch<{ id: number; userId: string }[]>("/weeklyplans");
      const myPlan = plans.find((p) => p.userId === userId);
      if (!myPlan) {
        setStatus("error");
        return;
      }
      await authFetch(`/weeklyplans/${myPlan.id}/entries`, {
        method: "POST",
        body: JSON.stringify({ day, slot, recipeId: recipe.id }),
      });
      setStatus("done");
      setTimeout(() => {
        setAdding(false);
        setStatus("idle");
      }, 1200);
    } catch {
      setStatus("error");
    }
  }

  return (
    <li
      className="relative bg-surface border border-stone rounded-b-lg shadow-sm p-4 pt-5 flex gap-3"
      style={{ borderTop: "2px dashed var(--color-stone)" }}
    >
      <span className="absolute -top-2 left-4 w-3 h-3 rounded-full bg-parchment border border-stone" />

      <div className="flex-1 min-w-0">
        <Link href={`/recipes/${recipe.id}`}>
          <p className="font-display uppercase tracking-wide text-ink truncate">
            {recipe.name}
          </p>
          <p className="font-mono text-xs text-basil mt-1">
            {recipe.nutrition.calories} cal · {recipe.portions} portions
          </p>
        </Link>

        {isOwner && (
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="text-xs text-basil hover:underline flex items-center gap-1 mt-2"
          >
            <Pencil size={12} /> Edit
          </Link>
        )}
      </div>

      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-16 h-16 object-cover rounded border border-stone shrink-0"
        />
      )}

      {userId && (
        <div className="absolute bottom-3 right-3">
          {!adding ? (
            <button
              onClick={() => setAdding(true)}
              className="text-xs text-basil flex items-center gap-1"
              aria-label="Add to plan"
            >
              <CalendarPlus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-surface border border-stone rounded px-2 py-1 animate-fade-in">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="text-xs bg-transparent"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d.slice(0, 3)}
                  </option>
                ))}
              </select>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="text-xs bg-transparent"
              >
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={status === "saving"}
                aria-label="Confirm"
              >
                {status === "done" ? (
                  <Check size={14} className="text-basil" />
                ) : (
                  "✓"
                )}
              </button>
            </div>
          )}
          {status === "error" && (
            <p className="text-xs text-red-600 mt-1">
              No weekly plan yet — create one on /plan first.
            </p>
          )}
        </div>
      )}
    </li>
  );
}
