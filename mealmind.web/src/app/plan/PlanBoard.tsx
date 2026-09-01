"use client";

import { useAuth } from "@/lib/auth-context";
import CreatePlanButton from "./CreatePlanButton";
import AssignSlotButton from "./AssignSlotButton";
import RemoveEntryButton from "./RemoveEntryButton";
import { Recipe } from "@/types/recipe";
import DeletePlanButton from "./DeletePlanButton";

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
import { Coffee, Sun, Moon, Cookie } from "lucide-react";

const SLOT_ICONS: Record<string, React.ReactNode> = {
  Breakfast: <Coffee size={14} />,
  Lunch: <Sun size={14} />,
  Dinner: <Moon size={14} />,
  Snack: <Cookie size={14} />,
};

export default function PlanBoard({
  plans,
  recipes,
}: {
  plans: any[];
  recipes: Recipe[];
}) {
  const { userId } = useAuth();
  const plan = plans.find((p) => p.userId === userId);

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
        This Week
      </h1>

      {plan && (
        <div className="flex justify-end mb-2">
          <DeletePlanButton planId={plan.id} />
        </div>
      )}

      {!plan && (
        <div className="text-center py-10">
          <p className="text-ink/60 mb-4">No weekly plan yet.</p>
          <CreatePlanButton />
        </div>
      )}

      {plan && (
        <div className="flex flex-col gap-4">
          {DAYS.map((day) => (
            <div
              key={day}
              className="relative bg-surface border border-stone rounded-b-lg shadow-sm p-4 pt-5"
              style={{ borderTop: "2px dashed var(--color-stone)" }}
            >
              <span className="absolute -top-2 left-4 w-3 h-3 rounded-full bg-parchment border border-stone" />
              <p className="font-display uppercase tracking-wide text-basil text-lg mb-2">
                {day}
              </p>
              <div className="flex flex-col gap-2">
                {SLOTS.map((slot) => {
                  const entry = plan.entries.find(
                    (e: any) => e.day === day && e.slot === slot,
                  );
                  return (
                    <div
                      key={slot}
                      className="flex items-baseline justify-between text-sm"
                    >
                      <span className="uppercase text-xs tracking-wide text-ink/60 flex items-center gap-1">
                        {SLOT_ICONS[slot]} {slot}
                      </span>
                      {entry ? (
                        <span className="flex items-center">
                          {entry.recipe?.name}
                          <RemoveEntryButton
                            planId={plan.id}
                            entryId={entry.id}
                          />
                        </span>
                      ) : (
                        <AssignSlotButton
                          planId={plan.id}
                          day={day}
                          slot={slot}
                          recipes={recipes}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
