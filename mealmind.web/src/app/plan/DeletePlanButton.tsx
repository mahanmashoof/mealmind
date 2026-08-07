"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export default function DeletePlanButton({ planId }: { planId: number }) {
  const [confirming, setConfirming] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  async function handleDelete() {
    await apiFetch(`/weeklyplans/${planId}`, { method: "DELETE" }, token);
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="text-xs flex items-center gap-2">
        Delete this week's plan?
        <button onClick={handleDelete} className="text-red-600 font-medium">
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="text-ink/50">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-ink/40 hover:text-red-600"
    >
      Delete plan
    </button>
  );
}
