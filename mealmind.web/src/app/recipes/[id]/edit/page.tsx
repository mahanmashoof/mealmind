"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { buttonPrimary, buttonGhost } from "@/lib/styles";
import { Recipe, Ingredient } from "@/types/recipe";
import { Plus } from "lucide-react";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [portions, setPortions] = useState(1);
  const [steps, setSteps] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 0, unit: "" },
  ]);
  const [nutrition, setNutrition] = useState({
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
  });
  const [error, setError] = useState("");
  const { authFetch } = useAuth();
  const router = useRouter();

  useEffect(() => {
    apiFetch<Recipe>(`/recipes/${id}`).then((recipe) => {
      setName(recipe.name);
      setPortions(recipe.portions || 1);
      setSteps(recipe.steps.length > 0 ? recipe.steps : [""]);
      setIngredients(
        recipe.ingredients.length > 0
          ? recipe.ingredients
          : [{ name: "", quantity: 0, unit: "" }],
      );
      setNutrition(recipe.nutrition);
      setLoaded(true);
    });
  }, [id]);

  function updateStep(i: number, value: string) {
    setSteps(steps.map((s, idx) => (idx === i ? value : s)));
  }
  function updateIngredient(
    i: number,
    field: keyof Ingredient,
    value: string | number,
  ) {
    setIngredients(
      ingredients.map((ing, idx) =>
        idx === i ? { ...ing, [field]: value } : ing,
      ),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Recipe needs a name.");
      return;
    }
    if (portions < 1) {
      setError("Portions must be at least 1.");
      return;
    }
    if (steps.filter((s) => s.trim() !== "").length === 0) {
      setError("Add at least one step.");
      return;
    }
    try {
      await authFetch(`/recipes/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          portions,
          steps: steps.filter((s) => s.trim() !== ""),
          ingredients: ingredients.filter((i) => i.name.trim() !== ""),
          nutrition,
        }),
      });
      router.push(`/recipes/${id}`);
    } catch {
      setError("Couldn't save changes. This may not be your recipe to edit.");
    }
  }

  if (!loaded) return <main className="px-4 py-6">Loading...</main>;

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-2xl mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex flex-col gap-2">
          <input
            placeholder="Recipe name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-stone rounded px-3 py-2 bg-surface"
            required
          />
          <label className="text-sm text-ink/60">Portions</label>
          <input
            type="number"
            min={1}
            value={portions}
            onChange={(e) => setPortions(Number(e.target.value))}
            className="border border-stone rounded px-3 py-2 bg-surface w-24"
          />
        </div>

        <div>
          <p className="font-display uppercase text-sm text-basil mb-2">
            Ingredients
          </p>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                className="border border-stone rounded px-2 py-1 bg-surface flex-1"
              />
              <input
                type="number"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) =>
                  updateIngredient(i, "quantity", Number(e.target.value))
                }
                className="border border-stone rounded px-2 py-1 bg-surface w-20"
              />
              <input
                placeholder="Unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                className="border border-stone rounded px-2 py-1 bg-surface w-20"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setIngredients([
                ...ingredients,
                { name: "", quantity: 0, unit: "" },
              ])
            }
            className={`${buttonGhost} flex items-center gap-1`}
          >
            <Plus size={14} /> add ingredient
          </button>
        </div>

        <div>
          <p className="font-display uppercase text-sm text-basil mb-2">
            Steps
          </p>
          {steps.map((step, i) => (
            <textarea
              key={i}
              placeholder={`Step ${i + 1}`}
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              className="border border-stone rounded px-2 py-1 bg-surface w-full mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className={`${buttonGhost} flex items-center gap-1`}
          >
            <Plus size={14} /> add step
          </button>
        </div>

        <div>
          <p className="font-display uppercase text-sm text-basil mb-2">
            Nutrition
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(
              ["calories", "proteinGrams", "carbsGrams", "fatGrams"] as const
            ).map((field) => (
              <label
                key={field}
                className="text-xs text-ink/60 flex flex-col gap-1"
              >
                {field}
                <input
                  type="number"
                  value={nutrition[field]}
                  onChange={(e) =>
                    setNutrition({
                      ...nutrition,
                      [field]: Number(e.target.value),
                    })
                  }
                  className="border border-stone rounded px-2 py-1 bg-surface"
                />
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className={buttonPrimary}>
          Save Changes
        </button>
      </form>
    </main>
  );
}
