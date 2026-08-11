"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import DeleteRecipeButton from "./DeleteRecipeButton";

export default function RecipeOwnerActions({
  recipeId,
  ownerId,
}: {
  recipeId: number;
  ownerId: string;
}) {
  const { userId } = useAuth();

  if (userId !== ownerId) return null;

  return (
    <div className="flex items-center gap-4 mb-2">
      <Link
        href={`/recipes/${recipeId}/edit`}
        className="text-xs text-basil hover:underline"
      >
        Edit
      </Link>
      <DeleteRecipeButton recipeId={recipeId} />
    </div>
  );
}
