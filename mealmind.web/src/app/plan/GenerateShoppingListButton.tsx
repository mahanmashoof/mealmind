"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { generateShoppingList } from "@/lib/api/shoppingList";
import { buttonPrimary } from "@/lib/styles";

export default function GenerateShoppingListButton() {
  const [confirming, setConfirming] = useState(false);
  const { authFetch } = useAuth();
  const router = useRouter();
  const t = useTranslations("shoppingList");

  async function generate() {
    await generateShoppingList(authFetch);
    router.push("/shoppinglist");
  }

  if (confirming) {
    return (
      <span className="text-xs flex items-center gap-2 justify-center">
        {t("confirmGenerate")}
        <button onClick={generate} className="text-basil font-medium">
          {t("yes")}
        </button>
        <button onClick={() => setConfirming(false)} className="text-ink/50">
          {t("cancel")}
        </button>
      </span>
    );
  }

  return (
    <div className="flex justify-center mt-6">
      <button onClick={() => setConfirming(true)} className={buttonPrimary}>
        {t("generateShoppingList")}
      </button>
    </div>
  );
}
