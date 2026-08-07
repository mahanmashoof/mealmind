"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function RemoveEntryButton({
  planId,
  entryId,
}: {
  planId: number;
  entryId: number;
}) {
  const { token } = useAuth();
  const router = useRouter();

  async function remove() {
    await apiFetch(
      `/weeklyplans/${planId}/entries/${entryId}`,
      { method: "DELETE" },
      token,
    );
    router.refresh();
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
