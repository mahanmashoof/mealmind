"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import CreatePlanButton from "./CreatePlanButton";
import DeletePlanButton from "./DeletePlanButton";
import PrepPlanButton from "./PrepPlanButton";
import PlanCellInput from "./PlanCellInput";
import RemoveEntryButton from "./RemoveEntryButton";
import { Recipe } from "@/types/recipe";
import { WeeklyPlan } from "@/types/plan";
import { Coffee, Sun, Moon, Cookie } from "lucide-react";

const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const DAY_VALUES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const SLOT_KEYS = ["breakfast", "lunch", "dinner", "snack"];
const SLOT_VALUES = ["Breakfast", "Lunch", "Dinner", "Snack"];

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
  plans: WeeklyPlan[];
  recipes: Recipe[];
}) {
  const { userId } = useAuth();
  const t = useTranslations("plan");
  const plan = plans.find((p) => p.userId === userId);
  const [activeDay, setActiveDay] = useState(0); // index into DAY_VALUES, mobile only

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-3xl text-ink tracking-wide mb-4">
        {t("title")}
      </h1>

      {plan && (
        <>
          <div className="flex justify-end mb-2">
            <DeletePlanButton planId={plan.id} />
          </div>
          <PrepPlanButton planId={plan.id} />
        </>
      )}

      {!plan && (
        <div className="text-center py-10">
          <p className="text-ink/60 mb-4">{t("noPlan")}</p>
          <CreatePlanButton />
        </div>
      )}

      {plan && (
        <>
          {/* MOBILE: day switcher + single day's meals */}
          <div className="md:hidden">
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {DAY_KEYS.map((dayKey, i) => (
                <button
                  key={dayKey}
                  onClick={() => setActiveDay(i)}
                  className={`shrink-0 font-display uppercase text-xs px-3 py-2 rounded ${
                    activeDay === i
                      ? "bg-basil text-parchment"
                      : "bg-surface border border-stone text-ink/70"
                  }`}
                >
                  {t(dayKey).slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {SLOT_KEYS.map((slotKey, si) => {
                const slotValue = SLOT_VALUES[si];
                const dayValue = DAY_VALUES[activeDay];
                const entry = plan.entries.find(
                  (e) => e.day === dayValue && e.slot === slotValue,
                );
                return (
                  <div
                    key={slotKey}
                    className="bg-surface border border-stone rounded p-2 flex items-center gap-2"
                  >
                    <span className="flex items-center gap-1 text-xs text-ink/60 w-20 shrink-0">
                      {SLOT_ICONS[slotValue]} {t(slotKey)}
                    </span>
                    <div className="flex-1">
                      {entry ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">
                            {entry.recipe?.name}
                          </span>
                          <RemoveEntryButton
                            planId={plan.id}
                            entryId={entry.id}
                          />
                        </div>
                      ) : (
                        <PlanCellInput
                          planId={plan.id}
                          day={dayValue}
                          slot={slotValue}
                          recipes={recipes}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESKTOP: full 4x7 table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="border-collapse text-xs min-w-160 w-full">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-parchment"></th>
                  {DAY_KEYS.map((dayKey) => (
                    <th
                      key={dayKey}
                      className="font-display uppercase text-ink/70 text-center py-1 px-1 min-w-20"
                    >
                      {t(dayKey).slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SLOT_KEYS.map((slotKey, si) => {
                  const slotValue = SLOT_VALUES[si];
                  return (
                    <tr key={slotKey} className="border-t border-stone">
                      <td className="sticky left-0 bg-parchment pr-2 py-2 text-ink/70 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          {SLOT_ICONS[slotValue]} {t(slotKey)}
                        </span>
                      </td>
                      {DAY_VALUES.map((dayValue) => {
                        const entry = plan.entries.find(
                          (e) => e.day === dayValue && e.slot === slotValue,
                        );
                        return (
                          <td key={dayValue} className="px-1 py-1 align-top">
                            {entry ? (
                              <div className="flex items-center justify-between bg-surface border border-stone rounded px-1 py-1">
                                <span className="truncate">
                                  {entry.recipe?.name}
                                </span>
                                <RemoveEntryButton
                                  planId={plan.id}
                                  entryId={entry.id}
                                />
                              </div>
                            ) : (
                              <PlanCellInput
                                planId={plan.id}
                                day={dayValue}
                                slot={slotValue}
                                recipes={recipes}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
