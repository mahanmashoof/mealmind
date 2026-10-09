"use client";

import { useState, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/types/recipe";

const PAGE_SIZE = 9;

type SortKey = "name" | "calories" | "portions";

export default function RecipeBrowser({ recipes }: { recipes: Recipe[] }) {
  const { userId } = useAuth();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [onlyMine, setOnlyMine] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [desc, setDesc] = useState(false);

  const filtered = useMemo(() => {
    let result = recipes;
    if (query.trim()) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase()),
      );
    }
    if (onlyMine) {
      result = result.filter((r) => r.userId === userId);
    }
    result = [...result].sort((a, b) => {
      let diff = 0;
      if (sort === "name") diff = a.name.localeCompare(b.name);
      else if (sort === "calories")
        diff = a.nutrition.calories - b.nutrition.calories;
      else diff = a.portions - b.portions;

      if (diff === 0) diff = a.name.localeCompare(b.name); // stable tie-breaker
      return desc ? -diff : diff;
    });
    return result;
  }, [recipes, query, sort, desc, onlyMine, userId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const pageItems = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex items-center gap-2 border border-stone rounded px-3 py-2 bg-surface flex-1">
          <Search size={16} className="text-ink/40" />
          <input
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border border-stone rounded px-2 py-2 bg-surface text-sm"
        >
          <option value="name">Name</option>
          <option value="calories">Calories</option>
          <option value="portions">Portions</option>
        </select>

        <button
          onClick={() => setDesc(!desc)}
          className="border border-stone rounded px-2 py-2 bg-surface"
          aria-label={desc ? "Sort descending" : "Sort ascending"}
        >
          {desc ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </button>

        {userId && (
          <label className="flex items-center gap-1 text-sm px-2">
            <input
              type="checkbox"
              checked={onlyMine}
              onChange={(e) => {
                setOnlyMine(e.target.checked);
                setPage(1);
              }}
            />
            Mine only
          </label>
        )}

        <div className="flex border border-stone rounded overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-2 py-2 ${view === "list" ? "bg-basil text-parchment" : "bg-surface"}`}
            aria-label="List view"
          >
            <ListIcon size={16} />
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-2 py-2 ${view === "grid" ? "bg-basil text-parchment" : "bg-surface"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-ink/60 text-center py-10">
          No recipes match your search.
        </p>
      ) : (
        <ul
          className={
            view === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 gap-3"
              : "flex flex-col gap-3"
          }
        >
          {pageItems.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} view={view} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page_ === 1}
            className="disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-ink/60">
            {page_} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page_ === totalPages}
            className="disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
