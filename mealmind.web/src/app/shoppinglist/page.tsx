"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import {
  getMyShoppingList,
  updateShoppingListItem,
} from "@/lib/api/shoppingList";
import { ShoppingList, ShoppingListItem } from "@/types/shoppingList";
import Link from "next/link";
import { buttonPrimary } from "@/lib/styles";

export default function ShoppingListPage() {
  const { authFetch } = useAuth();
  const t = useTranslations("shoppingList");
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const l = await getMyShoppingList(authFetch);
    setList(l);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function toggleChecked(item: ShoppingListItem) {
    await updateShoppingListItem(authFetch, item.id, {
      isChecked: !item.isChecked,
    });
    refresh();
  }

  async function updateQty(item: ShoppingListItem, qty: number) {
    await updateShoppingListItem(authFetch, item.id, { quantity: qty });
    refresh();
  }

  if (loading) return <main className="px-4 py-6">{t("loading")}</main>;

  return (
    <main className="px-4 py-6">
      <h1 className="font-display uppercase text-2xl text-ink tracking-wide mb-4">
        {t("title")}
      </h1>
      {!list || list.items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-ink/60 mb-4">{t("empty")}</p>
          <Link href="/plan" className={buttonPrimary}>
            {t("goToPlan")}
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 bg-surface border border-stone rounded p-2"
            >
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => toggleChecked(item)}
              />
              <span
                className={`flex-1 text-sm truncate min-w-0 ${item.isChecked ? "line-through text-ink/40" : ""}`}
              >
                {item.name}
              </span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQty(item, Number(e.target.value))}
                className="w-16 text-xs border border-stone rounded px-1 py-1 bg-surface shrink-0"
              />
              <span className="text-xs text-ink/60 shrink-0">{item.unit}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
