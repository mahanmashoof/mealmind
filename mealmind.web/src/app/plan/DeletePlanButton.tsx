"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Trash2 } from "lucide-react";
import { deletePlan } from "@/lib/api/plans";
import { useTranslations } from "next-intl";

export default function DeletePlanButton({ planId }: { planId: number }) {
  const [confirming, setConfirming] = useState(false);
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const t = useTranslations("plan");

  async function handleDelete() {
    try {
      await deletePlan(authFetch, planId);
      router.refresh();
    } catch {
      setError("Couldn't delete this plan. It may not be yours to delete.");
    }
  }

  if (confirming) {
    return (
      <span className="text-xs flex flex-col gap-1">
        <span className="text-xs flex items-center gap-2">
          {t("deleteConfirm")}
          <button onClick={handleDelete} className="text-red-600 font-medium">
            {t("yes")}
          </button>
          <button onClick={() => setConfirming(false)} className="text-ink/50">
            {t("cancel")}
          </button>
        </span>
        {error && <span className="text-red-600">{error}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-ink/40 hover:text-red-600 flex items-center gap-1"
    >
      <Trash2 size={12} /> {t("deletePlan")}
    </button>
  );
}
