"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { buttonPrimary } from "@/lib/styles";

export default function PrepPlanButton({ planId }: { planId: number }) {
  const [tasks, setTasks] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuth();
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    try {
      const result = await authFetch<{ tasks: string[] }>(
        `/weeklyplans/${planId}/prep-plan`,
        { method: "GET" },
      );
      setTasks(result.tasks);
    } catch {
      setError("Couldn't generate a plan. Try logging in again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className={`${buttonPrimary} ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? "Thinking..." : "Generate prep plan"}
        </button>
        {error && <p className="text-red-600 text-xs">{error}</p>}
      </div>
      {tasks && (
        <ul className="mt-3 text-sm text-gray-700 list-disc list-inside flex flex-col gap-1">
          {tasks.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
