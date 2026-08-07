"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";

function mondayOfThisWeek(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // shift Sunday back to previous Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

export default function CreatePlanButton() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  async function create() {
    setLoading(true);
    try {
      await apiFetch(
        "/weeklyplans",
        {
          method: "POST",
          body: JSON.stringify({ weekStartDate: mondayOfThisWeek() }),
        },
        token,
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={create} disabled={loading} className={buttonPrimary}>
      {loading ? "Creating..." : "Start this week's plan"}
    </button>
  );
}
