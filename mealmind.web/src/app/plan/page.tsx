import { apiFetch } from "@/lib/api";
import { Recipe } from "@/types/recipe";
import AssignSlotButton from "./AssignSlotButton";
import PrepPlanButton from "./PrepPolanButton";

interface MealPlanEntry {
  id: number;
  day: string;
  slot: string;
  recipe: { id: number; name: string } | null;
}

interface WeeklyPlan {
  id: number;
  weekStartDate: string;
  entries: MealPlanEntry[];
}

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

export default async function PlanPage() {
  const [plans, recipes] = await Promise.all([
    apiFetch<WeeklyPlan[]>("/weeklyplans"),
    apiFetch<Recipe[]>("/recipes"),
  ]);
  const plan = plans[0]; // simplest case: show the first plan found

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
        This Week
      </h1>
      <PrepPlanButton planId={plan.id} />
      {!plan && <p className="text-gray-500">No weekly plan yet.</p>}
      {plan && (
        <div className="flex flex-col gap-4">
          {DAYS.map((day) => (
            <div
              key={day}
              className="relative bg-white border border-stone rounded-b-lg shadow-sm p-4 pt-5"
              style={{
                borderTop: "2px dashed var(--color-stone)",
              }}
            >
              <span className="absolute -top-2 left-4 w-3 h-3 rounded-full bg-parchment border border-stone" />
              <p className="font-display uppercase tracking-wide text-basil text-lg mb-2">
                {day}
              </p>
              <div className="flex flex-col gap-2">
                {SLOTS.map((slot) => {
                  const entry = plan.entries.find(
                    (e) => e.day === day && e.slot === slot,
                  );
                  return (
                    <div
                      key={slot}
                      className="flex items-baseline justify-between text-sm"
                    >
                      <span className="uppercase text-xs tracking-wide text-ink/60">
                        {slot}
                      </span>
                      <span className="font-body">
                        {entry?.recipe?.name ??
                          (plan && (
                            <AssignSlotButton
                              planId={plan.id}
                              day={day}
                              slot={slot}
                              recipes={recipes}
                            />
                          ))}
                      </span>
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
