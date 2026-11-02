"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Ingredient, NutritionInfo } from "@/types/recipe";

export default function PortionScaler({
  basePortions,
  ingredients,
  nutrition,
}: {
  basePortions: number;
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
}) {
  const [portions, setPortions] = useState(basePortions);
  const factor = portions / basePortions;
  const t = useTranslations("recipeDetail");

  function scale(value: number) {
    return Math.round(value * factor * 10) / 10;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setPortions(Math.max(1, portions - 1))}
          className="text-basil px-2 text-lg"
          aria-label="Decrease portions"
        >
          −
        </button>
        <span className="font-mono text-sm">
          {portions} {t("portionsLabel")}
        </span>
        <button
          onClick={() => setPortions(portions + 1)}
          className="text-basil px-2 text-lg"
          aria-label="Increase portions"
        >
          +
        </button>
      </div>

      <p className="font-mono text-xs text-basil mb-3">
        {scale(nutrition.calories)} cal · {scale(nutrition.proteinGrams)}g
        protein
      </p>

      <ul className="font-mono text-sm flex flex-col gap-1">
        {ingredients.map((i, idx) => (
          <li key={idx} className="flex items-baseline gap-2">
            <span>{i.name}</span>
            <span className="flex-1 border-b border-dotted border-stone -ranslate-y-" />
            <span className="text-basil">
              {Math.round(i.quantity * factor * 100) / 100} {i.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
