"use client";

import { useAuth } from "@/lib/auth-context";
import { removeEntry } from "@/lib/api/plans";

export default function RemoveEntryButton({
  planId,
  entryId,
  onDone,
}: {
  planId: number;
  entryId: number;
  onDone: () => void;
}) {
  const { authFetch } = useAuth();

  async function remove() {
    await removeEntry(authFetch, planId, entryId);
    onDone();
  }

  return (
    <button
      onClick={remove}
      className="text-xs text-ink/40 hover:text-basil ml-2"
      aria-label="Remove"
    >
      ✕
    </button>
  );
}
