import { apiFetch } from "@/lib/api";

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
  const plans = await apiFetch<WeeklyPlan[]>("/weeklyplans");
  const plan = plans[0]; // simplest case: show the first plan found

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">This Week</h1>
      {!plan && <p className="text-gray-500">No weekly plan yet.</p>}
      {plan && (
        <div className="flex flex-col gap-4">
          {DAYS.map((day) => (
            <div key={day} className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold mb-2">{day}</p>
              <div className="flex flex-col gap-1">
                {SLOTS.map((slot) => {
                  const entry = plan.entries.find(
                    (e) => e.day === day && e.slot === slot,
                  );
                  return (
                    <p key={slot} className="text-sm text-gray-600">
                      <span className="font-medium">{slot}:</span>{" "}
                      {entry?.recipe?.name ?? "—"}
                    </p>
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
