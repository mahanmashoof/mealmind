"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function RemoveEntryButton({
  planId,
  entryId,
}: {
  planId: number;
  entryId: number;
}) {
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function remove() {
    try {
      await authFetch(`/weeklyplans/${planId}/entries/${entryId}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch {
      setError("Couldn't remove this entry. It may not be yours to delete.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={remove}
        className="text-xs text-ink/40 hover:text-basil ml-2"
        aria-label="Remove"
      >
        ✕
      </button>

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
