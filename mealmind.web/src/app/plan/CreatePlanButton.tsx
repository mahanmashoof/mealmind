"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
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
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function create() {
    setLoading(true);
    setError("");
    try {
      await authFetch("/weeklyplans", {
        method: "POST",
        body: JSON.stringify({ weekStartDate: mondayOfThisWeek() }),
      });
      router.refresh();
    } catch {
      setError("Couldn't create a plan. Try logging in again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={create} disabled={loading} className={buttonPrimary}>
        {loading ? "Creating..." : "Start this week's plan"}
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
