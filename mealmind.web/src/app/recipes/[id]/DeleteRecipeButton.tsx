"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/lib/api/recipes";
import { useTranslations } from "next-intl";

export default function DeleteRecipeButton({ recipeId }: { recipeId: number }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const { authFetch } = useAuth();
  const [error, setError] = useState("");
  const t = useTranslations("recipeDetail");

  async function handleDelete() {
    try {
      await deleteRecipe(authFetch, recipeId);
      router.push("/");
    } catch {
      setError(t("errorDelete"));
    }
  }

  if (confirming) {
    return (
      <span className="text-xs flex flex-col gap-1">
        <span className="text-xs flex items-center gap-2">
          {t("deleteConfirm")}
          <button onClick={handleDelete} className="text-red-600 font-medium">
            Yes
          </button>
          <button onClick={() => setConfirming(false)} className="text-ink/50">
            Cancel
          </button>
        </span>
        {error && <span className="text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-ink/40 hover:text-red-600 flex items-center gap-1"
    >
      <Trash2 size={12} /> {t("deleteRecipe")}
    </button>
  );
}
