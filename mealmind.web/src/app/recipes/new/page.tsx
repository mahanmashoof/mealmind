"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { buttonPrimary } from "@/lib/styles";

export default function NewRecipePage() {
  const [name, setName] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/recipes",
      {
        method: "POST",
        body: JSON.stringify({
          name,
          steps: [],
          nutrition: {},
          ingredients: [],
          portions: 1,
        }),
      },
      token,
    );
    router.push("/");
  }

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">New Recipe</h1>
        <input
          placeholder="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button type="submit" className={buttonPrimary}>
          Create
        </button>
      </form>
    </main>
  );
}
