"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";

interface Reminder {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();
  const t = useTranslations("recipeForm");
  const rt = useTranslations("reminders");

  useEffect(() => {
    authFetch<Reminder[]>("/reminders")
      .then(setReminders)
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: number) {
    await authFetch(`/reminders/${id}/read`, { method: "POST" });
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, isRead: true } : r)),
    );
  }

  if (loading) return <main className="px-4 py-6">{t("loading")}</main>;

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-2xl text-ink tracking-wide mb-4">
        {rt("title")}
      </h1>
      {reminders.length === 0 && (
        <div className="text-center py-10">
          <p className="text-ink/60">{rt("empty")}</p>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {reminders.map((r) => (
          <li
            key={r.id}
            className={`bg-surface border border-stone rounded p-3 text-sm flex items-center justify-between ${
              r.isRead ? "opacity-50" : ""
            }`}
          >
            <span>{r.message}</span>
            {!r.isRead && (
              <button
                onClick={() => markRead(r.id)}
                className="text-xs text-basil hover:underline ml-3 shrink-0"
              >
                {rt("markRead")}
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
