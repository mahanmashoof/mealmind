"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Trash2 } from "lucide-react";

export default function DeleteRecipeButton({ recipeId }: { recipeId: number }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();
  const { authFetch } = useAuth();
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      await authFetch(`/recipes/${recipeId}`, { method: "DELETE" });
      router.push("/");
    } catch {
      setError("Couldn't delete this recipe. It may not be yours to delete.");
    }
  }

  if (confirming) {
    return (
      <span className="text-xs flex flex-col gap-1">
        <span className="text-xs flex items-center gap-2">
          Delete this recipe?
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
      <Trash2 size={12} /> Delete recipe
    </button>
  );
}
