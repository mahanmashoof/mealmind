"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { buttonPrimary } from "@/lib/styles";

export default function NewRecipePage() {
  const [name, setName] = useState("");
  const { authFetch } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await authFetch("/recipes", {
        method: "POST",
        body: JSON.stringify({
          name,
          steps: [],
          nutrition: {},
          ingredients: [],
          portions: 1,
        }),
      });
      router.push("/");
    } catch {
      setError("Couldn't create this recipe.");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-red-600 text-xs">{error}</p>}
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
