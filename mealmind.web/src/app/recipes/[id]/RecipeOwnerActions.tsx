"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import DeleteRecipeButton from "./DeleteRecipeButton";
import ImageUpload from "./ImageUpload";
import { Pencil } from "lucide-react";

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
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex items-center gap-4">
        <Link
          href={`/recipes/${recipeId}/edit`}
          className="text-xs text-basil hover:underline flex items-center gap-1"
        >
          <Pencil size={12} /> Edit
        </Link>
        <DeleteRecipeButton recipeId={recipeId} />
      </div>
      <ImageUpload recipeId={recipeId} />
    </div>
  );
}
